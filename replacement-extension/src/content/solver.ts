/**
 * Moodle Quiz Solver - Content Script (document_end)
 * 
 * Replaces QuizSolver.js from the original "Quiz Solver for Moodle" v3.0.2
 * Handles question detection, content extraction, API communication, and answer application.
 */

// --- Configuration ---
const BACKEND_URL = 'https://quizsolverformoodle.com';
const RESPONSE_TIMEOUT_MS = 30000;
const ACTION_TIMEOUT_MS = 3000;
const READY_TIMEOUT_MS = 15000;
const DELAY = 25;

// --- Error Classes ---
class AdapterError extends Error {
  constructor(code, message, recoverable = false) {
    super(message);
    this.code = code;
    this.name = 'AdapterError';
    this.recoverable = recoverable;
  }
}

// --- Utility Functions ---
function generateUUID() {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 15) | 64;
  bytes[8] = (bytes[8] & 63) | 128;
  const hex = Array.from(bytes, value => value.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function throwIfAborted(signal) {
  if (signal?.aborted) throw new DOMException('Operation cancelled.', 'AbortError');
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// --- Storage ---
async function getStoredConfig() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['quizSolver'], (result) => {
      resolve(result.quizSolver);
    });
  });
}

// --- DOM Utilities ---
const OMIT_SELECTOR = 'input,textarea,select,button,.specificfeedback,.feedback,.answernumber,.accesshide,.sr-only,.visually-hidden,[data-moodle-solver],.qtype_multichoice_clearchoice,.MathJax_Preview';

function suffix(element, prefix) {
  const token = Array.from(element.classList).find(c => new RegExp(`^${prefix}[0-9]+$`).test(c));
  return token ? token.slice(prefix.length) : null;
}

function elements(root, selector) {
  return Array.from(root.querySelectorAll(selector));
}

function check(elements, signal) {
  if (signal?.aborted) throw new DOMException('Operation cancelled', 'AbortError');
  for (const element of elements) {
    if (!element.isConnected || element.matches(':disabled, [readonly]')) {
      throw new Error('The question controls are no longer editable.');
    }
  }
}

function dismissValueEvents(element) {
  element.dispatchEvent(new Event('input', { bubbles: true }));
  element.dispatchEvent(new Event('change', { bubbles: true }));
}

function setNativeValue(element, value) {
  const prototype = element.tagName === 'SELECT'
    ? HTMLSelectElement.prototype
    : element.tagName === 'TEXTAREA'
      ? HTMLTextAreaElement.prototype
      : HTMLInputElement.prototype;
  Object.getOwnPropertyDescriptor(prototype, 'value')?.set.call(element, value);
  dismissValueEvents(element);
  if (element.value !== value) throw new AdapterError('application_failed', 'Moodle did not retain the requested response.');
}

function checked(input, next) {
  if (input.checked === next) return;
  if (input.type === 'checkbox' || next) input.click();
  else { input.checked = false; dismissValueEvents(input); }
  if (input.checked !== next) throw new Error('Moodle did not accept the selected option.');
}

function assertEditable(root) {
  if (!root.isConnected) throw new AdapterError('stale_question', 'This question is no longer on the page.');
  if (root.matches('.readonly, [aria-readonly="true"]') || root.querySelector('.formulation.readonly'))
    throw new AdapterError('readonly', 'This question is read-only.');
  const controls = root.querySelectorAll('.formulation input:not([type="hidden"]):not([type="submit"]):not([type="button"]), .formulation textarea, .formulation select');
  if (Array.from(controls).filter(c => !c.closest('.qtype_multichoice_clearchoice'))
    .some(c => c.disabled || ('readOnly' in c && c.readOnly)))
    throw new AdapterError('readonly', 'This question is read-only.');
  if (root.querySelector('.formulation [aria-readonly="true"], .formulation .ddarea.readonly'))
    throw new AdapterError('readonly', 'This question is read-only.');
}

function isInteractiveTarget(target) {
  const element = target instanceof Element ? target
    : target instanceof Node ? target.parentElement
    : null;
  return !!(element?.closest('input, textarea, select, button, label, a, [role="button"], [contenteditable], [data-region="answer-label"], .draghome, .drag, .drop, .dropzone, .marker, .sortableitem, [data-moodle-solver]'));
}

// --- Bridge Communication (to bridge.js via window.postMessage) ---
let bridgeSequence = 0;
function bridgeCall(root, command, args, signal) {
  throwIfAborted(signal);
  if (!root.id) throw new AdapterError('missing_identity', 'Moodle did not provide a question identity.');

  return new Promise((resolve, reject) => {
    const id = `b${Date.now()}_${++bridgeSequence}`;
    let cancellation;
    let cleanupTimer;
    const timer = setTimeout(() => cancel(new AdapterError('bridge_timeout', 'Moodle did not finish updating the question.')), 15000);

    const finish = (error, value) => {
      clearTimeout(timer);
      clearTimeout(cleanupTimer);
      window.removeEventListener('message', receive);
      signal?.removeEventListener('abort', abort);
      if (cancellation || error) reject(cancellation || error);
      else resolve(value);
    };

    const cancel = (error) => {
      if (cancellation) return;
      cancellation = error;
      window.postMessage({
        source: 'moodle-quiz-solver-v2',
        direction: 'cancel',
        id,
        root_id: root.id
      }, window.location.origin);
      cleanupTimer = setTimeout(() => finish(error), 3500);
    };

    const abort = () => cancel(new DOMException('Operation cancelled.', 'AbortError'));
    const receive = (event) => {
      if (event.source !== window || event.origin !== window.location.origin) return;
      const message = event.data;
      if (!message || message.source !== 'moodle-quiz-solver-v2' || message.direction !== 'response' || message.id !== id) return;
      if (message.ok === true) finish(undefined, message.result);
      else finish(new AdapterError('application_failed', typeof message.error === 'string' ? message.error : 'Moodle could not apply this answer.'));
    };

    window.addEventListener('message', receive);
    signal?.addEventListener('abort', abort, { once: true });
    window.postMessage({
      source: 'moodle-quiz-solver-v2',
      direction: 'request',
      id,
      root_id: root.id,
      command,
      args
    }, window.location.origin);
  });
}

// --- Validation ---
const QUESTION_TYPES = ['multichoice', 'truefalse', 'shortanswer', 'numerical', 'calculated', 'calculatedsimple', 'calculatedmulti', 'match', 'randomsamatch', 'multianswer', 'gapselect', 'ddwtos', 'ddimageortext', 'ddmarker', 'ordering', 'essay'];

function questionType(root) {
  if (root.classList.contains('description')) return 'description';
  if (root.classList.contains('missingtype')) return 'missingtype';
  return QUESTION_TYPES.find(type => root.classList.contains(type)) || null;
}

function validateQuestion(question) {
  return typeof question.qtype === 'string' &&
    typeof question.content === 'object' &&
    typeof question.fields === 'object' &&
    typeof question.assets === 'object';
}

function validateAnswerForQuestion(question, answer) {
  if (!answer || typeof answer !== 'object') throw new AdapterError('invalid_answer', 'Answer must be an object.');
  for (const fieldId of Object.keys(question.fields)) {
    if (!(fieldId in answer)) throw new AdapterError('invalid_answer', `Missing answer for field ${fieldId}`);
  }
}

// --- Content Extraction ---
function label(text) {
  return text ? [{ kind: 'text', text }] : [];
}

function parsePoints(value) {
  if (!value) return [];
  return value.split(';').map(part => {
    const coordinates = part.split(',');
    const [x, y] = coordinates.map(Number);
    if (coordinates.length !== 2 || !Number.isFinite(x) || !Number.isFinite(y))
      throw new Error('Moodle has an invalid marker response.');
    return { x, y };
  });
}

