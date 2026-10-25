/**
 * Bridge Content Script (document_start, MAIN world)
 *
 * Intercepts Moodle's secure window initialization to prevent event-halting,
 * and provides a postMessage bridge for the solver content script to call
 * native Moodle operations (drag-drop, markers, ordering, essay editors).
 */

if (window.__moodleQuizSolverBridge) {
  console.log('[MoodleQuizSolver] Bridge already initialized');
} else {
  window.__moodleQuizSolverBridge = true;

  /**
   * Moodle's secure-window module registers YUI handlers that halt native mouse,
   * drag, clipboard, selection, keyboard and print events. Intercept its init
   * before those handlers are registered.
   */
  function installSecureWindowCompatibility(host) {
    host = host || window;
    var patched = new WeakSet();

    function patchSecureWindow(secure) {
      if (!secure || typeof secure !== 'object' || patched.has(secure) || typeof secure.init !== 'function') return;
      patched.add(secure);
      var original = secure.init;
      secure.init = function () {
        var _a;
        if ((_a = host.document.body) === null || _a === void 0 ? void 0 : _a.classList.contains('quiz-secure-window')) return;
        return original.apply(this, arguments);
      };
    }

    var hookedQuizzes = new WeakSet();
    function hookQuiz(quiz) {
      if (!quiz || typeof quiz !== 'object' || hookedQuizzes.has(quiz)) return;
      hookedQuizzes.add(quiz);
      var secure = quiz.secure_window;
      patchSecureWindow(secure);
      Object.defineProperty(quiz, 'secure_window', {
        configurable: true, enumerable: true,
        get: function () { return secure; },
        set: function (value) { secure = value; patchSecureWindow(value); }
      });
    }

    var hookedMoodles = new WeakSet();
    function hookMoodle(moodle) {
      if (!moodle || typeof moodle !== 'object' || hookedMoodles.has(moodle)) return;
      hookedMoodles.add(moodle);
      var quiz = moodle.mod_quiz;
      hookQuiz(quiz);
      Object.defineProperty(moodle, 'mod_quiz', {
        configurable: true, enumerable: true,
        get: function () { return quiz; },
        set: function (value) { quiz = value; hookQuiz(value); }
      });
    }

    var global = host;
    var moodle = global.M;
    hookMoodle(moodle);
    Object.defineProperty(global, 'M', {
      configurable: true, enumerable: true,
      get: function () { return moodle; },
      set: function (value) { moodle = value; hookMoodle(value); }
    });
  }

  installSecureWindowCompatibility();

  /** Constants */
  var DELAY = 25;
  var ACTION_TIMEOUT = 3000;
  var READY_TIMEOUT = 15000;
  var main = window;
  var operation;

  function checkOperation() {
    if (operation && operation.signal && operation.signal.aborted) throw new DOMException('Operation cancelled', 'AbortError');
    if (operation && Date.now() >= operation.deadline) fail('Moodle update exceeded its time budget');
  }

  function fail(message) { throw new Error(message); }
  function throwIfAborted(signal) { if (signal && signal.aborted) throw new DOMException('Operation cancelled.', 'AbortError'); }
  function record(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) fail('Invalid bridge arguments');
    return value;
  }
  function string(value) {
    if (typeof value !== 'string' || !value || value.length > 512) fail('Invalid control identity');
    return value;
  }
  function elements(root, selector) { return Array.from(root.querySelectorAll(selector)); }
  function nodes(root, selector) { return Array.from(root.querySelectorAll(selector)); }
  function field(root, name) {
    var matches = nodes(root, 'input[name]').filter(function (el) { return el.name === string(name); });
    if (matches.length !== 1 || matches[0].disabled || matches[0].readOnly) fail('Response field is unavailable');
    return matches[0];
  }
  function suffix(element, prefix) {
    var value = Array.from(element.classList).find(function (c) { return new RegExp('^' + prefix + '[0-9]+$').test(c); });
    return value ? value.slice(prefix.length) : null;
  }

  function assertRoot(root) {
    checkOperation();
    if (!root.isConnected || !root.matches('.que') || !root.closest('#responseform') ||
      root.matches('[class*="-readonly"]') ||
      root.querySelector('.draghomes.readonly,.answercontainer.readonly,.droparea.readonly')) {
      fail('Question is unavailable or read-only');
    }
  }

  async function until(check, timeout, quiesce) {
    timeout = timeout || ACTION_TIMEOUT;
    quiesce = quiesce || false;
    var end = Date.now() + timeout;
    while (!check()) {
      if (!quiesce) checkOperation();
      if (Date.now() >= end) fail('Moodle control did not finish updating');
      await new Promise(function (resolve) { setTimeout(resolve, DELAY); });
    }
  }

  async function moduleValue(name) {
    await until(function () { return typeof main.require === 'function'; }, READY_TIMEOUT);
    return new Promise(function (resolve, reject) {
      var signal = operation && operation.signal;
      var remaining = Math.max(1, Math.min(READY_TIMEOUT, ((operation && operation.deadline) || (Date.now() + READY_TIMEOUT)) - Date.now()));
      var cleanup = function () { clearTimeout(timer); if (signal) signal.removeEventListener('abort', abort); };
      var abort = function () { cleanup(); reject(new DOMException('Operation cancelled', 'AbortError')); };
      var timer = setTimeout(function () { cleanup(); reject(new Error('Moodle module did not load')); }, remaining);
      if (signal) signal.addEventListener('abort', abort, { once: true });
      if (signal && signal.aborted) { abort(); return; }
      main.require([name], function (result) { cleanup(); resolve(result); }, function (error) { cleanup(); reject(error); });
    });
  }

  function changed(input) {
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }

  async function dirty(root) {
    var checker = await moduleValue('core_form/changechecker');
    assertRoot(root);
    var form = root.closest('#responseform');
    if (form && typeof checker.markFormAsDirty === 'function') checker.markFormAsDirty(form);
  }

  function keyboard(target, code) {
    var key = code === 27 ? 'Escape' : 'ArrowRight';
    var event = new KeyboardEvent('keydown', { key: key, code: key, bubbles: true, cancelable: true });
    Object.defineProperties(event, { keyCode: { value: code }, which: { value: code } });
    target.dispatchEvent(event);
  }

  async function ready(root) {
    assertRoot(root);
    await moduleValue('jquery');
    await until(function () {
      assertRoot(root);
      if (root.querySelector('.beingdragged')) return false;
      if (root.matches('.ddimageortext,.ddmarker')) {
        if (!nodes(root, '.ddarea img').every(function (image) { return image.complete && image.naturalWidth > 0; })) return false;
        var bg = root.querySelector('.dropbackground');
        if (!bg || bg.getBoundingClientRect().width <= 0) return false;
      }
      if (root.matches('.ddwtos,.ddimageortext,.ddmarker') && !root.querySelector('.dragplaceholder')) return false;
      if (root.matches('.ddimageortext') && !root.querySelector('.dropzones .dropzone')) return false;
      return true;
    }, READY_TIMEOUT);

    var geometry = function () {
      return nodes(root, '.drop,.dropzone,.dropbackground').map(function (node) {
        var rect = node.getBoundingClientRect();
        return [rect.left, rect.top, rect.width, rect.height].join(',');
      }).join(';');
    };

    var previous = geometry();
    var stable = 0;
    await until(function () {
      assertRoot(root);
      var current = geometry();
      stable = current === previous ? stable + 1 : 0;
      previous = current;
      return stable >= 2;
    }, READY_TIMEOUT);
  }

  async function step(root, input, key) {
    assertRoot(root);
    var place = suffix(input, 'place');
    var selector = root.classList.contains('ddwtos') ? '.drop' : '.dropzone';
    var drop = nodes(root, selector).find(function (el) { return suffix(el, 'place') === place; });
    if (!drop || !place) fail('Missing native drop control');
    var old = input.value;
    if (key === 27 && (!old || old === '0')) return;

    var $ = await moduleValue('jquery');
    var eventName = root.classList.contains('ddwtos') ? 'qtype_ddwtos-dragmoved' : 'qtype_ddimageortext-dragmoved';
    var moved = false;
    var listener = function () {
      var question = arguments[3];
      if (question && question.containerId === root.id) moved = true;
    };
    $(document.body).on(eventName, listener);
    try {
      assertRoot(root);
      keyboard(drop, key);
      await until(function () {
        assertRoot(root);
        return moved && !root.querySelector('.beingdragged') && input.value !== old;
      });
      await new Promise(function (resolve) { setTimeout(resolve, 0); });
      changed(input);
    } finally {
      try {
        if (root.isConnected && root.querySelector('.beingdragged')) {
          await until(function () { return !root.isConnected || !root.querySelector('.beingdragged'); }, ACTION_TIMEOUT, true);
        }
      } finally {
        $(document.body).off(eventName, listener);
      }
    }
  }

  async function clearPlaces(root) {
    if (!root.matches('.ddwtos,.ddimageortext')) fail('Not a slot drag question');
    await ready(root);
    for (var _i = 0, _a = nodes(root, 'input.placeinput[name]'); _i < _a.length; _i++) {
      var input = _a[_i];
      await step(root, input, 27);
    }
  }

  function mouseEvent(target, type, pageX, pageY) {
    var event = new MouseEvent(type, {
      bubbles: true, cancelable: true, button: 0,
      buttons: type === 'mouseup' ? 0 : 1,
      clientX: pageX - window.scrollX, clientY: pageY - window.scrollY
    });
    Object.defineProperties(event, { which: { value: 1 }, pageX: { value: pageX }, pageY: { value: pageY } });
    target.dispatchEvent(event);
  }

  function parsePoints(value) {
    if (!value) return [];
    return value.split(';').map(function (part) {
      var coords = part.split(',');
      var x = Number(coords[0]), y = Number(coords[1]);
      if (coords.length !== 2 || !Number.isFinite(x) || !Number.isFinite(y))
        fail('Invalid native marker response');
      return { x: x, y: y };
    });
  }

  async function markers(root, args) {
    if (!root.classList.contains('ddmarker')) fail('Not a marker question');
    await ready(root);
    var $ = await moduleValue('jquery');
    var input = field(root, args.fieldName);
    if (!input.classList.contains('choices') || !Array.isArray(args.points) || args.points.length > 500)
      fail('Invalid marker response');

    var choice = suffix(input, 'choice');
    var bg = root.querySelector('.dropbackground');
    var points = args.points.map(function (value) {
      var point = record(value);
      var x = point.x, y = point.y;
      if (typeof x !== 'number' || typeof y !== 'number' || !Number.isFinite(x) || !Number.isFinite(y) ||
        x < 0 || y < 0 || x >= bg.naturalWidth || y >= bg.naturalHeight)
        fail('Marker point is outside the image');
      return { x: x, y: y };
    });

    var capacity = Number(suffix(input, 'noofdrags'));
    if (!input.classList.contains('infinite') && points.length > capacity) fail('Marker capacity exceeded');

    for (var _i = 0, _a = nodes(root, '.droparea .marker:not(.dragplaceholder)').filter(function (el) { return suffix(el, 'choice') === choice; }); _i < _a.length; _i++) {
      var marker2 = _a[_i];
      assertRoot(root);
      keyboard(marker2, 27);
    }
    if (input.value) fail('Moodle did not clear existing markers');

    for (var _b = 0, _c = points; _b < _c.length; _b++) {
      var point = _c[_b];
      assertRoot(root);
      var marker = nodes(root, '.draghomes .marker.unneeded:not(.dragplaceholder)').find(function (el) { return suffix(el, 'choice') === choice; });
      if (!marker) fail('No remaining native marker instance');

      var start = marker.getBoundingClientRect();
      var pointerX = start.left + window.scrollX + Math.min(start.width / 2, 10);
      var pointerY = start.top + window.scrollY + Math.min(start.height / 2, 10);
      var finalX = pointerX, finalY = pointerY;
      var started = false;

      try {
        mouseEvent(marker, 'mousedown', pointerX, pointerY);
        started = marker.classList.contains('beingdragged');
        if (!started) fail('Native marker drag did not start');

        var actualStart = marker.getBoundingClientRect();
        var bounds = bg.getBoundingClientRect();
        var ratio = $.fn ? $(bg).width() / bg.naturalWidth : bg.getBoundingClientRect().width / bg.naturalWidth;
        if (!(ratio > 0)) fail('Background image geometry is unavailable');

        var markerStyle = getComputedStyle(marker);
        var fraction = function (value) {
          var parsed = parseFloat(value);
          return Number.isFinite(parsed) ? parsed - parseInt(value, 10) : 0;
        };

        finalX = pointerX + bounds.left + 1 + point.x * ratio - actualStart.left + fraction(markerStyle.left);
        finalY = pointerY + bounds.top + 1 + point.y * ratio - actualStart.top + fraction(markerStyle.top);
        mouseEvent(window, 'mousemove', finalX, finalY);
      } finally {
        if (started) mouseEvent(window, 'mouseup', finalX, finalY);
      }
      await new Promise(function (resolve) { setTimeout(resolve, 0); });
    }

    var actual = parsePoints(input.value);
    var remaining = actual.slice();
    for (var _d = 0, _e = points; _d < _e.length; _d++) {
      var pt = _e[_d];
      var idx = remaining.findIndex(function (p) { return Math.abs(p.x - pt.x) <= 1 && Math.abs(p.y - pt.y) <= 1; });
      if (idx < 0) fail('Moodle marker coordinates differ from the requested position');
      remaining.splice(idx, 1);
    }
    if (remaining.length) fail('Unexpected marker instances remain');
    changed(input);
  }

  async function setPlace(root, args) {
    if (!root.matches('.ddwtos,.ddimageortext')) fail('Not a slot drag question');
    await ready(root);
    var input = field(root, args.fieldName);
    if (!input.classList.contains('placeinput')) fail('Not a place field');

    var choice = args.choice === null ? '0' : string(args.choice);
    if ((input.value || '0') === choice) return;

    var group = suffix(input, 'group');
    var choices = nodes(root, '.draghome:not(.dragplaceholder)').filter(function (el) { return suffix(el, 'group') === group; });
    var count = new Set(choices.map(function (el) { return suffix(el, 'choice'); })).size;

    if (choice !== '0' && !choices.some(function (el) { return suffix(el, 'choice') === choice; }))
      fail('Unknown drag choice');

    await step(root, input, 27);
    if (choice === '0') return;

    for (var attempt = 0; attempt <= count; attempt++) {
      await step(root, input, 39);
      if (input.value === choice) return;
    }
    fail('Drag choice is unavailable; check finite choice capacity');
  }

  async function order(root, args) {
    if (!root.classList.contains('ordering')) fail('Not an ordering question');
    var list = root.querySelector('#' + CSS.escape(args.listId));
    if (!list || !Array.isArray(args.itemIds)) fail('Missing ordering control');

    var items = Array.from(list.children).filter(function (el) { return el instanceof HTMLElement && el.classList.contains('sortableitem'); });
    var ids = args.itemIds.map(string);
    if (ids.length !== items.length || new Set(ids).size !== items.length || ids.some(function (id) { return !items.some(function (el) { return el.id === id; }); }))
      fail('Invalid item permutation');

    var input = field(root, args.fieldName);
    for (var index = 0; index < ids.length; index++) {
      var item = items.find(function (el) { return el.id === ids[index]; });
      if (!item) continue;
      var budget = items.length;
      while (Array.from(list.children).indexOf(item) > index) {
        assertRoot(root);
        if (--budget < 0) fail('Ordering control did not move');
        var button = nodes(item, 'button[type="button"][data-action="move-backward"]').find(function (el) { return !el.disabled && el.getClientRects().length > 0; });
        if (!button) fail('Native ordering button is unavailable');
        var previous = Array.from(list.children).indexOf(item);
        button.click();
        if (Array.from(list.children).indexOf(item) !== previous - 1) fail('Native ordering handler is not ready');
        await new Promise(function (resolve) { setTimeout(resolve, 0); });
      }
    }

    if (input.value !== ids.join(',')) fail('Moodle did not serialize the requested order');
    changed(input);
    await dirty(root);
  }

  // --- Essay Editor Support ---

  function editorContentSignature(html) {
    var copy = document.createElement('div');
    copy.innerHTML = html;
    return copy.textContent || '';
  }

  function editorHTML(root, textarea) {
    var iframe = root.querySelector('iframe[id="' + CSS.escape(textarea.id) + '_ifr"]');
    var attoWrap = textarea.closest('.editor_atto_wrap');
    var atto = attoWrap ? attoWrap.querySelector('.editor_atto_content') : null;
    if (!atto) atto = root.querySelector('[id="' + CSS.escape(textarea.id) + 'editable"]');
    var body = (iframe && iframe.contentDocument && iframe.contentDocument.body) || atto;
    if (!body) throw new Error('The Moodle editor is still initializing.');
    var copy = body.cloneNode(true);
    cleanEditorDOM(copy);
    return copy.innerHTML;
  }

  async function nativeValueChange(element, write, signal) {
    throwIfAborted(signal);
    var observing = true;
    var restartPolling = function () {
      element.dispatchEvent(new element.ownerDocument.defaultView.KeyboardEvent('keydown', { bubbles: true, key: 'Unidentified', code: 'Unidentified' }));
    };
    var resumeAfterBlur = function () {
      queueMicrotask(function () {
        if (observing && !(signal && signal.aborted) && element.isConnected) restartPolling();
      });
    };
    element.addEventListener('blur', resumeAfterBlur);
    try {
      restartPolling();
      throwIfAborted(signal);
      write();
      await new Promise(function (resolve, reject) {
        var finish = function () { signal.removeEventListener('abort', abort); resolve(); };
        var timer = setTimeout(finish, 100);
        var abort = function () { clearTimeout(timer); signal.removeEventListener('abort', abort); reject(new DOMException('Operation cancelled.', 'AbortError')); };
        signal.addEventListener('abort', abort, { once: true });
        if (signal.aborted) abort();
      });
      throwIfAborted(signal);
    } finally {
      observing = false;
      element.removeEventListener('blur', resumeAfterBlur);
    }
  }

  function cleanEditorDOM(copy) {
    copy.querySelectorAll('[data-mce-bogus="all"], [data-mce-type="bookmark"]').forEach(function (node) { node.remove(); });
    copy.querySelectorAll('*').forEach(function (node) {
      for (var _i = 0, _a = Array.from(node.attributes); _i < _a.length; _i++) {
        var attr = _a[_i];
        if (attr.name.startsWith('data-mce-')) node.removeAttribute(attr.name);
      }
    });
  }

  function paragraphHTML(text) {
    return text.split(/\r?\n\r?\n/).map(function (paragraph) {
      return '<p style="white-space: pre-wrap;">' + paragraph.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\r?\n/g, '<br>') + '</p>';
    }).join('');
  }

  function tinyTextHTML(text) {
    var pre = document.createElement('pre');
    pre.style.cssText = 'white-space: pre-wrap; font: inherit; margin: 0; padding: 0; border: 0; background: transparent; color: inherit;';
    var span = document.createElement('span');
    span.style.font = 'inherit';
    span.textContent = text;
    pre.append(span);
    return pre.outerHTML;
  }

  async function handleEssayCommand(root, command, args, signal) {
    if (typeof args.textarea_id !== 'string') throw new Error('Missing editor identity.');
    var textarea = document.getElementById(args.textarea_id);
    if (!(textarea instanceof HTMLTextAreaElement) || !root.contains(textarea) || !textarea.name.endsWith('_answer'))
      throw new Error('Editor is not owned by this question.');
    if (textarea.disabled || textarea.readOnly) throw new Error('Editor is read-only.');
    if (signal.aborted) throw new Error('Editor operation cancelled.');

    if (command === 'essay.read') return { value: textarea.value };
    if (command !== 'essay.write' && command !== 'essay.restore' && command !== 'essay.ready')
      throw new Error('Unknown editor command.');
    if (command === 'essay.write' && typeof args.value !== 'string') throw new Error('Missing answer text.');
    if (command === 'essay.restore' && typeof args.html !== 'string') throw new Error('Missing previous answer.');

    var tiny = window.tinyMCE && window.tinyMCE.get(textarea.id);
    var atto = null;
    var settledAtto = null;
    var settledPlain = false;
    var confirmedPlain = false;
    var deadline = Date.now() + 10000;

    do {
      if (signal.aborted || !root.isConnected || !textarea.isConnected || !root.contains(textarea))
        throw new Error('Editor operation cancelled.');

      tiny = window.tinyMCE && window.tinyMCE.get(textarea.id);
      var candidate = root.querySelector('[id="' + CSS.escape(textarea.id) + 'editable"].editor_atto_content');
      var pending = window.M && window.M.util && window.M.util.pending_js;
      var attoReady = candidate && candidate.isConnected && document.readyState !== 'loading' &&
        Array.isArray(pending) && pending.length === 0;
      atto = attoReady && settledAtto === candidate ? candidate : null;
      settledAtto = attoReady ? candidate : null;

      if ((tiny && tiny.initialized !== false && tiny.undoManager) || atto) break;

      var richStarting = !!tiny || !!candidate || !!root.querySelector('.tox, .editor_atto_wrap, .tox-edit-area iframe');
      var plainReady = document.readyState !== 'loading' && Array.isArray(pending) && pending.length === 0
        && !richStarting && window.getComputedStyle(textarea).display !== 'none';
      if (plainReady && settledPlain) { confirmedPlain = true; break; }
      settledPlain = plainReady;
      await new Promise(function (resolve) { setTimeout(resolve, 50); });
    } while (Date.now() < deadline);

    var surface;
    if (tiny && tiny.initialized !== false && tiny.undoManager) surface = 'tiny';
    else if (atto) surface = 'atto';
    else if (confirmedPlain) surface = 'plain';
    else throw new Error('The Moodle editor is still initializing.');

    if (surface !== 'tiny') tiny = null;
    if (surface !== 'atto') atto = null;
    if (textarea.disabled || textarea.readOnly) throw new Error('Editor is read-only.');
    if (tiny && tiny.mode && tiny.mode.get() === 'readonly') throw new Error('Editor is read-only.');
    if (atto && (atto.getAttribute('contenteditable') === 'false' || atto.getAttribute('aria-readonly') === 'true'))
      throw new Error('Editor is read-only.');

    if (command === 'essay.ready')
      return surface === 'plain' ? { surface: surface, value: textarea.value } : { surface: surface, html: editorHTML(root, textarea) };

    if (surface === 'plain') throw new Error('The essay editor changed after preparation. Generate a fresh answer.');
    if (typeof args.expected_html !== 'string' || editorHTML(root, textarea) !== args.expected_html)
      throw new Error('The editor was changed before application. Generate a fresh answer.');

    var html = command === 'essay.restore' ? args.html
      : tiny ? tinyTextHTML(args.value) : paragraphHTML(args.value);

    if (tiny) {
      tiny.undoManager.transact(function () { tiny.setContent(html); tiny.save(); });
      tiny.fire('change');
      if (editorContentSignature(html) !== editorContentSignature(tiny.getContent()) ||
        editorContentSignature(tiny.getContent()) !== editorContentSignature(textarea.value))
        throw new Error('TinyMCE did not synchronize the complete answer.');
    } else if (atto) {
      if (atto.getAttribute('contenteditable') === 'false' || atto.getAttribute('aria-readonly') === 'true')
        throw new Error('Editor is read-only.');
      await nativeValueChange(atto, function () {
        atto.innerHTML = html;
        atto.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, key: ' ' }));
      }, signal);
      if (editorContentSignature(html) !== editorContentSignature(atto.innerHTML) ||
        editorContentSignature(atto.innerHTML) !== editorContentSignature(textarea.value))
        throw new Error('Atto did not synchronize the complete answer.');
    } else {
      throw new Error('The Moodle editor is still initializing.');
    }

    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    textarea.dispatchEvent(new Event('change', { bubbles: true }));
    return { value: textarea.value };
  }

  /**
   * Main bridge entry point - executes a bridge command on a question root
   */
  async function executeBridge(root, command, argument, signal) {
    operation = { signal: signal, deadline: Date.now() + 12000 };
    try {
      assertRoot(root);
      var args = record(argument);

      if (command.startsWith('essay.'))
        return await handleEssayCommand(root, command, args, signal);

      switch (command) {
        case 'ready':
          await ready(root);
          return true;
        case 'composite.clear':
          await clearPlaces(root);
          return true;
        case 'composite.set':
          await setPlace(root, args);
          return true;
        case 'ordering.set':
          await order(root, args);
          return true;
        case 'marker.set':
          await markers(root, args);
          return true;
        case 'dirty':
          await dirty(root);
          return true;
        default:
          throw new Error('Unknown bridge command: ' + command);
      }
    } finally {
      operation = undefined;
    }
  }

  // Expose executeBridge for external calls
  window.__moodleQuizSolverExec = executeBridge;

  // Set up message listener for bridge calls from solver content script
  var queue = Promise.resolve();
  var controllers = new Map();

  window.addEventListener('message', function (event) {
    if (event.source !== window || event.origin !== location.origin) return;
    var message = event.data;
    if (!message || message.source !== 'moodle-quiz-solver-v2') return;

    if (message.direction === 'cancel' && typeof message.id === 'string') {
      var ctrl = controllers.get(message.id);
      if (ctrl) ctrl.abort();
      return;
    }

    if (message.direction !== 'request' ||
      typeof message.id !== 'string' || typeof message.root_id !== 'string' || typeof message.command !== 'string')
      return;

    var controller = new AbortController();
    controllers.set(message.id, controller);

    queue = queue.then(async function () {
      try {
        var root = document.getElementById(message.root_id);
        if (!root) fail('Question no longer exists');
        var result = await executeBridge(root, message.command, message.args, controller.signal);
        window.postMessage({
          source: 'moodle-quiz-solver-v2',
          direction: 'response',
          id: message.id,
          ok: true,
          result: result
        }, location.origin);
      } catch (error) {
        window.postMessage({
          source: 'moodle-quiz-solver-v2',
          direction: 'response',
          id: message.id,
          ok: false,
          error: error instanceof Error ? error.message : 'Moodle control failed'
        }, location.origin);
      } finally {
        controllers.delete(message.id);
      }
    });
  });
}

export {}
