(function (exports) {
    'use strict';

    const BLOCKS = new Set(['ADDRESS', 'ARTICLE', 'ASIDE', 'BLOCKQUOTE', 'DD', 'DIV', 'DL', 'DT', 'FIGCAPTION', 'FIGURE', 'FOOTER', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'HEADER', 'HR', 'LI', 'MAIN', 'NAV', 'OL', 'P', 'PRE', 'SECTION', 'TABLE', 'TBODY', 'TD', 'TFOOT', 'TH', 'THEAD', 'TR', 'UL']);
    function cleanEditorDOM(copy) {
        copy.querySelectorAll('[data-mce-bogus="all"], [data-mce-type="bookmark"]').forEach(node => node.remove());
        copy.querySelectorAll('*').forEach(node => {
            for (const attribute of Array.from(node.attributes))
                if (attribute.name.startsWith('data-mce-'))
                    node.removeAttribute(attribute.name);
        });
        const preservesWhitespace = (element) => {
            var _a;
            for (let ancestor = element; ancestor; ancestor = ancestor.parentElement) {
                if (['PRE', 'CODE', 'TEXTAREA'].includes(ancestor.tagName) || ['pre', 'pre-wrap', 'pre-line', 'break-spaces'].includes(((_a = ancestor.style) === null || _a === void 0 ? void 0 : _a.whiteSpace) || ''))
                    return true;
            }
            return false;
        };
        const visit = (parent) => {
            for (const node of Array.from(parent.childNodes)) {
                if (node.nodeType === 1) {
                    visit(node);
                    continue;
                }
                // Tiny's serializer inserts newlines BETWEEN blocks. Whitespace inside
                // paragraphs/code or between inline elements remains authored content.
                if (node.nodeType !== 3 || !/^[\t\r\n ]+$/.test(node.textContent || '') || preservesWhitespace(parent))
                    continue;
                const previous = node.previousSibling, next = node.nextSibling;
                const block = (sibling) => (sibling === null || sibling === void 0 ? void 0 : sibling.nodeType) === 1 && BLOCKS.has(sibling.tagName);
                if ((previous || next) && (!previous || block(previous)) && (!next || block(next)))
                    node.remove();
            }
        };
        visit(copy);
    }
    /** Compare complete visible content without flattening BRs, paragraphs or indentation. */
    function editorContentSignature(html) {
        const copy = document.createElement('div');
        copy.innerHTML = html;
        cleanEditorDOM(copy);
        const tokens = (parent) => {
            const result = [];
            const append = (token) => {
                if (typeof token === 'string' && typeof result[result.length - 1] === 'string')
                    result[result.length - 1] = result[result.length - 1] + token;
                else
                    result.push(token);
            };
            for (const node of Array.from(parent.childNodes)) {
                if (node.nodeType === 3) {
                    if (node.textContent)
                        append(node.textContent);
                    continue;
                }
                if (node.nodeType !== 1)
                    continue;
                const element = node;
                if (element.tagName === 'BR')
                    append({ break: true });
                else if (BLOCKS.has(element.tagName))
                    append({ block: element.tagName.toLowerCase(), children: tokens(element) });
                else if (['IMG', 'SVG', 'MATH', 'AUDIO', 'VIDEO', 'IFRAME', 'OBJECT'].includes(element.tagName))
                    append({ media: element.tagName.toLowerCase(), html: element.outerHTML });
                else
                    tokens(element).forEach(append);
            }
            return result;
        };
        const result = tokens(copy);
        // Native editors represent the empty textarea with one placeholder paragraph.
        const only = result[0];
        if (result.length === 1 && typeof only === 'object' && 'block' in only && only.block === 'p'
            && (!only.children.length || (only.children.length === 1 && typeof only.children[0] === 'object' && 'break' in only.children[0])))
            return '[]';
        return JSON.stringify(result);
    }
    /** Read visible rich-editor state without private Moodle or editor managers. */
    function editorHTML(root, textarea) {
        var _a, _b;
        const iframe = root.querySelector(`iframe[id="${CSS.escape(textarea.id)}_ifr"]`);
        const atto = ((_a = textarea.closest('.editor_atto_wrap')) === null || _a === void 0 ? void 0 : _a.querySelector('.editor_atto_content'))
            || root.querySelector(`[id="${CSS.escape(textarea.id)}editable"]`);
        const body = ((_b = iframe === null || iframe === void 0 ? void 0 : iframe.contentDocument) === null || _b === void 0 ? void 0 : _b.body) || atto;
        if (!body)
            throw new Error('The Moodle editor is still initializing.');
        const copy = body.cloneNode(true);
        cleanEditorDOM(copy);
        return copy.innerHTML;
    }

    function throwIfAborted(signal) {
        if (signal === null || signal === void 0 ? void 0 : signal.aborted)
            throw new DOMException('Operation cancelled.', 'AbortError');
    }

    /** Let Moodle's public YUI valuechange listener observe a programmatic edit. */
    async function nativeValueChange(element, write, signal) {
        throwIfAborted(signal);
        let observing = true;
        // Moodle's bundled YUI _onKeyDown initializes/restarts polling even for an
        // unfocused target. Do this BEFORE writing so its baseline is the old value.
        const restartPolling = () => element.dispatchEvent(new element.ownerDocument.defaultView.KeyboardEvent('keydown', { bubbles: true, key: 'Unidentified', code: 'Unidentified' }));
        const resumeAfterBlur = () => {
            // YUI's delegated blur listener stops polling. If the user moves focus
            // during our observation window, restart only after that native listener.
            queueMicrotask(() => { if (observing && !(signal === null || signal === void 0 ? void 0 : signal.aborted) && element.isConnected)
                restartPolling(); });
        };
        element.addEventListener('blur', resumeAfterBlur);
        try {
            restartPolling();
            throwIfAborted(signal);
            write();
            await new Promise((resolve, reject) => {
                const finish = () => { signal === null || signal === void 0 ? void 0 : signal.removeEventListener('abort', abort); resolve(); };
                const timer = setTimeout(finish, 100); // YUI valuechange polls every 50ms.
                const abort = () => { clearTimeout(timer); signal === null || signal === void 0 ? void 0 : signal.removeEventListener('abort', abort); reject(new DOMException('Operation cancelled.', 'AbortError')); };
                signal === null || signal === void 0 ? void 0 : signal.addEventListener('abort', abort, { once: true });
                if (signal === null || signal === void 0 ? void 0 : signal.aborted)
                    abort();
            });
            throwIfAborted(signal);
        }
        finally {
            observing = false;
            element.removeEventListener('blur', resumeAfterBlur);
        }
    }

    function paragraphHTML(text) {
        return text.split(/\r?\n\r?\n/).map(paragraph => `<p style="white-space: pre-wrap;">${paragraph.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\r?\n/g, '<br>')}</p>`).join('');
    }
    function tinyTextHTML(text) {
        // Tiny's parser strips indentation after BRs even with CSS pre-wrap on P.
        // PRE is its native whitespace-preserving element. A styled inner span
        // survives serialization and protects a leading LF from PRE's HTML parsing
        // rule; inherited typography avoids rendering an essay as a code sample.
        const pre = document.createElement('pre');
        pre.style.cssText = 'white-space: pre-wrap; font: inherit; margin: 0; padding: 0; border: 0; background: transparent; color: inherit;';
        const span = document.createElement('span');
        span.style.font = 'inherit';
        span.textContent = text;
        pre.append(span);
        return pre.outerHTML;
    }
    async function handleEditorCommand(root, command, args, signal) {
        var _a, _b, _c, _d;
        if (typeof args.textarea_id !== 'string')
            throw new Error('Missing editor identity.');
        const textarea = document.getElementById(args.textarea_id);
        if (!(textarea instanceof HTMLTextAreaElement) || !root.contains(textarea) || !textarea.name.endsWith('_answer'))
            throw new Error('Editor is not owned by this question.');
        if (textarea.disabled || textarea.readOnly)
            throw new Error('Editor is read-only.');
        if (signal === null || signal === void 0 ? void 0 : signal.aborted)
            throw new Error('Editor operation cancelled.');
        if (command === 'essay.read')
            return { value: textarea.value };
        if (command !== 'essay.write' && command !== 'essay.restore' && command !== 'essay.ready')
            throw new Error('Unknown editor command.');
        if (command === 'essay.write' && typeof args.value !== 'string')
            throw new Error('Missing answer text.');
        if (command === 'essay.restore' && typeof args.html !== 'string')
            throw new Error('Missing previous answer.');
        let tiny;
        let atto = null;
        let settledAtto = null;
        let settledPlain = false;
        let confirmedPlain = false;
        const deadline = Date.now() + 10000;
        do {
            if ((signal === null || signal === void 0 ? void 0 : signal.aborted) || !root.isConnected || !textarea.isConnected || !root.contains(textarea))
                throw new Error('Editor operation cancelled.');
            tiny = (_a = window.tinyMCE) === null || _a === void 0 ? void 0 : _a.get(textarea.id);
            const candidate = root.querySelector(`[id="${CSS.escape(textarea.id)}editable"].editor_atto_content`);
            // Moodle 4.5 Atto creates the div before copying textarea content and
            // fetching its autosaved draft. Public pending_js tracks YUI IO through
            // io:end (javascript-static.js); a present div alone is not readiness.
            const pending = (_c = (_b = window.M) === null || _b === void 0 ? void 0 : _b.util) === null || _c === void 0 ? void 0 : _c.pending_js;
            const attoReady = (candidate === null || candidate === void 0 ? void 0 : candidate.isConnected) && document.readyState !== 'loading'
                && Array.isArray(pending) && pending.length === 0;
            atto = attoReady && settledAtto === candidate ? candidate : null;
            settledAtto = attoReady ? candidate : null;
            if ((tiny && tiny.initialized !== false && tiny.undoManager) || atto)
                break;
            const richStarting = !!tiny || !!candidate || !!root.querySelector('.tox, .editor_atto_wrap, .tox-edit-area iframe');
            const plainReady = document.readyState !== 'loading' && Array.isArray(pending) && pending.length === 0
                && !richStarting && window.getComputedStyle(textarea).display !== 'none';
            if (plainReady && settledPlain) {
                confirmedPlain = true;
                break;
            }
            settledPlain = plainReady;
            await new Promise(resolve => setTimeout(resolve, 50));
        } while (Date.now() < deadline);
        let surface;
        if (tiny && tiny.initialized !== false && tiny.undoManager)
            surface = 'tiny';
        else if (atto)
            surface = 'atto';
        else if (confirmedPlain)
            surface = 'plain';
        else
            throw new Error('The Moodle editor is still initializing.');
        if (surface !== 'tiny')
            tiny = null;
        if (surface !== 'atto')
            atto = null;
        if (textarea.disabled || textarea.readOnly)
            throw new Error('Editor is read-only.');
        if (((_d = tiny === null || tiny === void 0 ? void 0 : tiny.mode) === null || _d === void 0 ? void 0 : _d.get()) === 'readonly')
            throw new Error('Editor is read-only.');
        if (atto && (atto.getAttribute('contenteditable') === 'false' || atto.getAttribute('aria-readonly') === 'true'))
            throw new Error('Editor is read-only.');
        if (command === 'essay.ready')
            return surface === 'plain' ? { surface, value: textarea.value }
                : { surface, html: editorHTML(root, textarea) };
        if (surface === 'plain')
            throw new Error('The essay editor changed after preparation. Generate a fresh answer.');
        if (typeof args.expected_html !== 'string' || editorHTML(root, textarea) !== args.expected_html)
            throw new Error('The editor was changed before application. Generate a fresh answer.');
        const html = command === 'essay.restore' ? args.html
            : tiny ? tinyTextHTML(args.value) : paragraphHTML(args.value);
        if (tiny) {
            tiny.undoManager.transact(() => { tiny.setContent(html); tiny.save(); });
            tiny.fire('change');
            const expected = editorContentSignature(html);
            const visible = editorContentSignature(tiny.getContent());
            const saved = editorContentSignature(textarea.value);
            if (expected !== visible || visible !== saved)
                throw new Error('TinyMCE did not synchronize the complete answer.');
        }
        else if (atto) {
            if (atto.getAttribute('contenteditable') === 'false' || atto.getAttribute('aria-readonly') === 'true')
                throw new Error('Editor is read-only.');
            const editor = atto;
            await nativeValueChange(editor, () => {
                editor.innerHTML = html;
                editor.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, key: ' ' }));
            }, signal);
            if (editorContentSignature(html) !== editorContentSignature(atto.innerHTML) || editorContentSignature(atto.innerHTML) !== editorContentSignature(textarea.value))
                throw new Error('Atto did not synchronize the complete answer.');
        }
        else
            throw new Error('The Moodle editor is still initializing.');
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
        textarea.dispatchEvent(new Event('change', { bubbles: true }));
        return { value: textarea.value };
    }

    /**
     * Moodle's secure-window module registers YUI handlers that halt native mouse,
     * drag, clipboard, selection, keyboard and print events. Intercept its init
     * before those handlers are registered. The popup and its separate close-button
     * initializer remain Moodle-owned, and native question listeners see every event.
     */
    function installSecureWindowCompatibility(host = window) {
        const patched = new WeakSet();
        const patchSecureWindow = (secure) => {
            if (!secure || typeof secure !== 'object' || patched.has(secure) || typeof secure.init !== 'function')
                return;
            patched.add(secure);
            const original = secure.init;
            secure.init = function (...args) {
                var _a;
                if ((_a = host.document.body) === null || _a === void 0 ? void 0 : _a.classList.contains('quiz-secure-window'))
                    return;
                return original.apply(this, args);
            };
        };
        const hookedQuizzes = new WeakSet();
        const hookQuiz = (quiz) => {
            if (!quiz || typeof quiz !== 'object' || hookedQuizzes.has(quiz))
                return;
            hookedQuizzes.add(quiz);
            let secure = quiz.secure_window;
            patchSecureWindow(secure);
            Object.defineProperty(quiz, 'secure_window', {
                configurable: true, enumerable: true,
                get: () => secure,
                set: value => { secure = value; patchSecureWindow(value); }
            });
        };
        const hookedMoodles = new WeakSet();
        const hookMoodle = (moodle) => {
            if (!moodle || typeof moodle !== 'object' || hookedMoodles.has(moodle))
                return;
            hookedMoodles.add(moodle);
            let quiz = moodle.mod_quiz;
            hookQuiz(quiz);
            Object.defineProperty(moodle, 'mod_quiz', {
                configurable: true, enumerable: true,
                get: () => quiz,
                set: value => { quiz = value; hookQuiz(value); }
            });
        };
        const global = host;
        let moodle = global.M;
        hookMoodle(moodle);
        Object.defineProperty(global, 'M', {
            configurable: true, enumerable: true,
            get: () => moodle,
            set: value => { moodle = value; hookMoodle(value); }
        });
    }

    /** Moodle 4.5 native controls. Runs in MAIN; never reinitialises Moodle modules. */
    const DELAY = 25;
    const ACTION_TIMEOUT = 3000;
    const READY_TIMEOUT = 15000;
    const main = window;
    let operation;
    function checkOperation() {
        var _a;
        if ((_a = operation === null || operation === void 0 ? void 0 : operation.signal) === null || _a === void 0 ? void 0 : _a.aborted)
            throw new DOMException('Operation cancelled', 'AbortError');
        if (operation && Date.now() >= operation.deadline)
            fail('Moodle update exceeded its time budget');
    }
    function fail(message) { throw new Error(message); }
    function record(value) {
        if (!value || typeof value !== 'object' || Array.isArray(value))
            fail('Invalid bridge arguments');
        return value;
    }
    function string(value) {
        if (typeof value !== 'string' || !value || value.length > 512)
            fail('Invalid control identity');
        return value;
    }
    function nodes(root, selector) {
        return Array.from(root.querySelectorAll(selector));
    }
    function field(root, name) {
        const matches = nodes(root, 'input[name]').filter(el => el.name === string(name));
        if (matches.length !== 1 || matches[0].disabled || matches[0].readOnly)
            fail('Response field is unavailable');
        return matches[0];
    }
    function suffix(element, prefix) {
        const value = Array.from(element.classList).find(c => new RegExp(`^${prefix}[0-9]+$`).test(c));
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
    async function until(check, timeout = ACTION_TIMEOUT, quiesce = false) {
        const end = Date.now() + timeout;
        while (!check()) {
            if (!quiesce)
                checkOperation();
            if (Date.now() >= end)
                fail('Moodle control did not finish updating');
            await new Promise(resolve => setTimeout(resolve, DELAY));
        }
    }
    async function moduleValue(name) {
        await until(() => typeof main.require === 'function', READY_TIMEOUT);
        return new Promise((resolve, reject) => {
            var _a;
            const signal = operation === null || operation === void 0 ? void 0 : operation.signal;
            const remaining = Math.max(1, Math.min(READY_TIMEOUT, ((_a = operation === null || operation === void 0 ? void 0 : operation.deadline) !== null && _a !== void 0 ? _a : Date.now() + READY_TIMEOUT) - Date.now()));
            const cleanup = () => { clearTimeout(timer); signal === null || signal === void 0 ? void 0 : signal.removeEventListener('abort', abort); };
            const abort = () => { cleanup(); reject(new DOMException('Operation cancelled', 'AbortError')); };
            const timer = setTimeout(() => { cleanup(); reject(new Error('Moodle module did not load')); }, remaining);
            signal === null || signal === void 0 ? void 0 : signal.addEventListener('abort', abort, { once: true });
            if (signal === null || signal === void 0 ? void 0 : signal.aborted) {
                abort();
                return;
            }
            main.require([name], result => { cleanup(); resolve(result); }, error => {
                cleanup();
                reject(error);
            });
        });
    }
    function changed(input) {
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
    }
    async function dirty(root) {
        const checker = await moduleValue('core_form/changechecker');
        assertRoot(root);
        const form = root.closest('#responseform');
        if (form && typeof checker.markFormAsDirty === 'function')
            checker.markFormAsDirty(form);
    }
    function keyboard(target, code) {
        const key = code === 27 ? 'Escape' : 'ArrowRight';
        const event = new KeyboardEvent('keydown', { key, code: key, bubbles: true, cancelable: true });
        // Moodle's 4.5 handlers intentionally read legacy numeric key codes.
        Object.defineProperties(event, { keyCode: { value: code }, which: { value: code } });
        target.dispatchEvent(event);
    }
    async function ready(root) {
        assertRoot(root);
        await moduleValue('jquery');
        await until(() => {
            assertRoot(root);
            if (root.querySelector('.beingdragged'))
                return false;
            if (root.matches('.ddimageortext,.ddmarker')) {
                if (!nodes(root, '.ddarea img').every(image => image.complete && image.naturalWidth > 0))
                    return false;
                const bg = root.querySelector('.dropbackground');
                if (!bg || bg.getBoundingClientRect().width <= 0)
                    return false;
            }
            if (root.matches('.ddwtos,.ddimageortext,.ddmarker') && !root.querySelector('.dragplaceholder'))
                return false;
            if (root.matches('.ddimageortext') && !root.querySelector('.dropzones .dropzone'))
                return false;
            return true;
        }, READY_TIMEOUT);
        const geometry = () => nodes(root, '.drop,.dropzone,.dropbackground').map(node => {
            const rect = node.getBoundingClientRect();
            return [rect.left, rect.top, rect.width, rect.height].join(',');
        }).join(';');
        let previous = geometry();
        let stable = 0;
        await until(() => {
            assertRoot(root);
            const current = geometry();
            stable = current === previous ? stable + 1 : 0;
            previous = current;
            return stable >= 2;
        }, READY_TIMEOUT);
    }
    async function step(root, input, key) {
        assertRoot(root);
        const place = suffix(input, 'place');
        const selector = root.classList.contains('ddwtos') ? '.drop' : '.dropzone';
        const drop = nodes(root, selector).find(el => suffix(el, 'place') === place);
        if (!drop || !place)
            fail('Missing native drop control');
        const old = input.value;
        if (key === 27 && (!old || old === '0'))
            return; // Empty Escape can lock ddwtos's keyboard flag.
        const $ = await moduleValue('jquery');
        const eventName = root.classList.contains('ddwtos') ? 'qtype_ddwtos-dragmoved' : 'qtype_ddimageortext-dragmoved';
        let moved = false;
        const listener = (...args) => {
            const question = args[3];
            if ((question === null || question === void 0 ? void 0 : question.containerId) === root.id)
                moved = true;
        };
        $(document.body).on(eventName, listener);
        try {
            assertRoot(root);
            keyboard(drop, key);
            await until(() => {
                assertRoot(root);
                return moved && !root.querySelector('.beingdragged') && input.value !== old;
            });
            // The native event updates classes, clones, focus and the change checker.
            await new Promise(resolve => setTimeout(resolve, 0));
            changed(input);
        }
        finally {
            // Cancellation stops future commands, but let the already-started native animation settle.
            try {
                if (root.isConnected && root.querySelector('.beingdragged')) {
                    await until(() => !root.isConnected || !root.querySelector('.beingdragged'), ACTION_TIMEOUT, true);
                }
            }
            finally {
                $(document.body).off(eventName, listener);
            }
        }
    }
    async function clearPlaces(root) {
        if (!root.matches('.ddwtos,.ddimageortext'))
            fail('Not a slot drag question');
        await ready(root);
        for (const input of nodes(root, 'input.placeinput[name]'))
            await step(root, input, 27);
    }
    async function setPlace(root, args) {
        if (!root.matches('.ddwtos,.ddimageortext'))
            fail('Not a slot drag question');
        await ready(root);
        const input = field(root, args.fieldName);
        if (!input.classList.contains('placeinput'))
            fail('Not a place field');
        const choice = args.choice === null ? '0' : string(args.choice);
        if ((input.value || '0') === choice)
            return;
        const group = suffix(input, 'group');
        const choices = nodes(root, '.draghome:not(.dragplaceholder)').filter(el => suffix(el, 'group') === group);
        const count = new Set(choices.map(el => suffix(el, 'choice'))).size;
        if (choice !== '0' && !choices.some(el => suffix(el, 'choice') === choice))
            fail('Unknown drag choice');
        await step(root, input, 27);
        if (choice === '0')
            return;
        for (let attempt = 0; attempt <= count; attempt++) {
            await step(root, input, 39);
            if (input.value === choice)
                return;
        }
        fail('Drag choice is unavailable; check finite choice capacity');
    }
    async function order(root, args) {
        if (!root.classList.contains('ordering'))
            fail('Not an ordering question');
        const list = nodes(root, '.sortablelist').find(el => el.id === string(args.listId));
        if (!list || !Array.isArray(args.itemIds))
            fail('Missing ordering control');
        const items = Array.from(list.children).filter((el) => el instanceof HTMLElement && el.classList.contains('sortableitem'));
        const ids = args.itemIds.map(string);
        if (ids.length !== items.length || new Set(ids).size !== items.length || ids.some(id => !items.some(el => el.id === id)))
            fail('Invalid item permutation');
        const input = field(root, args.fieldName);
        for (let index = 0; index < ids.length; index++) {
            const item = items.find(el => el.id === ids[index]);
            let budget = items.length;
            while (Array.from(list.children).indexOf(item) > index) {
                assertRoot(root);
                if (--budget < 0)
                    fail('Ordering control did not move');
                const button = nodes(item, 'button[type="button"][data-action="move-backward"]')
                    .find(el => !el.disabled && el.getClientRects().length > 0);
                if (!button)
                    fail('Native ordering button is unavailable');
                const previous = Array.from(list.children).indexOf(item);
                button.click();
                if (Array.from(list.children).indexOf(item) !== previous - 1)
                    fail('Native ordering handler is not ready');
                await new Promise(resolve => setTimeout(resolve, 0));
            }
        }
        if (input.value !== ids.join(','))
            fail('Moodle did not serialize the requested order');
        changed(input);
        await dirty(root);
    }
    function mouse(target, type, pageX, pageY) {
        const event = new MouseEvent(type, {
            bubbles: true, cancelable: true, button: 0, buttons: type === 'mouseup' ? 0 : 1,
            clientX: pageX - window.scrollX, clientY: pageY - window.scrollY
        });
        // Moodle's drag manager reads page coordinates; preserve fractional pixels at responsive scales.
        Object.defineProperties(event, {
            which: { value: 1 }, pageX: { value: pageX }, pageY: { value: pageY }
        });
        target.dispatchEvent(event);
    }
    function readPoints(value) {
        if (!value)
            return [];
        return value.split(';').map(part => {
            const [x, y] = part.split(',').map(Number);
            if (!Number.isFinite(x) || !Number.isFinite(y))
                fail('Invalid native marker response');
            return { x, y };
        });
    }
    async function markers(root, args) {
        if (!root.classList.contains('ddmarker'))
            fail('Not a marker question');
        await ready(root);
        const $ = await moduleValue('jquery');
        const input = field(root, args.fieldName);
        if (!input.classList.contains('choices') || !Array.isArray(args.points) || args.points.length > 500)
            fail('Invalid marker response');
        const choice = suffix(input, 'choice');
        const bg = root.querySelector('.dropbackground');
        const points = args.points.map(value => {
            const point = record(value);
            const x = point.x, y = point.y;
            if (typeof x !== 'number' || typeof y !== 'number' || !Number.isFinite(x) || !Number.isFinite(y) ||
                x < 0 || y < 0 || x >= bg.naturalWidth || y >= bg.naturalHeight)
                fail('Marker point is outside the image');
            return { x, y };
        });
        const capacity = Number(suffix(input, 'noofdrags'));
        if (!input.classList.contains('infinite') && points.length > capacity)
            fail('Marker capacity exceeded');
        for (const marker of nodes(root, '.droparea .marker:not(.dragplaceholder)').filter(el => suffix(el, 'choice') === choice)) {
            assertRoot(root);
            keyboard(marker, 27);
        }
        if (input.value)
            fail('Moodle did not clear existing markers');
        for (const point of points) {
            assertRoot(root);
            const marker = nodes(root, '.draghomes .marker.unneeded:not(.dragplaceholder)').find(el => suffix(el, 'choice') === choice);
            if (!marker)
                fail('No remaining native marker instance');
            const start = marker.getBoundingClientRect();
            const pointerX = start.left + window.scrollX + Math.min(start.width / 2, 10);
            const pointerY = start.top + window.scrollY + Math.min(start.height / 2, 10);
            let finalX = pointerX, finalY = pointerY;
            let started = false;
            try {
                mouse(marker, 'mousedown', pointerX, pointerY);
                started = marker.classList.contains('beingdragged');
                if (!started)
                    fail('Native marker drag did not start');
                const actualStart = marker.getBoundingClientRect();
                const bounds = bg.getBoundingClientRect();
                // Match Moodle's bgRatio, including fractional CSS pixels at native browser zoom.
                const ratio = $(bg).width() / bg.naturalWidth;
                if (!(ratio > 0))
                    fail('Background image geometry is unavailable');
                const markerStyle = getComputedStyle(marker);
                // core/dragdrop.handleMove subtracts offset - parseInt(cssPosition), losing this fraction.
                const fraction = (value) => Number.isFinite(parseFloat(value)) ? parseFloat(value) - parseInt(value, 10) : 0;
                finalX = pointerX + bounds.left + 1 + point.x * ratio - actualStart.left + fraction(markerStyle.left);
                finalY = pointerY + bounds.top + 1 + point.y * ratio - actualStart.top + fraction(markerStyle.top);
                mouse(window, 'mousemove', finalX, finalY);
            }
            finally {
                if (started)
                    mouse(window, 'mouseup', finalX, finalY);
            }
            await new Promise(resolve => setTimeout(resolve, 0));
        }
        const actual = readPoints(input.value);
        const remaining = [...actual];
        for (const point of points) {
            const i = remaining.findIndex(p => Math.abs(p.x - point.x) <= 1 && Math.abs(p.y - point.y) <= 1);
            if (i < 0)
                fail('Moodle marker coordinates differ from the requested position');
            remaining.splice(i, 1);
        }
        if (remaining.length)
            fail('Unexpected marker instances remain');
        changed(input);
    }
    /** Exported for a bounded browser harness; callers still pass a real question root. */
    async function executeBridge(root, command, argument, signal) {
        operation = { signal, deadline: Date.now() + 12000 };
        try {
            assertRoot(root);
            const args = record(argument);
            if (command.startsWith('essay.'))
                return await handleEditorCommand(root, command, args, signal);
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
                default: return fail('Unknown bridge command');
            }
        }
        finally {
            operation = undefined;
        }
    }
    if (!main.__quizSolverV2Bridge) {
        main.__quizSolverV2Bridge = true;
        installSecureWindowCompatibility();
        let queue = Promise.resolve();
        const controllers = new Map();
        window.addEventListener('message', event => {
            var _a;
            if (event.source !== window || event.origin !== location.origin)
                return;
            const message = event.data;
            if (!message || message.source !== 'quiz-solver-v2')
                return;
            if (message.direction === 'cancel' && typeof message.id === 'string') {
                (_a = controllers.get(message.id)) === null || _a === void 0 ? void 0 : _a.abort();
                return;
            }
            if (message.direction !== 'request' ||
                typeof message.id !== 'string' || typeof message.root_id !== 'string' || typeof message.command !== 'string')
                return;
            const controller = new AbortController();
            controllers.set(message.id, controller);
            queue = queue.then(async () => {
                try {
                    const root = document.getElementById(message.root_id);
                    if (!root)
                        fail('Question no longer exists');
                    const result = await executeBridge(root, message.command, message.args, controller.signal);
                    window.postMessage({ source: 'quiz-solver-v2', direction: 'response', id: message.id, ok: true, result }, location.origin);
                }
                catch (error) {
                    window.postMessage({ source: 'quiz-solver-v2', direction: 'response', id: message.id, ok: false,
                        error: error instanceof Error ? error.message : 'Moodle control failed' }, location.origin);
                }
                finally {
                    controllers.delete(message.id);
                }
            });
        });
    }

    exports.executeBridge = executeBridge;

    return exports;

})({});
//# sourceMappingURL=MoodleBridge.js.map