class ContentExtractor {
  constructor(fieldNodes, idGenerator) {
    this.fieldNodes = fieldNodes;
    this.idGenerator = idGenerator;
    this.sources = new Map();
    this.images = new Map();
  }

  asset(image) {
    const source = image.currentSrc || image.src;
    const previous = this.sources.get(source);
    if (previous) return previous;
    const id = this.idGenerator('a');
    this.sources.set(source, id);
    this.images.set(id, image);
    return id;
  }

  content(node) {
    if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE)
      return Array.from(node.childNodes).flatMap(child => this.content(child));
    if (node.nodeType === Node.TEXT_NODE)
      return node.textContent ? [{ kind: 'text', text: node.textContent }] : [];
    if (!(node instanceof Element)) return [];

    const field = this.fieldNodes.get(node);
    if (field) return [{ kind: 'field', field_id: field }];

    if (node.matches('script[type^="math/tex"]'))
      return [{ kind: 'math', format: 'tex', source: node.textContent || '' }];
    if (node.matches('math'))
      return [{ kind: 'math', format: 'mathml', source: node.outerHTML }];

    const tex = node.getAttribute('data-tex') || node.getAttribute('data-latex');
    if (tex) return [{ kind: 'math', format: 'tex', source: tex }];

    if (node.matches('mjx-container,.MathJax,.MathJax_Display')) {
      const annotation = node.querySelector('annotation[encoding="application/x-tex"]');
      if (annotation) return [{ kind: 'math', format: 'tex', source: annotation.textContent || '' }];
      const math = node.querySelector('math');
      if (math) return this.content(math);
      const label = node.getAttribute('aria-label');
      if (label) return [{ kind: 'text', text: label }];
    }

    if (node.matches(OMIT_SELECTOR)) return [];
    if (node.matches('audio,video,iframe,object,embed'))
      throw new AdapterError('unsupported_media', 'This question contains media outside image and math support.');

    if (node instanceof HTMLImageElement)
      return [{ kind: 'image', asset_id: this.asset(node), alt: node.alt || node.title || '' }];

    if (node instanceof HTMLCanvasElement || node.tagName.toLowerCase() === 'svg') {
      const image = new Image();
      try {
        if (node instanceof HTMLCanvasElement) image.src = node.toDataURL('image/png');
        else {
          const copy = node.cloneNode(true);
          image.src = `data:image/svg+xml;base64,${btoa(new XMLSerializer().serializeToString(copy))}`;
        }
      } catch {
        throw new AdapterError('missing_image', 'This diagram cannot be read by the extension.');
      }
      return [{ kind: 'image', asset_id: this.asset(image), alt: node.getAttribute('aria-label') || '' }];
    }

    if (node.matches('pre')) return [{ kind: 'code', text: node.textContent || '' }];

    if (node.matches('table')) {
      const table = node;
      return [{ kind: 'table', rows: Array.from(table.rows).map(row => ({
        cells: Array.from(row.cells).map(cell => ({
          header: cell.tagName === 'TH',
          content: this.children(cell)
        }))
      })) }];
    }

    if (node.matches('ul,ol')) {
      return [{ kind: 'list', ordered: node.tagName === 'OL', items: Array.from(node.children)
        .filter(child => child.tagName === 'LI').map(child => this.children(child)) }];
    }

    if (node.matches('br')) return [{ kind: 'text', text: '\n' }];

    const children = this.children(node);
    return node.matches('p,h1,h2,h3,h4,h5,h6') ? [{ kind: 'paragraph', children }] : children;
  }

  children(node) {
    return Array.from(node.childNodes).flatMap(child => this.content(child));
  }

  async finish(question, signal) {
    const assets = {};
    const entries = [...this.images.entries()];
    const hashes = new Map();
    const aliases = new Map();

    for (let start = 0; start < entries.length; start += 4) {
      const batch = await Promise.all(entries.slice(start, start + 4).map(async ([id, image]) => [id, await imageData(image, signal)]));
      for (const [id, asset] of batch) {
        const existing = hashes.get(asset.data);
        if (existing) aliases.set(id, existing);
        else {
          if (hashes.size >= 64) throw new AdapterError('too_many_images', 'This question contains more than 64 distinct images.');
          hashes.set(asset.data, id);
          assets[id] = asset;
        }
      }
    }

    const rewrite = (value) => {
      if (!value || typeof value !== 'object') return;
      if (Array.isArray(value)) { value.forEach(rewrite); return; }
      const object = value;
      if (typeof object.asset_id === 'string' && aliases.has(object.asset_id))
        object.asset_id = aliases.get(object.asset_id);
      Object.values(object).forEach(rewrite);
    };

    rewrite(question);
    question.assets = assets;
  }
}

// --- Image Data Extraction ---
async function imageData(image, signal) {
  throwIfAborted(signal);
  const source = image.currentSrc || image.src;
  if (!source) throw new AdapterError('missing_image', 'A required image has no source.');

  const controller = new AbortController();
  const cancel = () => controller.abort();
  signal?.addEventListener('abort', cancel, { once: true });
  const timer = setTimeout(cancel, 15000);

  let objectURL;
  try {
    let rendered = image;
    let bytes;
    let mime;

    try {
      const response = await fetch(source, { credentials: 'include', signal: controller.signal });
      if (!response.ok) throw new Error('Image fetch failed.');
      const blob = await response.blob();
      if (blob.size > 5 * 1024 * 1024) throw new AdapterError('image_too_large', 'A required image exceeds 5 MiB.');
      bytes = new Uint8Array(await blob.arrayBuffer());
      if (bytes[0] === 137 && bytes[1] === 80 && bytes[2] === 78 && bytes[3] === 71) mime = 'image/png';
      else if (bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) mime = 'image/jpeg';
      objectURL = URL.createObjectURL(blob);
      rendered = new Image();
      rendered.src = objectURL;
    } catch (error) {
      if (controller.signal.aborted || error instanceof AdapterError) throw error;
      bytes = undefined;
      mime = undefined;
    }

    await new Promise((resolve, reject) => {
      rendered.onload = () => resolve();
      rendered.onerror = () => reject(new AdapterError('missing_image', 'A required image could not be loaded.'));
      controller.signal.addEventListener('abort', () => reject(new DOMException('Image preparation cancelled or timed out.', 'AbortError')), { once: true });
      if (controller.signal.aborted) throw new DOMException('Image preparation cancelled or timed out.', 'AbortError');
      if (rendered.complete) rendered.naturalWidth > 0 ? resolve() : reject(new AdapterError('missing_image', ''));
    });

    const width = rendered.naturalWidth;
    const height = rendered.naturalHeight;
    if (!width || !height || width * height > 64000000)
      throw new AdapterError('invalid_image', 'A required image has invalid or excessive dimensions.');

    if (bytes && mime) return { mime_type: mime, data: bytesToBase64(bytes), width, height };

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Canvas is unavailable.');
    context.drawImage(rendered, 0, 0);
    const data = canvas.toDataURL('image/png').split(',')[1];
    const decodedBytes = data.length * 3 / 4 - (data.endsWith('==') ? 2 : data.endsWith('=') ? 1 : 0);
    if (decodedBytes > 5 * 1024 * 1024) throw new AdapterError('image_too_large', 'A required image exceeds 5 MiB.');
    return { mime_type: 'image/png', data, width, height };
  } catch (error) {
    throwIfAborted(signal);
    if (error instanceof AdapterError) throw error;
    throw new AdapterError('missing_image', 'A required image could not be read. Allow the image to load and retry.');
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', cancel);
    if (objectURL) URL.revokeObjectURL(objectURL);
  }
}

