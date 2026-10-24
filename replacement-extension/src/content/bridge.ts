/**
 * Bridge Content Script (document_start)
 * Runs in MAIN world to intercept Moodle's secure window initialization
 * and provide a message bridge for the solver content script.
 */

// Prevent multiple initializations
if (window.__moodleQuizSolverBridge) {
  console.log('[MoodleQuizSolver] Bridge already initialized');
} else {
  window.__moodleQuizSolverBridge = true;

  /**
   * Moodle's secure-window module registers YUI handlers that halt native mouse,
   * drag, clipboard, selection, keyboard and print events. Intercept its init
   * before those handlers are registered. The popup and its separate close-button
   * initializer remain Moodle-owned, and native question listeners see every event.
   */
  function installSecureWindowCompatibility(host = window) {
    const patched = new WeakSet();

    const patchSecureWindow = (secure: unknown) => {
      if (!secure || typeof secure !== 'object' || patched.has(secure) || typeof (secure as Record<string, unknown>).init !== 'function') {
        return;
      }
      patched.add(secure);
      const original = (secure as Record<string, unknown>).init as Function;
      (secure as Record<string, unknown>).init = function (...args: unknown[]) {
        var _a;
        if ((_a = host.document.body) === null || _a === void 0 ? void 0 : _a.classList.contains('quiz-secure-window')) {
          return;
        }
        return original.apply(this, args);
      };
    };

    const hookedQuizzes = new WeakSet();
    const hookQuiz = (quiz: unknown) => {
      if (!quiz || typeof quiz !== 'object' || hookedQuizzes.has(quiz)) return;
      hookedQuizzes.add(quiz);
      let secure = (quiz as Record<string, unknown>).secure_window;
      patchSecureWindow(secure);
      Object.defineProperty(quiz, 'secure_window', {
        configurable: true,
        enumerable: true,
        get: () => secure,
        set: (value) => { secure = value; patchSecureWindow(value); }
      });
    };

    const hookedMoodles = new WeakSet();
    const hookMoodle = (moodle: unknown) => {
      if (!moodle || typeof moodle !== 'object' || hookedMoodles.has(moodle)) return;
      hookedMoodles.add(moodle);
      let quiz = (moodle as Record<string, unknown>).mod_quiz;
      hookQuiz(quiz);
      Object.defineProperty(moodle, 'mod_quiz', {
        configurable: true,
        enumerable: true,
        get: () => quiz,
        set: (value) => { quiz = value; hookQuiz(value); }
      });
    };

    const global = host;
    let moodle = global.M;
    hookMoodle(moodle);
    Object.defineProperty(global, 'M', {
      configurable: true,
      enumerable: true,
      get: () => moodle,
      set: (value) => { moodle = value; hookMoodle(value); }
    });
  }

  // Install secure window compatibility immediately
  installSecureWindowCompatibility();

  /**
   * Message bridge for communication between content scripts and popup
   */
  const controllers = new Map<string, AbortController>();
  let queue = Promise.resolve();

  window.addEventListener('message', (event) => {
    // Only accept messages from same window and origin
    if (event.source !== window || event.origin !== location.origin) return;

    const message = event.data;
    if (!message || message.source !== 'moodle-quiz-solver-v2') return;

    // Handle cancellation
    if (message.direction === 'cancel' && typeof message.id === 'string') {
      controllers.get(message.id)?.abort();
      return;
    }

    // Handle requests from popup/solver
    if (message.direction !== 'request' ||
        typeof message.id !== 'string' ||
        typeof message.root_id !== 'string' ||
        typeof message.command !== 'string') {
      return;
    }

    const controller = new AbortController();
    controllers.set(message.id, controller);

    queue = queue.then(async () => {
      try {
        const root = document.getElementById(message.root_id);
        if (!root) {
          throw new Error('Question no longer exists');
        }

        const result = await executeBridge(root, message.command, message.args, controller.signal);
        window.postMessage({
          source: 'moodle-quiz-solver-v2',
          direction: 'response',
          id: message.id,
          ok: true,
          result
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

  /**
   * Execute a bridge command on a question root
   */
  async function executeBridge(
    root: HTMLElement,
    command: string,
    argument: unknown,
    signal: AbortSignal
  ): Promise<unknown> {
    // Validate root
    if (!root.isConnected || !root.matches('.que') || !root.closest('#responseform') ||
        root.matches('[class*="-readonly"]') ||
        root.querySelector('.draghomes.readonly,.answercontainer.readonly,.droparea.readonly')) {
      throw new Error('Question is unavailable or read-only');
    }

    // Check abort signal
    const checkAbort = () => {
      if (signal.aborted) throw new DOMException('Operation cancelled', 'AbortError');
    };

    // Load Moodle module via require
    async function moduleValue(name: string): Promise<unknown> {
      await waitFor(() => typeof (window as unknown as { require?: Function }).require === 'function', 15000);
      return new Promise((resolve, reject) => {
        const remaining = Math.max(1, 15000 - (Date.now() - Date.now()));
        const cleanup = () => { signal.removeEventListener('abort', abort); };
        const abort = () => { cleanup(); reject(new DOMException('Operation cancelled', 'AbortError')); };
        const timer = setTimeout(() => { cleanup(); reject(new Error('Moodle module did not load')); }, remaining);
        signal.addEventListener('abort', abort, { once: true });
        if (signal.aborted) { abort(); return; }
        (window as unknown as { require: Function }).require([name], (result: unknown) => {
          cleanup();
          clearTimeout(timer);
          resolve(result);
        }, (error: Error) => {
          cleanup();
          clearTimeout(timer);
          reject(error);
        });
      });
    }

    // Wait for condition
    async function waitFor(check: () => boolean, timeout: number, quiesce = false): Promise<void> {
      const end = Date.now() + timeout;
      while (!check()) {
        if (!quiesce) checkAbort();
        if (Date.now() >= end) throw new Error('Moodle control did not finish updating');
        await new Promise(r => setTimeout(r, 25));
      }
    }

    // Dispatch input/change events
    function changed(input: HTMLInputElement): void {
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }

    // Mark form as dirty
    async function dirty(root: HTMLElement): Promise<void> {
      const checker = await moduleValue('core_form/changechecker') as { markFormAsDirty?: (form: HTMLFormElement) => void };
      const form = root.closest('#responseform') as HTMLFormElement | null;
      if (form && typeof checker?.markFormAsDirty === 'function') {
        checker.markFormAsDirty(form);
      }
    }

    // Keyboard event simulation
    function keyboard(target: HTMLElement, code: number): void {
      const key = code === 27 ? 'Escape' : 'ArrowRight';
      const event = new KeyboardEvent('keydown', { key, code: key, bubbles: true, cancelable: true });
      Object.defineProperties(event, { keyCode: { value: code }, which: { value: code } });
      target.dispatchEvent(event);
    }

    // Handle different commands
    checkAbort();

    switch (command) {
      case 'ready': {
        await waitFor(() => {
          checkAbort();
          if (root.querySelector('.beingdragged')) return false;
          if (root.matches('.ddimageortext,.ddmarker')) {
            if (!Array.from(root.querySelectorAll('.ddarea img')).every(img => img.complete && img.naturalWidth > 0))
              return false;
            const bg = root.querySelector('.dropbackground');
            if (!bg || bg.getBoundingClientRect().width <= 0) return false;
          }
          if (root.matches('.ddwtos,.ddimageortext,.ddmarker') && !root.querySelector('.dragplaceholder')) return false;
          if (root.matches('.ddimageortext') && !root.querySelector('.dropzones .dropzone')) return false;
          return true;
        }, 15000);

        // Wait for geometry stability
        const geometry = () => Array.from(root.querySelectorAll('.drop,.dropzone,.dropbackground')).map(node => {
          const rect = node.getBoundingClientRect();
          return [rect.left, rect.top, rect.width, rect.height].join(',');
        }).join(';');

        let previous = geometry();
        let stable = 0;
        await waitFor(() => {
          checkAbort();
          const current = geometry();
          stable = current === previous ? stable + 1 : 0;
          previous = current;
          return stable >= 2;
        }, 15000);
        return true;
      }

      case 'composite.clear': {
        if (!root.matches('.ddwtos,.ddimageortext')) throw new Error('Not a slot drag question');
        // Wait for ready
        await (await moduleValue('core_form/changechecker')); // dummy wait
        const inputs = Array.from(root.querySelectorAll('input.placeinput[name]'));
        for (const input of inputs) {
          checkAbort();
          const place = (input.className.match(/place(\d+)/) || [])[1];
          const selector = root.classList.contains('ddwtos') ? '.drop' : '.dropzone';
          const drop = Array.from(root.querySelectorAll(selector)).find(el =>
            (el.className.match(/place(\d+)/) || [])[1] === place
          );
          if (!drop || !place) continue;
          await stepDrag(root, input, drop, 27);
        }
        return true;
      }

      case 'composite.set': {
        if (!root.matches('.ddwtos,.ddimageortext')) throw new Error('Not a slot drag question');
        await waitFor(() => true, 15000); // ready
        const args = argument as { fieldName: string; choice: string | null };
        const input = root.querySelector(`input[name="${CSS.escape(args.fieldName)}"]`) as HTMLInputElement;
        if (!input || !input.classList.contains('placeinput')) throw new Error('Not a place field');

        const choice = args.choice === null ? '0' : String(args.choice);
        if ((input.value || '0') === choice) return true;

        const group = (input.className.match(/group(\d+)/) || [])[1];
        const choices = Array.from(root.querySelectorAll('.draghome:not(.dragplaceholder)')).filter(el =>
          (el.className.match(/group(\d+)/) || [])[1] === group
        );
        const count = new Set(choices.map(el => (el.className.match(/choice(\d+)/) || [])[1])).size;

        if (choice !== '0' && !choices.some(el => (el.className.match(/choice(\d+)/) || [])[1] === choice)) {
          throw new Error('Unknown drag choice');
        }

        await stepDrag(root, input, null, 27); // clear first
        if (choice === '0') return true;

        for (let attempt = 0; attempt <= count; attempt++) {
          checkAbort();
          const drop = findDropForChoice(root, choice);
          if (drop) await stepDrag(root, input, drop, 39);
          if (input.value === choice) return true;
        }
        throw new Error('Drag choice is unavailable; check finite choice capacity');
      }

      case 'ordering.set': {
        if (!root.classList.contains('ordering')) throw new Error('Not an ordering question');
        const args = argument as { listId: string; itemIds: string[]; fieldName: string };
        const list = root.querySelector(`#${CSS.escape(args.listId)}`) as HTMLElement;
        if (!list || !Array.isArray(args.itemIds)) throw new Error('Missing ordering control');

        const items = Array.from(list.children).filter(el =>
          el instanceof HTMLElement && el.classList.contains('sortableitem')
        );
        const ids = args.itemIds.map(String);
        if (ids.length !== items.length || new Set(ids).size !== items.length ||
            ids.some(id => !items.some(el => el.id === id))) {
          throw new Error('Invalid item permutation');
        }

        const input = root.querySelector(`input[name="${CSS.escape(args.fieldName)}"]`) as HTMLInputElement;
        if (!input) throw new Error('Ordering input not found');

        for (let index = 0; index < ids.length; index++) {
          checkAbort();
          const item = items.find(el => el.id === ids[index]);
          if (!item) continue;
          let budget = items.length;
          while (Array.from(list.children).indexOf(item) > index) {
            checkAbort();
            if (--budget < 0) throw new Error('Ordering control did not move');
            const button = Array.from(item.querySelectorAll('button[type="button"][data-action="move-backward"]'))
              .find(el => !el.disabled && el.getClientRects().length > 0);
            if (!button) throw new Error('Native ordering button is unavailable');
            const previous = Array.from(list.children).indexOf(item);
            button.click();
            if (Array.from(list.children).indexOf(item) !== previous - 1)
              throw new Error('Native ordering handler is not ready');
            await new Promise(r => setTimeout(r, 0));
          }
        }

        if (input.value !== ids.join(',')) throw new Error('Moodle did not serialize the requested order');
        changed(input);
        await dirty(root);
        return true;
      }

      case 'marker.set': {
        if (!root.classList.contains('ddmarker')) throw new Error('Not a marker question');
        await waitFor(() => true, 15000); // ready
        const $ = (await moduleValue('jquery')) as { (selector: string): { on: Function; off: Function } };
        const args = argument as { fieldName: string; points: Array<{ x: number; y: number }> };
        const input = root.querySelector(`input[name="${CSS.escape(args.fieldName)}"]`) as HTMLInputElement;
        if (!input?.classList.contains('choices') || !Array.isArray(args.points) || args.points.length > 500)
          throw new Error('Invalid marker response');

        const choice = (input.className.match(/choice(\d+)/) || [])[1];
        const bg = root.querySelector('.dropbackground') as HTMLImageElement;
        if (!bg) throw new Error('Background image not found');

        const capacity = Number((input.className.match(/noofdrags(\d+)/) || [])[1]) || Infinity;
        if (!input.classList.contains('infinite') && args.points.length > capacity)
          throw new Error('Marker capacity exceeded');

        // Clear existing markers
        for (const marker of Array.from(root.querySelectorAll('.droparea .marker:not(.dragplaceholder)')).filter(el =>
          (el.className.match(/choice(\d+)/) || [])[1] === choice
        )) {
          checkAbort();
          keyboard(marker, 27);
        }

        if (input.value) throw new Error('Moodle did not clear existing markers');

        for (const point of args.points) {
          checkAbort();
          const marker = Array.from(root.querySelectorAll('.draghomes .marker.unneeded:not(.dragplaceholder)'))
            .find(el => (el.className.match(/choice(\d+)/) || [])[1] === choice);
          if (!marker) throw new Error('No remaining native marker instance');

          const start = marker.getBoundingClientRect();
          const pointerX = start.left + window.scrollX + Math.min(start.width / 2, 10);
          const pointerY = start.top + window.scrollY + Math.min(start.height / 2, 10);
          let finalX = pointerX, finalY = pointerY;
          let started = false;

          try {
            mouseEvent(marker, 'mousedown', pointerX, pointerY);
            started = marker.classList.contains('beingdragged');
            if (!started) throw new Error('Native marker drag did not start');

            const actualStart = marker.getBoundingClientRect();
            const bounds = bg.getBoundingClientRect();
            const ratio = $(bg).width() / bg.naturalWidth;
            if (!(ratio > 0)) throw new Error('Background image geometry is unavailable');

            const markerStyle = getComputedStyle(marker);
            const fraction = (value: string) => {
              const parsed = parseFloat(value);
              return Number.isFinite(parsed) ? parsed - parseInt(value, 10) : 0;
            };

            finalX = pointerX + bounds.left + 1 + point.x * ratio - actualStart.left + fraction(markerStyle.left);
            finalY = pointerY + bounds.top + 1 + point.y * ratio - actualStart.top + fraction(markerStyle.top);
            mouseEvent(window, 'mousemove', finalX, finalY);
          } finally {
            if (started) mouseEvent(window, 'mouseup', finalX, finalY);
          }
          await new Promise(r => setTimeout(r, 0));
        }

        // Verify positions
        const actual = parsePoints(input.value);
        const remaining = [...actual];
        for (const point of args.points) {
          const i = remaining.findIndex(p => Math.abs(p.x - point.x) <= 1 && Math.abs(p.y - point.y) <= 1);
          if (i < 0) throw new Error('Moodle marker coordinates differ from the requested position');
          remaining.splice(i, 1);
        }
        if (remaining.length) throw new Error('Unexpected marker instances remain');
        changed(input);
        return true;
      }

      case 'dirty': {
        await dirty(root);
        return true;
      }

      default:
        throw new Error(`Unknown bridge command: ${command}`);
    }
  }

  // Helper functions
  function findDropForChoice(root: HTMLElement, choice: string): HTMLElement | null {
    const selector = root.classList.contains('ddwtos') ? '.drop' : '.dropzone';
    return Array.from(root.querySelectorAll(selector)).find(el =>
      (el.className.match(/place(\d+)/) || [])[1] === choice
    ) as HTMLElement | null;
  }

  async function stepDrag(root: HTMLElement, input: HTMLInputElement, drop: HTMLElement | null, keyCode: number): Promise<void> {
    const $ = (await moduleValue('jquery')) as { (selector: string): { on: Function; off: Function } };
    const old = input.value;
    if (keyCode === 27 && (!old || old === '0')) return;

    const eventName = root.classList.contains('ddwtos') ? 'qtype_ddwtos-dragmoved' : 'qtype_ddimageortext-dragmoved';
    let moved = false;
    const listener = (...args: unknown[]) => {
      const question = args[3];
      if ((question as { containerId?: string })?.containerId === root.id) moved = true;
    };

    $(document.body).on(eventName, listener);
    try {
      if (drop) keyboard(drop, keyCode);
      await waitFor(() => moved && !root.querySelector('.beingdragged') && input.value !== old, 3000);
      await new Promise(r => setTimeout(r, 0));
      changed(input);
    } finally {
      try {
        if (root.isConnected && root.querySelector('.beingdragged')) {
          await waitFor(() => !root.isConnected || !root.querySelector('.beingdragged'), 3000, true);
        }
      } finally {
        $(document.body).off(eventName, listener);
      }
    }
  }

  function mouseEvent(target: EventTarget, type: string, pageX: number, pageY: number): void {
    const event = new MouseEvent(type, {
      bubbles: true, cancelable: true, button: 0,
      buttons: type === 'mouseup' ? 0 : 1,
      clientX: pageX - window.scrollX, clientY: pageY - window.scrollY
    });
    Object.defineProperties(event, { which: { value: 1 }, pageX: { value: pageX }, pageY: { value: pageY } });
    target.dispatchEvent(event);
  }

  function parsePoints(value: string): Array<{ x: number; y: number }> {
    if (!value) return [];
    return value.split(';').map(part => {
      const [x, y] = part.split(',').map(Number);
      if (!Number.isFinite(x) || !Number.isFinite(y)) throw new Error('Invalid native marker response');
      return { x, y };
    });
  }

  // Export for solver script (not needed since message listener handles all calls)
}

export {};