function bytesToBase64(bytes) {
  let binary = '';
  for (let index = 0; index < bytes.length; index += 8192) {
    const chunk = [];
    for (let offset = index; offset < Math.min(index + 8192, bytes.length); offset++) chunk.push(bytes[offset]);
    binary += String.fromCharCode(...chunk);
  }
  return btoa(binary);
}

// --- Standard Question Type Adapters ---
function formulation(ctx) {
  return ctx.root.matches('.formulation') ? ctx.root : ctx.root.querySelector('.formulation') || ctx.root;
}

function extractStandard(ctx) {
  const form = formulation(ctx);
  switch (ctx.qtype) {
    case 'multichoice':
    case 'calculatedmulti':
    case 'truefalse': {
      const controls = form.querySelectorAll('.answer input[type=radio], .answer input[type=checkbox]')
        .filter(input => input.value !== '-1' && !input.closest('.qtype_multichoice_clearchoice'));
      if (!controls.length) throw new Error('Moodle choice controls are missing.');
      addChoice(ctx, Array.from(controls), [], '', form.querySelector('.answer') || undefined,
        form.querySelector('.qtype_multichoice_clearchoice') || undefined);
      return true;
    }
    case 'shortanswer': {
      const input = form.querySelector('input[type=text][name$="_answer"]');
      if (!input) throw new Error('Moodle short-answer control is missing.');
      addText(ctx, input);
      return true;
    }
    case 'numerical':
    case 'calculated':
    case 'calculatedsimple': {
      const input = form.querySelector('input[type=text][name$="_answer"]');
      if (!input) throw new Error('Moodle numeric answer control is missing.');
      const units = form.querySelectorAll('select[name$="_unit"], input[type=radio][name$="_unit"]')
        .filter(c => !c.closest('.qtype_multichoice_clearchoice'));
      if (units.some(c => c.tagName === 'SELECT') && units.length !== 1)
        throw new Error('Ambiguous Moodle unit controls.');
      addNumeric(ctx, input, Array.from(units));
      return true;
    }
    case 'match':
    case 'randomsamatch': {
      const selects = Array.from(form.querySelectorAll('table.answer select'));
      if (!selects.length) throw new Error('Moodle matching controls are missing.');
      for (const select of selects) {
        const row = select.closest('tr');
        const stem = row?.querySelector('td.text');
        if (!row || !stem) throw new Error('Moodle matching row is incomplete.');
        addChoice(ctx, [select], ctx.content(stem), '0', row);
      }
      return true;
    }
    case 'multianswer': {
      if (form.querySelector('.notifyproblem')) throw new Error('This Moodle Cloze question has missing subquestions.');
      const controls = form.querySelectorAll('input[type=text], input[type=radio], input[type=checkbox], select');
      const groups = new Map();
      for (const control of controls) {
        const match = control.name.match(/^(.*_sub\d+)_(answer|choice\d+)$/);
        if (!match) continue;
        const group = groups.get(match[1]) || [];
        group.push(control);
        groups.set(match[1], group);
      }
      if (!groups.size) throw new Error('Moodle Cloze subquestion controls are missing.');
      for (const group of groups.values()) {
        const first = group[0];
        if (first.tagName === 'INPUT' && first.type === 'text') {
          if (group.length !== 1) throw new Error('Ambiguous Cloze text field.');
          addText(ctx, first, first.closest('.subquestion') || first);
        } else if (first.tagName === 'SELECT') {
          if (group.length !== 1) throw new Error('Ambiguous Cloze selection field.');
          addChoice(ctx, group, [], '', first.closest('.subquestion') || first);
        } else {
          addChoice(ctx, group, [], '', first.closest('fieldset.answer') || first);
        }
      }
      return true;
    }
    default: return false;
  }
}

function addChoice(ctx, controls, content, placeholder, marker, clear) {
  const select = controls[0].tagName === 'SELECT' ? controls[0] : null;
  const inputs = select ? [] : controls;
  const multiple = !select && inputs[0].type === 'checkbox';
  if (!select && inputs.some(input => input.type !== (multiple ? 'checkbox' : 'radio')))
    throw new Error('Mixed choice controls.');

  const { options, targets } = makeOptions(ctx, select
    ? Array.from(select.options).filter(option => option.value !== placeholder && !option.disabled)
    : inputs);

  const kind = multiple ? 'multiple_choice' : 'single_choice';
  const read = () => select ? select.value : inputs.map(input => input.checked);

  const reset = async () => {
    check(controls, null);
    if (select) {
      if (!Array.from(select.options).some(option => option.value === placeholder))
        throw new Error('Moodle placeholder is missing.');
      setNativeValue(select, placeholder);
    } else if (clear?.querySelector('input[type=radio][value="-1"]')) {
      clear.querySelector('a[role=button]')?.click();
      const clearRadio = clear.querySelector('input[type=radio][value="-1"]');
      clearRadio.disabled = false;
      if (!clearRadio.checked) {
        clearRadio.checked = true;
        clear.classList.add('sr-only');
        clear.setAttribute('aria-hidden', 'true');
        clear.querySelector('a')?.setAttribute('tabindex', '-1');
      }
      dismissValueEvents(clearRadio);
    } else {
      inputs.forEach(input => checked(input, false));
    }
  };

  const binding = {
    elements: controls,
    read,
    async apply(answer) {
      check(controls, null);
      if (answer.kind !== kind) throw new Error('Answer kind does not match the Moodle choice field.');
      const ids = answer.kind === 'multiple_choice' ? answer.option_ids : [answer.option_id];
      if (new Set(ids).size !== ids.length || ids.some(id => !targets.has(id)))
        throw new Error('Unknown or duplicate option ID.');
      const selected = ids.map(id => targets.get(id));
      if (select) {
        const target = selected[0];
        if (!select.contains(target) || target.disabled) throw new Error('The selected Moodle option changed.');
        setNativeValue(select, target.value);
        if (select.value !== target.value) throw new Error('Moodle rejected the option.');
      } else {
        inputs.forEach(input => checked(input, selected.includes(input)));
      }
    },
    async restore(previous) {
      check(controls, null);
      if (select) {
        if (typeof previous !== 'string' || !Array.from(select.options).some(option => option.value === previous))
          throw new Error('Invalid saved selection.');
        setNativeValue(select, previous);
      } else {
        if (!Array.isArray(previous) || previous.length !== inputs.length || previous.some(item => typeof item !== 'boolean'))
          throw new Error('Invalid saved choices.');
        if (!previous.some(Boolean)) await reset();
        else inputs.forEach((input, index) => checked(input, previous[index]));
      }
    },
    reset
  };

  const id = ctx.addField({ kind, content, options, group: null, location: null }, binding);
  ctx.fieldNodes.set(marker || select || inputs[0].closest('fieldset.answer') || inputs[0], id);
}

function addText(ctx, input, marker) {
  const controls = [input];
  const binding = {
    elements: controls,
    read: () => input.value,
    async apply(answer) {
      check(controls, null);
      if (answer.kind !== 'text') throw new Error('Expected a text answer.');
      setNativeValue(input, answer.value);
    },
    async restore(previous) {
      check(controls, null);
      if (typeof previous !== 'string') throw new Error('Invalid saved text.');
      setNativeValue(input, previous);
    },
    async reset() { check(controls, null); setNativeValue(input, ''); }
  };
  const id = ctx.addField({ kind: 'text', content: [] }, binding);
  ctx.fieldNodes.set(marker || input, id);
}

function addNumeric(ctx, input, unitControls) {
  const select = unitControls[0]?.tagName === 'SELECT' ? unitControls[0] : null;
  const radios = select ? [] : unitControls;
  const unitItems = select
    ? Array.from(select.options).filter(option => option.value !== '' && !option.disabled)
    : radios;
  const { options: unit_options, targets } = unitItems.length ? makeOptions(ctx, unitItems) : { options: {}, targets: new Map() };
  const controls = [input, ...unitControls];

  const binding = {
    elements: controls,
    read: () => ({ value: input.value, unit: select ? select.value : radios.map(radio => radio.checked) }),
    async apply(answer) {
      check(controls, null);
      if (answer.kind !== 'numeric') throw new Error('Expected a numeric answer.');
      const unit = answer.unit_option_id == null ? null : targets.get(answer.unit_option_id);
      if ((unitControls.length > 0 && !unit) || (unitControls.length === 0 && answer.unit_option_id != null))
        throw new Error('Unknown or missing unit option ID.');
      if (select && unit && (!select.contains(unit) || unit.disabled)) throw new Error('Moodle unit options changed.');
      setNativeValue(input, answer.value);
      if (select && unit) setNativeValue(select, unit.value);
      else radios.forEach(radio => checked(radio, radio === unit));
    },
    async restore(previous) {
      check(controls, null);
      if (!previous || typeof previous !== 'object' || !('value' in previous) || typeof previous.value !== 'string' || !('unit' in previous))
        throw new Error('Invalid saved numeric answer.');
      if (select && (typeof previous.unit !== 'string' || !Array.from(select.options).some(option => option.value === previous.unit)))
        throw new Error('Invalid saved unit.');
      if (!select && (!Array.isArray(previous.unit) || previous.unit.length !== radios.length || previous.unit.some(item => typeof item !== 'boolean')))
        throw new Error('Invalid saved units.');
      setNativeValue(input, previous.value);
      if (select) setNativeValue(select, previous.unit);
      else radios.forEach((radio, index) => checked(radio, previous.unit[index]));
    },
    async reset() {
      check(controls, null);
      setNativeValue(input, '');
      if (select) setNativeValue(select, '');
      else radios.forEach(radio => checked(radio, false));
    }
  };

  const id = ctx.addField({ kind: 'numeric', content: [], unit_options }, binding);
  const wrapper = input.closest('span.answer');
  ctx.fieldNodes.set(wrapper && unitControls.every(control => wrapper.contains(control)) ? wrapper : input, id);
  unitControls.forEach(control => ctx.fieldNodes.set(control, id));
}

function makeOptions(ctx, controls) {
  const options = {};
  const targets = new Map();
  for (const control of controls) {
    const id = ctx.id('c');
    options[id] = {
      content: optionContent(ctx, control.tagName === 'OPTION' ? control : labelOfInput(control)),
      group: null,
      capacity: null
    };
    targets.set(id, control);
  }
  if (!targets.size) throw new Error('Moodle has no answer options for this field.');
  return { options, targets };
}

function optionContent(ctx, node) {
  const copy = node.cloneNode(true);
  if ('querySelectorAll' in copy) {
    copy.querySelectorAll('.answernumber, .specificfeedback, .feedbacktrigger, .feedbackspan, .outcome, .accesshide, .sr-only, .visually-hidden, input, select').forEach(el => el.remove());
  }
  return ctx.content(copy);
}

function labelOfInput(input) {
  const ids = (input.getAttribute('aria-labelledby') || '').split(/\s+/).filter(Boolean);
  if (ids.length) {
    const fragment = input.ownerDocument.createDocumentFragment();
    for (const id of ids) {
      const element = input.ownerDocument.getElementById(id);
      if (element && input.closest('.que')?.contains(element)) fragment.append(element.cloneNode(true));
    }
    if (fragment.childNodes.length) return fragment;
  }
  return input.labels?.[0] || input.parentElement || input;
}

// --- Composite Question Type Adapters ---
function ordering(ctx) {
  const lists = elements(ctx.root, '.formulation .sortablelist');
  if (lists.length !== 1) throw new Error('Ordering list is missing or ambiguous.');
  const list = lists[0];
  const items = Array.from(list.children).filter(el => el instanceof HTMLElement && el.classList.contains('sortableitem'));
  if (!items.length || items.some(item => !item.id) || new Set(items.map(item => item.id)).size !== items.length)
    throw new Error('Ordering items are missing or read-only.');
  const response = uniqueField(ctx.root, input => /_response_\d+$/.test(input.name));

  const opaqueToNative = new Map();
  const nativeToOpaque = new Map();
  const itemFields = {};
  for (const item of items) {
    const id = ctx.id('i');
    opaqueToNative.set(id, item.id);
    nativeToOpaque.set(item.id, id);
    const contentNode = item.querySelector('[data-itemcontent]') || item;
    itemFields[id] = { content: ctx.content(contentNode) };
  }

  const initial = items.map(item => nativeToOpaque.get(item.id));
  const applyIds = async (ids, signal) => {
    throwIfAborted(signal);
    if (!Array.isArray(ids) || ids.length !== items.length || new Set(ids).size !== items.length ||
        ids.some(id => typeof id !== 'string' || !opaqueToNative.has(id)))
      throw new Error('Invalid ordering permutation.');
    await bridgeCall(ctx.root, 'ordering.set', {
      listId: list.id,
      fieldName: response.name,
      itemIds: ids.map(id => opaqueToNative.get(id))
    }, signal);
  };

  const id = ctx.addField({ kind: 'ordering', content: [], items: itemFields }, {
    elements: [list, response],
    read: () => ({
      kind: 'ordering',
      item_ids: Array.from(list.children)
        .filter(el => el.classList.contains('sortableitem'))
        .map(item => nativeToOpaque.get(item.id) || (() => { throw new Error('Ordering identities changed.'); })())
    }),
    apply: async (answer, signal) => {
      if (answer.kind !== 'ordering') return;
      await applyIds(answer.item_ids, signal);
    },
    restore: async (previous, signal) => { await applyIds(previous.item_ids, signal); },
    reset: async (signal) => { await applyIds(initial, signal); }
  });
  ctx.fieldNodes.set(list, id);
}

function gapselect(ctx) {
  const selects = elements(ctx.root, '.formulation select').filter(el => /_p\d+$/.test(el.name));
  if (!selects.length) throw new Error('No gap dropdowns were found.');

  const groupIds = new Map();
  const optionIds = new Map();
  for (const select of selects) {
    const group = suffix(select.parentElement, 'group');
    if (!group || select.disabled) throw new Error('Gap group is missing or read-only.');
    if (!groupIds.has(group)) groupIds.set(group, ctx.id('g'));

    const options = {};
    const native = new Map();
    for (const option of Array.from(select.options).filter(option => option.value !== '')) {
      const key = `${group}:${option.value}`;
      if (!optionIds.has(key)) optionIds.set(key, ctx.id('c'));
      const id = optionIds.get(key);
      options[id] = { content: label(option.textContent || ''), group: groupIds.get(group), capacity: null };
      native.set(id, option.value);
    }

    const write = async (id, signal) => {
      throwIfAborted(signal);
      if (id !== null && (typeof id !== 'string' || !native.has(id)))
        throw new Error('Unknown gap option.');
      if (!select.isConnected || select.disabled) throw new Error('The gap is no longer editable.');
      const value = id === null ? '' : native.get(id);
      setNativeValue(select, value);
      if (select.value !== value) throw new Error('Moodle did not accept the selected gap option.');
    };

    const fieldId = ctx.addField({
      kind: 'single_choice', content: [], options,
      group: groupIds.get(group), location: null
    }, {
      elements: [select],
      read: () => ({
        kind: 'single_choice',
        option_id: select.value === '' ? null :
          Array.from(native).find(([, value]) => value === select.value)?.[0] ?? (() => { throw new Error('The selected gap option changed.'); })()
      }),
      apply: async (answer, signal) => { if (answer.kind === 'single_choice') await write(answer.option_id, signal); },
      restore: async (previous, signal) => { await write(previous.option_id, signal); },
      reset: async (signal) => { await write(null, signal); }
    });
    ctx.fieldNodes.set(select, fieldId);
  }
}

async function slots(ctx) {
  await bridgeCall(ctx.root, 'ready', {});
  const inputs = elements(ctx.root, 'input.placeinput[name]');
  if (!inputs.length) throw new Error('No drag response fields were found.');

  const choices = new Map();
  for (const node of elements(ctx.root, '.draghome:not(.dragplaceholder)')) {
    const group = suffix(node, 'group');
    const choice = suffix(node, 'choice');
    if (group && choice && !choices.has(`${group}:${choice}`))
      choices.set(`${group}:${choice}`, { id: ctx.id('c'), node });
  }

  const groups = new Map();
  const bg = ctx.qtype === 'ddimageortext' ? ctx.root.querySelector('.dropbackground') : null;
  const asset = bg ? ctx.asset(bg) : null;

  for (const input of inputs) {
    const group = suffix(input, 'group');
    const place = suffix(input, 'place');
    if (!group || !place) throw new Error('A drag group or place identity is missing.');
    if (!groups.has(group)) groups.set(group, ctx.id('g'));

    const drop = elements(ctx.root, ctx.qtype === 'ddwtos' ? '.drop' : '.dropzones .dropzone')
      .find(node => suffix(node, 'place') === place && suffix(node, 'group') === group);
    if (!drop) throw new Error('The native drop zone is not available.');

    const options = {};
    const native = new Map();
    for (const [key, entry] of choices) {
      if (!key.startsWith(`${group}:`)) continue;
      options[entry.id] = {
        content: ctx.content(entry.node),
        group: groups.get(group),
        capacity: entry.node.classList.contains('infinite') ? null : 1
      };
      native.set(entry.id, key.slice(group.length + 1));
    }
    if (!native.size) throw new Error('No choices exist for this drag group.');

    let location = null;
    if (bg && asset) {
      const box = bg.getBoundingClientRect();
      const target = drop.getBoundingClientRect();
      const style = getComputedStyle(bg);
      const innerWidth = bg.clientWidth - parseFloat(style.paddingLeft || '0') - parseFloat(style.paddingRight || '0');
      const scale = innerWidth / bg.naturalWidth;
      if (!(scale > 0)) throw new Error('Background image geometry is unavailable.');
      location = {
        asset_id: asset,
        x: Math.max(0, Math.round((target.left - box.left - bg.clientLeft) / scale)),
        y: Math.max(0, Math.round((target.top - box.top - bg.clientTop) / scale)),
        width: Math.max(1, Math.round(target.width / scale)),
        height: Math.max(1, Math.round(target.height / scale))
      };
    }

    const write = async (id, signal) => {
      throwIfAborted(signal);
      if (id !== null && (typeof id !== 'string' || !native.has(id)))
        throw new Error('Unknown drag choice.');
      await bridgeCall(ctx.root, 'composite.set', {
        fieldName: input.name,
        choice: id === null ? null : native.get(id)
      }, signal);
    };

    const dropLabel = drop.querySelector('.accesshide')?.textContent || `Blank ${place}`;
    const fieldId = ctx.addField({
      kind: 'single_choice', content: label(dropLabel), options,
      group: groups.get(group), location
    }, {
      elements: [drop, input],
      read: () => ({
        kind: 'single_choice',
        option_id: !input.value || input.value === '0' ? null :
          Array.from(native).find(([, value]) => value === input.value)?.[0] ?? (() => { throw new Error('The selected drag choice changed.'); })()
      }),
      apply: async (answer, signal) => { if (answer.kind === 'single_choice') await write(answer.option_id, signal); },
      restore: async (previous, signal) => { await write(previous.option_id, signal); },
      reset: async (signal) => { await write(null, signal); }
    });
    ctx.fieldNodes.set(drop, fieldId);
  }
  ctx.prepareApply = async (signal) => { await bridgeCall(ctx.root, 'composite.clear', {}, signal); };
}

async function markers(ctx) {
  await bridgeCall(ctx.root, 'ready', {});
  const bg = ctx.root.querySelector('.dropbackground');
  if (!bg) throw new Error('Marker background is missing.');
  const asset = ctx.asset(bg);
  const inputs = elements(ctx.root, 'input.choices[name]');
  if (!inputs.length) throw new Error('Marker response fields are missing.');

  for (const input of inputs) {
    const choice = suffix(input, 'choice');
    const marker = elements(ctx.root, '.draghomes .marker:not(.dragplaceholder), .droparea .marker:not(.dragplaceholder)')
      .find(node => suffix(node, 'choice') === choice);
    if (!marker) throw new Error('Marker label is missing.');
    const capacity = input.classList.contains('infinite') ? null : Number(suffix(input, 'noofdrags'));

    const write = async (value, signal) => {
      throwIfAborted(signal);
      if (!Array.isArray(value)) throw new Error('Invalid marker coordinates.');
      await bridgeCall(ctx.root, 'marker.set', { fieldName: input.name, points: value }, signal);
    };

    const id = ctx.addField({
      kind: 'markers',
      content: ctx.content(marker.querySelector('.markertext') || marker),
      asset_id: asset,
      capacity
    }, {
      elements: [input],
      read: () => ({ kind: 'markers', points: parsePoints(input.value) }),
      apply: async (answer, signal) => { if (answer.kind === 'markers') await write(answer.points, signal); },
      restore: async (previous, signal) => { await write(previous.points, signal); },
      reset: async (signal) => { await write([], signal); }
    });
    ctx.fieldNodes.set(input, id);
    for (const node of elements(ctx.root, '.marker').filter(el => suffix(el, 'choice') === choice))
      ctx.fieldNodes.set(node, id);
  }
}

async function extractEssay(ctx, signal) {
  if (ctx.qtype !== 'essay') return false;
  const textarea = Array.from(ctx.root.querySelectorAll('.formulation textarea'))
    .find(element => element.name.endsWith('_answer'));
  if (!textarea) throw new AdapterError('attachment_only', 'This essay requires file attachments, which are outside this extension\'s support.');

  const editorWrapper = !!textarea.closest('.qtype_essay_editor,.qtype_essay_editorfilepicker');
  const readiness = editorWrapper ? await bridgeCall(ctx.root, 'essay.ready', { textarea_id: textarea.id }, signal) : null;

  if (editorWrapper && (!readiness || typeof readiness !== 'object' || !('surface' in readiness) ||
    !['plain', 'tiny', 'atto'].includes(String(readiness.surface))))
    throw new AdapterError('application_failed', 'Moodle did not identify the essay editor.');

  const rich = editorWrapper && readiness.surface !== 'plain';
  const read = () => rich ? editorHTML(ctx.root, textarea) : textarea.value;
  const apply = async (answer, signal) => {
    throwIfAborted(signal);
    if (answer.kind !== 'essay') throw new AdapterError('invalid_answer', 'An essay response is required.');
    if (rich)
      await bridgeCall(ctx.root, 'essay.write', { textarea_id: textarea.id, value: answer.value, expected_html: read() }, signal);
    else
      await nativeValueChange(textarea, () => setNativeValue(textarea, answer.value), signal);
  };
  const restore = async (previous, signal) => {
    if (typeof previous !== 'string') throw new Error('Invalid essay snapshot.');
    throwIfAborted(signal);
    if (rich)
      await bridgeCall(ctx.root, 'essay.restore', { textarea_id: textarea.id, html: previous, expected_html: read() }, signal);
    else
      await nativeValueChange(textarea, () => setNativeValue(textarea, previous), signal);
  };

  const current = read();
  const content = current
    ? [{ kind: 'text', text: `Existing response or response template (preserve required structure):\n${current}` }]
    : [];

  const id = ctx.addField({ kind: 'essay', content }, {
    elements: [textarea], read, apply, restore, reset: signal => restore('', signal)
  });
  ctx.fieldNodes.set(textarea.closest('.qtype_essay_editor,.qtype_essay_editorfilepicker') || textarea, id);
  return true;
}

function extractComposite(ctx) {
  switch (ctx.qtype) {
    case 'ordering': ordering(ctx); return true;
    case 'gapselect': gapselect(ctx); return true;
    case 'ddwtos':
    case 'ddimageortext': slots(ctx); return true;
    case 'ddmarker': markers(ctx); return true;
    default: return false;
  }
}

// --- Essay Editor Support ---
function editorHTML(root, textarea) {
  const iframe = root.querySelector(`iframe[id="${CSS.escape(textarea.id)}_ifr"]`);
  const atto = textarea.closest('.editor_atto_wrap')?.querySelector('.editor_atto_content')
    || root.querySelector(`[id="${CSS.escape(textarea.id)}editable"]`);
  const body = iframe?.contentDocument?.body || atto;
  if (!body) throw new Error('The Moodle editor is still initializing.');
  const copy = body.cloneNode(true);
  cleanEditorDOM(copy);
  return copy.innerHTML;
}

async function nativeValueChange(element, write, signal) {
  throwIfAborted(signal);
  let observing = true;
  const restartPolling = () => element.dispatchEvent(
    new element.ownerDocument.defaultView.KeyboardEvent('keydown', { bubbles: true, key: 'Unidentified', code: 'Unidentified' })
  );
  const resumeAfterBlur = () => {
    queueMicrotask(() => {
      if (observing && !signal?.aborted && element.isConnected) restartPolling();
    });
  };
  element.addEventListener('blur', resumeAfterBlur);
  try {
    restartPolling();
    throwIfAborted(signal);
    write();
    await new Promise((resolve, reject) => {
      const finish = () => { signal?.removeEventListener('abort', abort); resolve(); };
      const timer = setTimeout(finish, 100);
      const abort = () => { clearTimeout(timer); signal?.removeEventListener('abort', abort); reject(new DOMException('Operation cancelled.', 'AbortError')); };
      signal?.addEventListener('abort', abort, { once: true });
      if (signal?.aborted) abort();
    });
    throwIfAborted(signal);
  } finally {
    observing = false;
    element.removeEventListener('blur', resumeAfterBlur);
  }
}

function cleanEditorDOM(copy) {
  copy.querySelectorAll('[data-mce-bogus="all"], [data-mce-type="bookmark"]').forEach(node => node.remove());
  copy.querySelectorAll('*').forEach(node => {
    for (const attr of Array.from(node.attributes)) if (attr.name.startsWith('data-mce-')) node.removeAttribute(attr.name);
  });
}

// --- Unique Field Helper ---
function uniqueField(root, predicate) {
  const found = elements(root, 'input[type="hidden"][name]').filter(predicate);
  if (found.length !== 1) throw new Error('Moodle did not provide one unambiguous response field.');
  return found[0];
}

// --- Question Extraction ---
let snapshotSequence = 0;

async function extractQuestion(root, signal) {
  assertEditable(root);
  throwIfAborted(signal);
  const qtype = questionType(root);
  if (!qtype || qtype === 'missingtype')
    throw new AdapterError('unsupported_question', 'This Moodle question type is unavailable.');
  if (qtype === 'description')
    throw new AdapterError('informational', 'This block provides information and has no answer.');

  const counters = new Map();
  const nextId = (prefix) => {
    const count = (counters.get(prefix) || 0) + 1;
    counters.set(prefix, count);
    return `${prefix}${count}`;
  };

  const fieldNodes = new Map();
  const extractor = new ContentExtractor(fieldNodes, nextId);

  const ctx = {
    root, qtype, fields: {}, bindings: new Map(), fieldNodes,
    id: nextId,
    content: node => extractor.content(node),
    asset: image => extractor.asset(image),
    addField(field, binding) {
      const id = nextId('f');
      this.fields[id] = field;
      this.bindings.set(id, binding);
      return id;
    }
  };

  const handled = extractStandard(ctx) || extractComposite(ctx) || await extractEssay(ctx, signal);
  if (!handled || !ctx.bindings.size)
    throw new AdapterError('unsupported_question', 'No supported answer controls were found.');

  const stem = root.querySelector('.qtext') || (qtype === 'multianswer' ? root.querySelector('.formulation') : null);
  if (!stem) throw new AdapterError('missing_question', 'Moodle did not provide question text.');

  const question = {
    qtype,
    content: ctx.content(stem),
    fields: ctx.fields,
    assets: {}
  };

  // Deduplicate field references in content
  const seen = new Set();
  const deduplicate = (blocks) => blocks.filter(block => {
    if (block.kind === 'field') {
      if (seen.has(block.field_id)) return false;
      seen.add(block.field_id);
    }
    if (block.kind === 'paragraph') block.children = deduplicate(block.children);
    if (block.kind === 'list') block.items = block.items.map(deduplicate);
    if (block.kind === 'table') block.rows.forEach(row => row.cells.forEach(cell => { cell.content = deduplicate(cell.content); }));
    return true;
  });
  question.content = deduplicate(question.content);

  // Include description blocks from this quiz page
  root.ownerDocument.querySelectorAll('.que.description .qtext').forEach(description => {
    question.content.push({
      kind: 'paragraph',
      children: [{ kind: 'text', text: 'Information block from this quiz page:' }, ...ctx.content(description)]
    });
  });

  const fingerprintSnapshot = fingerprint(root);
  const previous = new Map([...ctx.bindings].map(([id, binding]) => [id, binding.read()]));

  await extractor.finish(question, signal);
  throwIfAborted(signal);

  if (fingerprint(root) !== fingerprintSnapshot ||
    [...ctx.bindings].some(([id, binding]) => JSON.stringify(binding.read()) !== JSON.stringify(previous.get(id))))
    throw new AdapterError('stale_question', 'The question changed while preparing it. Please retry.');

  if (!validateQuestion(question))
    throw new AdapterError('invalid_question', 'This question could not be represented by the v2 contract.');

  return {
    id: `s${Date.now()}_${++snapshotSequence}`,
    root,
    question,
    bindings: ctx.bindings,
    fingerprint: fingerprintSnapshot,
    previous,
    prepareApply: ctx.prepareApply
  };
}

function fingerprint(root) {
  const formulation = root.querySelector('.formulation');
  if (!formulation) return '';
  const clone = formulation.cloneNode(true);
  clone.querySelectorAll('[data-moodle-solver],.specificfeedback,.feedback,.MathJax_Preview').forEach(el => el.remove());
  clone.querySelectorAll('.qtext').forEach(stem => {
    stem.style.removeProperty('cursor');
    if (!stem.getAttribute('style')) stem.removeAttribute('style');
  });
  return `${root.id}|${questionType(root)}|${clone.innerHTML}`;
}

// --- Answer Application ---
let applicationQueue = Promise.resolve();

async function applyAnswer(snapshot, answer, signal, edited = () => false) {
  validateAnswerForQuestion(snapshot.question, answer);

  const operation = applicationQueue.catch(() => {}).then(async () => {
    throwIfAborted(signal);
    assertEditable(snapshot.root);
    if (edited() || fingerprint(snapshot.root) !== snapshot.fingerprint ||
      [...snapshot.bindings].some(([id, binding]) => JSON.stringify(binding.read()) !== JSON.stringify(snapshot.previous.get(id))))
      throw new AdapterError('stale_question', 'This question was edited after generation began. Generate a fresh answer.');

    let mutated = false;
    try {
      mutated = true;
      await snapshot.prepareApply?.(signal);
      for (const [id, binding] of snapshot.bindings) {
        throwIfAborted(signal);
        if (edited()) throw new AdapterError('user_edit', 'A manual edit interrupted answer application.');
        assertEditable(snapshot.root);
        await binding.apply(answer.fields[id], signal);
        throwIfAborted(signal);
        if (edited()) throw new AdapterError('user_edit', 'A manual edit interrupted answer application.');
      }

      const applied = new Map([...snapshot.bindings].map(([id, binding]) => [id, binding.read()]));
      await new Promise(resolve => setTimeout(resolve, 0));
      throwIfAborted(signal);
      assertEditable(snapshot.root);
      if (edited() || [...snapshot.bindings].some(([id, binding]) =>
        JSON.stringify(binding.read()) !== JSON.stringify(applied.get(id))))
        throw new AdapterError('application_changed', 'Moodle changed the response before verification finished.');
    } catch (error) {
      if (mutated && !edited() && snapshot.root.isConnected) {
        const restoration = new AbortController();
        const checkEdit = () => { if (edited()) restoration.abort(); };
        const editEvents = ['input', 'change', 'pointerdown', 'keydown', 'beforeinput', 'paste', 'cut', 'drop', 'click'];
        editEvents.forEach(event => snapshot.root.addEventListener(event, checkEdit, true));
        try {
          assertEditable(snapshot.root);
          await snapshot.prepareApply?.(restoration.signal);
          for (const [id, binding] of snapshot.bindings) {
            checkEdit();
            throwIfAborted(restoration.signal);
            await binding.restore(snapshot.previous.get(id), restoration.signal);
          }
          checkEdit();
          throwIfAborted(restoration.signal);
          if ([...snapshot.bindings].some(([id, binding]) =>
            JSON.stringify(binding.read()) !== JSON.stringify(snapshot.previous.get(id))))
            throw new Error('Restored response differs.');
        } catch {
          if (edited()) throw new AdapterError('user_edit', 'A manual edit interrupted restoration. Review this question before continuing.');
          throw new AdapterError('restoration_failed', 'Moodle could not finish applying or fully restore the answer. Review this question before continuing.');
        } finally {
          editEvents.forEach(event => snapshot.root.removeEventListener(event, checkEdit, true));
        }
      }
      throw error;
    }
  });
  applicationQueue = operation;
  return operation;
}

// --- API Communication ---
async function responseJSON(response) {
  try { return await response.json(); } catch { throw new AdapterError('invalid_server_response', 'The backend returned an unreadable response. No answer was applied.'); }
}

function serverError(value) {
  // Validate error response would use AJV validators in original
  if (value && typeof value === 'object' && 'error' in value && value.error && typeof value.error === 'object' && 'message' in value.error) {
    throw new AdapterError((value as { error: { code?: string; message: string } }).error.code || 'api_error', (value as { error: { message: string } }).error.message);
  }
  throw new AdapterError('invalid_server_response', 'The backend returned an invalid error response.');
}

async function get(path, apiKey, signal) {
  const response = await fetch(`${BACKEND_URL}/api/v2/${path}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
    signal
  });
  if (response.status === 404) throw new AdapterError('v2_unavailable', 'This backend does not provide the required v2 API.');
  const value = await responseJSON(response);
  if (!response.ok) serverError(value);
  return value;
}

async function getModels(apiKey, signal) {
  const value = await get('models', apiKey, signal);
  if (!value || !Array.isArray(value.models)) throw new AdapterError('invalid_models', 'The backend model list does not match v2.');
  return value;
}

async function getCapabilities(apiKey, signal) {
  const value = await get('capabilities', apiKey, signal);
  if (!value || !Array.isArray(value.schema_versions) || !Array.isArray(value.question_types))
    throw new AdapterError('invalid_capabilities', 'The backend capabilities do not match v2.');
  return value;
}

async function getAnswer(snapshot, config, signal) {
  const controller = new AbortController();
  const abort = () => controller.abort();
  signal?.addEventListener('abort', abort, { once: true });
  const timer = setTimeout(abort, RESPONSE_TIMEOUT_MS);

  try {
    throwIfAborted(signal);
    const [capabilities, catalog] = await Promise.all([
      getCapabilities(config.apiKey, controller.signal),
      getModels(config.apiKey, controller.signal)
    ]);

    if (!capabilities.schema_versions.includes('2.0') || !capabilities.question_types.includes(snapshot.question.qtype))
      throw new AdapterError('unsupported_question', 'The backend does not support this question.');

    const model = catalog.models.find(m => m.id === config.model) || catalog.models.find(m => m.is_default);
    if (!model || !model.structured_outputs ||
      (Object.keys(snapshot.question.assets).length > 0 && !model.input_modalities?.includes('image')))
      throw new AdapterError('model_not_supported', 'Choose a verified model supporting structured answers and this question\'s images.');

    if (!model.reasoning_levels?.some(level => level.key === config.reasoning))
      throw new AdapterError('reasoning_not_supported', 'Choose an available reasoning level for this model in the extension settings.');

    const body = {
      schema_version: '2.0',
      request_id: generateUUID(),
      snapshot_id: snapshot.id,
      model: model.id,
      reasoning: config.reasoning,
      context: config.context || '',
      question: snapshot.question
    };

    if (!validateAnswerRequest(body))
      throw new AdapterError('invalid_request', 'The question does not satisfy the v2 request contract.');

    const serialized = JSON.stringify(body);
    if (new TextEncoder().encode(serialized).length > capabilities.limits.max_request_bytes)
      throw new AdapterError('request_too_large', 'This question exceeds the backend request limit.');

    const response = await fetch(`${BACKEND_URL}/api/v2/answer`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: serialized,
      signal: controller.signal
    });

    const value = await responseJSON(response);
    if (!response.ok) serverError(value);
    if (!validateAnswerSuccess(value))
      throw new AdapterError('invalid_answer', 'The backend answer does not satisfy the v2 contract.');

    const result = value;
    if (result.request_id !== body.request_id || result.snapshot_id !== snapshot.id || result.question_type !== snapshot.question.qtype)
      throw new AdapterError('stale_answer', 'The response belongs to a different question.');

    validateAnswerForQuestion(snapshot.question, result.answer);

    // Update credits in storage
    const storage = await chrome.storage.local.get('quizSolver');
    if (storage.quizSolver?.apiKey === config.apiKey && typeof result.credits_remaining === 'number')
      await chrome.storage.local.set({ quizSolver: { ...storage.quizSolver, credits: result.credits_remaining } });

    return result;
  } catch (error) {
    if (controller.signal.aborted && !signal?.aborted)
      throw new AdapterError('timeout', 'The answer request timed out. Generate a new answer to retry.');
    throw error;
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', abort);
  }
}

// --- Validation stubs (in production, these use AJV compiled validators) ---
function validateAnswerRequest(body) {
  if (!body.schema_version || !body.request_id || !body.snapshot_id || !body.model || !body.question)
    return false;
  try {
    // UUID pattern check
    const uuidPattern = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    if (!uuidPattern.test(body.request_id)) return false;
    if (!/^[a-z][a-zA-Z0-9_-]{0,63}$/.test(body.snapshot_id)) return false;
    if (typeof body.context === 'string' && body.context.length > 75000) return false;
    if (typeof body.reasoning !== 'string') return false;
    return true;
  } catch { return false; }
}

function validateAnswerSuccess(value) {
  if (!value || typeof value !== 'object') return false;
  return 'answer' in value && 'request_id' in value && 'snapshot_id' in value && 'question_type' in value;
}

// --- Main Controller ---
function initializeV2() {
  const states = new Map();
  const cleanups = new Map();

  const trackEditors = (state) => {
    for (const [frame, cleanup] of state.frames) {
      if (!frame.isConnected) { cleanup(); state.frames.delete(frame); }
    }
    for (const frame of state.root.querySelectorAll('.tox-edit-area iframe')) {
      if (state.frames.has(frame)) continue;
      let detach = () => {};
      const attach = () => {
        detach();
        const doc = frame.contentDocument;
        if (!doc) return;
        const events = ['beforeinput', 'input', 'change', 'pointerdown', 'keydown', 'paste', 'cut', 'drop'];
        const edit = (event) => {
          if (!event.isTrusted || (state.phase === 'applying' && (event.type === 'input' || event.type === 'change'))) return;
          state.revision++;
          if (state.phase === 'applying') state.controller?.abort();
        };
        events.forEach(event => doc.addEventListener(event, edit, true));
        detach = () => events.forEach(event => doc.removeEventListener(event, edit, true));
      };
      frame.addEventListener('load', attach);
      attach();
      state.frames.set(frame, () => { detach(); frame.removeEventListener('load', attach); });
    }
  };

  const excluded = (target) => {
    const element = target instanceof Element
      ? target
      : target instanceof Node ? target.parentElement
      : null;
    return !!(element?.closest('.questionflag')) || isInteractiveTarget(target);
  };

  const update = (state) => {
    const cursor = state.cursor && !state.nativeHover
      ? state.phase === 'generating' || state.phase === 'applying' ? 'wait'
      : state.phase === 'pending' ? 'copy'
      : 'pointer'
      : state.originalCursor;
    if (cursor) state.info.style.setProperty('cursor', cursor, state.originalCursorPriority);
    else state.info.style.removeProperty('cursor');
  };

  const isCurrent = (state) =>
    state.root.isConnected &&
    state.root.querySelector('.info') === state.info &&
    state.root.querySelector('.formulation') === state.formulation &&
    questionType(state.root) === state.type &&
    (state.root.querySelector('.qtext') || (state.root.classList.contains('multianswer') ? state.root.querySelector('.formulation') : null)) === state.stem;

  const activate = async (state) => {
    if (!isCurrent(state) || state.phase === 'applying') return;
    if (state.phase === 'generating') { state.controller?.abort(); return; }
    if (window.getSelection()?.toString().trim()) return;

    const revision = state.revision;
    const controller = new AbortController();
    state.controller = controller;
    const pending = state.pending;
    state.pending = undefined;

    if (pending) {
      state.phase = 'applying';
      update(state);
      try {
        await applyAnswer(pending.snapshot, pending.answer, controller.signal, () => state.revision !== pending.revision);
        state.phase = 'ready';
        update(state);
      } catch (error) {
        if (state.controller === controller && isCurrent(state)) {
          state.phase = 'ready';
          const cancelled = !(error instanceof AdapterError) &&
            (controller.signal.aborted || (error instanceof Error && error.name === 'AbortError'));
          const message = error instanceof Error ? error.message : 'The answer could not be applied.';
          update(state);
          if (!cancelled) window.alert(message);
          else if (state.revision !== revision) window.alert('A manual edit interrupted application. Review this question before continuing.');
        }
      } finally {
        if (state.controller === controller) state.controller = undefined;
      }
      return;
    }

    if (!state.type || state.type === 'missingtype')
      throw new AdapterError('unsupported_question', 'This Moodle question type is unavailable.');

    state.phase = 'generating';
    update(state);

    try {
      const config = await getStoredConfig();
      throwIfAborted(controller.signal);
      if (!config?.apiKey) throw new AdapterError('configuration_required', 'Configure the extension with an API key first.');

      state.cursor = config.cursor !== false;
      update(state);

      const snapshot = await extractQuestion(state.root, controller.signal);
      update(state);

      const result = await getAnswer(snapshot, config, controller.signal);
      if (state.controller !== controller) return;
      throwIfAborted(controller.signal);
      if (state.revision !== revision) throw new AdapterError('stale_question', 'You edited this question. Generate a fresh answer.');

      if (config.fillOnClick) {
        state.pending = { snapshot, answer: result.answer, revision };
        state.phase = 'pending';
        update(state);
      } else {
        state.phase = 'applying';
        update(state);
        await applyAnswer(snapshot, result.answer, controller.signal, () => state.revision !== revision);
        state.phase = 'ready';
        update(state);
      }
    } catch (error) {
      if (state.controller === controller && isCurrent(state)) {
        state.phase = 'ready';
        const cancelled = !(error instanceof AdapterError) &&
          (controller.signal.aborted || (error instanceof Error && error.name === 'AbortError'));
        const message = error instanceof Error ? error.message : 'The answer could not be applied.';
        update(state);
        if (!cancelled) window.alert(message);
        else if (state.revision !== revision) window.alert('A manual edit interrupted application. Review this question before continuing.');
      }
    } finally {
      if (state.controller === controller) state.controller = undefined;
    }
  };

  const scan = () => {
    // Remove stale states
    for (const [root, state] of states) {
      if (!isCurrent(state)) {
        cleanups.get(root)?.();
        cleanups.delete(root);
        states.delete(root);
      }
    }

    // Detect new questions
    for (const root of document.querySelectorAll('.que')) {
      if (states.has(root)) continue;
      const info = root.querySelector('.info');
      const type = questionType(root);
      if (!info || type === 'description') continue;

      const stem = root.querySelector('.qtext') || (root.classList.contains('multianswer') ? root.querySelector('.formulation') : null);
      const state = {
        root, stem, info, type,
        formulation: root.querySelector('.formulation'),
        originalCursor: info.style.getPropertyValue('cursor'),
        originalCursorPriority: info.style.getPropertyPriority('cursor'),
        nativeHover: false, phase: 'ready', revision: 0, frames: new Map()
      };
      states.set(root, state);

      // Initialize cursor from config
      void getStoredConfig().then(config => {
        if (states.get(root) !== state || state.controller) return;
        state.cursor = config?.cursor !== false;
        update(state);
      }).catch(() => {});

      // Event handlers
      const click = (event) => { if (!excluded(event.target)) void activate(state); };
      const over = (event) => { state.nativeHover = excluded(event.target); update(state); };
      const out = (event) => {
        state.nativeHover = event.relatedTarget instanceof Node && info.contains(event.relatedTarget) && excluded(event.relatedTarget);
        update(state);
      };
      const edit = (event) => {
        if (!event.isTrusted || !(event.target instanceof Element)) return;
        if (event.target.closest('[data-moodle-solver], .info, .questionflag')) return;
        if (state.phase === 'applying' && (event.type === 'input' || event.type === 'change')) return;
        if (event.type === 'input' || event.type === 'change' || isInteractiveTarget(event.target)) {
          state.revision++;
          if (state.phase === 'applying') state.controller?.abort();
        }
      };

      info.addEventListener('click', click);
      info.addEventListener('mouseover', over);
      info.addEventListener('mouseout', out);

      const editEvents = ['input', 'change', 'pointerdown', 'keydown', 'beforeinput', 'paste', 'cut', 'drop', 'click'];
      for (const event of editEvents) root.addEventListener(event, edit, true);

      cleanups.set(root, () => {
        const controller = state.controller;
        state.controller = undefined;
        controller?.abort();
        info.removeEventListener('click', click);
        info.removeEventListener('mouseover', over);
        info.removeEventListener('mouseout', out);
        for (const event of editEvents) root.removeEventListener(event, edit, true);
        state.cursor = false;
        update(state);
        state.frames.forEach(cleanup => cleanup());
        state.frames.clear();
      });
    }

    states.forEach(trackEditors);
  };

  let scheduled;
  const observer = new MutationObserver(() => {
    if (!scheduled) scheduled = setTimeout(() => { scheduled = undefined; scan(); }, 100);
  });
  scan();
  observer.observe(document.body, { childList: true, subtree: true });

  return () => {
    observer.disconnect();
    clearTimeout(scheduled);
    for (const state of states.values()) state.controller?.abort();
    cleanups.forEach(cleanup => cleanup());
    states.clear();
  };
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    void initializeV2();
  });
} else {
  void initializeV2();
}

export {};