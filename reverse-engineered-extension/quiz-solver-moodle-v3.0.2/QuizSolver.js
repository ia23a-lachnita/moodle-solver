(function (factory) {
	typeof define === 'function' && define.amd ? define(factory) :
	factory();
})((function () { 'use strict';

	function getDefaultExportFromCjs (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	var browserPolyfill$1 = {exports: {}};

	var browserPolyfill = browserPolyfill$1.exports;

	var hasRequiredBrowserPolyfill;

	function requireBrowserPolyfill () {
		if (hasRequiredBrowserPolyfill) return browserPolyfill$1.exports;
		hasRequiredBrowserPolyfill = 1;
		(function (module, exports$1) {
			(function (global, factory) {
			  {
			    factory(module);
			  }
			})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : browserPolyfill, function (module) {

			  if (!(globalThis.chrome && globalThis.chrome.runtime && globalThis.chrome.runtime.id)) {
			    throw new Error("This script should only be loaded in a browser extension.");
			  }
			  if (!(globalThis.browser && globalThis.browser.runtime && globalThis.browser.runtime.id)) {
			    const CHROME_SEND_MESSAGE_CALLBACK_NO_RESPONSE_MESSAGE = "The message port closed before a response was received.";

			    // Wrapping the bulk of this polyfill in a one-time-use function is a minor
			    // optimization for Firefox. Since Spidermonkey does not fully parse the
			    // contents of a function until the first time it's called, and since it will
			    // never actually need to be called, this allows the polyfill to be included
			    // in Firefox nearly for free.
			    const wrapAPIs = extensionAPIs => {
			      // NOTE: apiMetadata is associated to the content of the api-metadata.json file
			      // at build time by replacing the following "include" with the content of the
			      // JSON file.
			      const apiMetadata = {
			        "alarms": {
			          "clear": {
			            "minArgs": 0,
			            "maxArgs": 1
			          },
			          "clearAll": {
			            "minArgs": 0,
			            "maxArgs": 0
			          },
			          "get": {
			            "minArgs": 0,
			            "maxArgs": 1
			          },
			          "getAll": {
			            "minArgs": 0,
			            "maxArgs": 0
			          }
			        },
			        "bookmarks": {
			          "create": {
			            "minArgs": 1,
			            "maxArgs": 1
			          },
			          "get": {
			            "minArgs": 1,
			            "maxArgs": 1
			          },
			          "getChildren": {
			            "minArgs": 1,
			            "maxArgs": 1
			          },
			          "getRecent": {
			            "minArgs": 1,
			            "maxArgs": 1
			          },
			          "getSubTree": {
			            "minArgs": 1,
			            "maxArgs": 1
			          },
			          "getTree": {
			            "minArgs": 0,
			            "maxArgs": 0
			          },
			          "move": {
			            "minArgs": 2,
			            "maxArgs": 2
			          },
			          "remove": {
			            "minArgs": 1,
			            "maxArgs": 1
			          },
			          "removeTree": {
			            "minArgs": 1,
			            "maxArgs": 1
			          },
			          "search": {
			            "minArgs": 1,
			            "maxArgs": 1
			          },
			          "update": {
			            "minArgs": 2,
			            "maxArgs": 2
			          }
			        },
			        "browserAction": {
			          "disable": {
			            "minArgs": 0,
			            "maxArgs": 1,
			            "fallbackToNoCallback": true
			          },
			          "enable": {
			            "minArgs": 0,
			            "maxArgs": 1,
			            "fallbackToNoCallback": true
			          },
			          "getBadgeBackgroundColor": {
			            "minArgs": 1,
			            "maxArgs": 1
			          },
			          "getBadgeText": {
			            "minArgs": 1,
			            "maxArgs": 1
			          },
			          "getPopup": {
			            "minArgs": 1,
			            "maxArgs": 1
			          },
			          "getTitle": {
			            "minArgs": 1,
			            "maxArgs": 1
			          },
			          "openPopup": {
			            "minArgs": 0,
			            "maxArgs": 0
			          },
			          "setBadgeBackgroundColor": {
			            "minArgs": 1,
			            "maxArgs": 1,
			            "fallbackToNoCallback": true
			          },
			          "setBadgeText": {
			            "minArgs": 1,
			            "maxArgs": 1,
			            "fallbackToNoCallback": true
			          },
			          "setIcon": {
			            "minArgs": 1,
			            "maxArgs": 1
			          },
			          "setPopup": {
			            "minArgs": 1,
			            "maxArgs": 1,
			            "fallbackToNoCallback": true
			          },
			          "setTitle": {
			            "minArgs": 1,
			            "maxArgs": 1,
			            "fallbackToNoCallback": true
			          }
			        },
			        "browsingData": {
			          "remove": {
			            "minArgs": 2,
			            "maxArgs": 2
			          },
			          "removeCache": {
			            "minArgs": 1,
			            "maxArgs": 1
			          },
			          "removeCookies": {
			            "minArgs": 1,
			            "maxArgs": 1
			          },
			          "removeDownloads": {
			            "minArgs": 1,
			            "maxArgs": 1
			          },
			          "removeFormData": {
			            "minArgs": 1,
			            "maxArgs": 1
			          },
			          "removeHistory": {
			            "minArgs": 1,
			            "maxArgs": 1
			          },
			          "removeLocalStorage": {
			            "minArgs": 1,
			            "maxArgs": 1
			          },
			          "removePasswords": {
			            "minArgs": 1,
			            "maxArgs": 1
			          },
			          "removePluginData": {
			            "minArgs": 1,
			            "maxArgs": 1
			          },
			          "settings": {
			            "minArgs": 0,
			            "maxArgs": 0
			          }
			        },
			        "commands": {
			          "getAll": {
			            "minArgs": 0,
			            "maxArgs": 0
			          }
			        },
			        "contextMenus": {
			          "remove": {
			            "minArgs": 1,
			            "maxArgs": 1
			          },
			          "removeAll": {
			            "minArgs": 0,
			            "maxArgs": 0
			          },
			          "update": {
			            "minArgs": 2,
			            "maxArgs": 2
			          }
			        },
			        "cookies": {
			          "get": {
			            "minArgs": 1,
			            "maxArgs": 1
			          },
			          "getAll": {
			            "minArgs": 1,
			            "maxArgs": 1
			          },
			          "getAllCookieStores": {
			            "minArgs": 0,
			            "maxArgs": 0
			          },
			          "remove": {
			            "minArgs": 1,
			            "maxArgs": 1
			          },
			          "set": {
			            "minArgs": 1,
			            "maxArgs": 1
			          }
			        },
			        "devtools": {
			          "inspectedWindow": {
			            "eval": {
			              "minArgs": 1,
			              "maxArgs": 2,
			              "singleCallbackArg": false
			            }
			          },
			          "panels": {
			            "create": {
			              "minArgs": 3,
			              "maxArgs": 3,
			              "singleCallbackArg": true
			            },
			            "elements": {
			              "createSidebarPane": {
			                "minArgs": 1,
			                "maxArgs": 1
			              }
			            }
			          }
			        },
			        "downloads": {
			          "cancel": {
			            "minArgs": 1,
			            "maxArgs": 1
			          },
			          "download": {
			            "minArgs": 1,
			            "maxArgs": 1
			          },
			          "erase": {
			            "minArgs": 1,
			            "maxArgs": 1
			          },
			          "getFileIcon": {
			            "minArgs": 1,
			            "maxArgs": 2
			          },
			          "open": {
			            "minArgs": 1,
			            "maxArgs": 1,
			            "fallbackToNoCallback": true
			          },
			          "pause": {
			            "minArgs": 1,
			            "maxArgs": 1
			          },
			          "removeFile": {
			            "minArgs": 1,
			            "maxArgs": 1
			          },
			          "resume": {
			            "minArgs": 1,
			            "maxArgs": 1
			          },
			          "search": {
			            "minArgs": 1,
			            "maxArgs": 1
			          },
			          "show": {
			            "minArgs": 1,
			            "maxArgs": 1,
			            "fallbackToNoCallback": true
			          }
			        },
			        "extension": {
			          "isAllowedFileSchemeAccess": {
			            "minArgs": 0,
			            "maxArgs": 0
			          },
			          "isAllowedIncognitoAccess": {
			            "minArgs": 0,
			            "maxArgs": 0
			          }
			        },
			        "history": {
			          "addUrl": {
			            "minArgs": 1,
			            "maxArgs": 1
			          },
			          "deleteAll": {
			            "minArgs": 0,
			            "maxArgs": 0
			          },
			          "deleteRange": {
			            "minArgs": 1,
			            "maxArgs": 1
			          },
			          "deleteUrl": {
			            "minArgs": 1,
			            "maxArgs": 1
			          },
			          "getVisits": {
			            "minArgs": 1,
			            "maxArgs": 1
			          },
			          "search": {
			            "minArgs": 1,
			            "maxArgs": 1
			          }
			        },
			        "i18n": {
			          "detectLanguage": {
			            "minArgs": 1,
			            "maxArgs": 1
			          },
			          "getAcceptLanguages": {
			            "minArgs": 0,
			            "maxArgs": 0
			          }
			        },
			        "identity": {
			          "launchWebAuthFlow": {
			            "minArgs": 1,
			            "maxArgs": 1
			          }
			        },
			        "idle": {
			          "queryState": {
			            "minArgs": 1,
			            "maxArgs": 1
			          }
			        },
			        "management": {
			          "get": {
			            "minArgs": 1,
			            "maxArgs": 1
			          },
			          "getAll": {
			            "minArgs": 0,
			            "maxArgs": 0
			          },
			          "getSelf": {
			            "minArgs": 0,
			            "maxArgs": 0
			          },
			          "setEnabled": {
			            "minArgs": 2,
			            "maxArgs": 2
			          },
			          "uninstallSelf": {
			            "minArgs": 0,
			            "maxArgs": 1
			          }
			        },
			        "notifications": {
			          "clear": {
			            "minArgs": 1,
			            "maxArgs": 1
			          },
			          "create": {
			            "minArgs": 1,
			            "maxArgs": 2
			          },
			          "getAll": {
			            "minArgs": 0,
			            "maxArgs": 0
			          },
			          "getPermissionLevel": {
			            "minArgs": 0,
			            "maxArgs": 0
			          },
			          "update": {
			            "minArgs": 2,
			            "maxArgs": 2
			          }
			        },
			        "pageAction": {
			          "getPopup": {
			            "minArgs": 1,
			            "maxArgs": 1
			          },
			          "getTitle": {
			            "minArgs": 1,
			            "maxArgs": 1
			          },
			          "hide": {
			            "minArgs": 1,
			            "maxArgs": 1,
			            "fallbackToNoCallback": true
			          },
			          "setIcon": {
			            "minArgs": 1,
			            "maxArgs": 1
			          },
			          "setPopup": {
			            "minArgs": 1,
			            "maxArgs": 1,
			            "fallbackToNoCallback": true
			          },
			          "setTitle": {
			            "minArgs": 1,
			            "maxArgs": 1,
			            "fallbackToNoCallback": true
			          },
			          "show": {
			            "minArgs": 1,
			            "maxArgs": 1,
			            "fallbackToNoCallback": true
			          }
			        },
			        "permissions": {
			          "contains": {
			            "minArgs": 1,
			            "maxArgs": 1
			          },
			          "getAll": {
			            "minArgs": 0,
			            "maxArgs": 0
			          },
			          "remove": {
			            "minArgs": 1,
			            "maxArgs": 1
			          },
			          "request": {
			            "minArgs": 1,
			            "maxArgs": 1
			          }
			        },
			        "runtime": {
			          "getBackgroundPage": {
			            "minArgs": 0,
			            "maxArgs": 0
			          },
			          "getPlatformInfo": {
			            "minArgs": 0,
			            "maxArgs": 0
			          },
			          "openOptionsPage": {
			            "minArgs": 0,
			            "maxArgs": 0
			          },
			          "requestUpdateCheck": {
			            "minArgs": 0,
			            "maxArgs": 0
			          },
			          "sendMessage": {
			            "minArgs": 1,
			            "maxArgs": 3
			          },
			          "sendNativeMessage": {
			            "minArgs": 2,
			            "maxArgs": 2
			          },
			          "setUninstallURL": {
			            "minArgs": 1,
			            "maxArgs": 1
			          }
			        },
			        "sessions": {
			          "getDevices": {
			            "minArgs": 0,
			            "maxArgs": 1
			          },
			          "getRecentlyClosed": {
			            "minArgs": 0,
			            "maxArgs": 1
			          },
			          "restore": {
			            "minArgs": 0,
			            "maxArgs": 1
			          }
			        },
			        "storage": {
			          "local": {
			            "clear": {
			              "minArgs": 0,
			              "maxArgs": 0
			            },
			            "get": {
			              "minArgs": 0,
			              "maxArgs": 1
			            },
			            "getBytesInUse": {
			              "minArgs": 0,
			              "maxArgs": 1
			            },
			            "remove": {
			              "minArgs": 1,
			              "maxArgs": 1
			            },
			            "set": {
			              "minArgs": 1,
			              "maxArgs": 1
			            }
			          },
			          "managed": {
			            "get": {
			              "minArgs": 0,
			              "maxArgs": 1
			            },
			            "getBytesInUse": {
			              "minArgs": 0,
			              "maxArgs": 1
			            }
			          },
			          "sync": {
			            "clear": {
			              "minArgs": 0,
			              "maxArgs": 0
			            },
			            "get": {
			              "minArgs": 0,
			              "maxArgs": 1
			            },
			            "getBytesInUse": {
			              "minArgs": 0,
			              "maxArgs": 1
			            },
			            "remove": {
			              "minArgs": 1,
			              "maxArgs": 1
			            },
			            "set": {
			              "minArgs": 1,
			              "maxArgs": 1
			            }
			          }
			        },
			        "tabs": {
			          "captureVisibleTab": {
			            "minArgs": 0,
			            "maxArgs": 2
			          },
			          "create": {
			            "minArgs": 1,
			            "maxArgs": 1
			          },
			          "detectLanguage": {
			            "minArgs": 0,
			            "maxArgs": 1
			          },
			          "discard": {
			            "minArgs": 0,
			            "maxArgs": 1
			          },
			          "duplicate": {
			            "minArgs": 1,
			            "maxArgs": 1
			          },
			          "executeScript": {
			            "minArgs": 1,
			            "maxArgs": 2
			          },
			          "get": {
			            "minArgs": 1,
			            "maxArgs": 1
			          },
			          "getCurrent": {
			            "minArgs": 0,
			            "maxArgs": 0
			          },
			          "getZoom": {
			            "minArgs": 0,
			            "maxArgs": 1
			          },
			          "getZoomSettings": {
			            "minArgs": 0,
			            "maxArgs": 1
			          },
			          "goBack": {
			            "minArgs": 0,
			            "maxArgs": 1
			          },
			          "goForward": {
			            "minArgs": 0,
			            "maxArgs": 1
			          },
			          "highlight": {
			            "minArgs": 1,
			            "maxArgs": 1
			          },
			          "insertCSS": {
			            "minArgs": 1,
			            "maxArgs": 2
			          },
			          "move": {
			            "minArgs": 2,
			            "maxArgs": 2
			          },
			          "query": {
			            "minArgs": 1,
			            "maxArgs": 1
			          },
			          "reload": {
			            "minArgs": 0,
			            "maxArgs": 2
			          },
			          "remove": {
			            "minArgs": 1,
			            "maxArgs": 1
			          },
			          "removeCSS": {
			            "minArgs": 1,
			            "maxArgs": 2
			          },
			          "sendMessage": {
			            "minArgs": 2,
			            "maxArgs": 3
			          },
			          "setZoom": {
			            "minArgs": 1,
			            "maxArgs": 2
			          },
			          "setZoomSettings": {
			            "minArgs": 1,
			            "maxArgs": 2
			          },
			          "update": {
			            "minArgs": 1,
			            "maxArgs": 2
			          }
			        },
			        "topSites": {
			          "get": {
			            "minArgs": 0,
			            "maxArgs": 0
			          }
			        },
			        "webNavigation": {
			          "getAllFrames": {
			            "minArgs": 1,
			            "maxArgs": 1
			          },
			          "getFrame": {
			            "minArgs": 1,
			            "maxArgs": 1
			          }
			        },
			        "webRequest": {
			          "handlerBehaviorChanged": {
			            "minArgs": 0,
			            "maxArgs": 0
			          }
			        },
			        "windows": {
			          "create": {
			            "minArgs": 0,
			            "maxArgs": 1
			          },
			          "get": {
			            "minArgs": 1,
			            "maxArgs": 2
			          },
			          "getAll": {
			            "minArgs": 0,
			            "maxArgs": 1
			          },
			          "getCurrent": {
			            "minArgs": 0,
			            "maxArgs": 1
			          },
			          "getLastFocused": {
			            "minArgs": 0,
			            "maxArgs": 1
			          },
			          "remove": {
			            "minArgs": 1,
			            "maxArgs": 1
			          },
			          "update": {
			            "minArgs": 2,
			            "maxArgs": 2
			          }
			        }
			      };
			      if (Object.keys(apiMetadata).length === 0) {
			        throw new Error("api-metadata.json has not been included in browser-polyfill");
			      }

			      /**
			       * A WeakMap subclass which creates and stores a value for any key which does
			       * not exist when accessed, but behaves exactly as an ordinary WeakMap
			       * otherwise.
			       *
			       * @param {function} createItem
			       *        A function which will be called in order to create the value for any
			       *        key which does not exist, the first time it is accessed. The
			       *        function receives, as its only argument, the key being created.
			       */
			      class DefaultWeakMap extends WeakMap {
			        constructor(createItem, items = undefined) {
			          super(items);
			          this.createItem = createItem;
			        }
			        get(key) {
			          if (!this.has(key)) {
			            this.set(key, this.createItem(key));
			          }
			          return super.get(key);
			        }
			      }

			      /**
			       * Returns true if the given object is an object with a `then` method, and can
			       * therefore be assumed to behave as a Promise.
			       *
			       * @param {*} value The value to test.
			       * @returns {boolean} True if the value is thenable.
			       */
			      const isThenable = value => {
			        return value && typeof value === "object" && typeof value.then === "function";
			      };

			      /**
			       * Creates and returns a function which, when called, will resolve or reject
			       * the given promise based on how it is called:
			       *
			       * - If, when called, `chrome.runtime.lastError` contains a non-null object,
			       *   the promise is rejected with that value.
			       * - If the function is called with exactly one argument, the promise is
			       *   resolved to that value.
			       * - Otherwise, the promise is resolved to an array containing all of the
			       *   function's arguments.
			       *
			       * @param {object} promise
			       *        An object containing the resolution and rejection functions of a
			       *        promise.
			       * @param {function} promise.resolve
			       *        The promise's resolution function.
			       * @param {function} promise.reject
			       *        The promise's rejection function.
			       * @param {object} metadata
			       *        Metadata about the wrapped method which has created the callback.
			       * @param {boolean} metadata.singleCallbackArg
			       *        Whether or not the promise is resolved with only the first
			       *        argument of the callback, alternatively an array of all the
			       *        callback arguments is resolved. By default, if the callback
			       *        function is invoked with only a single argument, that will be
			       *        resolved to the promise, while all arguments will be resolved as
			       *        an array if multiple are given.
			       *
			       * @returns {function}
			       *        The generated callback function.
			       */
			      const makeCallback = (promise, metadata) => {
			        return (...callbackArgs) => {
			          if (extensionAPIs.runtime.lastError) {
			            promise.reject(new Error(extensionAPIs.runtime.lastError.message));
			          } else if (metadata.singleCallbackArg || callbackArgs.length <= 1 && metadata.singleCallbackArg !== false) {
			            promise.resolve(callbackArgs[0]);
			          } else {
			            promise.resolve(callbackArgs);
			          }
			        };
			      };
			      const pluralizeArguments = numArgs => numArgs == 1 ? "argument" : "arguments";

			      /**
			       * Creates a wrapper function for a method with the given name and metadata.
			       *
			       * @param {string} name
			       *        The name of the method which is being wrapped.
			       * @param {object} metadata
			       *        Metadata about the method being wrapped.
			       * @param {integer} metadata.minArgs
			       *        The minimum number of arguments which must be passed to the
			       *        function. If called with fewer than this number of arguments, the
			       *        wrapper will raise an exception.
			       * @param {integer} metadata.maxArgs
			       *        The maximum number of arguments which may be passed to the
			       *        function. If called with more than this number of arguments, the
			       *        wrapper will raise an exception.
			       * @param {boolean} metadata.singleCallbackArg
			       *        Whether or not the promise is resolved with only the first
			       *        argument of the callback, alternatively an array of all the
			       *        callback arguments is resolved. By default, if the callback
			       *        function is invoked with only a single argument, that will be
			       *        resolved to the promise, while all arguments will be resolved as
			       *        an array if multiple are given.
			       *
			       * @returns {function(object, ...*)}
			       *       The generated wrapper function.
			       */
			      const wrapAsyncFunction = (name, metadata) => {
			        return function asyncFunctionWrapper(target, ...args) {
			          if (args.length < metadata.minArgs) {
			            throw new Error(`Expected at least ${metadata.minArgs} ${pluralizeArguments(metadata.minArgs)} for ${name}(), got ${args.length}`);
			          }
			          if (args.length > metadata.maxArgs) {
			            throw new Error(`Expected at most ${metadata.maxArgs} ${pluralizeArguments(metadata.maxArgs)} for ${name}(), got ${args.length}`);
			          }
			          return new Promise((resolve, reject) => {
			            if (metadata.fallbackToNoCallback) {
			              // This API method has currently no callback on Chrome, but it return a promise on Firefox,
			              // and so the polyfill will try to call it with a callback first, and it will fallback
			              // to not passing the callback if the first call fails.
			              try {
			                target[name](...args, makeCallback({
			                  resolve,
			                  reject
			                }, metadata));
			              } catch (cbError) {
			                console.warn(`${name} API method doesn't seem to support the callback parameter, ` + "falling back to call it without a callback: ", cbError);
			                target[name](...args);

			                // Update the API method metadata, so that the next API calls will not try to
			                // use the unsupported callback anymore.
			                metadata.fallbackToNoCallback = false;
			                metadata.noCallback = true;
			                resolve();
			              }
			            } else if (metadata.noCallback) {
			              target[name](...args);
			              resolve();
			            } else {
			              target[name](...args, makeCallback({
			                resolve,
			                reject
			              }, metadata));
			            }
			          });
			        };
			      };

			      /**
			       * Wraps an existing method of the target object, so that calls to it are
			       * intercepted by the given wrapper function. The wrapper function receives,
			       * as its first argument, the original `target` object, followed by each of
			       * the arguments passed to the original method.
			       *
			       * @param {object} target
			       *        The original target object that the wrapped method belongs to.
			       * @param {function} method
			       *        The method being wrapped. This is used as the target of the Proxy
			       *        object which is created to wrap the method.
			       * @param {function} wrapper
			       *        The wrapper function which is called in place of a direct invocation
			       *        of the wrapped method.
			       *
			       * @returns {Proxy<function>}
			       *        A Proxy object for the given method, which invokes the given wrapper
			       *        method in its place.
			       */
			      const wrapMethod = (target, method, wrapper) => {
			        return new Proxy(method, {
			          apply(targetMethod, thisObj, args) {
			            return wrapper.call(thisObj, target, ...args);
			          }
			        });
			      };
			      let hasOwnProperty = Function.call.bind(Object.prototype.hasOwnProperty);

			      /**
			       * Wraps an object in a Proxy which intercepts and wraps certain methods
			       * based on the given `wrappers` and `metadata` objects.
			       *
			       * @param {object} target
			       *        The target object to wrap.
			       *
			       * @param {object} [wrappers = {}]
			       *        An object tree containing wrapper functions for special cases. Any
			       *        function present in this object tree is called in place of the
			       *        method in the same location in the `target` object tree. These
			       *        wrapper methods are invoked as described in {@see wrapMethod}.
			       *
			       * @param {object} [metadata = {}]
			       *        An object tree containing metadata used to automatically generate
			       *        Promise-based wrapper functions for asynchronous. Any function in
			       *        the `target` object tree which has a corresponding metadata object
			       *        in the same location in the `metadata` tree is replaced with an
			       *        automatically-generated wrapper function, as described in
			       *        {@see wrapAsyncFunction}
			       *
			       * @returns {Proxy<object>}
			       */
			      const wrapObject = (target, wrappers = {}, metadata = {}) => {
			        let cache = Object.create(null);
			        let handlers = {
			          has(proxyTarget, prop) {
			            return prop in target || prop in cache;
			          },
			          get(proxyTarget, prop, receiver) {
			            if (prop in cache) {
			              return cache[prop];
			            }
			            if (!(prop in target)) {
			              return undefined;
			            }
			            let value = target[prop];
			            if (typeof value === "function") {
			              // This is a method on the underlying object. Check if we need to do
			              // any wrapping.

			              if (typeof wrappers[prop] === "function") {
			                // We have a special-case wrapper for this method.
			                value = wrapMethod(target, target[prop], wrappers[prop]);
			              } else if (hasOwnProperty(metadata, prop)) {
			                // This is an async method that we have metadata for. Create a
			                // Promise wrapper for it.
			                let wrapper = wrapAsyncFunction(prop, metadata[prop]);
			                value = wrapMethod(target, target[prop], wrapper);
			              } else {
			                // This is a method that we don't know or care about. Return the
			                // original method, bound to the underlying object.
			                value = value.bind(target);
			              }
			            } else if (typeof value === "object" && value !== null && (hasOwnProperty(wrappers, prop) || hasOwnProperty(metadata, prop))) {
			              // This is an object that we need to do some wrapping for the children
			              // of. Create a sub-object wrapper for it with the appropriate child
			              // metadata.
			              value = wrapObject(value, wrappers[prop], metadata[prop]);
			            } else if (hasOwnProperty(metadata, "*")) {
			              // Wrap all properties in * namespace.
			              value = wrapObject(value, wrappers[prop], metadata["*"]);
			            } else {
			              // We don't need to do any wrapping for this property,
			              // so just forward all access to the underlying object.
			              Object.defineProperty(cache, prop, {
			                configurable: true,
			                enumerable: true,
			                get() {
			                  return target[prop];
			                },
			                set(value) {
			                  target[prop] = value;
			                }
			              });
			              return value;
			            }
			            cache[prop] = value;
			            return value;
			          },
			          set(proxyTarget, prop, value, receiver) {
			            if (prop in cache) {
			              cache[prop] = value;
			            } else {
			              target[prop] = value;
			            }
			            return true;
			          },
			          defineProperty(proxyTarget, prop, desc) {
			            return Reflect.defineProperty(cache, prop, desc);
			          },
			          deleteProperty(proxyTarget, prop) {
			            return Reflect.deleteProperty(cache, prop);
			          }
			        };

			        // Per contract of the Proxy API, the "get" proxy handler must return the
			        // original value of the target if that value is declared read-only and
			        // non-configurable. For this reason, we create an object with the
			        // prototype set to `target` instead of using `target` directly.
			        // Otherwise we cannot return a custom object for APIs that
			        // are declared read-only and non-configurable, such as `chrome.devtools`.
			        //
			        // The proxy handlers themselves will still use the original `target`
			        // instead of the `proxyTarget`, so that the methods and properties are
			        // dereferenced via the original targets.
			        let proxyTarget = Object.create(target);
			        return new Proxy(proxyTarget, handlers);
			      };

			      /**
			       * Creates a set of wrapper functions for an event object, which handles
			       * wrapping of listener functions that those messages are passed.
			       *
			       * A single wrapper is created for each listener function, and stored in a
			       * map. Subsequent calls to `addListener`, `hasListener`, or `removeListener`
			       * retrieve the original wrapper, so that  attempts to remove a
			       * previously-added listener work as expected.
			       *
			       * @param {DefaultWeakMap<function, function>} wrapperMap
			       *        A DefaultWeakMap object which will create the appropriate wrapper
			       *        for a given listener function when one does not exist, and retrieve
			       *        an existing one when it does.
			       *
			       * @returns {object}
			       */
			      const wrapEvent = wrapperMap => ({
			        addListener(target, listener, ...args) {
			          target.addListener(wrapperMap.get(listener), ...args);
			        },
			        hasListener(target, listener) {
			          return target.hasListener(wrapperMap.get(listener));
			        },
			        removeListener(target, listener) {
			          target.removeListener(wrapperMap.get(listener));
			        }
			      });
			      const onRequestFinishedWrappers = new DefaultWeakMap(listener => {
			        if (typeof listener !== "function") {
			          return listener;
			        }

			        /**
			         * Wraps an onRequestFinished listener function so that it will return a
			         * `getContent()` property which returns a `Promise` rather than using a
			         * callback API.
			         *
			         * @param {object} req
			         *        The HAR entry object representing the network request.
			         */
			        return function onRequestFinished(req) {
			          const wrappedReq = wrapObject(req, {} /* wrappers */, {
			            getContent: {
			              minArgs: 0,
			              maxArgs: 0
			            }
			          });
			          listener(wrappedReq);
			        };
			      });
			      const onMessageWrappers = new DefaultWeakMap(listener => {
			        if (typeof listener !== "function") {
			          return listener;
			        }

			        /**
			         * Wraps a message listener function so that it may send responses based on
			         * its return value, rather than by returning a sentinel value and calling a
			         * callback. If the listener function returns a Promise, the response is
			         * sent when the promise either resolves or rejects.
			         *
			         * @param {*} message
			         *        The message sent by the other end of the channel.
			         * @param {object} sender
			         *        Details about the sender of the message.
			         * @param {function(*)} sendResponse
			         *        A callback which, when called with an arbitrary argument, sends
			         *        that value as a response.
			         * @returns {boolean}
			         *        True if the wrapped listener returned a Promise, which will later
			         *        yield a response. False otherwise.
			         */
			        return function onMessage(message, sender, sendResponse) {
			          let didCallSendResponse = false;
			          let wrappedSendResponse;
			          let sendResponsePromise = new Promise(resolve => {
			            wrappedSendResponse = function (response) {
			              didCallSendResponse = true;
			              resolve(response);
			            };
			          });
			          let result;
			          try {
			            result = listener(message, sender, wrappedSendResponse);
			          } catch (err) {
			            result = Promise.reject(err);
			          }
			          const isResultThenable = result !== true && isThenable(result);

			          // If the listener didn't returned true or a Promise, or called
			          // wrappedSendResponse synchronously, we can exit earlier
			          // because there will be no response sent from this listener.
			          if (result !== true && !isResultThenable && !didCallSendResponse) {
			            return false;
			          }

			          // A small helper to send the message if the promise resolves
			          // and an error if the promise rejects (a wrapped sendMessage has
			          // to translate the message into a resolved promise or a rejected
			          // promise).
			          const sendPromisedResult = promise => {
			            promise.then(msg => {
			              // send the message value.
			              sendResponse(msg);
			            }, error => {
			              // Send a JSON representation of the error if the rejected value
			              // is an instance of error, or the object itself otherwise.
			              let message;
			              if (error && (error instanceof Error || typeof error.message === "string")) {
			                message = error.message;
			              } else {
			                message = "An unexpected error occurred";
			              }
			              sendResponse({
			                __mozWebExtensionPolyfillReject__: true,
			                message
			              });
			            }).catch(err => {
			              // Print an error on the console if unable to send the response.
			              console.error("Failed to send onMessage rejected reply", err);
			            });
			          };

			          // If the listener returned a Promise, send the resolved value as a
			          // result, otherwise wait the promise related to the wrappedSendResponse
			          // callback to resolve and send it as a response.
			          if (isResultThenable) {
			            sendPromisedResult(result);
			          } else {
			            sendPromisedResult(sendResponsePromise);
			          }

			          // Let Chrome know that the listener is replying.
			          return true;
			        };
			      });
			      const wrappedSendMessageCallback = ({
			        reject,
			        resolve
			      }, reply) => {
			        if (extensionAPIs.runtime.lastError) {
			          // Detect when none of the listeners replied to the sendMessage call and resolve
			          // the promise to undefined as in Firefox.
			          // See https://github.com/mozilla/webextension-polyfill/issues/130
			          if (extensionAPIs.runtime.lastError.message === CHROME_SEND_MESSAGE_CALLBACK_NO_RESPONSE_MESSAGE) {
			            resolve();
			          } else {
			            reject(new Error(extensionAPIs.runtime.lastError.message));
			          }
			        } else if (reply && reply.__mozWebExtensionPolyfillReject__) {
			          // Convert back the JSON representation of the error into
			          // an Error instance.
			          reject(new Error(reply.message));
			        } else {
			          resolve(reply);
			        }
			      };
			      const wrappedSendMessage = (name, metadata, apiNamespaceObj, ...args) => {
			        if (args.length < metadata.minArgs) {
			          throw new Error(`Expected at least ${metadata.minArgs} ${pluralizeArguments(metadata.minArgs)} for ${name}(), got ${args.length}`);
			        }
			        if (args.length > metadata.maxArgs) {
			          throw new Error(`Expected at most ${metadata.maxArgs} ${pluralizeArguments(metadata.maxArgs)} for ${name}(), got ${args.length}`);
			        }
			        return new Promise((resolve, reject) => {
			          const wrappedCb = wrappedSendMessageCallback.bind(null, {
			            resolve,
			            reject
			          });
			          args.push(wrappedCb);
			          apiNamespaceObj.sendMessage(...args);
			        });
			      };
			      const staticWrappers = {
			        devtools: {
			          network: {
			            onRequestFinished: wrapEvent(onRequestFinishedWrappers)
			          }
			        },
			        runtime: {
			          onMessage: wrapEvent(onMessageWrappers),
			          onMessageExternal: wrapEvent(onMessageWrappers),
			          sendMessage: wrappedSendMessage.bind(null, "sendMessage", {
			            minArgs: 1,
			            maxArgs: 3
			          })
			        },
			        tabs: {
			          sendMessage: wrappedSendMessage.bind(null, "sendMessage", {
			            minArgs: 2,
			            maxArgs: 3
			          })
			        }
			      };
			      const settingMetadata = {
			        clear: {
			          minArgs: 1,
			          maxArgs: 1
			        },
			        get: {
			          minArgs: 1,
			          maxArgs: 1
			        },
			        set: {
			          minArgs: 1,
			          maxArgs: 1
			        }
			      };
			      apiMetadata.privacy = {
			        network: {
			          "*": settingMetadata
			        },
			        services: {
			          "*": settingMetadata
			        },
			        websites: {
			          "*": settingMetadata
			        }
			      };
			      return wrapObject(extensionAPIs, staticWrappers, apiMetadata);
			    };

			    // The build process adds a UMD wrapper around this file, which makes the
			    // `module` variable available.
			    module.exports = wrapAPIs(chrome);
			  } else {
			    module.exports = globalThis.browser;
			  }
			});
			
		} (browserPolyfill$1));
		return browserPolyfill$1.exports;
	}

	requireBrowserPolyfill();

	/**
	 * Retrieves the stored Quiz Solver for Moodle configuration from browser storage.
	 */
	async function getStoredConfig() {
	    const storageData = (await browser.storage.local.get(['quizSolver']));
	    return storageData.quizSolver;
	}
	/**
	 * Decrements the credits by 1 in local storage.
	 * This provides immediate optimistic UI feedback while the server request is in flight.
	 * @returns The new credits value after decrementing, or undefined if credits weren't set.
	 */
	async function decrementCredits() {
	    const currentConfig = await getStoredConfig();
	    if (!currentConfig || typeof currentConfig.credits !== 'number') {
	        return undefined;
	    }
	    const newCredits = Math.max(0, currentConfig.credits - 1);
	    await browser.storage.local.set({
	        quizSolver: Object.assign(Object.assign({}, currentConfig), { credits: newCredits })
	    });
	    return newCredits;
	}

	const BACKEND_URL = "https://quizsolverformoodle.com";

	let container = null;
	let promptOutput = null;
	let promptInput = null;
	let toggleButton = null;
	let isVisible = false;
	let abortController = null;
	let loadingInterval = null;
	let buttonState = 'hidden';
	let submitBtn = null;
	let isLoading = false;
	function initializeCustomPrompt(config) {
	    if (container && container.parentNode)
	        return;
	    if (document.readyState === 'loading') {
	        document.addEventListener('DOMContentLoaded', () => {
	            createUI(config);
	        });
	    }
	    else {
	        createUI(config);
	    }
	}
	function createUI(config) {
	    if (document.getElementById('quiz-solver-for-moodle-toggle-button')) {
	        return;
	    }
	    const submitButtonsDiv = document.querySelector('.submitbtns');
	    const questions = document.querySelectorAll('.que');
	    const lastQuestion = questions[questions.length - 1];
	    let buttonInjectionPoint = null;
	    if (submitButtonsDiv) {
	        buttonInjectionPoint = submitButtonsDiv;
	    }
	    let containerInjectionPoint = null;
	    if (submitButtonsDiv) {
	        containerInjectionPoint = submitButtonsDiv;
	    }
	    else if (lastQuestion) {
	        containerInjectionPoint = lastQuestion;
	    }
	    else {
	        containerInjectionPoint = document.querySelector('[role="main"]') || document.body;
	    }
	    if (!containerInjectionPoint) {
	        console.error('[Quiz Solver for Moodle] No container injection point found!');
	        return;
	    }
	    toggleButton = document.createElement('button');
	    toggleButton.id = 'quiz-solver-for-moodle-toggle-button';
	    toggleButton.type = 'button';
	    toggleButton.className = 'btn btn-secondary';
	    toggleButton.style.marginRight = '10px';
	    toggleButton.style.display = 'none';
	    const icon = document.createElement('i');
	    icon.className = 'fa-regular fa-comment';
	    toggleButton.appendChild(icon);
	    document.addEventListener('keydown', e => {
	        if (e.altKey && toggleButton && buttonState === 'hidden') {
	            toggleButton.style.display = '';
	        }
	        if (e.key === 'Escape' && isVisible) {
	            toggleVisibility();
	            buttonState = 'hidden';
	            if (toggleButton) {
	                toggleButton.style.display = 'none';
	            }
	        }
	    });
	    document.addEventListener('keyup', e => {
	        if (!e.altKey && toggleButton && buttonState === 'hidden') {
	            toggleButton.style.display = 'none';
	        }
	    });
	    toggleButton.addEventListener('click', () => {
	        if (buttonState === 'hidden') {
	            if (!isVisible) {
	                toggleVisibility();
	            }
	            buttonState = 'edit';
	        }
	        else {
	            if (isVisible) {
	                toggleVisibility();
	            }
	            buttonState = 'hidden';
	            if (toggleButton) {
	                toggleButton.style.display = 'none';
	            }
	        }
	    });
	    container = document.createElement('div');
	    container.id = 'quiz-solver-for-moodle-custom-prompt';
	    container.style.display = 'none';
	    container.style.marginTop = '10px';
	    container.style.marginBottom = '20px';
	    container.style.padding = '15px';
	    container.className = 'card';
	    const inputGroup = document.createElement('div');
	    inputGroup.className = 'd-flex align-items-center mb-3';
	    inputGroup.style.gap = '10px';
	    promptInput = document.createElement('input');
	    promptInput.type = 'text';
	    promptInput.className = 'form-control';
	    promptInput.placeholder = 'Ask anything...';
	    promptInput.style.flex = '1';
	    promptInput.addEventListener('keydown', e => {
	        if (e.key === 'Enter') {
	            e.preventDefault();
	            if (isLoading) {
	                cancelPrompt();
	            }
	            else {
	                submitPrompt(config);
	            }
	        }
	    });
	    submitBtn = document.createElement('button');
	    submitBtn.type = 'button';
	    submitBtn.className = 'btn btn-primary';
	    submitBtn.textContent = 'Enter';
	    submitBtn.addEventListener('click', () => {
	        if (isLoading) {
	            cancelPrompt();
	        }
	        else {
	            submitPrompt(config);
	        }
	    });
	    inputGroup.appendChild(promptInput);
	    inputGroup.appendChild(submitBtn);
	    const outputContainer = document.createElement('div');
	    outputContainer.style.position = 'relative';
	    outputContainer.style.marginTop = '15px';
	    promptOutput = document.createElement('textarea');
	    promptOutput.className = 'form-control';
	    promptOutput.style.width = '100%';
	    promptOutput.style.minHeight = '150px';
	    promptOutput.style.whiteSpace = 'pre-wrap';
	    promptOutput.readOnly = false;
	    promptOutput.style.backgroundColor = '#f8f9fa';
	    promptOutput.style.borderColor = '#dee2e6';
	    outputContainer.appendChild(promptOutput);
	    container.appendChild(inputGroup);
	    container.appendChild(outputContainer);
	    if (buttonInjectionPoint) {
	        if (buttonInjectionPoint.firstChild) {
	            buttonInjectionPoint.insertBefore(toggleButton, buttonInjectionPoint.firstChild);
	        }
	        else {
	            buttonInjectionPoint.appendChild(toggleButton);
	        }
	    }
	    if (!containerInjectionPoint.parentNode) {
	        return;
	    }
	    if (containerInjectionPoint.nextSibling) {
	        containerInjectionPoint.parentNode.insertBefore(container, containerInjectionPoint.nextSibling);
	    }
	    else {
	        containerInjectionPoint.parentNode.appendChild(container);
	    }
	}
	function toggleVisibility() {
	    if (!container)
	        return;
	    isVisible = !isVisible;
	    container.style.display = isVisible ? 'block' : 'none';
	    if (isVisible && promptInput) {
	        promptInput.focus();
	    }
	}
	function startLoadingAnimation() {
	    if (!promptOutput)
	        return;
	    isLoading = true;
	    let dotCount = 0;
	    const dots = ['.', '..', '...'];
	    promptOutput.value = dots[0];
	    if (loadingInterval !== null) {
	        clearInterval(loadingInterval);
	    }
	    loadingInterval = window.setInterval(() => {
	        dotCount = (dotCount + 1) % dots.length;
	        if (promptOutput) {
	            promptOutput.value = dots[dotCount];
	        }
	    }, 500);
	    if (submitBtn) {
	        submitBtn.className = 'btn btn-danger';
	        submitBtn.textContent = 'Abort';
	    }
	}
	function stopLoadingAnimation() {
	    if (loadingInterval !== null) {
	        clearInterval(loadingInterval);
	        loadingInterval = null;
	    }
	    isLoading = false;
	    if (submitBtn) {
	        submitBtn.className = 'btn btn-primary';
	        submitBtn.textContent = 'Enter';
	    }
	}
	function cancelPrompt() {
	    if (abortController) {
	        abortController.abort();
	    }
	    stopLoadingAnimation();
	    if (promptOutput) {
	        promptOutput.value = 'Cancelled.';
	    }
	}
	async function submitPrompt(config) {
	    var _a;
	    if (!promptInput || !promptOutput || !promptInput.value.trim())
	        return;
	    const prompt = promptInput.value.trim();
	    clearErrorStyling();
	    startLoadingAnimation();
	    if (abortController) {
	        abortController.abort();
	    }
	    abortController = new AbortController();
	    try {
	        const freshConfig = await getStoredConfig();
	        const configToUse = freshConfig || config;
	        const reasoning = configToUse.reasoning || 'low';
	        if (!['low', 'medium', 'high'].includes(reasoning)) {
	            throw new Error('Custom prompts support Low, Medium or High reasoning. Choose a model and one of those levels in the extension settings.');
	        }
	        await decrementCredits();
	        const requestBody = {
	            model: configToUse.model,
	            prompt: prompt,
	            context: configToUse.context || '',
	            reasoning
	        };
	        const response = await fetch(`${BACKEND_URL}/api/v1/chat`, {
	            method: 'POST',
	            headers: {
	                'Content-Type': 'application/json',
	                Authorization: `Token ${configToUse.apiKey}`
	            },
	            body: JSON.stringify(requestBody),
	            signal: abortController.signal
	        });
	        stopLoadingAnimation();
	        if (!response.ok) {
	            let errorMessage = 'Error getting response';
	            try {
	                const errorData = await response.json();
	                if ((_a = errorData === null || errorData === void 0 ? void 0 : errorData.error) === null || _a === void 0 ? void 0 : _a.message) {
	                    errorMessage = errorData.error.message;
	                }
	            }
	            catch (_b) {
	                // Ignore JSON parse error
	            }
	            if (response.status === 401) {
	                throw new Error('Invalid API key. Please generate a new one in your dashboard.');
	            }
	            else if (response.status === 402) {
	                throw new Error('No credits remaining.');
	            }
	            else if (response.status === 429) {
	                throw new Error('Too many requests. Please wait.');
	            }
	            else if (response.status >= 500) {
	                throw new Error('Server error. Please try again later.');
	            }
	            throw new Error(errorMessage);
	        }
	        const data = await response.json();
	        promptOutput.value = data.response;
	        promptOutput.scrollTop = promptOutput.scrollHeight;
	        if (typeof data.credits_remaining === 'number') {
	            const currentConfig = (await browser.storage.local.get('quizSolver')).quizSolver || {};
	            await browser.storage.local.set({
	                quizSolver: Object.assign(Object.assign({}, currentConfig), { credits: data.credits_remaining })
	            });
	        }
	    }
	    catch (error) {
	        stopLoadingAnimation();
	        if (error instanceof Error && error.name === 'AbortError') {
	            promptOutput.value = 'Request aborted.';
	            clearErrorStyling();
	            return;
	        }
	        applyErrorStyling();
	        let errorMessage;
	        if (error instanceof TypeError && error.message === 'Failed to fetch') {
	            errorMessage = 'Unable to connect. Please check your internet connection and try again.';
	        }
	        else if (error instanceof Error) {
	            errorMessage = error.message;
	        }
	        else {
	            errorMessage = 'An unexpected error occurred. Please try again.';
	        }
	        promptOutput.value = `Error: ${errorMessage}`;
	    }
	    finally {
	        stopLoadingAnimation();
	        abortController = null;
	    }
	}
	function applyErrorStyling() {
	    if (!promptOutput)
	        return;
	    promptOutput.style.backgroundColor = '#f8d7da';
	    promptOutput.style.borderColor = '#f5c2c7';
	    promptOutput.style.color = '#842029';
	}
	function clearErrorStyling() {
	    if (!promptOutput)
	        return;
	    promptOutput.style.backgroundColor = '#f8f9fa';
	    promptOutput.style.borderColor = '#dee2e6';
	    promptOutput.style.color = '';
	}

	class AdapterError extends Error {
	    constructor(code, message) {
	        super(message);
	        this.code = code;
	        this.name = 'AdapterError';
	    }
	}
	function throwIfAborted(signal) {
	    if (signal === null || signal === void 0 ? void 0 : signal.aborted)
	        throw new DOMException('Operation cancelled.', 'AbortError');
	}

	var ucs2length = {};

	var hasRequiredUcs2length;

	function requireUcs2length () {
		if (hasRequiredUcs2length) return ucs2length;
		hasRequiredUcs2length = 1;
		Object.defineProperty(ucs2length, "__esModule", { value: true });
		// https://mathiasbynens.be/notes/javascript-encoding
		// https://github.com/bestiejs/punycode.js - punycode.ucs2.decode
		function ucs2length$1(str) {
		    const len = str.length;
		    let length = 0;
		    let pos = 0;
		    let value;
		    while (pos < len) {
		        length++;
		        value = str.charCodeAt(pos++);
		        if (value >= 0xd800 && value <= 0xdbff && pos < len) {
		            // high surrogate, and there is a next character
		            value = str.charCodeAt(pos);
		            if ((value & 0xfc00) === 0xdc00)
		                pos++; // low surrogate
		        }
		    }
		    return length;
		}
		ucs2length.default = ucs2length$1;
		ucs2length$1.code = 'require("ajv/dist/runtime/ucs2length").default';
		
		return ucs2length;
	}

	var ucs2lengthExports = /*@__PURE__*/ requireUcs2length();
	var runtimeHelper0Module = /*@__PURE__*/getDefaultExportFromCjs(ucs2lengthExports);

	var equal = {};

	var fastDeepEqual;
	var hasRequiredFastDeepEqual;

	function requireFastDeepEqual () {
		if (hasRequiredFastDeepEqual) return fastDeepEqual;
		hasRequiredFastDeepEqual = 1;

		// do not edit .js files directly - edit src/index.jst



		fastDeepEqual = function equal(a, b) {
		  if (a === b) return true;

		  if (a && b && typeof a == 'object' && typeof b == 'object') {
		    if (a.constructor !== b.constructor) return false;

		    var length, i, keys;
		    if (Array.isArray(a)) {
		      length = a.length;
		      if (length != b.length) return false;
		      for (i = length; i-- !== 0;)
		        if (!equal(a[i], b[i])) return false;
		      return true;
		    }



		    if (a.constructor === RegExp) return a.source === b.source && a.flags === b.flags;
		    if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf();
		    if (a.toString !== Object.prototype.toString) return a.toString() === b.toString();

		    keys = Object.keys(a);
		    length = keys.length;
		    if (length !== Object.keys(b).length) return false;

		    for (i = length; i-- !== 0;)
		      if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;

		    for (i = length; i-- !== 0;) {
		      var key = keys[i];

		      if (!equal(a[key], b[key])) return false;
		    }

		    return true;
		  }

		  // true if both NaN, false otherwise
		  return a!==a && b!==b;
		};
		return fastDeepEqual;
	}

	var hasRequiredEqual;

	function requireEqual () {
		if (hasRequiredEqual) return equal;
		hasRequiredEqual = 1;
		Object.defineProperty(equal, "__esModule", { value: true });
		// https://github.com/ajv-validator/ajv/issues/889
		const equal$1 = requireFastDeepEqual();
		equal$1.code = 'require("ajv/dist/runtime/equal").default';
		equal.default = equal$1;
		
		return equal;
	}

	var equalExports = /*@__PURE__*/ requireEqual();
	var runtimeHelper1Module = /*@__PURE__*/getDefaultExportFromCjs(equalExports);

	/* Generated. Do not edit. */
	const runtimeHelper0 = runtimeHelper0Module.default || runtimeHelper0Module;
	const runtimeHelper1 = runtimeHelper1Module.default || runtimeHelper1Module;
	const validateAnswerRequest = validate21;const formats0 = /^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i;const pattern4 = new RegExp("^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$", "u");const pattern5 = new RegExp("^[a-z][a-zA-Z0-9_-]{0,63}$", "u");const func1 = runtimeHelper0;const schema34 = {"enum":["multichoice","truefalse","shortanswer","numerical","calculated","calculatedsimple","calculatedmulti","match","randomsamatch","multianswer","gapselect","ddwtos","ddimageortext","ddmarker","ordering","essay"]};const schema39 = {"properties":{"mime_type":{"enum":["image/png","image/jpeg"]}}};const schema35 = {"oneOf":[{"type":"object","properties":{"kind":{"const":"text"},"text":{"type":"string"}},"required":["kind","text"],"additionalProperties":false},{"type":"object","properties":{"kind":{"const":"paragraph"},"children":{"type":"array","items":{"$ref":"#/$defs/ContentBlock"}}},"required":["kind","children"],"additionalProperties":false},{"type":"object","properties":{"kind":{"const":"code"},"text":{"type":"string"}},"required":["kind","text"],"additionalProperties":false},{"type":"object","properties":{"kind":{"const":"math"},"format":{"type":"string","enum":["tex","mathml"]},"source":{"type":"string"}},"required":["kind","format","source"],"additionalProperties":false},{"type":"object","properties":{"kind":{"const":"image"},"asset_id":{"type":"string","pattern":"^[a-z][a-zA-Z0-9_-]{0,63}$"},"alt":{"type":"string"}},"required":["kind","asset_id","alt"],"additionalProperties":false},{"type":"object","properties":{"kind":{"const":"field"},"field_id":{"type":"string","pattern":"^[a-z][a-zA-Z0-9_-]{0,63}$"}},"required":["kind","field_id"],"additionalProperties":false},{"type":"object","properties":{"kind":{"const":"list"},"ordered":{"type":"boolean"},"items":{"type":"array","items":{"type":"array","items":{"$ref":"#/$defs/ContentBlock"}}}},"required":["kind","ordered","items"],"additionalProperties":false},{"type":"object","properties":{"kind":{"const":"table"},"rows":{"type":"array","items":{"type":"object","properties":{"cells":{"type":"array","items":{"type":"object","properties":{"header":{"type":"boolean"},"content":{"type":"array","items":{"$ref":"#/$defs/ContentBlock"}}},"required":["header","content"],"additionalProperties":false}}},"required":["cells"],"additionalProperties":false}}},"required":["kind","rows"],"additionalProperties":false}]};const wrapper0 = {validate: validate23};function validate23(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){let vErrors = null;let errors = 0;const evaluated0 = validate23.evaluated;if(evaluated0.dynamicProps){evaluated0.props = undefined;}if(evaluated0.dynamicItems){evaluated0.items = undefined;}const _errs0 = errors;let valid0 = false;let passing0 = null;const _errs1 = errors;if(data && typeof data == "object" && !Array.isArray(data)){if(data.kind === undefined){const err0 = {instancePath,schemaPath:"#/oneOf/0/required",keyword:"required",params:{missingProperty: "kind"},message:"must have required property '"+"kind"+"'"};if(vErrors === null){vErrors = [err0];}else {vErrors.push(err0);}errors++;}if(data.text === undefined){const err1 = {instancePath,schemaPath:"#/oneOf/0/required",keyword:"required",params:{missingProperty: "text"},message:"must have required property '"+"text"+"'"};if(vErrors === null){vErrors = [err1];}else {vErrors.push(err1);}errors++;}for(const key0 in data){if(!((key0 === "kind") || (key0 === "text"))){const err2 = {instancePath,schemaPath:"#/oneOf/0/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err2];}else {vErrors.push(err2);}errors++;}}if(data.kind !== undefined){if("text" !== data.kind){const err3 = {instancePath:instancePath+"/kind",schemaPath:"#/oneOf/0/properties/kind/const",keyword:"const",params:{allowedValue: "text"},message:"must be equal to constant"};if(vErrors === null){vErrors = [err3];}else {vErrors.push(err3);}errors++;}}if(data.text !== undefined){if(typeof data.text !== "string"){const err4 = {instancePath:instancePath+"/text",schemaPath:"#/oneOf/0/properties/text/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err4];}else {vErrors.push(err4);}errors++;}}}else {const err5 = {instancePath,schemaPath:"#/oneOf/0/type",keyword:"type",params:{type: "object"},message:"must be object"};if(vErrors === null){vErrors = [err5];}else {vErrors.push(err5);}errors++;}var _valid0 = _errs1 === errors;if(_valid0){valid0 = true;passing0 = 0;var props0 = true;}const _errs7 = errors;if(data && typeof data == "object" && !Array.isArray(data)){if(data.kind === undefined){const err6 = {instancePath,schemaPath:"#/oneOf/1/required",keyword:"required",params:{missingProperty: "kind"},message:"must have required property '"+"kind"+"'"};if(vErrors === null){vErrors = [err6];}else {vErrors.push(err6);}errors++;}if(data.children === undefined){const err7 = {instancePath,schemaPath:"#/oneOf/1/required",keyword:"required",params:{missingProperty: "children"},message:"must have required property '"+"children"+"'"};if(vErrors === null){vErrors = [err7];}else {vErrors.push(err7);}errors++;}for(const key1 in data){if(!((key1 === "kind") || (key1 === "children"))){const err8 = {instancePath,schemaPath:"#/oneOf/1/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err8];}else {vErrors.push(err8);}errors++;}}if(data.kind !== undefined){if("paragraph" !== data.kind){const err9 = {instancePath:instancePath+"/kind",schemaPath:"#/oneOf/1/properties/kind/const",keyword:"const",params:{allowedValue: "paragraph"},message:"must be equal to constant"};if(vErrors === null){vErrors = [err9];}else {vErrors.push(err9);}errors++;}}if(data.children !== undefined){let data3 = data.children;if(Array.isArray(data3)){const len0 = data3.length;for(let i0=0; i0<len0; i0++){if(!(wrapper0.validate(data3[i0], {instancePath:instancePath+"/children/" + i0,parentData:data3,parentDataProperty:i0,rootData,dynamicAnchors}))){vErrors = vErrors === null ? wrapper0.validate.errors : vErrors.concat(wrapper0.validate.errors);errors = vErrors.length;}}}else {const err10 = {instancePath:instancePath+"/children",schemaPath:"#/oneOf/1/properties/children/type",keyword:"type",params:{type: "array"},message:"must be array"};if(vErrors === null){vErrors = [err10];}else {vErrors.push(err10);}errors++;}}}else {const err11 = {instancePath,schemaPath:"#/oneOf/1/type",keyword:"type",params:{type: "object"},message:"must be object"};if(vErrors === null){vErrors = [err11];}else {vErrors.push(err11);}errors++;}var _valid0 = _errs7 === errors;if(_valid0 && valid0){valid0 = false;passing0 = [passing0, 1];}else {if(_valid0){valid0 = true;passing0 = 1;if(props0 !== true){props0 = true;}}const _errs14 = errors;if(data && typeof data == "object" && !Array.isArray(data)){if(data.kind === undefined){const err12 = {instancePath,schemaPath:"#/oneOf/2/required",keyword:"required",params:{missingProperty: "kind"},message:"must have required property '"+"kind"+"'"};if(vErrors === null){vErrors = [err12];}else {vErrors.push(err12);}errors++;}if(data.text === undefined){const err13 = {instancePath,schemaPath:"#/oneOf/2/required",keyword:"required",params:{missingProperty: "text"},message:"must have required property '"+"text"+"'"};if(vErrors === null){vErrors = [err13];}else {vErrors.push(err13);}errors++;}for(const key2 in data){if(!((key2 === "kind") || (key2 === "text"))){const err14 = {instancePath,schemaPath:"#/oneOf/2/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key2},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err14];}else {vErrors.push(err14);}errors++;}}if(data.kind !== undefined){if("code" !== data.kind){const err15 = {instancePath:instancePath+"/kind",schemaPath:"#/oneOf/2/properties/kind/const",keyword:"const",params:{allowedValue: "code"},message:"must be equal to constant"};if(vErrors === null){vErrors = [err15];}else {vErrors.push(err15);}errors++;}}if(data.text !== undefined){if(typeof data.text !== "string"){const err16 = {instancePath:instancePath+"/text",schemaPath:"#/oneOf/2/properties/text/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err16];}else {vErrors.push(err16);}errors++;}}}else {const err17 = {instancePath,schemaPath:"#/oneOf/2/type",keyword:"type",params:{type: "object"},message:"must be object"};if(vErrors === null){vErrors = [err17];}else {vErrors.push(err17);}errors++;}var _valid0 = _errs14 === errors;if(_valid0 && valid0){valid0 = false;passing0 = [passing0, 2];}else {if(_valid0){valid0 = true;passing0 = 2;if(props0 !== true){props0 = true;}}const _errs20 = errors;if(data && typeof data == "object" && !Array.isArray(data)){if(data.kind === undefined){const err18 = {instancePath,schemaPath:"#/oneOf/3/required",keyword:"required",params:{missingProperty: "kind"},message:"must have required property '"+"kind"+"'"};if(vErrors === null){vErrors = [err18];}else {vErrors.push(err18);}errors++;}if(data.format === undefined){const err19 = {instancePath,schemaPath:"#/oneOf/3/required",keyword:"required",params:{missingProperty: "format"},message:"must have required property '"+"format"+"'"};if(vErrors === null){vErrors = [err19];}else {vErrors.push(err19);}errors++;}if(data.source === undefined){const err20 = {instancePath,schemaPath:"#/oneOf/3/required",keyword:"required",params:{missingProperty: "source"},message:"must have required property '"+"source"+"'"};if(vErrors === null){vErrors = [err20];}else {vErrors.push(err20);}errors++;}for(const key3 in data){if(!(((key3 === "kind") || (key3 === "format")) || (key3 === "source"))){const err21 = {instancePath,schemaPath:"#/oneOf/3/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key3},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err21];}else {vErrors.push(err21);}errors++;}}if(data.kind !== undefined){if("math" !== data.kind){const err22 = {instancePath:instancePath+"/kind",schemaPath:"#/oneOf/3/properties/kind/const",keyword:"const",params:{allowedValue: "math"},message:"must be equal to constant"};if(vErrors === null){vErrors = [err22];}else {vErrors.push(err22);}errors++;}}if(data.format !== undefined){let data8 = data.format;if(typeof data8 !== "string"){const err23 = {instancePath:instancePath+"/format",schemaPath:"#/oneOf/3/properties/format/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err23];}else {vErrors.push(err23);}errors++;}if(!((data8 === "tex") || (data8 === "mathml"))){const err24 = {instancePath:instancePath+"/format",schemaPath:"#/oneOf/3/properties/format/enum",keyword:"enum",params:{allowedValues: schema35.oneOf[3].properties.format.enum},message:"must be equal to one of the allowed values"};if(vErrors === null){vErrors = [err24];}else {vErrors.push(err24);}errors++;}}if(data.source !== undefined){if(typeof data.source !== "string"){const err25 = {instancePath:instancePath+"/source",schemaPath:"#/oneOf/3/properties/source/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err25];}else {vErrors.push(err25);}errors++;}}}else {const err26 = {instancePath,schemaPath:"#/oneOf/3/type",keyword:"type",params:{type: "object"},message:"must be object"};if(vErrors === null){vErrors = [err26];}else {vErrors.push(err26);}errors++;}var _valid0 = _errs20 === errors;if(_valid0 && valid0){valid0 = false;passing0 = [passing0, 3];}else {if(_valid0){valid0 = true;passing0 = 3;if(props0 !== true){props0 = true;}}const _errs28 = errors;if(data && typeof data == "object" && !Array.isArray(data)){if(data.kind === undefined){const err27 = {instancePath,schemaPath:"#/oneOf/4/required",keyword:"required",params:{missingProperty: "kind"},message:"must have required property '"+"kind"+"'"};if(vErrors === null){vErrors = [err27];}else {vErrors.push(err27);}errors++;}if(data.asset_id === undefined){const err28 = {instancePath,schemaPath:"#/oneOf/4/required",keyword:"required",params:{missingProperty: "asset_id"},message:"must have required property '"+"asset_id"+"'"};if(vErrors === null){vErrors = [err28];}else {vErrors.push(err28);}errors++;}if(data.alt === undefined){const err29 = {instancePath,schemaPath:"#/oneOf/4/required",keyword:"required",params:{missingProperty: "alt"},message:"must have required property '"+"alt"+"'"};if(vErrors === null){vErrors = [err29];}else {vErrors.push(err29);}errors++;}for(const key4 in data){if(!(((key4 === "kind") || (key4 === "asset_id")) || (key4 === "alt"))){const err30 = {instancePath,schemaPath:"#/oneOf/4/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key4},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err30];}else {vErrors.push(err30);}errors++;}}if(data.kind !== undefined){if("image" !== data.kind){const err31 = {instancePath:instancePath+"/kind",schemaPath:"#/oneOf/4/properties/kind/const",keyword:"const",params:{allowedValue: "image"},message:"must be equal to constant"};if(vErrors === null){vErrors = [err31];}else {vErrors.push(err31);}errors++;}}if(data.asset_id !== undefined){let data11 = data.asset_id;if(typeof data11 === "string"){if(!pattern5.test(data11)){const err32 = {instancePath:instancePath+"/asset_id",schemaPath:"#/oneOf/4/properties/asset_id/pattern",keyword:"pattern",params:{pattern: "^[a-z][a-zA-Z0-9_-]{0,63}$"},message:"must match pattern \""+"^[a-z][a-zA-Z0-9_-]{0,63}$"+"\""};if(vErrors === null){vErrors = [err32];}else {vErrors.push(err32);}errors++;}}else {const err33 = {instancePath:instancePath+"/asset_id",schemaPath:"#/oneOf/4/properties/asset_id/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err33];}else {vErrors.push(err33);}errors++;}}if(data.alt !== undefined){if(typeof data.alt !== "string"){const err34 = {instancePath:instancePath+"/alt",schemaPath:"#/oneOf/4/properties/alt/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err34];}else {vErrors.push(err34);}errors++;}}}else {const err35 = {instancePath,schemaPath:"#/oneOf/4/type",keyword:"type",params:{type: "object"},message:"must be object"};if(vErrors === null){vErrors = [err35];}else {vErrors.push(err35);}errors++;}var _valid0 = _errs28 === errors;if(_valid0 && valid0){valid0 = false;passing0 = [passing0, 4];}else {if(_valid0){valid0 = true;passing0 = 4;if(props0 !== true){props0 = true;}}const _errs36 = errors;if(data && typeof data == "object" && !Array.isArray(data)){if(data.kind === undefined){const err36 = {instancePath,schemaPath:"#/oneOf/5/required",keyword:"required",params:{missingProperty: "kind"},message:"must have required property '"+"kind"+"'"};if(vErrors === null){vErrors = [err36];}else {vErrors.push(err36);}errors++;}if(data.field_id === undefined){const err37 = {instancePath,schemaPath:"#/oneOf/5/required",keyword:"required",params:{missingProperty: "field_id"},message:"must have required property '"+"field_id"+"'"};if(vErrors === null){vErrors = [err37];}else {vErrors.push(err37);}errors++;}for(const key5 in data){if(!((key5 === "kind") || (key5 === "field_id"))){const err38 = {instancePath,schemaPath:"#/oneOf/5/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key5},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err38];}else {vErrors.push(err38);}errors++;}}if(data.kind !== undefined){if("field" !== data.kind){const err39 = {instancePath:instancePath+"/kind",schemaPath:"#/oneOf/5/properties/kind/const",keyword:"const",params:{allowedValue: "field"},message:"must be equal to constant"};if(vErrors === null){vErrors = [err39];}else {vErrors.push(err39);}errors++;}}if(data.field_id !== undefined){let data14 = data.field_id;if(typeof data14 === "string"){if(!pattern5.test(data14)){const err40 = {instancePath:instancePath+"/field_id",schemaPath:"#/oneOf/5/properties/field_id/pattern",keyword:"pattern",params:{pattern: "^[a-z][a-zA-Z0-9_-]{0,63}$"},message:"must match pattern \""+"^[a-z][a-zA-Z0-9_-]{0,63}$"+"\""};if(vErrors === null){vErrors = [err40];}else {vErrors.push(err40);}errors++;}}else {const err41 = {instancePath:instancePath+"/field_id",schemaPath:"#/oneOf/5/properties/field_id/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err41];}else {vErrors.push(err41);}errors++;}}}else {const err42 = {instancePath,schemaPath:"#/oneOf/5/type",keyword:"type",params:{type: "object"},message:"must be object"};if(vErrors === null){vErrors = [err42];}else {vErrors.push(err42);}errors++;}var _valid0 = _errs36 === errors;if(_valid0 && valid0){valid0 = false;passing0 = [passing0, 5];}else {if(_valid0){valid0 = true;passing0 = 5;if(props0 !== true){props0 = true;}}const _errs42 = errors;if(data && typeof data == "object" && !Array.isArray(data)){if(data.kind === undefined){const err43 = {instancePath,schemaPath:"#/oneOf/6/required",keyword:"required",params:{missingProperty: "kind"},message:"must have required property '"+"kind"+"'"};if(vErrors === null){vErrors = [err43];}else {vErrors.push(err43);}errors++;}if(data.ordered === undefined){const err44 = {instancePath,schemaPath:"#/oneOf/6/required",keyword:"required",params:{missingProperty: "ordered"},message:"must have required property '"+"ordered"+"'"};if(vErrors === null){vErrors = [err44];}else {vErrors.push(err44);}errors++;}if(data.items === undefined){const err45 = {instancePath,schemaPath:"#/oneOf/6/required",keyword:"required",params:{missingProperty: "items"},message:"must have required property '"+"items"+"'"};if(vErrors === null){vErrors = [err45];}else {vErrors.push(err45);}errors++;}for(const key6 in data){if(!(((key6 === "kind") || (key6 === "ordered")) || (key6 === "items"))){const err46 = {instancePath,schemaPath:"#/oneOf/6/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key6},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err46];}else {vErrors.push(err46);}errors++;}}if(data.kind !== undefined){if("list" !== data.kind){const err47 = {instancePath:instancePath+"/kind",schemaPath:"#/oneOf/6/properties/kind/const",keyword:"const",params:{allowedValue: "list"},message:"must be equal to constant"};if(vErrors === null){vErrors = [err47];}else {vErrors.push(err47);}errors++;}}if(data.ordered !== undefined){if(typeof data.ordered !== "boolean"){const err48 = {instancePath:instancePath+"/ordered",schemaPath:"#/oneOf/6/properties/ordered/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};if(vErrors === null){vErrors = [err48];}else {vErrors.push(err48);}errors++;}}if(data.items !== undefined){let data17 = data.items;if(Array.isArray(data17)){const len1 = data17.length;for(let i1=0; i1<len1; i1++){let data18 = data17[i1];if(Array.isArray(data18)){const len2 = data18.length;for(let i2=0; i2<len2; i2++){if(!(wrapper0.validate(data18[i2], {instancePath:instancePath+"/items/" + i1+"/" + i2,parentData:data18,parentDataProperty:i2,rootData,dynamicAnchors}))){vErrors = vErrors === null ? wrapper0.validate.errors : vErrors.concat(wrapper0.validate.errors);errors = vErrors.length;}}}else {const err49 = {instancePath:instancePath+"/items/" + i1,schemaPath:"#/oneOf/6/properties/items/items/type",keyword:"type",params:{type: "array"},message:"must be array"};if(vErrors === null){vErrors = [err49];}else {vErrors.push(err49);}errors++;}}}else {const err50 = {instancePath:instancePath+"/items",schemaPath:"#/oneOf/6/properties/items/type",keyword:"type",params:{type: "array"},message:"must be array"};if(vErrors === null){vErrors = [err50];}else {vErrors.push(err50);}errors++;}}}else {const err51 = {instancePath,schemaPath:"#/oneOf/6/type",keyword:"type",params:{type: "object"},message:"must be object"};if(vErrors === null){vErrors = [err51];}else {vErrors.push(err51);}errors++;}var _valid0 = _errs42 === errors;if(_valid0 && valid0){valid0 = false;passing0 = [passing0, 6];}else {if(_valid0){valid0 = true;passing0 = 6;if(props0 !== true){props0 = true;}}const _errs53 = errors;if(data && typeof data == "object" && !Array.isArray(data)){if(data.kind === undefined){const err52 = {instancePath,schemaPath:"#/oneOf/7/required",keyword:"required",params:{missingProperty: "kind"},message:"must have required property '"+"kind"+"'"};if(vErrors === null){vErrors = [err52];}else {vErrors.push(err52);}errors++;}if(data.rows === undefined){const err53 = {instancePath,schemaPath:"#/oneOf/7/required",keyword:"required",params:{missingProperty: "rows"},message:"must have required property '"+"rows"+"'"};if(vErrors === null){vErrors = [err53];}else {vErrors.push(err53);}errors++;}for(const key7 in data){if(!((key7 === "kind") || (key7 === "rows"))){const err54 = {instancePath,schemaPath:"#/oneOf/7/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key7},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err54];}else {vErrors.push(err54);}errors++;}}if(data.kind !== undefined){if("table" !== data.kind){const err55 = {instancePath:instancePath+"/kind",schemaPath:"#/oneOf/7/properties/kind/const",keyword:"const",params:{allowedValue: "table"},message:"must be equal to constant"};if(vErrors === null){vErrors = [err55];}else {vErrors.push(err55);}errors++;}}if(data.rows !== undefined){let data21 = data.rows;if(Array.isArray(data21)){const len3 = data21.length;for(let i3=0; i3<len3; i3++){let data22 = data21[i3];if(data22 && typeof data22 == "object" && !Array.isArray(data22)){if(data22.cells === undefined){const err56 = {instancePath:instancePath+"/rows/" + i3,schemaPath:"#/oneOf/7/properties/rows/items/required",keyword:"required",params:{missingProperty: "cells"},message:"must have required property '"+"cells"+"'"};if(vErrors === null){vErrors = [err56];}else {vErrors.push(err56);}errors++;}for(const key8 in data22){if(!(key8 === "cells")){const err57 = {instancePath:instancePath+"/rows/" + i3,schemaPath:"#/oneOf/7/properties/rows/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key8},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err57];}else {vErrors.push(err57);}errors++;}}if(data22.cells !== undefined){let data23 = data22.cells;if(Array.isArray(data23)){const len4 = data23.length;for(let i4=0; i4<len4; i4++){let data24 = data23[i4];if(data24 && typeof data24 == "object" && !Array.isArray(data24)){if(data24.header === undefined){const err58 = {instancePath:instancePath+"/rows/" + i3+"/cells/" + i4,schemaPath:"#/oneOf/7/properties/rows/items/properties/cells/items/required",keyword:"required",params:{missingProperty: "header"},message:"must have required property '"+"header"+"'"};if(vErrors === null){vErrors = [err58];}else {vErrors.push(err58);}errors++;}if(data24.content === undefined){const err59 = {instancePath:instancePath+"/rows/" + i3+"/cells/" + i4,schemaPath:"#/oneOf/7/properties/rows/items/properties/cells/items/required",keyword:"required",params:{missingProperty: "content"},message:"must have required property '"+"content"+"'"};if(vErrors === null){vErrors = [err59];}else {vErrors.push(err59);}errors++;}for(const key9 in data24){if(!((key9 === "header") || (key9 === "content"))){const err60 = {instancePath:instancePath+"/rows/" + i3+"/cells/" + i4,schemaPath:"#/oneOf/7/properties/rows/items/properties/cells/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key9},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err60];}else {vErrors.push(err60);}errors++;}}if(data24.header !== undefined){if(typeof data24.header !== "boolean"){const err61 = {instancePath:instancePath+"/rows/" + i3+"/cells/" + i4+"/header",schemaPath:"#/oneOf/7/properties/rows/items/properties/cells/items/properties/header/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};if(vErrors === null){vErrors = [err61];}else {vErrors.push(err61);}errors++;}}if(data24.content !== undefined){let data26 = data24.content;if(Array.isArray(data26)){const len5 = data26.length;for(let i5=0; i5<len5; i5++){if(!(wrapper0.validate(data26[i5], {instancePath:instancePath+"/rows/" + i3+"/cells/" + i4+"/content/" + i5,parentData:data26,parentDataProperty:i5,rootData,dynamicAnchors}))){vErrors = vErrors === null ? wrapper0.validate.errors : vErrors.concat(wrapper0.validate.errors);errors = vErrors.length;}}}else {const err62 = {instancePath:instancePath+"/rows/" + i3+"/cells/" + i4+"/content",schemaPath:"#/oneOf/7/properties/rows/items/properties/cells/items/properties/content/type",keyword:"type",params:{type: "array"},message:"must be array"};if(vErrors === null){vErrors = [err62];}else {vErrors.push(err62);}errors++;}}}else {const err63 = {instancePath:instancePath+"/rows/" + i3+"/cells/" + i4,schemaPath:"#/oneOf/7/properties/rows/items/properties/cells/items/type",keyword:"type",params:{type: "object"},message:"must be object"};if(vErrors === null){vErrors = [err63];}else {vErrors.push(err63);}errors++;}}}else {const err64 = {instancePath:instancePath+"/rows/" + i3+"/cells",schemaPath:"#/oneOf/7/properties/rows/items/properties/cells/type",keyword:"type",params:{type: "array"},message:"must be array"};if(vErrors === null){vErrors = [err64];}else {vErrors.push(err64);}errors++;}}}else {const err65 = {instancePath:instancePath+"/rows/" + i3,schemaPath:"#/oneOf/7/properties/rows/items/type",keyword:"type",params:{type: "object"},message:"must be object"};if(vErrors === null){vErrors = [err65];}else {vErrors.push(err65);}errors++;}}}else {const err66 = {instancePath:instancePath+"/rows",schemaPath:"#/oneOf/7/properties/rows/type",keyword:"type",params:{type: "array"},message:"must be array"};if(vErrors === null){vErrors = [err66];}else {vErrors.push(err66);}errors++;}}}else {const err67 = {instancePath,schemaPath:"#/oneOf/7/type",keyword:"type",params:{type: "object"},message:"must be object"};if(vErrors === null){vErrors = [err67];}else {vErrors.push(err67);}errors++;}var _valid0 = _errs53 === errors;if(_valid0 && valid0){valid0 = false;passing0 = [passing0, 7];}else {if(_valid0){valid0 = true;passing0 = 7;if(props0 !== true){props0 = true;}}}}}}}}}if(!valid0){const err68 = {instancePath,schemaPath:"#/oneOf",keyword:"oneOf",params:{passingSchemas: passing0},message:"must match exactly one schema in oneOf"};if(vErrors === null){vErrors = [err68];}else {vErrors.push(err68);}errors++;}else {errors = _errs0;if(vErrors !== null){if(_errs0){vErrors.length = _errs0;}else {vErrors = null;}}}validate23.errors = vErrors;evaluated0.props = props0;return errors === 0;}validate23.evaluated = {"dynamicProps":true,"dynamicItems":false};const schema36 = {"oneOf":[{"type":"object","properties":{"kind":{"type":"string","enum":["single_choice","multiple_choice"]},"content":{"type":"array","items":{"$ref":"#/$defs/ContentBlock"}},"options":{"type":"object","patternProperties":{"^[a-z][a-zA-Z0-9_-]{0,63}$":{"$ref":"#/$defs/Choice"}},"additionalProperties":false,"minProperties":1,"maxProperties":256},"group":{"anyOf":[{"type":"string","pattern":"^[a-z][a-zA-Z0-9_-]{0,63}$"},{"type":"null"}]},"location":{"anyOf":[{"$ref":"#/$defs/Location"},{"type":"null"}]}},"required":["kind","content","options","group","location"],"additionalProperties":false},{"type":"object","properties":{"kind":{"type":"string","enum":["text","essay"]},"content":{"type":"array","items":{"$ref":"#/$defs/ContentBlock"}}},"required":["kind","content"],"additionalProperties":false},{"type":"object","properties":{"kind":{"const":"numeric"},"content":{"type":"array","items":{"$ref":"#/$defs/ContentBlock"}},"unit_options":{"type":"object","patternProperties":{"^[a-z][a-zA-Z0-9_-]{0,63}$":{"$ref":"#/$defs/Choice"}},"additionalProperties":false,"maxProperties":256}},"required":["kind","content","unit_options"],"additionalProperties":false},{"type":"object","properties":{"kind":{"const":"ordering"},"content":{"type":"array","items":{"$ref":"#/$defs/ContentBlock"}},"items":{"type":"object","patternProperties":{"^[a-z][a-zA-Z0-9_-]{0,63}$":{"type":"object","properties":{"content":{"type":"array","items":{"$ref":"#/$defs/ContentBlock"}}},"required":["content"],"additionalProperties":false}},"additionalProperties":false,"minProperties":1,"maxProperties":256}},"required":["kind","content","items"],"additionalProperties":false},{"type":"object","properties":{"kind":{"const":"markers"},"content":{"type":"array","items":{"$ref":"#/$defs/ContentBlock"}},"asset_id":{"type":"string","pattern":"^[a-z][a-zA-Z0-9_-]{0,63}$"},"capacity":{"anyOf":[{"type":"integer","minimum":1},{"type":"null"}]}},"required":["kind","content","asset_id","capacity"],"additionalProperties":false}]};function validate27(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){let vErrors = null;let errors = 0;const evaluated0 = validate27.evaluated;if(evaluated0.dynamicProps){evaluated0.props = undefined;}if(evaluated0.dynamicItems){evaluated0.items = undefined;}if(data && typeof data == "object" && !Array.isArray(data)){if(data.content === undefined){const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "content"},message:"must have required property '"+"content"+"'"};if(vErrors === null){vErrors = [err0];}else {vErrors.push(err0);}errors++;}if(data.group === undefined){const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "group"},message:"must have required property '"+"group"+"'"};if(vErrors === null){vErrors = [err1];}else {vErrors.push(err1);}errors++;}if(data.capacity === undefined){const err2 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "capacity"},message:"must have required property '"+"capacity"+"'"};if(vErrors === null){vErrors = [err2];}else {vErrors.push(err2);}errors++;}for(const key0 in data){if(!(((key0 === "content") || (key0 === "group")) || (key0 === "capacity"))){const err3 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err3];}else {vErrors.push(err3);}errors++;}}if(data.content !== undefined){let data0 = data.content;if(Array.isArray(data0)){const len0 = data0.length;for(let i0=0; i0<len0; i0++){if(!(validate23(data0[i0], {instancePath:instancePath+"/content/" + i0,parentData:data0,parentDataProperty:i0,rootData,dynamicAnchors}))){vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);errors = vErrors.length;}}}else {const err4 = {instancePath:instancePath+"/content",schemaPath:"#/properties/content/type",keyword:"type",params:{type: "array"},message:"must be array"};if(vErrors === null){vErrors = [err4];}else {vErrors.push(err4);}errors++;}}if(data.group !== undefined){let data2 = data.group;const _errs6 = errors;let valid3 = false;const _errs7 = errors;if(typeof data2 === "string"){if(!pattern5.test(data2)){const err5 = {instancePath:instancePath+"/group",schemaPath:"#/properties/group/anyOf/0/pattern",keyword:"pattern",params:{pattern: "^[a-z][a-zA-Z0-9_-]{0,63}$"},message:"must match pattern \""+"^[a-z][a-zA-Z0-9_-]{0,63}$"+"\""};if(vErrors === null){vErrors = [err5];}else {vErrors.push(err5);}errors++;}}else {const err6 = {instancePath:instancePath+"/group",schemaPath:"#/properties/group/anyOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err6];}else {vErrors.push(err6);}errors++;}var _valid0 = _errs7 === errors;valid3 = valid3 || _valid0;const _errs9 = errors;if(data2 !== null){const err7 = {instancePath:instancePath+"/group",schemaPath:"#/properties/group/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};if(vErrors === null){vErrors = [err7];}else {vErrors.push(err7);}errors++;}var _valid0 = _errs9 === errors;valid3 = valid3 || _valid0;if(!valid3){const err8 = {instancePath:instancePath+"/group",schemaPath:"#/properties/group/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};if(vErrors === null){vErrors = [err8];}else {vErrors.push(err8);}errors++;}else {errors = _errs6;if(vErrors !== null){if(_errs6){vErrors.length = _errs6;}else {vErrors = null;}}}}if(data.capacity !== undefined){let data3 = data.capacity;const _errs12 = errors;let valid4 = false;const _errs13 = errors;if(!((typeof data3 == "number") && (!(data3 % 1) && !isNaN(data3)))){const err9 = {instancePath:instancePath+"/capacity",schemaPath:"#/properties/capacity/anyOf/0/type",keyword:"type",params:{type: "integer"},message:"must be integer"};if(vErrors === null){vErrors = [err9];}else {vErrors.push(err9);}errors++;}if(typeof data3 == "number"){if(data3 < 1 || isNaN(data3)){const err10 = {instancePath:instancePath+"/capacity",schemaPath:"#/properties/capacity/anyOf/0/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"};if(vErrors === null){vErrors = [err10];}else {vErrors.push(err10);}errors++;}}var _valid1 = _errs13 === errors;valid4 = valid4 || _valid1;const _errs15 = errors;if(data3 !== null){const err11 = {instancePath:instancePath+"/capacity",schemaPath:"#/properties/capacity/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};if(vErrors === null){vErrors = [err11];}else {vErrors.push(err11);}errors++;}var _valid1 = _errs15 === errors;valid4 = valid4 || _valid1;if(!valid4){const err12 = {instancePath:instancePath+"/capacity",schemaPath:"#/properties/capacity/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};if(vErrors === null){vErrors = [err12];}else {vErrors.push(err12);}errors++;}else {errors = _errs12;if(vErrors !== null){if(_errs12){vErrors.length = _errs12;}else {vErrors = null;}}}}}else {const err13 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};if(vErrors === null){vErrors = [err13];}else {vErrors.push(err13);}errors++;}validate27.errors = vErrors;return errors === 0;}validate27.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};function validate25(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){let vErrors = null;let errors = 0;const evaluated0 = validate25.evaluated;if(evaluated0.dynamicProps){evaluated0.props = undefined;}if(evaluated0.dynamicItems){evaluated0.items = undefined;}const _errs0 = errors;let valid0 = false;let passing0 = null;const _errs1 = errors;if(data && typeof data == "object" && !Array.isArray(data)){if(data.kind === undefined){const err0 = {instancePath,schemaPath:"#/oneOf/0/required",keyword:"required",params:{missingProperty: "kind"},message:"must have required property '"+"kind"+"'"};if(vErrors === null){vErrors = [err0];}else {vErrors.push(err0);}errors++;}if(data.content === undefined){const err1 = {instancePath,schemaPath:"#/oneOf/0/required",keyword:"required",params:{missingProperty: "content"},message:"must have required property '"+"content"+"'"};if(vErrors === null){vErrors = [err1];}else {vErrors.push(err1);}errors++;}if(data.options === undefined){const err2 = {instancePath,schemaPath:"#/oneOf/0/required",keyword:"required",params:{missingProperty: "options"},message:"must have required property '"+"options"+"'"};if(vErrors === null){vErrors = [err2];}else {vErrors.push(err2);}errors++;}if(data.group === undefined){const err3 = {instancePath,schemaPath:"#/oneOf/0/required",keyword:"required",params:{missingProperty: "group"},message:"must have required property '"+"group"+"'"};if(vErrors === null){vErrors = [err3];}else {vErrors.push(err3);}errors++;}if(data.location === undefined){const err4 = {instancePath,schemaPath:"#/oneOf/0/required",keyword:"required",params:{missingProperty: "location"},message:"must have required property '"+"location"+"'"};if(vErrors === null){vErrors = [err4];}else {vErrors.push(err4);}errors++;}for(const key0 in data){if(!(((((key0 === "kind") || (key0 === "content")) || (key0 === "options")) || (key0 === "group")) || (key0 === "location"))){const err5 = {instancePath,schemaPath:"#/oneOf/0/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err5];}else {vErrors.push(err5);}errors++;}}if(data.kind !== undefined){let data0 = data.kind;if(typeof data0 !== "string"){const err6 = {instancePath:instancePath+"/kind",schemaPath:"#/oneOf/0/properties/kind/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err6];}else {vErrors.push(err6);}errors++;}if(!((data0 === "single_choice") || (data0 === "multiple_choice"))){const err7 = {instancePath:instancePath+"/kind",schemaPath:"#/oneOf/0/properties/kind/enum",keyword:"enum",params:{allowedValues: schema36.oneOf[0].properties.kind.enum},message:"must be equal to one of the allowed values"};if(vErrors === null){vErrors = [err7];}else {vErrors.push(err7);}errors++;}}if(data.content !== undefined){let data1 = data.content;if(Array.isArray(data1)){const len0 = data1.length;for(let i0=0; i0<len0; i0++){if(!(validate23(data1[i0], {instancePath:instancePath+"/content/" + i0,parentData:data1,parentDataProperty:i0,rootData,dynamicAnchors}))){vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);errors = vErrors.length;}}}else {const err8 = {instancePath:instancePath+"/content",schemaPath:"#/oneOf/0/properties/content/type",keyword:"type",params:{type: "array"},message:"must be array"};if(vErrors === null){vErrors = [err8];}else {vErrors.push(err8);}errors++;}}if(data.options !== undefined){let data3 = data.options;if(data3 && typeof data3 == "object" && !Array.isArray(data3)){if(Object.keys(data3).length > 256){const err9 = {instancePath:instancePath+"/options",schemaPath:"#/oneOf/0/properties/options/maxProperties",keyword:"maxProperties",params:{limit: 256},message:"must NOT have more than 256 properties"};if(vErrors === null){vErrors = [err9];}else {vErrors.push(err9);}errors++;}if(Object.keys(data3).length < 1){const err10 = {instancePath:instancePath+"/options",schemaPath:"#/oneOf/0/properties/options/minProperties",keyword:"minProperties",params:{limit: 1},message:"must NOT have fewer than 1 properties"};if(vErrors === null){vErrors = [err10];}else {vErrors.push(err10);}errors++;}for(const key1 in data3){if(!(pattern5.test(key1))){const err11 = {instancePath:instancePath+"/options",schemaPath:"#/oneOf/0/properties/options/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err11];}else {vErrors.push(err11);}errors++;}}for(const key2 in data3){if(pattern5.test(key2)){if(!(validate27(data3[key2], {instancePath:instancePath+"/options/" + key2.replace(/~/g, "~0").replace(/\//g, "~1"),parentData:data3,parentDataProperty:key2,rootData,dynamicAnchors}))){vErrors = vErrors === null ? validate27.errors : vErrors.concat(validate27.errors);errors = vErrors.length;}}}}else {const err12 = {instancePath:instancePath+"/options",schemaPath:"#/oneOf/0/properties/options/type",keyword:"type",params:{type: "object"},message:"must be object"};if(vErrors === null){vErrors = [err12];}else {vErrors.push(err12);}errors++;}}if(data.group !== undefined){let data5 = data.group;const _errs14 = errors;let valid5 = false;const _errs15 = errors;if(typeof data5 === "string"){if(!pattern5.test(data5)){const err13 = {instancePath:instancePath+"/group",schemaPath:"#/oneOf/0/properties/group/anyOf/0/pattern",keyword:"pattern",params:{pattern: "^[a-z][a-zA-Z0-9_-]{0,63}$"},message:"must match pattern \""+"^[a-z][a-zA-Z0-9_-]{0,63}$"+"\""};if(vErrors === null){vErrors = [err13];}else {vErrors.push(err13);}errors++;}}else {const err14 = {instancePath:instancePath+"/group",schemaPath:"#/oneOf/0/properties/group/anyOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err14];}else {vErrors.push(err14);}errors++;}var _valid1 = _errs15 === errors;valid5 = valid5 || _valid1;const _errs17 = errors;if(data5 !== null){const err15 = {instancePath:instancePath+"/group",schemaPath:"#/oneOf/0/properties/group/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};if(vErrors === null){vErrors = [err15];}else {vErrors.push(err15);}errors++;}var _valid1 = _errs17 === errors;valid5 = valid5 || _valid1;if(!valid5){const err16 = {instancePath:instancePath+"/group",schemaPath:"#/oneOf/0/properties/group/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};if(vErrors === null){vErrors = [err16];}else {vErrors.push(err16);}errors++;}else {errors = _errs14;if(vErrors !== null){if(_errs14){vErrors.length = _errs14;}else {vErrors = null;}}}}if(data.location !== undefined){let data6 = data.location;const _errs20 = errors;let valid6 = false;const _errs21 = errors;if(data6 && typeof data6 == "object" && !Array.isArray(data6)){if(data6.asset_id === undefined){const err17 = {instancePath:instancePath+"/location",schemaPath:"#/$defs/Location/required",keyword:"required",params:{missingProperty: "asset_id"},message:"must have required property '"+"asset_id"+"'"};if(vErrors === null){vErrors = [err17];}else {vErrors.push(err17);}errors++;}if(data6.x === undefined){const err18 = {instancePath:instancePath+"/location",schemaPath:"#/$defs/Location/required",keyword:"required",params:{missingProperty: "x"},message:"must have required property '"+"x"+"'"};if(vErrors === null){vErrors = [err18];}else {vErrors.push(err18);}errors++;}if(data6.y === undefined){const err19 = {instancePath:instancePath+"/location",schemaPath:"#/$defs/Location/required",keyword:"required",params:{missingProperty: "y"},message:"must have required property '"+"y"+"'"};if(vErrors === null){vErrors = [err19];}else {vErrors.push(err19);}errors++;}if(data6.width === undefined){const err20 = {instancePath:instancePath+"/location",schemaPath:"#/$defs/Location/required",keyword:"required",params:{missingProperty: "width"},message:"must have required property '"+"width"+"'"};if(vErrors === null){vErrors = [err20];}else {vErrors.push(err20);}errors++;}if(data6.height === undefined){const err21 = {instancePath:instancePath+"/location",schemaPath:"#/$defs/Location/required",keyword:"required",params:{missingProperty: "height"},message:"must have required property '"+"height"+"'"};if(vErrors === null){vErrors = [err21];}else {vErrors.push(err21);}errors++;}for(const key3 in data6){if(!(((((key3 === "asset_id") || (key3 === "x")) || (key3 === "y")) || (key3 === "width")) || (key3 === "height"))){const err22 = {instancePath:instancePath+"/location",schemaPath:"#/$defs/Location/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key3},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err22];}else {vErrors.push(err22);}errors++;}}if(data6.asset_id !== undefined){let data7 = data6.asset_id;if(typeof data7 === "string"){if(!pattern5.test(data7)){const err23 = {instancePath:instancePath+"/location/asset_id",schemaPath:"#/$defs/Location/properties/asset_id/pattern",keyword:"pattern",params:{pattern: "^[a-z][a-zA-Z0-9_-]{0,63}$"},message:"must match pattern \""+"^[a-z][a-zA-Z0-9_-]{0,63}$"+"\""};if(vErrors === null){vErrors = [err23];}else {vErrors.push(err23);}errors++;}}else {const err24 = {instancePath:instancePath+"/location/asset_id",schemaPath:"#/$defs/Location/properties/asset_id/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err24];}else {vErrors.push(err24);}errors++;}}if(data6.x !== undefined){let data8 = data6.x;if(!((typeof data8 == "number") && (!(data8 % 1) && !isNaN(data8)))){const err25 = {instancePath:instancePath+"/location/x",schemaPath:"#/$defs/Location/properties/x/type",keyword:"type",params:{type: "integer"},message:"must be integer"};if(vErrors === null){vErrors = [err25];}else {vErrors.push(err25);}errors++;}if(typeof data8 == "number"){if(data8 < 0 || isNaN(data8)){const err26 = {instancePath:instancePath+"/location/x",schemaPath:"#/$defs/Location/properties/x/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};if(vErrors === null){vErrors = [err26];}else {vErrors.push(err26);}errors++;}}}if(data6.y !== undefined){let data9 = data6.y;if(!((typeof data9 == "number") && (!(data9 % 1) && !isNaN(data9)))){const err27 = {instancePath:instancePath+"/location/y",schemaPath:"#/$defs/Location/properties/y/type",keyword:"type",params:{type: "integer"},message:"must be integer"};if(vErrors === null){vErrors = [err27];}else {vErrors.push(err27);}errors++;}if(typeof data9 == "number"){if(data9 < 0 || isNaN(data9)){const err28 = {instancePath:instancePath+"/location/y",schemaPath:"#/$defs/Location/properties/y/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};if(vErrors === null){vErrors = [err28];}else {vErrors.push(err28);}errors++;}}}if(data6.width !== undefined){let data10 = data6.width;if(!((typeof data10 == "number") && (!(data10 % 1) && !isNaN(data10)))){const err29 = {instancePath:instancePath+"/location/width",schemaPath:"#/$defs/Location/properties/width/type",keyword:"type",params:{type: "integer"},message:"must be integer"};if(vErrors === null){vErrors = [err29];}else {vErrors.push(err29);}errors++;}if(typeof data10 == "number"){if(data10 < 1 || isNaN(data10)){const err30 = {instancePath:instancePath+"/location/width",schemaPath:"#/$defs/Location/properties/width/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"};if(vErrors === null){vErrors = [err30];}else {vErrors.push(err30);}errors++;}}}if(data6.height !== undefined){let data11 = data6.height;if(!((typeof data11 == "number") && (!(data11 % 1) && !isNaN(data11)))){const err31 = {instancePath:instancePath+"/location/height",schemaPath:"#/$defs/Location/properties/height/type",keyword:"type",params:{type: "integer"},message:"must be integer"};if(vErrors === null){vErrors = [err31];}else {vErrors.push(err31);}errors++;}if(typeof data11 == "number"){if(data11 < 1 || isNaN(data11)){const err32 = {instancePath:instancePath+"/location/height",schemaPath:"#/$defs/Location/properties/height/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"};if(vErrors === null){vErrors = [err32];}else {vErrors.push(err32);}errors++;}}}}else {const err33 = {instancePath:instancePath+"/location",schemaPath:"#/$defs/Location/type",keyword:"type",params:{type: "object"},message:"must be object"};if(vErrors === null){vErrors = [err33];}else {vErrors.push(err33);}errors++;}var _valid2 = _errs21 === errors;valid6 = valid6 || _valid2;const _errs35 = errors;if(data6 !== null){const err34 = {instancePath:instancePath+"/location",schemaPath:"#/oneOf/0/properties/location/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};if(vErrors === null){vErrors = [err34];}else {vErrors.push(err34);}errors++;}var _valid2 = _errs35 === errors;valid6 = valid6 || _valid2;if(!valid6){const err35 = {instancePath:instancePath+"/location",schemaPath:"#/oneOf/0/properties/location/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};if(vErrors === null){vErrors = [err35];}else {vErrors.push(err35);}errors++;}else {errors = _errs20;if(vErrors !== null){if(_errs20){vErrors.length = _errs20;}else {vErrors = null;}}}}}else {const err36 = {instancePath,schemaPath:"#/oneOf/0/type",keyword:"type",params:{type: "object"},message:"must be object"};if(vErrors === null){vErrors = [err36];}else {vErrors.push(err36);}errors++;}var _valid0 = _errs1 === errors;if(_valid0){valid0 = true;passing0 = 0;var props2 = true;}const _errs37 = errors;if(data && typeof data == "object" && !Array.isArray(data)){if(data.kind === undefined){const err37 = {instancePath,schemaPath:"#/oneOf/1/required",keyword:"required",params:{missingProperty: "kind"},message:"must have required property '"+"kind"+"'"};if(vErrors === null){vErrors = [err37];}else {vErrors.push(err37);}errors++;}if(data.content === undefined){const err38 = {instancePath,schemaPath:"#/oneOf/1/required",keyword:"required",params:{missingProperty: "content"},message:"must have required property '"+"content"+"'"};if(vErrors === null){vErrors = [err38];}else {vErrors.push(err38);}errors++;}for(const key4 in data){if(!((key4 === "kind") || (key4 === "content"))){const err39 = {instancePath,schemaPath:"#/oneOf/1/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key4},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err39];}else {vErrors.push(err39);}errors++;}}if(data.kind !== undefined){let data12 = data.kind;if(typeof data12 !== "string"){const err40 = {instancePath:instancePath+"/kind",schemaPath:"#/oneOf/1/properties/kind/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err40];}else {vErrors.push(err40);}errors++;}if(!((data12 === "text") || (data12 === "essay"))){const err41 = {instancePath:instancePath+"/kind",schemaPath:"#/oneOf/1/properties/kind/enum",keyword:"enum",params:{allowedValues: schema36.oneOf[1].properties.kind.enum},message:"must be equal to one of the allowed values"};if(vErrors === null){vErrors = [err41];}else {vErrors.push(err41);}errors++;}}if(data.content !== undefined){let data13 = data.content;if(Array.isArray(data13)){const len1 = data13.length;for(let i1=0; i1<len1; i1++){if(!(validate23(data13[i1], {instancePath:instancePath+"/content/" + i1,parentData:data13,parentDataProperty:i1,rootData,dynamicAnchors}))){vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);errors = vErrors.length;}}}else {const err42 = {instancePath:instancePath+"/content",schemaPath:"#/oneOf/1/properties/content/type",keyword:"type",params:{type: "array"},message:"must be array"};if(vErrors === null){vErrors = [err42];}else {vErrors.push(err42);}errors++;}}}else {const err43 = {instancePath,schemaPath:"#/oneOf/1/type",keyword:"type",params:{type: "object"},message:"must be object"};if(vErrors === null){vErrors = [err43];}else {vErrors.push(err43);}errors++;}var _valid0 = _errs37 === errors;if(_valid0 && valid0){valid0 = false;passing0 = [passing0, 1];}else {if(_valid0){valid0 = true;passing0 = 1;if(props2 !== true){props2 = true;}}const _errs45 = errors;if(data && typeof data == "object" && !Array.isArray(data)){if(data.kind === undefined){const err44 = {instancePath,schemaPath:"#/oneOf/2/required",keyword:"required",params:{missingProperty: "kind"},message:"must have required property '"+"kind"+"'"};if(vErrors === null){vErrors = [err44];}else {vErrors.push(err44);}errors++;}if(data.content === undefined){const err45 = {instancePath,schemaPath:"#/oneOf/2/required",keyword:"required",params:{missingProperty: "content"},message:"must have required property '"+"content"+"'"};if(vErrors === null){vErrors = [err45];}else {vErrors.push(err45);}errors++;}if(data.unit_options === undefined){const err46 = {instancePath,schemaPath:"#/oneOf/2/required",keyword:"required",params:{missingProperty: "unit_options"},message:"must have required property '"+"unit_options"+"'"};if(vErrors === null){vErrors = [err46];}else {vErrors.push(err46);}errors++;}for(const key5 in data){if(!(((key5 === "kind") || (key5 === "content")) || (key5 === "unit_options"))){const err47 = {instancePath,schemaPath:"#/oneOf/2/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key5},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err47];}else {vErrors.push(err47);}errors++;}}if(data.kind !== undefined){if("numeric" !== data.kind){const err48 = {instancePath:instancePath+"/kind",schemaPath:"#/oneOf/2/properties/kind/const",keyword:"const",params:{allowedValue: "numeric"},message:"must be equal to constant"};if(vErrors === null){vErrors = [err48];}else {vErrors.push(err48);}errors++;}}if(data.content !== undefined){let data16 = data.content;if(Array.isArray(data16)){const len2 = data16.length;for(let i2=0; i2<len2; i2++){if(!(validate23(data16[i2], {instancePath:instancePath+"/content/" + i2,parentData:data16,parentDataProperty:i2,rootData,dynamicAnchors}))){vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);errors = vErrors.length;}}}else {const err49 = {instancePath:instancePath+"/content",schemaPath:"#/oneOf/2/properties/content/type",keyword:"type",params:{type: "array"},message:"must be array"};if(vErrors === null){vErrors = [err49];}else {vErrors.push(err49);}errors++;}}if(data.unit_options !== undefined){let data18 = data.unit_options;if(data18 && typeof data18 == "object" && !Array.isArray(data18)){if(Object.keys(data18).length > 256){const err50 = {instancePath:instancePath+"/unit_options",schemaPath:"#/oneOf/2/properties/unit_options/maxProperties",keyword:"maxProperties",params:{limit: 256},message:"must NOT have more than 256 properties"};if(vErrors === null){vErrors = [err50];}else {vErrors.push(err50);}errors++;}for(const key6 in data18){if(!(pattern5.test(key6))){const err51 = {instancePath:instancePath+"/unit_options",schemaPath:"#/oneOf/2/properties/unit_options/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key6},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err51];}else {vErrors.push(err51);}errors++;}}for(const key7 in data18){if(pattern5.test(key7)){if(!(validate27(data18[key7], {instancePath:instancePath+"/unit_options/" + key7.replace(/~/g, "~0").replace(/\//g, "~1"),parentData:data18,parentDataProperty:key7,rootData,dynamicAnchors}))){vErrors = vErrors === null ? validate27.errors : vErrors.concat(validate27.errors);errors = vErrors.length;}}}}else {const err52 = {instancePath:instancePath+"/unit_options",schemaPath:"#/oneOf/2/properties/unit_options/type",keyword:"type",params:{type: "object"},message:"must be object"};if(vErrors === null){vErrors = [err52];}else {vErrors.push(err52);}errors++;}}}else {const err53 = {instancePath,schemaPath:"#/oneOf/2/type",keyword:"type",params:{type: "object"},message:"must be object"};if(vErrors === null){vErrors = [err53];}else {vErrors.push(err53);}errors++;}var _valid0 = _errs45 === errors;if(_valid0 && valid0){valid0 = false;passing0 = [passing0, 2];}else {if(_valid0){valid0 = true;passing0 = 2;if(props2 !== true){props2 = true;}}const _errs56 = errors;if(data && typeof data == "object" && !Array.isArray(data)){if(data.kind === undefined){const err54 = {instancePath,schemaPath:"#/oneOf/3/required",keyword:"required",params:{missingProperty: "kind"},message:"must have required property '"+"kind"+"'"};if(vErrors === null){vErrors = [err54];}else {vErrors.push(err54);}errors++;}if(data.content === undefined){const err55 = {instancePath,schemaPath:"#/oneOf/3/required",keyword:"required",params:{missingProperty: "content"},message:"must have required property '"+"content"+"'"};if(vErrors === null){vErrors = [err55];}else {vErrors.push(err55);}errors++;}if(data.items === undefined){const err56 = {instancePath,schemaPath:"#/oneOf/3/required",keyword:"required",params:{missingProperty: "items"},message:"must have required property '"+"items"+"'"};if(vErrors === null){vErrors = [err56];}else {vErrors.push(err56);}errors++;}for(const key8 in data){if(!(((key8 === "kind") || (key8 === "content")) || (key8 === "items"))){const err57 = {instancePath,schemaPath:"#/oneOf/3/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key8},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err57];}else {vErrors.push(err57);}errors++;}}if(data.kind !== undefined){if("ordering" !== data.kind){const err58 = {instancePath:instancePath+"/kind",schemaPath:"#/oneOf/3/properties/kind/const",keyword:"const",params:{allowedValue: "ordering"},message:"must be equal to constant"};if(vErrors === null){vErrors = [err58];}else {vErrors.push(err58);}errors++;}}if(data.content !== undefined){let data21 = data.content;if(Array.isArray(data21)){const len3 = data21.length;for(let i3=0; i3<len3; i3++){if(!(validate23(data21[i3], {instancePath:instancePath+"/content/" + i3,parentData:data21,parentDataProperty:i3,rootData,dynamicAnchors}))){vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);errors = vErrors.length;}}}else {const err59 = {instancePath:instancePath+"/content",schemaPath:"#/oneOf/3/properties/content/type",keyword:"type",params:{type: "array"},message:"must be array"};if(vErrors === null){vErrors = [err59];}else {vErrors.push(err59);}errors++;}}if(data.items !== undefined){let data23 = data.items;if(data23 && typeof data23 == "object" && !Array.isArray(data23)){if(Object.keys(data23).length > 256){const err60 = {instancePath:instancePath+"/items",schemaPath:"#/oneOf/3/properties/items/maxProperties",keyword:"maxProperties",params:{limit: 256},message:"must NOT have more than 256 properties"};if(vErrors === null){vErrors = [err60];}else {vErrors.push(err60);}errors++;}if(Object.keys(data23).length < 1){const err61 = {instancePath:instancePath+"/items",schemaPath:"#/oneOf/3/properties/items/minProperties",keyword:"minProperties",params:{limit: 1},message:"must NOT have fewer than 1 properties"};if(vErrors === null){vErrors = [err61];}else {vErrors.push(err61);}errors++;}for(const key9 in data23){if(!(pattern5.test(key9))){const err62 = {instancePath:instancePath+"/items",schemaPath:"#/oneOf/3/properties/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key9},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err62];}else {vErrors.push(err62);}errors++;}}for(const key10 in data23){if(pattern5.test(key10)){let data24 = data23[key10];if(data24 && typeof data24 == "object" && !Array.isArray(data24)){if(data24.content === undefined){const err63 = {instancePath:instancePath+"/items/" + key10.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/oneOf/3/properties/items/patternProperties/%5E%5Ba-z%5D%5Ba-zA-Z0-9_-%5D%7B0%2C63%7D%24/required",keyword:"required",params:{missingProperty: "content"},message:"must have required property '"+"content"+"'"};if(vErrors === null){vErrors = [err63];}else {vErrors.push(err63);}errors++;}for(const key11 in data24){if(!(key11 === "content")){const err64 = {instancePath:instancePath+"/items/" + key10.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/oneOf/3/properties/items/patternProperties/%5E%5Ba-z%5D%5Ba-zA-Z0-9_-%5D%7B0%2C63%7D%24/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key11},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err64];}else {vErrors.push(err64);}errors++;}}if(data24.content !== undefined){let data25 = data24.content;if(Array.isArray(data25)){const len4 = data25.length;for(let i4=0; i4<len4; i4++){if(!(validate23(data25[i4], {instancePath:instancePath+"/items/" + key10.replace(/~/g, "~0").replace(/\//g, "~1")+"/content/" + i4,parentData:data25,parentDataProperty:i4,rootData,dynamicAnchors}))){vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);errors = vErrors.length;}}}else {const err65 = {instancePath:instancePath+"/items/" + key10.replace(/~/g, "~0").replace(/\//g, "~1")+"/content",schemaPath:"#/oneOf/3/properties/items/patternProperties/%5E%5Ba-z%5D%5Ba-zA-Z0-9_-%5D%7B0%2C63%7D%24/properties/content/type",keyword:"type",params:{type: "array"},message:"must be array"};if(vErrors === null){vErrors = [err65];}else {vErrors.push(err65);}errors++;}}}else {const err66 = {instancePath:instancePath+"/items/" + key10.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/oneOf/3/properties/items/patternProperties/%5E%5Ba-z%5D%5Ba-zA-Z0-9_-%5D%7B0%2C63%7D%24/type",keyword:"type",params:{type: "object"},message:"must be object"};if(vErrors === null){vErrors = [err66];}else {vErrors.push(err66);}errors++;}}}}else {const err67 = {instancePath:instancePath+"/items",schemaPath:"#/oneOf/3/properties/items/type",keyword:"type",params:{type: "object"},message:"must be object"};if(vErrors === null){vErrors = [err67];}else {vErrors.push(err67);}errors++;}}}else {const err68 = {instancePath,schemaPath:"#/oneOf/3/type",keyword:"type",params:{type: "object"},message:"must be object"};if(vErrors === null){vErrors = [err68];}else {vErrors.push(err68);}errors++;}var _valid0 = _errs56 === errors;if(_valid0 && valid0){valid0 = false;passing0 = [passing0, 3];}else {if(_valid0){valid0 = true;passing0 = 3;if(props2 !== true){props2 = true;}}const _errs72 = errors;if(data && typeof data == "object" && !Array.isArray(data)){if(data.kind === undefined){const err69 = {instancePath,schemaPath:"#/oneOf/4/required",keyword:"required",params:{missingProperty: "kind"},message:"must have required property '"+"kind"+"'"};if(vErrors === null){vErrors = [err69];}else {vErrors.push(err69);}errors++;}if(data.content === undefined){const err70 = {instancePath,schemaPath:"#/oneOf/4/required",keyword:"required",params:{missingProperty: "content"},message:"must have required property '"+"content"+"'"};if(vErrors === null){vErrors = [err70];}else {vErrors.push(err70);}errors++;}if(data.asset_id === undefined){const err71 = {instancePath,schemaPath:"#/oneOf/4/required",keyword:"required",params:{missingProperty: "asset_id"},message:"must have required property '"+"asset_id"+"'"};if(vErrors === null){vErrors = [err71];}else {vErrors.push(err71);}errors++;}if(data.capacity === undefined){const err72 = {instancePath,schemaPath:"#/oneOf/4/required",keyword:"required",params:{missingProperty: "capacity"},message:"must have required property '"+"capacity"+"'"};if(vErrors === null){vErrors = [err72];}else {vErrors.push(err72);}errors++;}for(const key12 in data){if(!((((key12 === "kind") || (key12 === "content")) || (key12 === "asset_id")) || (key12 === "capacity"))){const err73 = {instancePath,schemaPath:"#/oneOf/4/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key12},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err73];}else {vErrors.push(err73);}errors++;}}if(data.kind !== undefined){if("markers" !== data.kind){const err74 = {instancePath:instancePath+"/kind",schemaPath:"#/oneOf/4/properties/kind/const",keyword:"const",params:{allowedValue: "markers"},message:"must be equal to constant"};if(vErrors === null){vErrors = [err74];}else {vErrors.push(err74);}errors++;}}if(data.content !== undefined){let data28 = data.content;if(Array.isArray(data28)){const len5 = data28.length;for(let i5=0; i5<len5; i5++){if(!(validate23(data28[i5], {instancePath:instancePath+"/content/" + i5,parentData:data28,parentDataProperty:i5,rootData,dynamicAnchors}))){vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);errors = vErrors.length;}}}else {const err75 = {instancePath:instancePath+"/content",schemaPath:"#/oneOf/4/properties/content/type",keyword:"type",params:{type: "array"},message:"must be array"};if(vErrors === null){vErrors = [err75];}else {vErrors.push(err75);}errors++;}}if(data.asset_id !== undefined){let data30 = data.asset_id;if(typeof data30 === "string"){if(!pattern5.test(data30)){const err76 = {instancePath:instancePath+"/asset_id",schemaPath:"#/oneOf/4/properties/asset_id/pattern",keyword:"pattern",params:{pattern: "^[a-z][a-zA-Z0-9_-]{0,63}$"},message:"must match pattern \""+"^[a-z][a-zA-Z0-9_-]{0,63}$"+"\""};if(vErrors === null){vErrors = [err76];}else {vErrors.push(err76);}errors++;}}else {const err77 = {instancePath:instancePath+"/asset_id",schemaPath:"#/oneOf/4/properties/asset_id/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err77];}else {vErrors.push(err77);}errors++;}}if(data.capacity !== undefined){let data31 = data.capacity;const _errs82 = errors;let valid26 = false;const _errs83 = errors;if(!((typeof data31 == "number") && (!(data31 % 1) && !isNaN(data31)))){const err78 = {instancePath:instancePath+"/capacity",schemaPath:"#/oneOf/4/properties/capacity/anyOf/0/type",keyword:"type",params:{type: "integer"},message:"must be integer"};if(vErrors === null){vErrors = [err78];}else {vErrors.push(err78);}errors++;}if(typeof data31 == "number"){if(data31 < 1 || isNaN(data31)){const err79 = {instancePath:instancePath+"/capacity",schemaPath:"#/oneOf/4/properties/capacity/anyOf/0/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"};if(vErrors === null){vErrors = [err79];}else {vErrors.push(err79);}errors++;}}var _valid3 = _errs83 === errors;valid26 = valid26 || _valid3;const _errs85 = errors;if(data31 !== null){const err80 = {instancePath:instancePath+"/capacity",schemaPath:"#/oneOf/4/properties/capacity/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};if(vErrors === null){vErrors = [err80];}else {vErrors.push(err80);}errors++;}var _valid3 = _errs85 === errors;valid26 = valid26 || _valid3;if(!valid26){const err81 = {instancePath:instancePath+"/capacity",schemaPath:"#/oneOf/4/properties/capacity/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};if(vErrors === null){vErrors = [err81];}else {vErrors.push(err81);}errors++;}else {errors = _errs82;if(vErrors !== null){if(_errs82){vErrors.length = _errs82;}else {vErrors = null;}}}}}else {const err82 = {instancePath,schemaPath:"#/oneOf/4/type",keyword:"type",params:{type: "object"},message:"must be object"};if(vErrors === null){vErrors = [err82];}else {vErrors.push(err82);}errors++;}var _valid0 = _errs72 === errors;if(_valid0 && valid0){valid0 = false;passing0 = [passing0, 4];}else {if(_valid0){valid0 = true;passing0 = 4;if(props2 !== true){props2 = true;}}}}}}if(!valid0){const err83 = {instancePath,schemaPath:"#/oneOf",keyword:"oneOf",params:{passingSchemas: passing0},message:"must match exactly one schema in oneOf"};if(vErrors === null){vErrors = [err83];}else {vErrors.push(err83);}errors++;}else {errors = _errs0;if(vErrors !== null){if(_errs0){vErrors.length = _errs0;}else {vErrors = null;}}}validate25.errors = vErrors;evaluated0.props = props2;return errors === 0;}validate25.evaluated = {"dynamicProps":true,"dynamicItems":false};const pattern22 = new RegExp("^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$", "u");function validate22(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){let vErrors = null;let errors = 0;const evaluated0 = validate22.evaluated;if(evaluated0.dynamicProps){evaluated0.props = undefined;}if(evaluated0.dynamicItems){evaluated0.items = undefined;}if(data && typeof data == "object" && !Array.isArray(data)){if(data.qtype === undefined){const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "qtype"},message:"must have required property '"+"qtype"+"'"};if(vErrors === null){vErrors = [err0];}else {vErrors.push(err0);}errors++;}if(data.content === undefined){const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "content"},message:"must have required property '"+"content"+"'"};if(vErrors === null){vErrors = [err1];}else {vErrors.push(err1);}errors++;}if(data.fields === undefined){const err2 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "fields"},message:"must have required property '"+"fields"+"'"};if(vErrors === null){vErrors = [err2];}else {vErrors.push(err2);}errors++;}if(data.assets === undefined){const err3 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "assets"},message:"must have required property '"+"assets"+"'"};if(vErrors === null){vErrors = [err3];}else {vErrors.push(err3);}errors++;}for(const key0 in data){if(!((((key0 === "qtype") || (key0 === "content")) || (key0 === "fields")) || (key0 === "assets"))){const err4 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err4];}else {vErrors.push(err4);}errors++;}}if(data.qtype !== undefined){let data0 = data.qtype;if(typeof data0 !== "string"){const err5 = {instancePath:instancePath+"/qtype",schemaPath:"#/$defs/QuestionType/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err5];}else {vErrors.push(err5);}errors++;}if(!((((((((((((((((data0 === "multichoice") || (data0 === "truefalse")) || (data0 === "shortanswer")) || (data0 === "numerical")) || (data0 === "calculated")) || (data0 === "calculatedsimple")) || (data0 === "calculatedmulti")) || (data0 === "match")) || (data0 === "randomsamatch")) || (data0 === "multianswer")) || (data0 === "gapselect")) || (data0 === "ddwtos")) || (data0 === "ddimageortext")) || (data0 === "ddmarker")) || (data0 === "ordering")) || (data0 === "essay"))){const err6 = {instancePath:instancePath+"/qtype",schemaPath:"#/$defs/QuestionType/enum",keyword:"enum",params:{allowedValues: schema34.enum},message:"must be equal to one of the allowed values"};if(vErrors === null){vErrors = [err6];}else {vErrors.push(err6);}errors++;}}if(data.content !== undefined){let data1 = data.content;if(Array.isArray(data1)){const len0 = data1.length;for(let i0=0; i0<len0; i0++){if(!(validate23(data1[i0], {instancePath:instancePath+"/content/" + i0,parentData:data1,parentDataProperty:i0,rootData,dynamicAnchors}))){vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);errors = vErrors.length;}}}else {const err7 = {instancePath:instancePath+"/content",schemaPath:"#/properties/content/type",keyword:"type",params:{type: "array"},message:"must be array"};if(vErrors === null){vErrors = [err7];}else {vErrors.push(err7);}errors++;}}if(data.fields !== undefined){let data3 = data.fields;if(data3 && typeof data3 == "object" && !Array.isArray(data3)){if(Object.keys(data3).length > 256){const err8 = {instancePath:instancePath+"/fields",schemaPath:"#/properties/fields/maxProperties",keyword:"maxProperties",params:{limit: 256},message:"must NOT have more than 256 properties"};if(vErrors === null){vErrors = [err8];}else {vErrors.push(err8);}errors++;}if(Object.keys(data3).length < 1){const err9 = {instancePath:instancePath+"/fields",schemaPath:"#/properties/fields/minProperties",keyword:"minProperties",params:{limit: 1},message:"must NOT have fewer than 1 properties"};if(vErrors === null){vErrors = [err9];}else {vErrors.push(err9);}errors++;}for(const key1 in data3){if(!(pattern5.test(key1))){const err10 = {instancePath:instancePath+"/fields",schemaPath:"#/properties/fields/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err10];}else {vErrors.push(err10);}errors++;}}for(const key2 in data3){if(pattern5.test(key2)){if(!(validate25(data3[key2], {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1"),parentData:data3,parentDataProperty:key2,rootData,dynamicAnchors}))){vErrors = vErrors === null ? validate25.errors : vErrors.concat(validate25.errors);errors = vErrors.length;}}}}else {const err11 = {instancePath:instancePath+"/fields",schemaPath:"#/properties/fields/type",keyword:"type",params:{type: "object"},message:"must be object"};if(vErrors === null){vErrors = [err11];}else {vErrors.push(err11);}errors++;}}if(data.assets !== undefined){let data5 = data.assets;if(data5 && typeof data5 == "object" && !Array.isArray(data5)){if(Object.keys(data5).length > 64){const err12 = {instancePath:instancePath+"/assets",schemaPath:"#/properties/assets/maxProperties",keyword:"maxProperties",params:{limit: 64},message:"must NOT have more than 64 properties"};if(vErrors === null){vErrors = [err12];}else {vErrors.push(err12);}errors++;}for(const key3 in data5){if(!(pattern5.test(key3))){const err13 = {instancePath:instancePath+"/assets",schemaPath:"#/properties/assets/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key3},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err13];}else {vErrors.push(err13);}errors++;}}for(const key4 in data5){if(pattern5.test(key4)){let data6 = data5[key4];if(data6 && typeof data6 == "object" && !Array.isArray(data6)){if(data6.mime_type === undefined){const err14 = {instancePath:instancePath+"/assets/" + key4.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/$defs/ImageAsset/required",keyword:"required",params:{missingProperty: "mime_type"},message:"must have required property '"+"mime_type"+"'"};if(vErrors === null){vErrors = [err14];}else {vErrors.push(err14);}errors++;}if(data6.data === undefined){const err15 = {instancePath:instancePath+"/assets/" + key4.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/$defs/ImageAsset/required",keyword:"required",params:{missingProperty: "data"},message:"must have required property '"+"data"+"'"};if(vErrors === null){vErrors = [err15];}else {vErrors.push(err15);}errors++;}if(data6.width === undefined){const err16 = {instancePath:instancePath+"/assets/" + key4.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/$defs/ImageAsset/required",keyword:"required",params:{missingProperty: "width"},message:"must have required property '"+"width"+"'"};if(vErrors === null){vErrors = [err16];}else {vErrors.push(err16);}errors++;}if(data6.height === undefined){const err17 = {instancePath:instancePath+"/assets/" + key4.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/$defs/ImageAsset/required",keyword:"required",params:{missingProperty: "height"},message:"must have required property '"+"height"+"'"};if(vErrors === null){vErrors = [err17];}else {vErrors.push(err17);}errors++;}for(const key5 in data6){if(!((((key5 === "mime_type") || (key5 === "data")) || (key5 === "width")) || (key5 === "height"))){const err18 = {instancePath:instancePath+"/assets/" + key4.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/$defs/ImageAsset/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key5},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err18];}else {vErrors.push(err18);}errors++;}}if(data6.mime_type !== undefined){let data7 = data6.mime_type;if(typeof data7 !== "string"){const err19 = {instancePath:instancePath+"/assets/" + key4.replace(/~/g, "~0").replace(/\//g, "~1")+"/mime_type",schemaPath:"#/$defs/ImageAsset/properties/mime_type/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err19];}else {vErrors.push(err19);}errors++;}if(!((data7 === "image/png") || (data7 === "image/jpeg"))){const err20 = {instancePath:instancePath+"/assets/" + key4.replace(/~/g, "~0").replace(/\//g, "~1")+"/mime_type",schemaPath:"#/$defs/ImageAsset/properties/mime_type/enum",keyword:"enum",params:{allowedValues: schema39.properties.mime_type.enum},message:"must be equal to one of the allowed values"};if(vErrors === null){vErrors = [err20];}else {vErrors.push(err20);}errors++;}}if(data6.data !== undefined){let data8 = data6.data;if(typeof data8 === "string"){if(func1(data8) > 6990508){const err21 = {instancePath:instancePath+"/assets/" + key4.replace(/~/g, "~0").replace(/\//g, "~1")+"/data",schemaPath:"#/$defs/ImageAsset/properties/data/maxLength",keyword:"maxLength",params:{limit: 6990508},message:"must NOT have more than 6990508 characters"};if(vErrors === null){vErrors = [err21];}else {vErrors.push(err21);}errors++;}if(func1(data8) < 1){const err22 = {instancePath:instancePath+"/assets/" + key4.replace(/~/g, "~0").replace(/\//g, "~1")+"/data",schemaPath:"#/$defs/ImageAsset/properties/data/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};if(vErrors === null){vErrors = [err22];}else {vErrors.push(err22);}errors++;}if(!pattern22.test(data8)){const err23 = {instancePath:instancePath+"/assets/" + key4.replace(/~/g, "~0").replace(/\//g, "~1")+"/data",schemaPath:"#/$defs/ImageAsset/properties/data/pattern",keyword:"pattern",params:{pattern: "^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$"},message:"must match pattern \""+"^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$"+"\""};if(vErrors === null){vErrors = [err23];}else {vErrors.push(err23);}errors++;}}else {const err24 = {instancePath:instancePath+"/assets/" + key4.replace(/~/g, "~0").replace(/\//g, "~1")+"/data",schemaPath:"#/$defs/ImageAsset/properties/data/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err24];}else {vErrors.push(err24);}errors++;}}if(data6.width !== undefined){let data9 = data6.width;if(!((typeof data9 == "number") && (!(data9 % 1) && !isNaN(data9)))){const err25 = {instancePath:instancePath+"/assets/" + key4.replace(/~/g, "~0").replace(/\//g, "~1")+"/width",schemaPath:"#/$defs/ImageAsset/properties/width/type",keyword:"type",params:{type: "integer"},message:"must be integer"};if(vErrors === null){vErrors = [err25];}else {vErrors.push(err25);}errors++;}if(typeof data9 == "number"){if(data9 < 1 || isNaN(data9)){const err26 = {instancePath:instancePath+"/assets/" + key4.replace(/~/g, "~0").replace(/\//g, "~1")+"/width",schemaPath:"#/$defs/ImageAsset/properties/width/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"};if(vErrors === null){vErrors = [err26];}else {vErrors.push(err26);}errors++;}}}if(data6.height !== undefined){let data10 = data6.height;if(!((typeof data10 == "number") && (!(data10 % 1) && !isNaN(data10)))){const err27 = {instancePath:instancePath+"/assets/" + key4.replace(/~/g, "~0").replace(/\//g, "~1")+"/height",schemaPath:"#/$defs/ImageAsset/properties/height/type",keyword:"type",params:{type: "integer"},message:"must be integer"};if(vErrors === null){vErrors = [err27];}else {vErrors.push(err27);}errors++;}if(typeof data10 == "number"){if(data10 < 1 || isNaN(data10)){const err28 = {instancePath:instancePath+"/assets/" + key4.replace(/~/g, "~0").replace(/\//g, "~1")+"/height",schemaPath:"#/$defs/ImageAsset/properties/height/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"};if(vErrors === null){vErrors = [err28];}else {vErrors.push(err28);}errors++;}}}}else {const err29 = {instancePath:instancePath+"/assets/" + key4.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/$defs/ImageAsset/type",keyword:"type",params:{type: "object"},message:"must be object"};if(vErrors === null){vErrors = [err29];}else {vErrors.push(err29);}errors++;}}}}else {const err30 = {instancePath:instancePath+"/assets",schemaPath:"#/properties/assets/type",keyword:"type",params:{type: "object"},message:"must be object"};if(vErrors === null){vErrors = [err30];}else {vErrors.push(err30);}errors++;}}}else {const err31 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};if(vErrors === null){vErrors = [err31];}else {vErrors.push(err31);}errors++;}validate22.errors = vErrors;return errors === 0;}validate22.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};function validate21(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){let vErrors = null;let errors = 0;const evaluated0 = validate21.evaluated;if(evaluated0.dynamicProps){evaluated0.props = undefined;}if(evaluated0.dynamicItems){evaluated0.items = undefined;}if(data && typeof data == "object" && !Array.isArray(data)){if(data.schema_version === undefined){const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "schema_version"},message:"must have required property '"+"schema_version"+"'"};if(vErrors === null){vErrors = [err0];}else {vErrors.push(err0);}errors++;}if(data.request_id === undefined){const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "request_id"},message:"must have required property '"+"request_id"+"'"};if(vErrors === null){vErrors = [err1];}else {vErrors.push(err1);}errors++;}if(data.snapshot_id === undefined){const err2 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "snapshot_id"},message:"must have required property '"+"snapshot_id"+"'"};if(vErrors === null){vErrors = [err2];}else {vErrors.push(err2);}errors++;}if(data.model === undefined){const err3 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "model"},message:"must have required property '"+"model"+"'"};if(vErrors === null){vErrors = [err3];}else {vErrors.push(err3);}errors++;}if(data.reasoning === undefined){const err4 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "reasoning"},message:"must have required property '"+"reasoning"+"'"};if(vErrors === null){vErrors = [err4];}else {vErrors.push(err4);}errors++;}if(data.context === undefined){const err5 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "context"},message:"must have required property '"+"context"+"'"};if(vErrors === null){vErrors = [err5];}else {vErrors.push(err5);}errors++;}if(data.question === undefined){const err6 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "question"},message:"must have required property '"+"question"+"'"};if(vErrors === null){vErrors = [err6];}else {vErrors.push(err6);}errors++;}for(const key0 in data){if(!(((((((key0 === "schema_version") || (key0 === "request_id")) || (key0 === "snapshot_id")) || (key0 === "model")) || (key0 === "reasoning")) || (key0 === "context")) || (key0 === "question"))){const err7 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err7];}else {vErrors.push(err7);}errors++;}}if(data.schema_version !== undefined){if("2.0" !== data.schema_version){const err8 = {instancePath:instancePath+"/schema_version",schemaPath:"#/properties/schema_version/const",keyword:"const",params:{allowedValue: "2.0"},message:"must be equal to constant"};if(vErrors === null){vErrors = [err8];}else {vErrors.push(err8);}errors++;}}if(data.request_id !== undefined){let data1 = data.request_id;if(typeof data1 === "string"){if(!pattern4.test(data1)){const err9 = {instancePath:instancePath+"/request_id",schemaPath:"#/properties/request_id/pattern",keyword:"pattern",params:{pattern: "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"},message:"must match pattern \""+"^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"+"\""};if(vErrors === null){vErrors = [err9];}else {vErrors.push(err9);}errors++;}if(!(formats0.test(data1))){const err10 = {instancePath:instancePath+"/request_id",schemaPath:"#/properties/request_id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};if(vErrors === null){vErrors = [err10];}else {vErrors.push(err10);}errors++;}}else {const err11 = {instancePath:instancePath+"/request_id",schemaPath:"#/properties/request_id/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err11];}else {vErrors.push(err11);}errors++;}}if(data.snapshot_id !== undefined){let data2 = data.snapshot_id;if(typeof data2 === "string"){if(!pattern5.test(data2)){const err12 = {instancePath:instancePath+"/snapshot_id",schemaPath:"#/properties/snapshot_id/pattern",keyword:"pattern",params:{pattern: "^[a-z][a-zA-Z0-9_-]{0,63}$"},message:"must match pattern \""+"^[a-z][a-zA-Z0-9_-]{0,63}$"+"\""};if(vErrors === null){vErrors = [err12];}else {vErrors.push(err12);}errors++;}}else {const err13 = {instancePath:instancePath+"/snapshot_id",schemaPath:"#/properties/snapshot_id/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err13];}else {vErrors.push(err13);}errors++;}}if(data.model !== undefined){let data3 = data.model;if(typeof data3 === "string"){if(func1(data3) > 255){const err14 = {instancePath:instancePath+"/model",schemaPath:"#/properties/model/maxLength",keyword:"maxLength",params:{limit: 255},message:"must NOT have more than 255 characters"};if(vErrors === null){vErrors = [err14];}else {vErrors.push(err14);}errors++;}if(func1(data3) < 1){const err15 = {instancePath:instancePath+"/model",schemaPath:"#/properties/model/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};if(vErrors === null){vErrors = [err15];}else {vErrors.push(err15);}errors++;}}else {const err16 = {instancePath:instancePath+"/model",schemaPath:"#/properties/model/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err16];}else {vErrors.push(err16);}errors++;}}if(data.reasoning !== undefined){let data4 = data.reasoning;if(typeof data4 === "string"){if(func1(data4) > 32){const err17 = {instancePath:instancePath+"/reasoning",schemaPath:"#/properties/reasoning/maxLength",keyword:"maxLength",params:{limit: 32},message:"must NOT have more than 32 characters"};if(vErrors === null){vErrors = [err17];}else {vErrors.push(err17);}errors++;}if(func1(data4) < 1){const err18 = {instancePath:instancePath+"/reasoning",schemaPath:"#/properties/reasoning/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};if(vErrors === null){vErrors = [err18];}else {vErrors.push(err18);}errors++;}}else {const err19 = {instancePath:instancePath+"/reasoning",schemaPath:"#/properties/reasoning/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err19];}else {vErrors.push(err19);}errors++;}}if(data.context !== undefined){let data5 = data.context;if(typeof data5 === "string"){if(func1(data5) > 75000){const err20 = {instancePath:instancePath+"/context",schemaPath:"#/properties/context/maxLength",keyword:"maxLength",params:{limit: 75000},message:"must NOT have more than 75000 characters"};if(vErrors === null){vErrors = [err20];}else {vErrors.push(err20);}errors++;}}else {const err21 = {instancePath:instancePath+"/context",schemaPath:"#/properties/context/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err21];}else {vErrors.push(err21);}errors++;}}if(data.question !== undefined){if(!(validate22(data.question, {instancePath:instancePath+"/question",parentData:data,parentDataProperty:"question",rootData,dynamicAnchors}))){vErrors = vErrors === null ? validate22.errors : vErrors.concat(validate22.errors);errors = vErrors.length;}}}else {const err22 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};if(vErrors === null){vErrors = [err22];}else {vErrors.push(err22);}errors++;}validate21.errors = vErrors;return errors === 0;}validate21.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};const validateAnswerSuccess = validate38;const schema43 = {"oneOf":[{"type":"object","properties":{"kind":{"const":"single_choice"},"option_id":{"type":"string","pattern":"^[a-z][a-zA-Z0-9_-]{0,63}$"}},"required":["kind","option_id"],"additionalProperties":false},{"type":"object","properties":{"kind":{"const":"multiple_choice"},"option_ids":{"type":"array","items":{"type":"string","pattern":"^[a-z][a-zA-Z0-9_-]{0,63}$"},"uniqueItems":true}},"required":["kind","option_ids"],"additionalProperties":false},{"type":"object","properties":{"kind":{"type":"string","enum":["text","essay"]},"value":{"type":"string"}},"required":["kind","value"],"additionalProperties":false},{"type":"object","properties":{"kind":{"const":"numeric"},"value":{"type":"string"},"unit_option_id":{"anyOf":[{"type":"string","pattern":"^[a-z][a-zA-Z0-9_-]{0,63}$"},{"type":"null"}]}},"required":["kind","value","unit_option_id"],"additionalProperties":false},{"type":"object","properties":{"kind":{"const":"ordering"},"item_ids":{"type":"array","items":{"type":"string","pattern":"^[a-z][a-zA-Z0-9_-]{0,63}$"},"minItems":1,"uniqueItems":true}},"required":["kind","item_ids"],"additionalProperties":false},{"type":"object","properties":{"kind":{"const":"markers"},"points":{"type":"array","items":{"type":"object","properties":{"x":{"type":"integer","minimum":0},"y":{"type":"integer","minimum":0}},"required":["x","y"],"additionalProperties":false}}},"required":["kind","points"],"additionalProperties":false}]};function validate39(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){let vErrors = null;let errors = 0;const evaluated0 = validate39.evaluated;if(evaluated0.dynamicProps){evaluated0.props = undefined;}if(evaluated0.dynamicItems){evaluated0.items = undefined;}if(data && typeof data == "object" && !Array.isArray(data)){if(data.fields === undefined){const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "fields"},message:"must have required property '"+"fields"+"'"};if(vErrors === null){vErrors = [err0];}else {vErrors.push(err0);}errors++;}for(const key0 in data){if(!(key0 === "fields")){const err1 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err1];}else {vErrors.push(err1);}errors++;}}if(data.fields !== undefined){let data0 = data.fields;if(data0 && typeof data0 == "object" && !Array.isArray(data0)){if(Object.keys(data0).length > 256){const err2 = {instancePath:instancePath+"/fields",schemaPath:"#/properties/fields/maxProperties",keyword:"maxProperties",params:{limit: 256},message:"must NOT have more than 256 properties"};if(vErrors === null){vErrors = [err2];}else {vErrors.push(err2);}errors++;}if(Object.keys(data0).length < 1){const err3 = {instancePath:instancePath+"/fields",schemaPath:"#/properties/fields/minProperties",keyword:"minProperties",params:{limit: 1},message:"must NOT have fewer than 1 properties"};if(vErrors === null){vErrors = [err3];}else {vErrors.push(err3);}errors++;}for(const key1 in data0){if(!(pattern5.test(key1))){const err4 = {instancePath:instancePath+"/fields",schemaPath:"#/properties/fields/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err4];}else {vErrors.push(err4);}errors++;}}for(const key2 in data0){if(pattern5.test(key2)){let data1 = data0[key2];const _errs7 = errors;let valid3 = false;let passing0 = null;const _errs8 = errors;if(data1 && typeof data1 == "object" && !Array.isArray(data1)){if(data1.kind === undefined){const err5 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/$defs/FieldAnswer/oneOf/0/required",keyword:"required",params:{missingProperty: "kind"},message:"must have required property '"+"kind"+"'"};if(vErrors === null){vErrors = [err5];}else {vErrors.push(err5);}errors++;}if(data1.option_id === undefined){const err6 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/$defs/FieldAnswer/oneOf/0/required",keyword:"required",params:{missingProperty: "option_id"},message:"must have required property '"+"option_id"+"'"};if(vErrors === null){vErrors = [err6];}else {vErrors.push(err6);}errors++;}for(const key3 in data1){if(!((key3 === "kind") || (key3 === "option_id"))){const err7 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/$defs/FieldAnswer/oneOf/0/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key3},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err7];}else {vErrors.push(err7);}errors++;}}if(data1.kind !== undefined){if("single_choice" !== data1.kind){const err8 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1")+"/kind",schemaPath:"#/$defs/FieldAnswer/oneOf/0/properties/kind/const",keyword:"const",params:{allowedValue: "single_choice"},message:"must be equal to constant"};if(vErrors === null){vErrors = [err8];}else {vErrors.push(err8);}errors++;}}if(data1.option_id !== undefined){let data3 = data1.option_id;if(typeof data3 === "string"){if(!pattern5.test(data3)){const err9 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1")+"/option_id",schemaPath:"#/$defs/FieldAnswer/oneOf/0/properties/option_id/pattern",keyword:"pattern",params:{pattern: "^[a-z][a-zA-Z0-9_-]{0,63}$"},message:"must match pattern \""+"^[a-z][a-zA-Z0-9_-]{0,63}$"+"\""};if(vErrors === null){vErrors = [err9];}else {vErrors.push(err9);}errors++;}}else {const err10 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1")+"/option_id",schemaPath:"#/$defs/FieldAnswer/oneOf/0/properties/option_id/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err10];}else {vErrors.push(err10);}errors++;}}}else {const err11 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/$defs/FieldAnswer/oneOf/0/type",keyword:"type",params:{type: "object"},message:"must be object"};if(vErrors === null){vErrors = [err11];}else {vErrors.push(err11);}errors++;}var _valid0 = _errs8 === errors;if(_valid0){valid3 = true;passing0 = 0;}const _errs14 = errors;if(data1 && typeof data1 == "object" && !Array.isArray(data1)){if(data1.kind === undefined){const err12 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/$defs/FieldAnswer/oneOf/1/required",keyword:"required",params:{missingProperty: "kind"},message:"must have required property '"+"kind"+"'"};if(vErrors === null){vErrors = [err12];}else {vErrors.push(err12);}errors++;}if(data1.option_ids === undefined){const err13 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/$defs/FieldAnswer/oneOf/1/required",keyword:"required",params:{missingProperty: "option_ids"},message:"must have required property '"+"option_ids"+"'"};if(vErrors === null){vErrors = [err13];}else {vErrors.push(err13);}errors++;}for(const key4 in data1){if(!((key4 === "kind") || (key4 === "option_ids"))){const err14 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/$defs/FieldAnswer/oneOf/1/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key4},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err14];}else {vErrors.push(err14);}errors++;}}if(data1.kind !== undefined){if("multiple_choice" !== data1.kind){const err15 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1")+"/kind",schemaPath:"#/$defs/FieldAnswer/oneOf/1/properties/kind/const",keyword:"const",params:{allowedValue: "multiple_choice"},message:"must be equal to constant"};if(vErrors === null){vErrors = [err15];}else {vErrors.push(err15);}errors++;}}if(data1.option_ids !== undefined){let data5 = data1.option_ids;if(Array.isArray(data5)){const len0 = data5.length;for(let i0=0; i0<len0; i0++){let data6 = data5[i0];if(typeof data6 === "string"){if(!pattern5.test(data6)){const err16 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1")+"/option_ids/" + i0,schemaPath:"#/$defs/FieldAnswer/oneOf/1/properties/option_ids/items/pattern",keyword:"pattern",params:{pattern: "^[a-z][a-zA-Z0-9_-]{0,63}$"},message:"must match pattern \""+"^[a-z][a-zA-Z0-9_-]{0,63}$"+"\""};if(vErrors === null){vErrors = [err16];}else {vErrors.push(err16);}errors++;}}else {const err17 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1")+"/option_ids/" + i0,schemaPath:"#/$defs/FieldAnswer/oneOf/1/properties/option_ids/items/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err17];}else {vErrors.push(err17);}errors++;}}let i1 = data5.length;let j0;if(i1 > 1){const indices0 = {};for(;i1--;){let item0 = data5[i1];if(typeof item0 !== "string"){continue;}if(typeof indices0[item0] == "number"){j0 = indices0[item0];const err18 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1")+"/option_ids",schemaPath:"#/$defs/FieldAnswer/oneOf/1/properties/option_ids/uniqueItems",keyword:"uniqueItems",params:{i: i1, j: j0},message:"must NOT have duplicate items (items ## "+j0+" and "+i1+" are identical)"};if(vErrors === null){vErrors = [err18];}else {vErrors.push(err18);}errors++;break;}indices0[item0] = i1;}}}else {const err19 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1")+"/option_ids",schemaPath:"#/$defs/FieldAnswer/oneOf/1/properties/option_ids/type",keyword:"type",params:{type: "array"},message:"must be array"};if(vErrors === null){vErrors = [err19];}else {vErrors.push(err19);}errors++;}}}else {const err20 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/$defs/FieldAnswer/oneOf/1/type",keyword:"type",params:{type: "object"},message:"must be object"};if(vErrors === null){vErrors = [err20];}else {vErrors.push(err20);}errors++;}var _valid0 = _errs14 === errors;if(_valid0 && valid3){valid3 = false;passing0 = [passing0, 1];}else {if(_valid0){valid3 = true;passing0 = 1;}const _errs22 = errors;if(data1 && typeof data1 == "object" && !Array.isArray(data1)){if(data1.kind === undefined){const err21 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/$defs/FieldAnswer/oneOf/2/required",keyword:"required",params:{missingProperty: "kind"},message:"must have required property '"+"kind"+"'"};if(vErrors === null){vErrors = [err21];}else {vErrors.push(err21);}errors++;}if(data1.value === undefined){const err22 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/$defs/FieldAnswer/oneOf/2/required",keyword:"required",params:{missingProperty: "value"},message:"must have required property '"+"value"+"'"};if(vErrors === null){vErrors = [err22];}else {vErrors.push(err22);}errors++;}for(const key5 in data1){if(!((key5 === "kind") || (key5 === "value"))){const err23 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/$defs/FieldAnswer/oneOf/2/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key5},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err23];}else {vErrors.push(err23);}errors++;}}if(data1.kind !== undefined){let data7 = data1.kind;if(typeof data7 !== "string"){const err24 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1")+"/kind",schemaPath:"#/$defs/FieldAnswer/oneOf/2/properties/kind/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err24];}else {vErrors.push(err24);}errors++;}if(!((data7 === "text") || (data7 === "essay"))){const err25 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1")+"/kind",schemaPath:"#/$defs/FieldAnswer/oneOf/2/properties/kind/enum",keyword:"enum",params:{allowedValues: schema43.oneOf[2].properties.kind.enum},message:"must be equal to one of the allowed values"};if(vErrors === null){vErrors = [err25];}else {vErrors.push(err25);}errors++;}}if(data1.value !== undefined){if(typeof data1.value !== "string"){const err26 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1")+"/value",schemaPath:"#/$defs/FieldAnswer/oneOf/2/properties/value/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err26];}else {vErrors.push(err26);}errors++;}}}else {const err27 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/$defs/FieldAnswer/oneOf/2/type",keyword:"type",params:{type: "object"},message:"must be object"};if(vErrors === null){vErrors = [err27];}else {vErrors.push(err27);}errors++;}var _valid0 = _errs22 === errors;if(_valid0 && valid3){valid3 = false;passing0 = [passing0, 2];}else {if(_valid0){valid3 = true;passing0 = 2;}const _errs29 = errors;if(data1 && typeof data1 == "object" && !Array.isArray(data1)){if(data1.kind === undefined){const err28 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/$defs/FieldAnswer/oneOf/3/required",keyword:"required",params:{missingProperty: "kind"},message:"must have required property '"+"kind"+"'"};if(vErrors === null){vErrors = [err28];}else {vErrors.push(err28);}errors++;}if(data1.value === undefined){const err29 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/$defs/FieldAnswer/oneOf/3/required",keyword:"required",params:{missingProperty: "value"},message:"must have required property '"+"value"+"'"};if(vErrors === null){vErrors = [err29];}else {vErrors.push(err29);}errors++;}if(data1.unit_option_id === undefined){const err30 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/$defs/FieldAnswer/oneOf/3/required",keyword:"required",params:{missingProperty: "unit_option_id"},message:"must have required property '"+"unit_option_id"+"'"};if(vErrors === null){vErrors = [err30];}else {vErrors.push(err30);}errors++;}for(const key6 in data1){if(!(((key6 === "kind") || (key6 === "value")) || (key6 === "unit_option_id"))){const err31 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/$defs/FieldAnswer/oneOf/3/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key6},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err31];}else {vErrors.push(err31);}errors++;}}if(data1.kind !== undefined){if("numeric" !== data1.kind){const err32 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1")+"/kind",schemaPath:"#/$defs/FieldAnswer/oneOf/3/properties/kind/const",keyword:"const",params:{allowedValue: "numeric"},message:"must be equal to constant"};if(vErrors === null){vErrors = [err32];}else {vErrors.push(err32);}errors++;}}if(data1.value !== undefined){if(typeof data1.value !== "string"){const err33 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1")+"/value",schemaPath:"#/$defs/FieldAnswer/oneOf/3/properties/value/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err33];}else {vErrors.push(err33);}errors++;}}if(data1.unit_option_id !== undefined){let data11 = data1.unit_option_id;const _errs36 = errors;let valid11 = false;const _errs37 = errors;if(typeof data11 === "string"){if(!pattern5.test(data11)){const err34 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1")+"/unit_option_id",schemaPath:"#/$defs/FieldAnswer/oneOf/3/properties/unit_option_id/anyOf/0/pattern",keyword:"pattern",params:{pattern: "^[a-z][a-zA-Z0-9_-]{0,63}$"},message:"must match pattern \""+"^[a-z][a-zA-Z0-9_-]{0,63}$"+"\""};if(vErrors === null){vErrors = [err34];}else {vErrors.push(err34);}errors++;}}else {const err35 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1")+"/unit_option_id",schemaPath:"#/$defs/FieldAnswer/oneOf/3/properties/unit_option_id/anyOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err35];}else {vErrors.push(err35);}errors++;}var _valid1 = _errs37 === errors;valid11 = valid11 || _valid1;const _errs39 = errors;if(data11 !== null){const err36 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1")+"/unit_option_id",schemaPath:"#/$defs/FieldAnswer/oneOf/3/properties/unit_option_id/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};if(vErrors === null){vErrors = [err36];}else {vErrors.push(err36);}errors++;}var _valid1 = _errs39 === errors;valid11 = valid11 || _valid1;if(!valid11){const err37 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1")+"/unit_option_id",schemaPath:"#/$defs/FieldAnswer/oneOf/3/properties/unit_option_id/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};if(vErrors === null){vErrors = [err37];}else {vErrors.push(err37);}errors++;}else {errors = _errs36;if(vErrors !== null){if(_errs36){vErrors.length = _errs36;}else {vErrors = null;}}}}}else {const err38 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/$defs/FieldAnswer/oneOf/3/type",keyword:"type",params:{type: "object"},message:"must be object"};if(vErrors === null){vErrors = [err38];}else {vErrors.push(err38);}errors++;}var _valid0 = _errs29 === errors;if(_valid0 && valid3){valid3 = false;passing0 = [passing0, 3];}else {if(_valid0){valid3 = true;passing0 = 3;}const _errs41 = errors;if(data1 && typeof data1 == "object" && !Array.isArray(data1)){if(data1.kind === undefined){const err39 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/$defs/FieldAnswer/oneOf/4/required",keyword:"required",params:{missingProperty: "kind"},message:"must have required property '"+"kind"+"'"};if(vErrors === null){vErrors = [err39];}else {vErrors.push(err39);}errors++;}if(data1.item_ids === undefined){const err40 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/$defs/FieldAnswer/oneOf/4/required",keyword:"required",params:{missingProperty: "item_ids"},message:"must have required property '"+"item_ids"+"'"};if(vErrors === null){vErrors = [err40];}else {vErrors.push(err40);}errors++;}for(const key7 in data1){if(!((key7 === "kind") || (key7 === "item_ids"))){const err41 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/$defs/FieldAnswer/oneOf/4/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key7},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err41];}else {vErrors.push(err41);}errors++;}}if(data1.kind !== undefined){if("ordering" !== data1.kind){const err42 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1")+"/kind",schemaPath:"#/$defs/FieldAnswer/oneOf/4/properties/kind/const",keyword:"const",params:{allowedValue: "ordering"},message:"must be equal to constant"};if(vErrors === null){vErrors = [err42];}else {vErrors.push(err42);}errors++;}}if(data1.item_ids !== undefined){let data13 = data1.item_ids;if(Array.isArray(data13)){if(data13.length < 1){const err43 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1")+"/item_ids",schemaPath:"#/$defs/FieldAnswer/oneOf/4/properties/item_ids/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};if(vErrors === null){vErrors = [err43];}else {vErrors.push(err43);}errors++;}const len1 = data13.length;for(let i2=0; i2<len1; i2++){let data14 = data13[i2];if(typeof data14 === "string"){if(!pattern5.test(data14)){const err44 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1")+"/item_ids/" + i2,schemaPath:"#/$defs/FieldAnswer/oneOf/4/properties/item_ids/items/pattern",keyword:"pattern",params:{pattern: "^[a-z][a-zA-Z0-9_-]{0,63}$"},message:"must match pattern \""+"^[a-z][a-zA-Z0-9_-]{0,63}$"+"\""};if(vErrors === null){vErrors = [err44];}else {vErrors.push(err44);}errors++;}}else {const err45 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1")+"/item_ids/" + i2,schemaPath:"#/$defs/FieldAnswer/oneOf/4/properties/item_ids/items/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err45];}else {vErrors.push(err45);}errors++;}}let i3 = data13.length;let j1;if(i3 > 1){const indices1 = {};for(;i3--;){let item1 = data13[i3];if(typeof item1 !== "string"){continue;}if(typeof indices1[item1] == "number"){j1 = indices1[item1];const err46 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1")+"/item_ids",schemaPath:"#/$defs/FieldAnswer/oneOf/4/properties/item_ids/uniqueItems",keyword:"uniqueItems",params:{i: i3, j: j1},message:"must NOT have duplicate items (items ## "+j1+" and "+i3+" are identical)"};if(vErrors === null){vErrors = [err46];}else {vErrors.push(err46);}errors++;break;}indices1[item1] = i3;}}}else {const err47 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1")+"/item_ids",schemaPath:"#/$defs/FieldAnswer/oneOf/4/properties/item_ids/type",keyword:"type",params:{type: "array"},message:"must be array"};if(vErrors === null){vErrors = [err47];}else {vErrors.push(err47);}errors++;}}}else {const err48 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/$defs/FieldAnswer/oneOf/4/type",keyword:"type",params:{type: "object"},message:"must be object"};if(vErrors === null){vErrors = [err48];}else {vErrors.push(err48);}errors++;}var _valid0 = _errs41 === errors;if(_valid0 && valid3){valid3 = false;passing0 = [passing0, 4];}else {if(_valid0){valid3 = true;passing0 = 4;}const _errs49 = errors;if(data1 && typeof data1 == "object" && !Array.isArray(data1)){if(data1.kind === undefined){const err49 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/$defs/FieldAnswer/oneOf/5/required",keyword:"required",params:{missingProperty: "kind"},message:"must have required property '"+"kind"+"'"};if(vErrors === null){vErrors = [err49];}else {vErrors.push(err49);}errors++;}if(data1.points === undefined){const err50 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/$defs/FieldAnswer/oneOf/5/required",keyword:"required",params:{missingProperty: "points"},message:"must have required property '"+"points"+"'"};if(vErrors === null){vErrors = [err50];}else {vErrors.push(err50);}errors++;}for(const key8 in data1){if(!((key8 === "kind") || (key8 === "points"))){const err51 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/$defs/FieldAnswer/oneOf/5/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key8},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err51];}else {vErrors.push(err51);}errors++;}}if(data1.kind !== undefined){if("markers" !== data1.kind){const err52 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1")+"/kind",schemaPath:"#/$defs/FieldAnswer/oneOf/5/properties/kind/const",keyword:"const",params:{allowedValue: "markers"},message:"must be equal to constant"};if(vErrors === null){vErrors = [err52];}else {vErrors.push(err52);}errors++;}}if(data1.points !== undefined){let data16 = data1.points;if(Array.isArray(data16)){const len2 = data16.length;for(let i4=0; i4<len2; i4++){let data17 = data16[i4];if(data17 && typeof data17 == "object" && !Array.isArray(data17)){if(data17.x === undefined){const err53 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1")+"/points/" + i4,schemaPath:"#/$defs/FieldAnswer/oneOf/5/properties/points/items/required",keyword:"required",params:{missingProperty: "x"},message:"must have required property '"+"x"+"'"};if(vErrors === null){vErrors = [err53];}else {vErrors.push(err53);}errors++;}if(data17.y === undefined){const err54 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1")+"/points/" + i4,schemaPath:"#/$defs/FieldAnswer/oneOf/5/properties/points/items/required",keyword:"required",params:{missingProperty: "y"},message:"must have required property '"+"y"+"'"};if(vErrors === null){vErrors = [err54];}else {vErrors.push(err54);}errors++;}for(const key9 in data17){if(!((key9 === "x") || (key9 === "y"))){const err55 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1")+"/points/" + i4,schemaPath:"#/$defs/FieldAnswer/oneOf/5/properties/points/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key9},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err55];}else {vErrors.push(err55);}errors++;}}if(data17.x !== undefined){let data18 = data17.x;if(!((typeof data18 == "number") && (!(data18 % 1) && !isNaN(data18)))){const err56 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1")+"/points/" + i4+"/x",schemaPath:"#/$defs/FieldAnswer/oneOf/5/properties/points/items/properties/x/type",keyword:"type",params:{type: "integer"},message:"must be integer"};if(vErrors === null){vErrors = [err56];}else {vErrors.push(err56);}errors++;}if(typeof data18 == "number"){if(data18 < 0 || isNaN(data18)){const err57 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1")+"/points/" + i4+"/x",schemaPath:"#/$defs/FieldAnswer/oneOf/5/properties/points/items/properties/x/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};if(vErrors === null){vErrors = [err57];}else {vErrors.push(err57);}errors++;}}}if(data17.y !== undefined){let data19 = data17.y;if(!((typeof data19 == "number") && (!(data19 % 1) && !isNaN(data19)))){const err58 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1")+"/points/" + i4+"/y",schemaPath:"#/$defs/FieldAnswer/oneOf/5/properties/points/items/properties/y/type",keyword:"type",params:{type: "integer"},message:"must be integer"};if(vErrors === null){vErrors = [err58];}else {vErrors.push(err58);}errors++;}if(typeof data19 == "number"){if(data19 < 0 || isNaN(data19)){const err59 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1")+"/points/" + i4+"/y",schemaPath:"#/$defs/FieldAnswer/oneOf/5/properties/points/items/properties/y/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};if(vErrors === null){vErrors = [err59];}else {vErrors.push(err59);}errors++;}}}}else {const err60 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1")+"/points/" + i4,schemaPath:"#/$defs/FieldAnswer/oneOf/5/properties/points/items/type",keyword:"type",params:{type: "object"},message:"must be object"};if(vErrors === null){vErrors = [err60];}else {vErrors.push(err60);}errors++;}}}else {const err61 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1")+"/points",schemaPath:"#/$defs/FieldAnswer/oneOf/5/properties/points/type",keyword:"type",params:{type: "array"},message:"must be array"};if(vErrors === null){vErrors = [err61];}else {vErrors.push(err61);}errors++;}}}else {const err62 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/$defs/FieldAnswer/oneOf/5/type",keyword:"type",params:{type: "object"},message:"must be object"};if(vErrors === null){vErrors = [err62];}else {vErrors.push(err62);}errors++;}var _valid0 = _errs49 === errors;if(_valid0 && valid3){valid3 = false;passing0 = [passing0, 5];}else {if(_valid0){valid3 = true;passing0 = 5;}}}}}}if(!valid3){const err63 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/$defs/FieldAnswer/oneOf",keyword:"oneOf",params:{passingSchemas: passing0},message:"must match exactly one schema in oneOf"};if(vErrors === null){vErrors = [err63];}else {vErrors.push(err63);}errors++;}else {errors = _errs7;if(vErrors !== null){if(_errs7){vErrors.length = _errs7;}else {vErrors = null;}}}}}}else {const err64 = {instancePath:instancePath+"/fields",schemaPath:"#/properties/fields/type",keyword:"type",params:{type: "object"},message:"must be object"};if(vErrors === null){vErrors = [err64];}else {vErrors.push(err64);}errors++;}}}else {const err65 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};if(vErrors === null){vErrors = [err65];}else {vErrors.push(err65);}errors++;}validate39.errors = vErrors;return errors === 0;}validate39.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};function validate38(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){let vErrors = null;let errors = 0;const evaluated0 = validate38.evaluated;if(evaluated0.dynamicProps){evaluated0.props = undefined;}if(evaluated0.dynamicItems){evaluated0.items = undefined;}if(data && typeof data == "object" && !Array.isArray(data)){if(data.schema_version === undefined){const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "schema_version"},message:"must have required property '"+"schema_version"+"'"};if(vErrors === null){vErrors = [err0];}else {vErrors.push(err0);}errors++;}if(data.request_id === undefined){const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "request_id"},message:"must have required property '"+"request_id"+"'"};if(vErrors === null){vErrors = [err1];}else {vErrors.push(err1);}errors++;}if(data.snapshot_id === undefined){const err2 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "snapshot_id"},message:"must have required property '"+"snapshot_id"+"'"};if(vErrors === null){vErrors = [err2];}else {vErrors.push(err2);}errors++;}if(data.question_type === undefined){const err3 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "question_type"},message:"must have required property '"+"question_type"+"'"};if(vErrors === null){vErrors = [err3];}else {vErrors.push(err3);}errors++;}if(data.answer === undefined){const err4 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "answer"},message:"must have required property '"+"answer"+"'"};if(vErrors === null){vErrors = [err4];}else {vErrors.push(err4);}errors++;}if(data.credits_remaining === undefined){const err5 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "credits_remaining"},message:"must have required property '"+"credits_remaining"+"'"};if(vErrors === null){vErrors = [err5];}else {vErrors.push(err5);}errors++;}for(const key0 in data){if(!((((((key0 === "schema_version") || (key0 === "request_id")) || (key0 === "snapshot_id")) || (key0 === "question_type")) || (key0 === "answer")) || (key0 === "credits_remaining"))){const err6 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err6];}else {vErrors.push(err6);}errors++;}}if(data.schema_version !== undefined){if("2.0" !== data.schema_version){const err7 = {instancePath:instancePath+"/schema_version",schemaPath:"#/properties/schema_version/const",keyword:"const",params:{allowedValue: "2.0"},message:"must be equal to constant"};if(vErrors === null){vErrors = [err7];}else {vErrors.push(err7);}errors++;}}if(data.request_id !== undefined){let data1 = data.request_id;if(typeof data1 === "string"){if(!pattern4.test(data1)){const err8 = {instancePath:instancePath+"/request_id",schemaPath:"#/properties/request_id/pattern",keyword:"pattern",params:{pattern: "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"},message:"must match pattern \""+"^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"+"\""};if(vErrors === null){vErrors = [err8];}else {vErrors.push(err8);}errors++;}if(!(formats0.test(data1))){const err9 = {instancePath:instancePath+"/request_id",schemaPath:"#/properties/request_id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};if(vErrors === null){vErrors = [err9];}else {vErrors.push(err9);}errors++;}}else {const err10 = {instancePath:instancePath+"/request_id",schemaPath:"#/properties/request_id/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err10];}else {vErrors.push(err10);}errors++;}}if(data.snapshot_id !== undefined){let data2 = data.snapshot_id;if(typeof data2 === "string"){if(!pattern5.test(data2)){const err11 = {instancePath:instancePath+"/snapshot_id",schemaPath:"#/properties/snapshot_id/pattern",keyword:"pattern",params:{pattern: "^[a-z][a-zA-Z0-9_-]{0,63}$"},message:"must match pattern \""+"^[a-z][a-zA-Z0-9_-]{0,63}$"+"\""};if(vErrors === null){vErrors = [err11];}else {vErrors.push(err11);}errors++;}}else {const err12 = {instancePath:instancePath+"/snapshot_id",schemaPath:"#/properties/snapshot_id/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err12];}else {vErrors.push(err12);}errors++;}}if(data.question_type !== undefined){let data3 = data.question_type;if(typeof data3 !== "string"){const err13 = {instancePath:instancePath+"/question_type",schemaPath:"#/$defs/QuestionType/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err13];}else {vErrors.push(err13);}errors++;}if(!((((((((((((((((data3 === "multichoice") || (data3 === "truefalse")) || (data3 === "shortanswer")) || (data3 === "numerical")) || (data3 === "calculated")) || (data3 === "calculatedsimple")) || (data3 === "calculatedmulti")) || (data3 === "match")) || (data3 === "randomsamatch")) || (data3 === "multianswer")) || (data3 === "gapselect")) || (data3 === "ddwtos")) || (data3 === "ddimageortext")) || (data3 === "ddmarker")) || (data3 === "ordering")) || (data3 === "essay"))){const err14 = {instancePath:instancePath+"/question_type",schemaPath:"#/$defs/QuestionType/enum",keyword:"enum",params:{allowedValues: schema34.enum},message:"must be equal to one of the allowed values"};if(vErrors === null){vErrors = [err14];}else {vErrors.push(err14);}errors++;}}if(data.answer !== undefined){if(!(validate39(data.answer, {instancePath:instancePath+"/answer",parentData:data,parentDataProperty:"answer",rootData,dynamicAnchors}))){vErrors = vErrors === null ? validate39.errors : vErrors.concat(validate39.errors);errors = vErrors.length;}}if(data.credits_remaining !== undefined){let data5 = data.credits_remaining;if(!((typeof data5 == "number") && (!(data5 % 1) && !isNaN(data5)))){const err15 = {instancePath:instancePath+"/credits_remaining",schemaPath:"#/properties/credits_remaining/type",keyword:"type",params:{type: "integer"},message:"must be integer"};if(vErrors === null){vErrors = [err15];}else {vErrors.push(err15);}errors++;}if(typeof data5 == "number"){if(data5 < 0 || isNaN(data5)){const err16 = {instancePath:instancePath+"/credits_remaining",schemaPath:"#/properties/credits_remaining/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};if(vErrors === null){vErrors = [err16];}else {vErrors.push(err16);}errors++;}}}}else {const err17 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};if(vErrors === null){vErrors = [err17];}else {vErrors.push(err17);}errors++;}validate38.errors = vErrors;return errors === 0;}validate38.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};const validateAnswer = validate41;function validate41(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){let vErrors = null;let errors = 0;const evaluated0 = validate41.evaluated;if(evaluated0.dynamicProps){evaluated0.props = undefined;}if(evaluated0.dynamicItems){evaluated0.items = undefined;}if(data && typeof data == "object" && !Array.isArray(data)){if(data.fields === undefined){const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "fields"},message:"must have required property '"+"fields"+"'"};if(vErrors === null){vErrors = [err0];}else {vErrors.push(err0);}errors++;}for(const key0 in data){if(!(key0 === "fields")){const err1 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err1];}else {vErrors.push(err1);}errors++;}}if(data.fields !== undefined){let data0 = data.fields;if(data0 && typeof data0 == "object" && !Array.isArray(data0)){if(Object.keys(data0).length > 256){const err2 = {instancePath:instancePath+"/fields",schemaPath:"#/properties/fields/maxProperties",keyword:"maxProperties",params:{limit: 256},message:"must NOT have more than 256 properties"};if(vErrors === null){vErrors = [err2];}else {vErrors.push(err2);}errors++;}if(Object.keys(data0).length < 1){const err3 = {instancePath:instancePath+"/fields",schemaPath:"#/properties/fields/minProperties",keyword:"minProperties",params:{limit: 1},message:"must NOT have fewer than 1 properties"};if(vErrors === null){vErrors = [err3];}else {vErrors.push(err3);}errors++;}for(const key1 in data0){if(!(pattern5.test(key1))){const err4 = {instancePath:instancePath+"/fields",schemaPath:"#/properties/fields/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err4];}else {vErrors.push(err4);}errors++;}}for(const key2 in data0){if(pattern5.test(key2)){let data1 = data0[key2];const _errs7 = errors;let valid3 = false;let passing0 = null;const _errs8 = errors;if(data1 && typeof data1 == "object" && !Array.isArray(data1)){if(data1.kind === undefined){const err5 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/$defs/FieldAnswer/oneOf/0/required",keyword:"required",params:{missingProperty: "kind"},message:"must have required property '"+"kind"+"'"};if(vErrors === null){vErrors = [err5];}else {vErrors.push(err5);}errors++;}if(data1.option_id === undefined){const err6 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/$defs/FieldAnswer/oneOf/0/required",keyword:"required",params:{missingProperty: "option_id"},message:"must have required property '"+"option_id"+"'"};if(vErrors === null){vErrors = [err6];}else {vErrors.push(err6);}errors++;}for(const key3 in data1){if(!((key3 === "kind") || (key3 === "option_id"))){const err7 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/$defs/FieldAnswer/oneOf/0/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key3},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err7];}else {vErrors.push(err7);}errors++;}}if(data1.kind !== undefined){if("single_choice" !== data1.kind){const err8 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1")+"/kind",schemaPath:"#/$defs/FieldAnswer/oneOf/0/properties/kind/const",keyword:"const",params:{allowedValue: "single_choice"},message:"must be equal to constant"};if(vErrors === null){vErrors = [err8];}else {vErrors.push(err8);}errors++;}}if(data1.option_id !== undefined){let data3 = data1.option_id;if(typeof data3 === "string"){if(!pattern5.test(data3)){const err9 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1")+"/option_id",schemaPath:"#/$defs/FieldAnswer/oneOf/0/properties/option_id/pattern",keyword:"pattern",params:{pattern: "^[a-z][a-zA-Z0-9_-]{0,63}$"},message:"must match pattern \""+"^[a-z][a-zA-Z0-9_-]{0,63}$"+"\""};if(vErrors === null){vErrors = [err9];}else {vErrors.push(err9);}errors++;}}else {const err10 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1")+"/option_id",schemaPath:"#/$defs/FieldAnswer/oneOf/0/properties/option_id/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err10];}else {vErrors.push(err10);}errors++;}}}else {const err11 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/$defs/FieldAnswer/oneOf/0/type",keyword:"type",params:{type: "object"},message:"must be object"};if(vErrors === null){vErrors = [err11];}else {vErrors.push(err11);}errors++;}var _valid0 = _errs8 === errors;if(_valid0){valid3 = true;passing0 = 0;}const _errs14 = errors;if(data1 && typeof data1 == "object" && !Array.isArray(data1)){if(data1.kind === undefined){const err12 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/$defs/FieldAnswer/oneOf/1/required",keyword:"required",params:{missingProperty: "kind"},message:"must have required property '"+"kind"+"'"};if(vErrors === null){vErrors = [err12];}else {vErrors.push(err12);}errors++;}if(data1.option_ids === undefined){const err13 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/$defs/FieldAnswer/oneOf/1/required",keyword:"required",params:{missingProperty: "option_ids"},message:"must have required property '"+"option_ids"+"'"};if(vErrors === null){vErrors = [err13];}else {vErrors.push(err13);}errors++;}for(const key4 in data1){if(!((key4 === "kind") || (key4 === "option_ids"))){const err14 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/$defs/FieldAnswer/oneOf/1/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key4},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err14];}else {vErrors.push(err14);}errors++;}}if(data1.kind !== undefined){if("multiple_choice" !== data1.kind){const err15 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1")+"/kind",schemaPath:"#/$defs/FieldAnswer/oneOf/1/properties/kind/const",keyword:"const",params:{allowedValue: "multiple_choice"},message:"must be equal to constant"};if(vErrors === null){vErrors = [err15];}else {vErrors.push(err15);}errors++;}}if(data1.option_ids !== undefined){let data5 = data1.option_ids;if(Array.isArray(data5)){const len0 = data5.length;for(let i0=0; i0<len0; i0++){let data6 = data5[i0];if(typeof data6 === "string"){if(!pattern5.test(data6)){const err16 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1")+"/option_ids/" + i0,schemaPath:"#/$defs/FieldAnswer/oneOf/1/properties/option_ids/items/pattern",keyword:"pattern",params:{pattern: "^[a-z][a-zA-Z0-9_-]{0,63}$"},message:"must match pattern \""+"^[a-z][a-zA-Z0-9_-]{0,63}$"+"\""};if(vErrors === null){vErrors = [err16];}else {vErrors.push(err16);}errors++;}}else {const err17 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1")+"/option_ids/" + i0,schemaPath:"#/$defs/FieldAnswer/oneOf/1/properties/option_ids/items/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err17];}else {vErrors.push(err17);}errors++;}}let i1 = data5.length;let j0;if(i1 > 1){const indices0 = {};for(;i1--;){let item0 = data5[i1];if(typeof item0 !== "string"){continue;}if(typeof indices0[item0] == "number"){j0 = indices0[item0];const err18 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1")+"/option_ids",schemaPath:"#/$defs/FieldAnswer/oneOf/1/properties/option_ids/uniqueItems",keyword:"uniqueItems",params:{i: i1, j: j0},message:"must NOT have duplicate items (items ## "+j0+" and "+i1+" are identical)"};if(vErrors === null){vErrors = [err18];}else {vErrors.push(err18);}errors++;break;}indices0[item0] = i1;}}}else {const err19 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1")+"/option_ids",schemaPath:"#/$defs/FieldAnswer/oneOf/1/properties/option_ids/type",keyword:"type",params:{type: "array"},message:"must be array"};if(vErrors === null){vErrors = [err19];}else {vErrors.push(err19);}errors++;}}}else {const err20 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/$defs/FieldAnswer/oneOf/1/type",keyword:"type",params:{type: "object"},message:"must be object"};if(vErrors === null){vErrors = [err20];}else {vErrors.push(err20);}errors++;}var _valid0 = _errs14 === errors;if(_valid0 && valid3){valid3 = false;passing0 = [passing0, 1];}else {if(_valid0){valid3 = true;passing0 = 1;}const _errs22 = errors;if(data1 && typeof data1 == "object" && !Array.isArray(data1)){if(data1.kind === undefined){const err21 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/$defs/FieldAnswer/oneOf/2/required",keyword:"required",params:{missingProperty: "kind"},message:"must have required property '"+"kind"+"'"};if(vErrors === null){vErrors = [err21];}else {vErrors.push(err21);}errors++;}if(data1.value === undefined){const err22 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/$defs/FieldAnswer/oneOf/2/required",keyword:"required",params:{missingProperty: "value"},message:"must have required property '"+"value"+"'"};if(vErrors === null){vErrors = [err22];}else {vErrors.push(err22);}errors++;}for(const key5 in data1){if(!((key5 === "kind") || (key5 === "value"))){const err23 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/$defs/FieldAnswer/oneOf/2/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key5},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err23];}else {vErrors.push(err23);}errors++;}}if(data1.kind !== undefined){let data7 = data1.kind;if(typeof data7 !== "string"){const err24 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1")+"/kind",schemaPath:"#/$defs/FieldAnswer/oneOf/2/properties/kind/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err24];}else {vErrors.push(err24);}errors++;}if(!((data7 === "text") || (data7 === "essay"))){const err25 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1")+"/kind",schemaPath:"#/$defs/FieldAnswer/oneOf/2/properties/kind/enum",keyword:"enum",params:{allowedValues: schema43.oneOf[2].properties.kind.enum},message:"must be equal to one of the allowed values"};if(vErrors === null){vErrors = [err25];}else {vErrors.push(err25);}errors++;}}if(data1.value !== undefined){if(typeof data1.value !== "string"){const err26 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1")+"/value",schemaPath:"#/$defs/FieldAnswer/oneOf/2/properties/value/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err26];}else {vErrors.push(err26);}errors++;}}}else {const err27 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/$defs/FieldAnswer/oneOf/2/type",keyword:"type",params:{type: "object"},message:"must be object"};if(vErrors === null){vErrors = [err27];}else {vErrors.push(err27);}errors++;}var _valid0 = _errs22 === errors;if(_valid0 && valid3){valid3 = false;passing0 = [passing0, 2];}else {if(_valid0){valid3 = true;passing0 = 2;}const _errs29 = errors;if(data1 && typeof data1 == "object" && !Array.isArray(data1)){if(data1.kind === undefined){const err28 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/$defs/FieldAnswer/oneOf/3/required",keyword:"required",params:{missingProperty: "kind"},message:"must have required property '"+"kind"+"'"};if(vErrors === null){vErrors = [err28];}else {vErrors.push(err28);}errors++;}if(data1.value === undefined){const err29 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/$defs/FieldAnswer/oneOf/3/required",keyword:"required",params:{missingProperty: "value"},message:"must have required property '"+"value"+"'"};if(vErrors === null){vErrors = [err29];}else {vErrors.push(err29);}errors++;}if(data1.unit_option_id === undefined){const err30 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/$defs/FieldAnswer/oneOf/3/required",keyword:"required",params:{missingProperty: "unit_option_id"},message:"must have required property '"+"unit_option_id"+"'"};if(vErrors === null){vErrors = [err30];}else {vErrors.push(err30);}errors++;}for(const key6 in data1){if(!(((key6 === "kind") || (key6 === "value")) || (key6 === "unit_option_id"))){const err31 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/$defs/FieldAnswer/oneOf/3/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key6},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err31];}else {vErrors.push(err31);}errors++;}}if(data1.kind !== undefined){if("numeric" !== data1.kind){const err32 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1")+"/kind",schemaPath:"#/$defs/FieldAnswer/oneOf/3/properties/kind/const",keyword:"const",params:{allowedValue: "numeric"},message:"must be equal to constant"};if(vErrors === null){vErrors = [err32];}else {vErrors.push(err32);}errors++;}}if(data1.value !== undefined){if(typeof data1.value !== "string"){const err33 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1")+"/value",schemaPath:"#/$defs/FieldAnswer/oneOf/3/properties/value/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err33];}else {vErrors.push(err33);}errors++;}}if(data1.unit_option_id !== undefined){let data11 = data1.unit_option_id;const _errs36 = errors;let valid11 = false;const _errs37 = errors;if(typeof data11 === "string"){if(!pattern5.test(data11)){const err34 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1")+"/unit_option_id",schemaPath:"#/$defs/FieldAnswer/oneOf/3/properties/unit_option_id/anyOf/0/pattern",keyword:"pattern",params:{pattern: "^[a-z][a-zA-Z0-9_-]{0,63}$"},message:"must match pattern \""+"^[a-z][a-zA-Z0-9_-]{0,63}$"+"\""};if(vErrors === null){vErrors = [err34];}else {vErrors.push(err34);}errors++;}}else {const err35 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1")+"/unit_option_id",schemaPath:"#/$defs/FieldAnswer/oneOf/3/properties/unit_option_id/anyOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err35];}else {vErrors.push(err35);}errors++;}var _valid1 = _errs37 === errors;valid11 = valid11 || _valid1;const _errs39 = errors;if(data11 !== null){const err36 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1")+"/unit_option_id",schemaPath:"#/$defs/FieldAnswer/oneOf/3/properties/unit_option_id/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};if(vErrors === null){vErrors = [err36];}else {vErrors.push(err36);}errors++;}var _valid1 = _errs39 === errors;valid11 = valid11 || _valid1;if(!valid11){const err37 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1")+"/unit_option_id",schemaPath:"#/$defs/FieldAnswer/oneOf/3/properties/unit_option_id/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};if(vErrors === null){vErrors = [err37];}else {vErrors.push(err37);}errors++;}else {errors = _errs36;if(vErrors !== null){if(_errs36){vErrors.length = _errs36;}else {vErrors = null;}}}}}else {const err38 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/$defs/FieldAnswer/oneOf/3/type",keyword:"type",params:{type: "object"},message:"must be object"};if(vErrors === null){vErrors = [err38];}else {vErrors.push(err38);}errors++;}var _valid0 = _errs29 === errors;if(_valid0 && valid3){valid3 = false;passing0 = [passing0, 3];}else {if(_valid0){valid3 = true;passing0 = 3;}const _errs41 = errors;if(data1 && typeof data1 == "object" && !Array.isArray(data1)){if(data1.kind === undefined){const err39 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/$defs/FieldAnswer/oneOf/4/required",keyword:"required",params:{missingProperty: "kind"},message:"must have required property '"+"kind"+"'"};if(vErrors === null){vErrors = [err39];}else {vErrors.push(err39);}errors++;}if(data1.item_ids === undefined){const err40 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/$defs/FieldAnswer/oneOf/4/required",keyword:"required",params:{missingProperty: "item_ids"},message:"must have required property '"+"item_ids"+"'"};if(vErrors === null){vErrors = [err40];}else {vErrors.push(err40);}errors++;}for(const key7 in data1){if(!((key7 === "kind") || (key7 === "item_ids"))){const err41 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/$defs/FieldAnswer/oneOf/4/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key7},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err41];}else {vErrors.push(err41);}errors++;}}if(data1.kind !== undefined){if("ordering" !== data1.kind){const err42 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1")+"/kind",schemaPath:"#/$defs/FieldAnswer/oneOf/4/properties/kind/const",keyword:"const",params:{allowedValue: "ordering"},message:"must be equal to constant"};if(vErrors === null){vErrors = [err42];}else {vErrors.push(err42);}errors++;}}if(data1.item_ids !== undefined){let data13 = data1.item_ids;if(Array.isArray(data13)){if(data13.length < 1){const err43 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1")+"/item_ids",schemaPath:"#/$defs/FieldAnswer/oneOf/4/properties/item_ids/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};if(vErrors === null){vErrors = [err43];}else {vErrors.push(err43);}errors++;}const len1 = data13.length;for(let i2=0; i2<len1; i2++){let data14 = data13[i2];if(typeof data14 === "string"){if(!pattern5.test(data14)){const err44 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1")+"/item_ids/" + i2,schemaPath:"#/$defs/FieldAnswer/oneOf/4/properties/item_ids/items/pattern",keyword:"pattern",params:{pattern: "^[a-z][a-zA-Z0-9_-]{0,63}$"},message:"must match pattern \""+"^[a-z][a-zA-Z0-9_-]{0,63}$"+"\""};if(vErrors === null){vErrors = [err44];}else {vErrors.push(err44);}errors++;}}else {const err45 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1")+"/item_ids/" + i2,schemaPath:"#/$defs/FieldAnswer/oneOf/4/properties/item_ids/items/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err45];}else {vErrors.push(err45);}errors++;}}let i3 = data13.length;let j1;if(i3 > 1){const indices1 = {};for(;i3--;){let item1 = data13[i3];if(typeof item1 !== "string"){continue;}if(typeof indices1[item1] == "number"){j1 = indices1[item1];const err46 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1")+"/item_ids",schemaPath:"#/$defs/FieldAnswer/oneOf/4/properties/item_ids/uniqueItems",keyword:"uniqueItems",params:{i: i3, j: j1},message:"must NOT have duplicate items (items ## "+j1+" and "+i3+" are identical)"};if(vErrors === null){vErrors = [err46];}else {vErrors.push(err46);}errors++;break;}indices1[item1] = i3;}}}else {const err47 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1")+"/item_ids",schemaPath:"#/$defs/FieldAnswer/oneOf/4/properties/item_ids/type",keyword:"type",params:{type: "array"},message:"must be array"};if(vErrors === null){vErrors = [err47];}else {vErrors.push(err47);}errors++;}}}else {const err48 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/$defs/FieldAnswer/oneOf/4/type",keyword:"type",params:{type: "object"},message:"must be object"};if(vErrors === null){vErrors = [err48];}else {vErrors.push(err48);}errors++;}var _valid0 = _errs41 === errors;if(_valid0 && valid3){valid3 = false;passing0 = [passing0, 4];}else {if(_valid0){valid3 = true;passing0 = 4;}const _errs49 = errors;if(data1 && typeof data1 == "object" && !Array.isArray(data1)){if(data1.kind === undefined){const err49 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/$defs/FieldAnswer/oneOf/5/required",keyword:"required",params:{missingProperty: "kind"},message:"must have required property '"+"kind"+"'"};if(vErrors === null){vErrors = [err49];}else {vErrors.push(err49);}errors++;}if(data1.points === undefined){const err50 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/$defs/FieldAnswer/oneOf/5/required",keyword:"required",params:{missingProperty: "points"},message:"must have required property '"+"points"+"'"};if(vErrors === null){vErrors = [err50];}else {vErrors.push(err50);}errors++;}for(const key8 in data1){if(!((key8 === "kind") || (key8 === "points"))){const err51 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/$defs/FieldAnswer/oneOf/5/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key8},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err51];}else {vErrors.push(err51);}errors++;}}if(data1.kind !== undefined){if("markers" !== data1.kind){const err52 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1")+"/kind",schemaPath:"#/$defs/FieldAnswer/oneOf/5/properties/kind/const",keyword:"const",params:{allowedValue: "markers"},message:"must be equal to constant"};if(vErrors === null){vErrors = [err52];}else {vErrors.push(err52);}errors++;}}if(data1.points !== undefined){let data16 = data1.points;if(Array.isArray(data16)){const len2 = data16.length;for(let i4=0; i4<len2; i4++){let data17 = data16[i4];if(data17 && typeof data17 == "object" && !Array.isArray(data17)){if(data17.x === undefined){const err53 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1")+"/points/" + i4,schemaPath:"#/$defs/FieldAnswer/oneOf/5/properties/points/items/required",keyword:"required",params:{missingProperty: "x"},message:"must have required property '"+"x"+"'"};if(vErrors === null){vErrors = [err53];}else {vErrors.push(err53);}errors++;}if(data17.y === undefined){const err54 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1")+"/points/" + i4,schemaPath:"#/$defs/FieldAnswer/oneOf/5/properties/points/items/required",keyword:"required",params:{missingProperty: "y"},message:"must have required property '"+"y"+"'"};if(vErrors === null){vErrors = [err54];}else {vErrors.push(err54);}errors++;}for(const key9 in data17){if(!((key9 === "x") || (key9 === "y"))){const err55 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1")+"/points/" + i4,schemaPath:"#/$defs/FieldAnswer/oneOf/5/properties/points/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key9},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err55];}else {vErrors.push(err55);}errors++;}}if(data17.x !== undefined){let data18 = data17.x;if(!((typeof data18 == "number") && (!(data18 % 1) && !isNaN(data18)))){const err56 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1")+"/points/" + i4+"/x",schemaPath:"#/$defs/FieldAnswer/oneOf/5/properties/points/items/properties/x/type",keyword:"type",params:{type: "integer"},message:"must be integer"};if(vErrors === null){vErrors = [err56];}else {vErrors.push(err56);}errors++;}if(typeof data18 == "number"){if(data18 < 0 || isNaN(data18)){const err57 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1")+"/points/" + i4+"/x",schemaPath:"#/$defs/FieldAnswer/oneOf/5/properties/points/items/properties/x/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};if(vErrors === null){vErrors = [err57];}else {vErrors.push(err57);}errors++;}}}if(data17.y !== undefined){let data19 = data17.y;if(!((typeof data19 == "number") && (!(data19 % 1) && !isNaN(data19)))){const err58 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1")+"/points/" + i4+"/y",schemaPath:"#/$defs/FieldAnswer/oneOf/5/properties/points/items/properties/y/type",keyword:"type",params:{type: "integer"},message:"must be integer"};if(vErrors === null){vErrors = [err58];}else {vErrors.push(err58);}errors++;}if(typeof data19 == "number"){if(data19 < 0 || isNaN(data19)){const err59 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1")+"/points/" + i4+"/y",schemaPath:"#/$defs/FieldAnswer/oneOf/5/properties/points/items/properties/y/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};if(vErrors === null){vErrors = [err59];}else {vErrors.push(err59);}errors++;}}}}else {const err60 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1")+"/points/" + i4,schemaPath:"#/$defs/FieldAnswer/oneOf/5/properties/points/items/type",keyword:"type",params:{type: "object"},message:"must be object"};if(vErrors === null){vErrors = [err60];}else {vErrors.push(err60);}errors++;}}}else {const err61 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1")+"/points",schemaPath:"#/$defs/FieldAnswer/oneOf/5/properties/points/type",keyword:"type",params:{type: "array"},message:"must be array"};if(vErrors === null){vErrors = [err61];}else {vErrors.push(err61);}errors++;}}}else {const err62 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/$defs/FieldAnswer/oneOf/5/type",keyword:"type",params:{type: "object"},message:"must be object"};if(vErrors === null){vErrors = [err62];}else {vErrors.push(err62);}errors++;}var _valid0 = _errs49 === errors;if(_valid0 && valid3){valid3 = false;passing0 = [passing0, 5];}else {if(_valid0){valid3 = true;passing0 = 5;}}}}}}if(!valid3){const err63 = {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/$defs/FieldAnswer/oneOf",keyword:"oneOf",params:{passingSchemas: passing0},message:"must match exactly one schema in oneOf"};if(vErrors === null){vErrors = [err63];}else {vErrors.push(err63);}errors++;}else {errors = _errs7;if(vErrors !== null){if(_errs7){vErrors.length = _errs7;}else {vErrors = null;}}}}}}else {const err64 = {instancePath:instancePath+"/fields",schemaPath:"#/properties/fields/type",keyword:"type",params:{type: "object"},message:"must be object"};if(vErrors === null){vErrors = [err64];}else {vErrors.push(err64);}errors++;}}}else {const err65 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};if(vErrors === null){vErrors = [err65];}else {vErrors.push(err65);}errors++;}validate41.errors = vErrors;return errors === 0;}validate41.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};const validateQuestion = validate42;function validate42(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){let vErrors = null;let errors = 0;const evaluated0 = validate42.evaluated;if(evaluated0.dynamicProps){evaluated0.props = undefined;}if(evaluated0.dynamicItems){evaluated0.items = undefined;}if(data && typeof data == "object" && !Array.isArray(data)){if(data.qtype === undefined){const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "qtype"},message:"must have required property '"+"qtype"+"'"};if(vErrors === null){vErrors = [err0];}else {vErrors.push(err0);}errors++;}if(data.content === undefined){const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "content"},message:"must have required property '"+"content"+"'"};if(vErrors === null){vErrors = [err1];}else {vErrors.push(err1);}errors++;}if(data.fields === undefined){const err2 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "fields"},message:"must have required property '"+"fields"+"'"};if(vErrors === null){vErrors = [err2];}else {vErrors.push(err2);}errors++;}if(data.assets === undefined){const err3 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "assets"},message:"must have required property '"+"assets"+"'"};if(vErrors === null){vErrors = [err3];}else {vErrors.push(err3);}errors++;}for(const key0 in data){if(!((((key0 === "qtype") || (key0 === "content")) || (key0 === "fields")) || (key0 === "assets"))){const err4 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err4];}else {vErrors.push(err4);}errors++;}}if(data.qtype !== undefined){let data0 = data.qtype;if(typeof data0 !== "string"){const err5 = {instancePath:instancePath+"/qtype",schemaPath:"#/$defs/QuestionType/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err5];}else {vErrors.push(err5);}errors++;}if(!((((((((((((((((data0 === "multichoice") || (data0 === "truefalse")) || (data0 === "shortanswer")) || (data0 === "numerical")) || (data0 === "calculated")) || (data0 === "calculatedsimple")) || (data0 === "calculatedmulti")) || (data0 === "match")) || (data0 === "randomsamatch")) || (data0 === "multianswer")) || (data0 === "gapselect")) || (data0 === "ddwtos")) || (data0 === "ddimageortext")) || (data0 === "ddmarker")) || (data0 === "ordering")) || (data0 === "essay"))){const err6 = {instancePath:instancePath+"/qtype",schemaPath:"#/$defs/QuestionType/enum",keyword:"enum",params:{allowedValues: schema34.enum},message:"must be equal to one of the allowed values"};if(vErrors === null){vErrors = [err6];}else {vErrors.push(err6);}errors++;}}if(data.content !== undefined){let data1 = data.content;if(Array.isArray(data1)){const len0 = data1.length;for(let i0=0; i0<len0; i0++){if(!(validate23(data1[i0], {instancePath:instancePath+"/content/" + i0,parentData:data1,parentDataProperty:i0,rootData,dynamicAnchors}))){vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);errors = vErrors.length;}}}else {const err7 = {instancePath:instancePath+"/content",schemaPath:"#/properties/content/type",keyword:"type",params:{type: "array"},message:"must be array"};if(vErrors === null){vErrors = [err7];}else {vErrors.push(err7);}errors++;}}if(data.fields !== undefined){let data3 = data.fields;if(data3 && typeof data3 == "object" && !Array.isArray(data3)){if(Object.keys(data3).length > 256){const err8 = {instancePath:instancePath+"/fields",schemaPath:"#/properties/fields/maxProperties",keyword:"maxProperties",params:{limit: 256},message:"must NOT have more than 256 properties"};if(vErrors === null){vErrors = [err8];}else {vErrors.push(err8);}errors++;}if(Object.keys(data3).length < 1){const err9 = {instancePath:instancePath+"/fields",schemaPath:"#/properties/fields/minProperties",keyword:"minProperties",params:{limit: 1},message:"must NOT have fewer than 1 properties"};if(vErrors === null){vErrors = [err9];}else {vErrors.push(err9);}errors++;}for(const key1 in data3){if(!(pattern5.test(key1))){const err10 = {instancePath:instancePath+"/fields",schemaPath:"#/properties/fields/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err10];}else {vErrors.push(err10);}errors++;}}for(const key2 in data3){if(pattern5.test(key2)){if(!(validate25(data3[key2], {instancePath:instancePath+"/fields/" + key2.replace(/~/g, "~0").replace(/\//g, "~1"),parentData:data3,parentDataProperty:key2,rootData,dynamicAnchors}))){vErrors = vErrors === null ? validate25.errors : vErrors.concat(validate25.errors);errors = vErrors.length;}}}}else {const err11 = {instancePath:instancePath+"/fields",schemaPath:"#/properties/fields/type",keyword:"type",params:{type: "object"},message:"must be object"};if(vErrors === null){vErrors = [err11];}else {vErrors.push(err11);}errors++;}}if(data.assets !== undefined){let data5 = data.assets;if(data5 && typeof data5 == "object" && !Array.isArray(data5)){if(Object.keys(data5).length > 64){const err12 = {instancePath:instancePath+"/assets",schemaPath:"#/properties/assets/maxProperties",keyword:"maxProperties",params:{limit: 64},message:"must NOT have more than 64 properties"};if(vErrors === null){vErrors = [err12];}else {vErrors.push(err12);}errors++;}for(const key3 in data5){if(!(pattern5.test(key3))){const err13 = {instancePath:instancePath+"/assets",schemaPath:"#/properties/assets/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key3},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err13];}else {vErrors.push(err13);}errors++;}}for(const key4 in data5){if(pattern5.test(key4)){let data6 = data5[key4];if(data6 && typeof data6 == "object" && !Array.isArray(data6)){if(data6.mime_type === undefined){const err14 = {instancePath:instancePath+"/assets/" + key4.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/$defs/ImageAsset/required",keyword:"required",params:{missingProperty: "mime_type"},message:"must have required property '"+"mime_type"+"'"};if(vErrors === null){vErrors = [err14];}else {vErrors.push(err14);}errors++;}if(data6.data === undefined){const err15 = {instancePath:instancePath+"/assets/" + key4.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/$defs/ImageAsset/required",keyword:"required",params:{missingProperty: "data"},message:"must have required property '"+"data"+"'"};if(vErrors === null){vErrors = [err15];}else {vErrors.push(err15);}errors++;}if(data6.width === undefined){const err16 = {instancePath:instancePath+"/assets/" + key4.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/$defs/ImageAsset/required",keyword:"required",params:{missingProperty: "width"},message:"must have required property '"+"width"+"'"};if(vErrors === null){vErrors = [err16];}else {vErrors.push(err16);}errors++;}if(data6.height === undefined){const err17 = {instancePath:instancePath+"/assets/" + key4.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/$defs/ImageAsset/required",keyword:"required",params:{missingProperty: "height"},message:"must have required property '"+"height"+"'"};if(vErrors === null){vErrors = [err17];}else {vErrors.push(err17);}errors++;}for(const key5 in data6){if(!((((key5 === "mime_type") || (key5 === "data")) || (key5 === "width")) || (key5 === "height"))){const err18 = {instancePath:instancePath+"/assets/" + key4.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/$defs/ImageAsset/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key5},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err18];}else {vErrors.push(err18);}errors++;}}if(data6.mime_type !== undefined){let data7 = data6.mime_type;if(typeof data7 !== "string"){const err19 = {instancePath:instancePath+"/assets/" + key4.replace(/~/g, "~0").replace(/\//g, "~1")+"/mime_type",schemaPath:"#/$defs/ImageAsset/properties/mime_type/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err19];}else {vErrors.push(err19);}errors++;}if(!((data7 === "image/png") || (data7 === "image/jpeg"))){const err20 = {instancePath:instancePath+"/assets/" + key4.replace(/~/g, "~0").replace(/\//g, "~1")+"/mime_type",schemaPath:"#/$defs/ImageAsset/properties/mime_type/enum",keyword:"enum",params:{allowedValues: schema39.properties.mime_type.enum},message:"must be equal to one of the allowed values"};if(vErrors === null){vErrors = [err20];}else {vErrors.push(err20);}errors++;}}if(data6.data !== undefined){let data8 = data6.data;if(typeof data8 === "string"){if(func1(data8) > 6990508){const err21 = {instancePath:instancePath+"/assets/" + key4.replace(/~/g, "~0").replace(/\//g, "~1")+"/data",schemaPath:"#/$defs/ImageAsset/properties/data/maxLength",keyword:"maxLength",params:{limit: 6990508},message:"must NOT have more than 6990508 characters"};if(vErrors === null){vErrors = [err21];}else {vErrors.push(err21);}errors++;}if(func1(data8) < 1){const err22 = {instancePath:instancePath+"/assets/" + key4.replace(/~/g, "~0").replace(/\//g, "~1")+"/data",schemaPath:"#/$defs/ImageAsset/properties/data/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};if(vErrors === null){vErrors = [err22];}else {vErrors.push(err22);}errors++;}if(!pattern22.test(data8)){const err23 = {instancePath:instancePath+"/assets/" + key4.replace(/~/g, "~0").replace(/\//g, "~1")+"/data",schemaPath:"#/$defs/ImageAsset/properties/data/pattern",keyword:"pattern",params:{pattern: "^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$"},message:"must match pattern \""+"^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$"+"\""};if(vErrors === null){vErrors = [err23];}else {vErrors.push(err23);}errors++;}}else {const err24 = {instancePath:instancePath+"/assets/" + key4.replace(/~/g, "~0").replace(/\//g, "~1")+"/data",schemaPath:"#/$defs/ImageAsset/properties/data/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err24];}else {vErrors.push(err24);}errors++;}}if(data6.width !== undefined){let data9 = data6.width;if(!((typeof data9 == "number") && (!(data9 % 1) && !isNaN(data9)))){const err25 = {instancePath:instancePath+"/assets/" + key4.replace(/~/g, "~0").replace(/\//g, "~1")+"/width",schemaPath:"#/$defs/ImageAsset/properties/width/type",keyword:"type",params:{type: "integer"},message:"must be integer"};if(vErrors === null){vErrors = [err25];}else {vErrors.push(err25);}errors++;}if(typeof data9 == "number"){if(data9 < 1 || isNaN(data9)){const err26 = {instancePath:instancePath+"/assets/" + key4.replace(/~/g, "~0").replace(/\//g, "~1")+"/width",schemaPath:"#/$defs/ImageAsset/properties/width/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"};if(vErrors === null){vErrors = [err26];}else {vErrors.push(err26);}errors++;}}}if(data6.height !== undefined){let data10 = data6.height;if(!((typeof data10 == "number") && (!(data10 % 1) && !isNaN(data10)))){const err27 = {instancePath:instancePath+"/assets/" + key4.replace(/~/g, "~0").replace(/\//g, "~1")+"/height",schemaPath:"#/$defs/ImageAsset/properties/height/type",keyword:"type",params:{type: "integer"},message:"must be integer"};if(vErrors === null){vErrors = [err27];}else {vErrors.push(err27);}errors++;}if(typeof data10 == "number"){if(data10 < 1 || isNaN(data10)){const err28 = {instancePath:instancePath+"/assets/" + key4.replace(/~/g, "~0").replace(/\//g, "~1")+"/height",schemaPath:"#/$defs/ImageAsset/properties/height/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"};if(vErrors === null){vErrors = [err28];}else {vErrors.push(err28);}errors++;}}}}else {const err29 = {instancePath:instancePath+"/assets/" + key4.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/$defs/ImageAsset/type",keyword:"type",params:{type: "object"},message:"must be object"};if(vErrors === null){vErrors = [err29];}else {vErrors.push(err29);}errors++;}}}}else {const err30 = {instancePath:instancePath+"/assets",schemaPath:"#/properties/assets/type",keyword:"type",params:{type: "object"},message:"must be object"};if(vErrors === null){vErrors = [err30];}else {vErrors.push(err30);}errors++;}}}else {const err31 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};if(vErrors === null){vErrors = [err31];}else {vErrors.push(err31);}errors++;}validate42.errors = vErrors;return errors === 0;}validate42.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};const validateErrorResponse = validate62;const schema55 = {"properties":{"error":{"properties":{"code":{"enum":["invalid_request","unsupported_question","invalid_image","request_too_large","model_not_found","model_not_supported","authentication_required","permission_denied","payment_required","rate_limited","provider_refusal","provider_invalid_output","upstream_error","timeout","internal_error","unsupported_version","provider_incomplete_output"]}}}}};function validate62(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){let vErrors = null;let errors = 0;const evaluated0 = validate62.evaluated;if(evaluated0.dynamicProps){evaluated0.props = undefined;}if(evaluated0.dynamicItems){evaluated0.items = undefined;}if(data && typeof data == "object" && !Array.isArray(data)){if(data.schema_version === undefined){const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "schema_version"},message:"must have required property '"+"schema_version"+"'"};if(vErrors === null){vErrors = [err0];}else {vErrors.push(err0);}errors++;}if(data.request_id === undefined){const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "request_id"},message:"must have required property '"+"request_id"+"'"};if(vErrors === null){vErrors = [err1];}else {vErrors.push(err1);}errors++;}if(data.error === undefined){const err2 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "error"},message:"must have required property '"+"error"+"'"};if(vErrors === null){vErrors = [err2];}else {vErrors.push(err2);}errors++;}for(const key0 in data){if(!(((key0 === "schema_version") || (key0 === "request_id")) || (key0 === "error"))){const err3 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err3];}else {vErrors.push(err3);}errors++;}}if(data.schema_version !== undefined){if("2.0" !== data.schema_version){const err4 = {instancePath:instancePath+"/schema_version",schemaPath:"#/properties/schema_version/const",keyword:"const",params:{allowedValue: "2.0"},message:"must be equal to constant"};if(vErrors === null){vErrors = [err4];}else {vErrors.push(err4);}errors++;}}if(data.request_id !== undefined){let data1 = data.request_id;const _errs4 = errors;let valid1 = false;const _errs5 = errors;if(typeof data1 === "string"){if(!pattern4.test(data1)){const err5 = {instancePath:instancePath+"/request_id",schemaPath:"#/properties/request_id/anyOf/0/pattern",keyword:"pattern",params:{pattern: "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"},message:"must match pattern \""+"^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"+"\""};if(vErrors === null){vErrors = [err5];}else {vErrors.push(err5);}errors++;}if(!(formats0.test(data1))){const err6 = {instancePath:instancePath+"/request_id",schemaPath:"#/properties/request_id/anyOf/0/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};if(vErrors === null){vErrors = [err6];}else {vErrors.push(err6);}errors++;}}else {const err7 = {instancePath:instancePath+"/request_id",schemaPath:"#/properties/request_id/anyOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err7];}else {vErrors.push(err7);}errors++;}var _valid0 = _errs5 === errors;valid1 = valid1 || _valid0;const _errs7 = errors;if(data1 !== null){const err8 = {instancePath:instancePath+"/request_id",schemaPath:"#/properties/request_id/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};if(vErrors === null){vErrors = [err8];}else {vErrors.push(err8);}errors++;}var _valid0 = _errs7 === errors;valid1 = valid1 || _valid0;if(!valid1){const err9 = {instancePath:instancePath+"/request_id",schemaPath:"#/properties/request_id/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};if(vErrors === null){vErrors = [err9];}else {vErrors.push(err9);}errors++;}else {errors = _errs4;if(vErrors !== null){if(_errs4){vErrors.length = _errs4;}else {vErrors = null;}}}}if(data.error !== undefined){let data2 = data.error;if(data2 && typeof data2 == "object" && !Array.isArray(data2)){if(data2.code === undefined){const err10 = {instancePath:instancePath+"/error",schemaPath:"#/properties/error/required",keyword:"required",params:{missingProperty: "code"},message:"must have required property '"+"code"+"'"};if(vErrors === null){vErrors = [err10];}else {vErrors.push(err10);}errors++;}if(data2.message === undefined){const err11 = {instancePath:instancePath+"/error",schemaPath:"#/properties/error/required",keyword:"required",params:{missingProperty: "message"},message:"must have required property '"+"message"+"'"};if(vErrors === null){vErrors = [err11];}else {vErrors.push(err11);}errors++;}if(data2.retryable === undefined){const err12 = {instancePath:instancePath+"/error",schemaPath:"#/properties/error/required",keyword:"required",params:{missingProperty: "retryable"},message:"must have required property '"+"retryable"+"'"};if(vErrors === null){vErrors = [err12];}else {vErrors.push(err12);}errors++;}if(data2.details === undefined){const err13 = {instancePath:instancePath+"/error",schemaPath:"#/properties/error/required",keyword:"required",params:{missingProperty: "details"},message:"must have required property '"+"details"+"'"};if(vErrors === null){vErrors = [err13];}else {vErrors.push(err13);}errors++;}for(const key1 in data2){if(!((((key1 === "code") || (key1 === "message")) || (key1 === "retryable")) || (key1 === "details"))){const err14 = {instancePath:instancePath+"/error",schemaPath:"#/properties/error/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err14];}else {vErrors.push(err14);}errors++;}}if(data2.code !== undefined){let data3 = data2.code;if(typeof data3 !== "string"){const err15 = {instancePath:instancePath+"/error/code",schemaPath:"#/properties/error/properties/code/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err15];}else {vErrors.push(err15);}errors++;}if(!(((((((((((((((((data3 === "invalid_request") || (data3 === "unsupported_question")) || (data3 === "invalid_image")) || (data3 === "request_too_large")) || (data3 === "model_not_found")) || (data3 === "model_not_supported")) || (data3 === "authentication_required")) || (data3 === "permission_denied")) || (data3 === "payment_required")) || (data3 === "rate_limited")) || (data3 === "provider_refusal")) || (data3 === "provider_invalid_output")) || (data3 === "upstream_error")) || (data3 === "timeout")) || (data3 === "internal_error")) || (data3 === "unsupported_version")) || (data3 === "provider_incomplete_output"))){const err16 = {instancePath:instancePath+"/error/code",schemaPath:"#/properties/error/properties/code/enum",keyword:"enum",params:{allowedValues: schema55.properties.error.properties.code.enum},message:"must be equal to one of the allowed values"};if(vErrors === null){vErrors = [err16];}else {vErrors.push(err16);}errors++;}}if(data2.message !== undefined){if(typeof data2.message !== "string"){const err17 = {instancePath:instancePath+"/error/message",schemaPath:"#/properties/error/properties/message/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err17];}else {vErrors.push(err17);}errors++;}}if(data2.retryable !== undefined){if(typeof data2.retryable !== "boolean"){const err18 = {instancePath:instancePath+"/error/retryable",schemaPath:"#/properties/error/properties/retryable/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};if(vErrors === null){vErrors = [err18];}else {vErrors.push(err18);}errors++;}}if(data2.details !== undefined){let data6 = data2.details;if(Array.isArray(data6)){const len0 = data6.length;for(let i0=0; i0<len0; i0++){let data7 = data6[i0];if(data7 && typeof data7 == "object" && !Array.isArray(data7)){if(data7.path === undefined){const err19 = {instancePath:instancePath+"/error/details/" + i0,schemaPath:"#/properties/error/properties/details/items/required",keyword:"required",params:{missingProperty: "path"},message:"must have required property '"+"path"+"'"};if(vErrors === null){vErrors = [err19];}else {vErrors.push(err19);}errors++;}if(data7.code === undefined){const err20 = {instancePath:instancePath+"/error/details/" + i0,schemaPath:"#/properties/error/properties/details/items/required",keyword:"required",params:{missingProperty: "code"},message:"must have required property '"+"code"+"'"};if(vErrors === null){vErrors = [err20];}else {vErrors.push(err20);}errors++;}for(const key2 in data7){if(!((key2 === "path") || (key2 === "code"))){const err21 = {instancePath:instancePath+"/error/details/" + i0,schemaPath:"#/properties/error/properties/details/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key2},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err21];}else {vErrors.push(err21);}errors++;}}if(data7.path !== undefined){if(typeof data7.path !== "string"){const err22 = {instancePath:instancePath+"/error/details/" + i0+"/path",schemaPath:"#/properties/error/properties/details/items/properties/path/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err22];}else {vErrors.push(err22);}errors++;}}if(data7.code !== undefined){if(typeof data7.code !== "string"){const err23 = {instancePath:instancePath+"/error/details/" + i0+"/code",schemaPath:"#/properties/error/properties/details/items/properties/code/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err23];}else {vErrors.push(err23);}errors++;}}}else {const err24 = {instancePath:instancePath+"/error/details/" + i0,schemaPath:"#/properties/error/properties/details/items/type",keyword:"type",params:{type: "object"},message:"must be object"};if(vErrors === null){vErrors = [err24];}else {vErrors.push(err24);}errors++;}}}else {const err25 = {instancePath:instancePath+"/error/details",schemaPath:"#/properties/error/properties/details/type",keyword:"type",params:{type: "array"},message:"must be array"};if(vErrors === null){vErrors = [err25];}else {vErrors.push(err25);}errors++;}}}else {const err26 = {instancePath:instancePath+"/error",schemaPath:"#/properties/error/type",keyword:"type",params:{type: "object"},message:"must be object"};if(vErrors === null){vErrors = [err26];}else {vErrors.push(err26);}errors++;}}}else {const err27 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};if(vErrors === null){vErrors = [err27];}else {vErrors.push(err27);}errors++;}validate62.errors = vErrors;return errors === 0;}validate62.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};const validateModelsResponse = validate63;const schema56 = {"properties":{"models":{"items":{"properties":{"input_modalities":{"items":{"enum":["text","image"]}}}}}}};function validate63(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){let vErrors = null;let errors = 0;const evaluated0 = validate63.evaluated;if(evaluated0.dynamicProps){evaluated0.props = undefined;}if(evaluated0.dynamicItems){evaluated0.items = undefined;}if(data && typeof data == "object" && !Array.isArray(data)){if(data.schema_version === undefined){const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "schema_version"},message:"must have required property '"+"schema_version"+"'"};if(vErrors === null){vErrors = [err0];}else {vErrors.push(err0);}errors++;}if(data.models === undefined){const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "models"},message:"must have required property '"+"models"+"'"};if(vErrors === null){vErrors = [err1];}else {vErrors.push(err1);}errors++;}if(data.credits_remaining === undefined){const err2 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "credits_remaining"},message:"must have required property '"+"credits_remaining"+"'"};if(vErrors === null){vErrors = [err2];}else {vErrors.push(err2);}errors++;}for(const key0 in data){if(!(((key0 === "schema_version") || (key0 === "models")) || (key0 === "credits_remaining"))){const err3 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err3];}else {vErrors.push(err3);}errors++;}}if(data.schema_version !== undefined){if("2.0" !== data.schema_version){const err4 = {instancePath:instancePath+"/schema_version",schemaPath:"#/properties/schema_version/const",keyword:"const",params:{allowedValue: "2.0"},message:"must be equal to constant"};if(vErrors === null){vErrors = [err4];}else {vErrors.push(err4);}errors++;}}if(data.models !== undefined){let data1 = data.models;if(Array.isArray(data1)){const len0 = data1.length;for(let i0=0; i0<len0; i0++){let data2 = data1[i0];if(data2 && typeof data2 == "object" && !Array.isArray(data2)){if(data2.id === undefined){const err5 = {instancePath:instancePath+"/models/" + i0,schemaPath:"#/properties/models/items/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};if(vErrors === null){vErrors = [err5];}else {vErrors.push(err5);}errors++;}if(data2.name === undefined){const err6 = {instancePath:instancePath+"/models/" + i0,schemaPath:"#/properties/models/items/required",keyword:"required",params:{missingProperty: "name"},message:"must have required property '"+"name"+"'"};if(vErrors === null){vErrors = [err6];}else {vErrors.push(err6);}errors++;}if(data2.is_default === undefined){const err7 = {instancePath:instancePath+"/models/" + i0,schemaPath:"#/properties/models/items/required",keyword:"required",params:{missingProperty: "is_default"},message:"must have required property '"+"is_default"+"'"};if(vErrors === null){vErrors = [err7];}else {vErrors.push(err7);}errors++;}if(data2.display_order === undefined){const err8 = {instancePath:instancePath+"/models/" + i0,schemaPath:"#/properties/models/items/required",keyword:"required",params:{missingProperty: "display_order"},message:"must have required property '"+"display_order"+"'"};if(vErrors === null){vErrors = [err8];}else {vErrors.push(err8);}errors++;}if(data2.input_modalities === undefined){const err9 = {instancePath:instancePath+"/models/" + i0,schemaPath:"#/properties/models/items/required",keyword:"required",params:{missingProperty: "input_modalities"},message:"must have required property '"+"input_modalities"+"'"};if(vErrors === null){vErrors = [err9];}else {vErrors.push(err9);}errors++;}if(data2.structured_outputs === undefined){const err10 = {instancePath:instancePath+"/models/" + i0,schemaPath:"#/properties/models/items/required",keyword:"required",params:{missingProperty: "structured_outputs"},message:"must have required property '"+"structured_outputs"+"'"};if(vErrors === null){vErrors = [err10];}else {vErrors.push(err10);}errors++;}if(data2.reasoning_levels === undefined){const err11 = {instancePath:instancePath+"/models/" + i0,schemaPath:"#/properties/models/items/required",keyword:"required",params:{missingProperty: "reasoning_levels"},message:"must have required property '"+"reasoning_levels"+"'"};if(vErrors === null){vErrors = [err11];}else {vErrors.push(err11);}errors++;}for(const key1 in data2){if(!(((((((key1 === "id") || (key1 === "name")) || (key1 === "is_default")) || (key1 === "display_order")) || (key1 === "input_modalities")) || (key1 === "structured_outputs")) || (key1 === "reasoning_levels"))){const err12 = {instancePath:instancePath+"/models/" + i0,schemaPath:"#/properties/models/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err12];}else {vErrors.push(err12);}errors++;}}if(data2.id !== undefined){if(typeof data2.id !== "string"){const err13 = {instancePath:instancePath+"/models/" + i0+"/id",schemaPath:"#/properties/models/items/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err13];}else {vErrors.push(err13);}errors++;}}if(data2.name !== undefined){if(typeof data2.name !== "string"){const err14 = {instancePath:instancePath+"/models/" + i0+"/name",schemaPath:"#/properties/models/items/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err14];}else {vErrors.push(err14);}errors++;}}if(data2.is_default !== undefined){if(typeof data2.is_default !== "boolean"){const err15 = {instancePath:instancePath+"/models/" + i0+"/is_default",schemaPath:"#/properties/models/items/properties/is_default/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};if(vErrors === null){vErrors = [err15];}else {vErrors.push(err15);}errors++;}}if(data2.display_order !== undefined){let data6 = data2.display_order;if(!((typeof data6 == "number") && (!(data6 % 1) && !isNaN(data6)))){const err16 = {instancePath:instancePath+"/models/" + i0+"/display_order",schemaPath:"#/properties/models/items/properties/display_order/type",keyword:"type",params:{type: "integer"},message:"must be integer"};if(vErrors === null){vErrors = [err16];}else {vErrors.push(err16);}errors++;}}if(data2.input_modalities !== undefined){let data7 = data2.input_modalities;if(Array.isArray(data7)){if(data7.length < 1){const err17 = {instancePath:instancePath+"/models/" + i0+"/input_modalities",schemaPath:"#/properties/models/items/properties/input_modalities/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};if(vErrors === null){vErrors = [err17];}else {vErrors.push(err17);}errors++;}const len1 = data7.length;for(let i1=0; i1<len1; i1++){let data8 = data7[i1];if(typeof data8 !== "string"){const err18 = {instancePath:instancePath+"/models/" + i0+"/input_modalities/" + i1,schemaPath:"#/properties/models/items/properties/input_modalities/items/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err18];}else {vErrors.push(err18);}errors++;}if(!((data8 === "text") || (data8 === "image"))){const err19 = {instancePath:instancePath+"/models/" + i0+"/input_modalities/" + i1,schemaPath:"#/properties/models/items/properties/input_modalities/items/enum",keyword:"enum",params:{allowedValues: schema56.properties.models.items.properties.input_modalities.items.enum},message:"must be equal to one of the allowed values"};if(vErrors === null){vErrors = [err19];}else {vErrors.push(err19);}errors++;}}let i2 = data7.length;let j0;if(i2 > 1){const indices0 = {};for(;i2--;){let item0 = data7[i2];if(typeof item0 !== "string"){continue;}if(typeof indices0[item0] == "number"){j0 = indices0[item0];const err20 = {instancePath:instancePath+"/models/" + i0+"/input_modalities",schemaPath:"#/properties/models/items/properties/input_modalities/uniqueItems",keyword:"uniqueItems",params:{i: i2, j: j0},message:"must NOT have duplicate items (items ## "+j0+" and "+i2+" are identical)"};if(vErrors === null){vErrors = [err20];}else {vErrors.push(err20);}errors++;break;}indices0[item0] = i2;}}}else {const err21 = {instancePath:instancePath+"/models/" + i0+"/input_modalities",schemaPath:"#/properties/models/items/properties/input_modalities/type",keyword:"type",params:{type: "array"},message:"must be array"};if(vErrors === null){vErrors = [err21];}else {vErrors.push(err21);}errors++;}}if(data2.structured_outputs !== undefined){if(typeof data2.structured_outputs !== "boolean"){const err22 = {instancePath:instancePath+"/models/" + i0+"/structured_outputs",schemaPath:"#/properties/models/items/properties/structured_outputs/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};if(vErrors === null){vErrors = [err22];}else {vErrors.push(err22);}errors++;}}if(data2.reasoning_levels !== undefined){let data10 = data2.reasoning_levels;if(Array.isArray(data10)){if(data10.length > 7){const err23 = {instancePath:instancePath+"/models/" + i0+"/reasoning_levels",schemaPath:"#/properties/models/items/properties/reasoning_levels/maxItems",keyword:"maxItems",params:{limit: 7},message:"must NOT have more than 7 items"};if(vErrors === null){vErrors = [err23];}else {vErrors.push(err23);}errors++;}if(data10.length < 1){const err24 = {instancePath:instancePath+"/models/" + i0+"/reasoning_levels",schemaPath:"#/properties/models/items/properties/reasoning_levels/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};if(vErrors === null){vErrors = [err24];}else {vErrors.push(err24);}errors++;}const len2 = data10.length;for(let i3=0; i3<len2; i3++){let data11 = data10[i3];if(data11 && typeof data11 == "object" && !Array.isArray(data11)){if(data11.key === undefined){const err25 = {instancePath:instancePath+"/models/" + i0+"/reasoning_levels/" + i3,schemaPath:"#/$defs/ReasoningLevel/required",keyword:"required",params:{missingProperty: "key"},message:"must have required property '"+"key"+"'"};if(vErrors === null){vErrors = [err25];}else {vErrors.push(err25);}errors++;}if(data11.label === undefined){const err26 = {instancePath:instancePath+"/models/" + i0+"/reasoning_levels/" + i3,schemaPath:"#/$defs/ReasoningLevel/required",keyword:"required",params:{missingProperty: "label"},message:"must have required property '"+"label"+"'"};if(vErrors === null){vErrors = [err26];}else {vErrors.push(err26);}errors++;}for(const key2 in data11){if(!((key2 === "key") || (key2 === "label"))){const err27 = {instancePath:instancePath+"/models/" + i0+"/reasoning_levels/" + i3,schemaPath:"#/$defs/ReasoningLevel/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key2},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err27];}else {vErrors.push(err27);}errors++;}}if(data11.key !== undefined){let data12 = data11.key;if(typeof data12 === "string"){if(func1(data12) > 32){const err28 = {instancePath:instancePath+"/models/" + i0+"/reasoning_levels/" + i3+"/key",schemaPath:"#/$defs/ReasoningLevel/properties/key/maxLength",keyword:"maxLength",params:{limit: 32},message:"must NOT have more than 32 characters"};if(vErrors === null){vErrors = [err28];}else {vErrors.push(err28);}errors++;}if(func1(data12) < 1){const err29 = {instancePath:instancePath+"/models/" + i0+"/reasoning_levels/" + i3+"/key",schemaPath:"#/$defs/ReasoningLevel/properties/key/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};if(vErrors === null){vErrors = [err29];}else {vErrors.push(err29);}errors++;}}else {const err30 = {instancePath:instancePath+"/models/" + i0+"/reasoning_levels/" + i3+"/key",schemaPath:"#/$defs/ReasoningLevel/properties/key/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err30];}else {vErrors.push(err30);}errors++;}}if(data11.label !== undefined){let data13 = data11.label;if(typeof data13 === "string"){if(func1(data13) > 80){const err31 = {instancePath:instancePath+"/models/" + i0+"/reasoning_levels/" + i3+"/label",schemaPath:"#/$defs/ReasoningLevel/properties/label/maxLength",keyword:"maxLength",params:{limit: 80},message:"must NOT have more than 80 characters"};if(vErrors === null){vErrors = [err31];}else {vErrors.push(err31);}errors++;}if(func1(data13) < 1){const err32 = {instancePath:instancePath+"/models/" + i0+"/reasoning_levels/" + i3+"/label",schemaPath:"#/$defs/ReasoningLevel/properties/label/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};if(vErrors === null){vErrors = [err32];}else {vErrors.push(err32);}errors++;}}else {const err33 = {instancePath:instancePath+"/models/" + i0+"/reasoning_levels/" + i3+"/label",schemaPath:"#/$defs/ReasoningLevel/properties/label/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err33];}else {vErrors.push(err33);}errors++;}}}else {const err34 = {instancePath:instancePath+"/models/" + i0+"/reasoning_levels/" + i3,schemaPath:"#/$defs/ReasoningLevel/type",keyword:"type",params:{type: "object"},message:"must be object"};if(vErrors === null){vErrors = [err34];}else {vErrors.push(err34);}errors++;}}}else {const err35 = {instancePath:instancePath+"/models/" + i0+"/reasoning_levels",schemaPath:"#/properties/models/items/properties/reasoning_levels/type",keyword:"type",params:{type: "array"},message:"must be array"};if(vErrors === null){vErrors = [err35];}else {vErrors.push(err35);}errors++;}}}else {const err36 = {instancePath:instancePath+"/models/" + i0,schemaPath:"#/properties/models/items/type",keyword:"type",params:{type: "object"},message:"must be object"};if(vErrors === null){vErrors = [err36];}else {vErrors.push(err36);}errors++;}}}else {const err37 = {instancePath:instancePath+"/models",schemaPath:"#/properties/models/type",keyword:"type",params:{type: "array"},message:"must be array"};if(vErrors === null){vErrors = [err37];}else {vErrors.push(err37);}errors++;}}if(data.credits_remaining !== undefined){let data14 = data.credits_remaining;if(!((typeof data14 == "number") && (!(data14 % 1) && !isNaN(data14)))){const err38 = {instancePath:instancePath+"/credits_remaining",schemaPath:"#/properties/credits_remaining/type",keyword:"type",params:{type: "integer"},message:"must be integer"};if(vErrors === null){vErrors = [err38];}else {vErrors.push(err38);}errors++;}if(typeof data14 == "number"){if(data14 < 0 || isNaN(data14)){const err39 = {instancePath:instancePath+"/credits_remaining",schemaPath:"#/properties/credits_remaining/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};if(vErrors === null){vErrors = [err39];}else {vErrors.push(err39);}errors++;}}}}else {const err40 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};if(vErrors === null){vErrors = [err40];}else {vErrors.push(err40);}errors++;}validate63.errors = vErrors;return errors === 0;}validate63.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};const validateCapabilitiesResponse = validate64;const schema58 = {"properties":{"image_mime_types":{"items":{"enum":["image/png","image/jpeg"]}}}};const func0 = runtimeHelper1;function validate64(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){let vErrors = null;let errors = 0;const evaluated0 = validate64.evaluated;if(evaluated0.dynamicProps){evaluated0.props = undefined;}if(evaluated0.dynamicItems){evaluated0.items = undefined;}if(data && typeof data == "object" && !Array.isArray(data)){if(data.schema_version === undefined){const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "schema_version"},message:"must have required property '"+"schema_version"+"'"};if(vErrors === null){vErrors = [err0];}else {vErrors.push(err0);}errors++;}if(data.schema_versions === undefined){const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "schema_versions"},message:"must have required property '"+"schema_versions"+"'"};if(vErrors === null){vErrors = [err1];}else {vErrors.push(err1);}errors++;}if(data.question_types === undefined){const err2 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "question_types"},message:"must have required property '"+"question_types"+"'"};if(vErrors === null){vErrors = [err2];}else {vErrors.push(err2);}errors++;}if(data.limits === undefined){const err3 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "limits"},message:"must have required property '"+"limits"+"'"};if(vErrors === null){vErrors = [err3];}else {vErrors.push(err3);}errors++;}if(data.image_mime_types === undefined){const err4 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "image_mime_types"},message:"must have required property '"+"image_mime_types"+"'"};if(vErrors === null){vErrors = [err4];}else {vErrors.push(err4);}errors++;}for(const key0 in data){if(!(((((key0 === "schema_version") || (key0 === "schema_versions")) || (key0 === "question_types")) || (key0 === "limits")) || (key0 === "image_mime_types"))){const err5 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err5];}else {vErrors.push(err5);}errors++;}}if(data.schema_version !== undefined){if("2.0" !== data.schema_version){const err6 = {instancePath:instancePath+"/schema_version",schemaPath:"#/properties/schema_version/const",keyword:"const",params:{allowedValue: "2.0"},message:"must be equal to constant"};if(vErrors === null){vErrors = [err6];}else {vErrors.push(err6);}errors++;}}if(data.schema_versions !== undefined){let data1 = data.schema_versions;if(Array.isArray(data1)){if(data1.length > 1){const err7 = {instancePath:instancePath+"/schema_versions",schemaPath:"#/properties/schema_versions/maxItems",keyword:"maxItems",params:{limit: 1},message:"must NOT have more than 1 items"};if(vErrors === null){vErrors = [err7];}else {vErrors.push(err7);}errors++;}if(data1.length < 1){const err8 = {instancePath:instancePath+"/schema_versions",schemaPath:"#/properties/schema_versions/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};if(vErrors === null){vErrors = [err8];}else {vErrors.push(err8);}errors++;}const len0 = data1.length;for(let i0=0; i0<len0; i0++){if("2.0" !== data1[i0]){const err9 = {instancePath:instancePath+"/schema_versions/" + i0,schemaPath:"#/properties/schema_versions/items/const",keyword:"const",params:{allowedValue: "2.0"},message:"must be equal to constant"};if(vErrors === null){vErrors = [err9];}else {vErrors.push(err9);}errors++;}}}else {const err10 = {instancePath:instancePath+"/schema_versions",schemaPath:"#/properties/schema_versions/type",keyword:"type",params:{type: "array"},message:"must be array"};if(vErrors === null){vErrors = [err10];}else {vErrors.push(err10);}errors++;}}if(data.question_types !== undefined){let data3 = data.question_types;if(Array.isArray(data3)){const len1 = data3.length;for(let i1=0; i1<len1; i1++){let data4 = data3[i1];if(typeof data4 !== "string"){const err11 = {instancePath:instancePath+"/question_types/" + i1,schemaPath:"#/$defs/QuestionType/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err11];}else {vErrors.push(err11);}errors++;}if(!((((((((((((((((data4 === "multichoice") || (data4 === "truefalse")) || (data4 === "shortanswer")) || (data4 === "numerical")) || (data4 === "calculated")) || (data4 === "calculatedsimple")) || (data4 === "calculatedmulti")) || (data4 === "match")) || (data4 === "randomsamatch")) || (data4 === "multianswer")) || (data4 === "gapselect")) || (data4 === "ddwtos")) || (data4 === "ddimageortext")) || (data4 === "ddmarker")) || (data4 === "ordering")) || (data4 === "essay"))){const err12 = {instancePath:instancePath+"/question_types/" + i1,schemaPath:"#/$defs/QuestionType/enum",keyword:"enum",params:{allowedValues: schema34.enum},message:"must be equal to one of the allowed values"};if(vErrors === null){vErrors = [err12];}else {vErrors.push(err12);}errors++;}}let i2 = data3.length;let j0;if(i2 > 1){outer0:for(;i2--;){for(j0 = i2; j0--;){if(func0(data3[i2], data3[j0])){const err13 = {instancePath:instancePath+"/question_types",schemaPath:"#/properties/question_types/uniqueItems",keyword:"uniqueItems",params:{i: i2, j: j0},message:"must NOT have duplicate items (items ## "+j0+" and "+i2+" are identical)"};if(vErrors === null){vErrors = [err13];}else {vErrors.push(err13);}errors++;break outer0;}}}}}else {const err14 = {instancePath:instancePath+"/question_types",schemaPath:"#/properties/question_types/type",keyword:"type",params:{type: "array"},message:"must be array"};if(vErrors === null){vErrors = [err14];}else {vErrors.push(err14);}errors++;}}if(data.limits !== undefined){let data5 = data.limits;if(data5 && typeof data5 == "object" && !Array.isArray(data5)){if(data5.max_assets === undefined){const err15 = {instancePath:instancePath+"/limits",schemaPath:"#/properties/limits/required",keyword:"required",params:{missingProperty: "max_assets"},message:"must have required property '"+"max_assets"+"'"};if(vErrors === null){vErrors = [err15];}else {vErrors.push(err15);}errors++;}if(data5.max_asset_bytes === undefined){const err16 = {instancePath:instancePath+"/limits",schemaPath:"#/properties/limits/required",keyword:"required",params:{missingProperty: "max_asset_bytes"},message:"must have required property '"+"max_asset_bytes"+"'"};if(vErrors === null){vErrors = [err16];}else {vErrors.push(err16);}errors++;}if(data5.max_request_bytes === undefined){const err17 = {instancePath:instancePath+"/limits",schemaPath:"#/properties/limits/required",keyword:"required",params:{missingProperty: "max_request_bytes"},message:"must have required property '"+"max_request_bytes"+"'"};if(vErrors === null){vErrors = [err17];}else {vErrors.push(err17);}errors++;}if(data5.max_context_characters === undefined){const err18 = {instancePath:instancePath+"/limits",schemaPath:"#/properties/limits/required",keyword:"required",params:{missingProperty: "max_context_characters"},message:"must have required property '"+"max_context_characters"+"'"};if(vErrors === null){vErrors = [err18];}else {vErrors.push(err18);}errors++;}if(data5.max_question_characters === undefined){const err19 = {instancePath:instancePath+"/limits",schemaPath:"#/properties/limits/required",keyword:"required",params:{missingProperty: "max_question_characters"},message:"must have required property '"+"max_question_characters"+"'"};if(vErrors === null){vErrors = [err19];}else {vErrors.push(err19);}errors++;}if(data5.max_fields === undefined){const err20 = {instancePath:instancePath+"/limits",schemaPath:"#/properties/limits/required",keyword:"required",params:{missingProperty: "max_fields"},message:"must have required property '"+"max_fields"+"'"};if(vErrors === null){vErrors = [err20];}else {vErrors.push(err20);}errors++;}if(data5.max_depth === undefined){const err21 = {instancePath:instancePath+"/limits",schemaPath:"#/properties/limits/required",keyword:"required",params:{missingProperty: "max_depth"},message:"must have required property '"+"max_depth"+"'"};if(vErrors === null){vErrors = [err21];}else {vErrors.push(err21);}errors++;}for(const key1 in data5){if(!(((((((key1 === "max_assets") || (key1 === "max_asset_bytes")) || (key1 === "max_request_bytes")) || (key1 === "max_context_characters")) || (key1 === "max_question_characters")) || (key1 === "max_fields")) || (key1 === "max_depth"))){const err22 = {instancePath:instancePath+"/limits",schemaPath:"#/properties/limits/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err22];}else {vErrors.push(err22);}errors++;}}if(data5.max_assets !== undefined){if(64 !== data5.max_assets){const err23 = {instancePath:instancePath+"/limits/max_assets",schemaPath:"#/properties/limits/properties/max_assets/const",keyword:"const",params:{allowedValue: 64},message:"must be equal to constant"};if(vErrors === null){vErrors = [err23];}else {vErrors.push(err23);}errors++;}}if(data5.max_asset_bytes !== undefined){if(5242880 !== data5.max_asset_bytes){const err24 = {instancePath:instancePath+"/limits/max_asset_bytes",schemaPath:"#/properties/limits/properties/max_asset_bytes/const",keyword:"const",params:{allowedValue: 5242880},message:"must be equal to constant"};if(vErrors === null){vErrors = [err24];}else {vErrors.push(err24);}errors++;}}if(data5.max_request_bytes !== undefined){if(20971520 !== data5.max_request_bytes){const err25 = {instancePath:instancePath+"/limits/max_request_bytes",schemaPath:"#/properties/limits/properties/max_request_bytes/const",keyword:"const",params:{allowedValue: 20971520},message:"must be equal to constant"};if(vErrors === null){vErrors = [err25];}else {vErrors.push(err25);}errors++;}}if(data5.max_context_characters !== undefined){if(75000 !== data5.max_context_characters){const err26 = {instancePath:instancePath+"/limits/max_context_characters",schemaPath:"#/properties/limits/properties/max_context_characters/const",keyword:"const",params:{allowedValue: 75000},message:"must be equal to constant"};if(vErrors === null){vErrors = [err26];}else {vErrors.push(err26);}errors++;}}if(data5.max_question_characters !== undefined){if(100000 !== data5.max_question_characters){const err27 = {instancePath:instancePath+"/limits/max_question_characters",schemaPath:"#/properties/limits/properties/max_question_characters/const",keyword:"const",params:{allowedValue: 100000},message:"must be equal to constant"};if(vErrors === null){vErrors = [err27];}else {vErrors.push(err27);}errors++;}}if(data5.max_fields !== undefined){if(256 !== data5.max_fields){const err28 = {instancePath:instancePath+"/limits/max_fields",schemaPath:"#/properties/limits/properties/max_fields/const",keyword:"const",params:{allowedValue: 256},message:"must be equal to constant"};if(vErrors === null){vErrors = [err28];}else {vErrors.push(err28);}errors++;}}if(data5.max_depth !== undefined){if(32 !== data5.max_depth){const err29 = {instancePath:instancePath+"/limits/max_depth",schemaPath:"#/properties/limits/properties/max_depth/const",keyword:"const",params:{allowedValue: 32},message:"must be equal to constant"};if(vErrors === null){vErrors = [err29];}else {vErrors.push(err29);}errors++;}}}else {const err30 = {instancePath:instancePath+"/limits",schemaPath:"#/properties/limits/type",keyword:"type",params:{type: "object"},message:"must be object"};if(vErrors === null){vErrors = [err30];}else {vErrors.push(err30);}errors++;}}if(data.image_mime_types !== undefined){let data13 = data.image_mime_types;if(Array.isArray(data13)){if(data13.length > 2){const err31 = {instancePath:instancePath+"/image_mime_types",schemaPath:"#/properties/image_mime_types/maxItems",keyword:"maxItems",params:{limit: 2},message:"must NOT have more than 2 items"};if(vErrors === null){vErrors = [err31];}else {vErrors.push(err31);}errors++;}if(data13.length < 2){const err32 = {instancePath:instancePath+"/image_mime_types",schemaPath:"#/properties/image_mime_types/minItems",keyword:"minItems",params:{limit: 2},message:"must NOT have fewer than 2 items"};if(vErrors === null){vErrors = [err32];}else {vErrors.push(err32);}errors++;}const len2 = data13.length;for(let i3=0; i3<len2; i3++){let data14 = data13[i3];if(typeof data14 !== "string"){const err33 = {instancePath:instancePath+"/image_mime_types/" + i3,schemaPath:"#/properties/image_mime_types/items/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err33];}else {vErrors.push(err33);}errors++;}if(!((data14 === "image/png") || (data14 === "image/jpeg"))){const err34 = {instancePath:instancePath+"/image_mime_types/" + i3,schemaPath:"#/properties/image_mime_types/items/enum",keyword:"enum",params:{allowedValues: schema58.properties.image_mime_types.items.enum},message:"must be equal to one of the allowed values"};if(vErrors === null){vErrors = [err34];}else {vErrors.push(err34);}errors++;}}let i4 = data13.length;let j1;if(i4 > 1){const indices0 = {};for(;i4--;){let item0 = data13[i4];if(typeof item0 !== "string"){continue;}if(typeof indices0[item0] == "number"){j1 = indices0[item0];const err35 = {instancePath:instancePath+"/image_mime_types",schemaPath:"#/properties/image_mime_types/uniqueItems",keyword:"uniqueItems",params:{i: i4, j: j1},message:"must NOT have duplicate items (items ## "+j1+" and "+i4+" are identical)"};if(vErrors === null){vErrors = [err35];}else {vErrors.push(err35);}errors++;break;}indices0[item0] = i4;}}}else {const err36 = {instancePath:instancePath+"/image_mime_types",schemaPath:"#/properties/image_mime_types/type",keyword:"type",params:{type: "array"},message:"must be array"};if(vErrors === null){vErrors = [err36];}else {vErrors.push(err36);}errors++;}}}else {const err37 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};if(vErrors === null){vErrors = [err37];}else {vErrors.push(err37);}errors++;}validate64.errors = vErrors;return errors === 0;}validate64.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

	function parseStrictJSON(text) {
	    if (new TextEncoder().encode(text).length > 20 * 1024 * 1024)
	        throw new AdapterError('request_too_large', 'JSON exceeds the response limit.');
	    let offset = 0;
	    const space = () => { while (/[ \t\r\n]/.test(text[offset] || '') && offset < text.length)
	        offset++; };
	    const string = () => {
	        const start = offset++;
	        while (offset < text.length) {
	            const char = text[offset++];
	            if (char === '\\')
	                offset++;
	            else if (char === '"')
	                return JSON.parse(text.slice(start, offset));
	        }
	        throw new Error('Unterminated JSON string.');
	    };
	    const read = (depth) => {
	        if (depth > 32)
	            throw new Error('JSON nesting exceeds 32.');
	        space();
	        if (text[offset] === '"')
	            return string();
	        if (text[offset] === '{') {
	            offset++;
	            space();
	            const result = Object.create(null);
	            if (text[offset] === '}') {
	                offset++;
	                return result;
	            }
	            while (true) {
	                space();
	                if (text[offset] !== '"')
	                    throw new Error('Expected a JSON object key.');
	                const key = string();
	                if (Object.prototype.hasOwnProperty.call(result, key))
	                    throw new Error('Duplicate JSON object key.');
	                space();
	                if (text[offset++] !== ':')
	                    throw new Error('Expected a JSON colon.');
	                result[key] = read(depth + 1);
	                space();
	                const separator = text[offset++];
	                if (separator === '}')
	                    return result;
	                if (separator !== ',')
	                    throw new Error('Expected a JSON object separator.');
	            }
	        }
	        if (text[offset] === '[') {
	            offset++;
	            space();
	            const array = [];
	            if (text[offset] === ']') {
	                offset++;
	                return array;
	            }
	            while (true) {
	                array.push(read(depth + 1));
	                space();
	                const separator = text[offset++];
	                if (separator === ']')
	                    return array;
	                if (separator !== ',')
	                    throw new Error('Expected a JSON array separator.');
	            }
	        }
	        const match = /^(?:true|false|null|-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?)/.exec(text.slice(offset));
	        if (!match)
	            throw new Error('Invalid JSON value.');
	        offset += match[0].length;
	        const value = JSON.parse(match[0]);
	        if (typeof value === 'number' && !Number.isFinite(value))
	            throw new Error('Non-finite JSON number.');
	        return value;
	    };
	    const result = read(0);
	    space();
	    if (offset !== text.length)
	        throw new Error('Trailing content after JSON.');
	    return result;
	}
	function validateAnswerForQuestion(question, value) {
	    var _a;
	    if (!validateQuestion(question) || !validateAnswer(value))
	        throw new AdapterError('invalid_answer', 'The answer does not match the v2 contract.');
	    const answer = value;
	    const keys = Object.keys(question.fields);
	    if (Object.keys(answer.fields).length !== keys.length || keys.some(id => !(id in answer.fields)))
	        throw new AdapterError('invalid_answer', 'The answer does not cover every question field.');
	    const uses = new Map();
	    for (const id of keys) {
	        const field = question.fields[id];
	        const result = answer.fields[id];
	        if (field.kind !== result.kind)
	            throw new AdapterError('invalid_answer', 'The answer field has the wrong kind.');
	        if ((field.kind === 'single_choice' || field.kind === 'multiple_choice') && (result.kind === 'single_choice' || result.kind === 'multiple_choice')) {
	            const selected = result.kind === 'single_choice' ? [result.option_id] : result.option_ids;
	            if (new Set(selected).size !== selected.length)
	                throw new AdapterError('invalid_answer', 'An option appears more than once.');
	            for (const optionId of selected) {
	                const option = field.options[optionId];
	                if (!option || option.group !== field.group)
	                    throw new AdapterError('invalid_answer', 'The selected option does not belong to this field.');
	                const capacityKey = `${(_a = field.group) !== null && _a !== void 0 ? _a : id}:${optionId}`;
	                const count = (uses.get(capacityKey) || 0) + 1;
	                uses.set(capacityKey, count);
	                if (option.capacity !== null && count > option.capacity)
	                    throw new AdapterError('invalid_answer', 'A draggable choice is used too many times.');
	            }
	        }
	        else if (field.kind === 'numeric' && result.kind === 'numeric') {
	            if (!result.value.trim())
	                throw new AdapterError('invalid_answer', 'A numeric response is empty.');
	            const units = Object.keys(field.unit_options);
	            if (units.length ? result.unit_option_id === null || !units.includes(result.unit_option_id) : result.unit_option_id !== null)
	                throw new AdapterError('invalid_answer', 'The numeric unit is not valid for this question.');
	        }
	        else if (field.kind === 'ordering' && result.kind === 'ordering') {
	            const items = Object.keys(field.items);
	            if (result.item_ids.length !== items.length || new Set(result.item_ids).size !== items.length || result.item_ids.some(item => !items.includes(item)))
	                throw new AdapterError('invalid_answer', 'The ordering answer must contain each item exactly once.');
	        }
	        else if (field.kind === 'markers' && result.kind === 'markers') {
	            const image = question.assets[field.asset_id];
	            if (!image || (field.capacity !== null && result.points.length > field.capacity) || result.points.some(point => !Number.isInteger(point.x) || !Number.isInteger(point.y) || point.x < 0 || point.y < 0 || point.x >= image.width || point.y >= image.height))
	                throw new AdapterError('invalid_answer', 'A marker is outside the image or exceeds its capacity.');
	        }
	        else if ((result.kind === 'text' || result.kind === 'essay') && !result.value.trim())
	            throw new AdapterError('invalid_answer', 'A required response is empty.');
	    }
	}

	const RESPONSE_TIMEOUT_MS = 135000;
	async function responseJSON(response) {
	    try {
	        return parseStrictJSON(await response.text());
	    }
	    catch (_a) {
	        throw new AdapterError('invalid_server_response', 'The backend returned an unreadable response. No answer was applied.');
	    }
	}
	function serverError(value) {
	    if (validateErrorResponse(value)) {
	        const error = value.error;
	        throw new AdapterError(error.code, error.message);
	    }
	    throw new AdapterError('invalid_server_response', 'The backend returned an invalid error response.');
	}
	async function get(path, apiKey, signal) {
	    const response = await fetch(`${BACKEND_URL}/api/v2/${path}`, { headers: { Authorization: `Token ${apiKey}` }, signal });
	    if (response.status === 404)
	        throw new AdapterError('v2_unavailable', 'This backend does not provide the required v2 API.');
	    const value = await responseJSON(response);
	    if (!response.ok)
	        serverError(value);
	    return value;
	}
	async function getModels(apiKey, signal) {
	    const value = await get('models', apiKey, signal);
	    if (!validateModelsResponse(value))
	        throw new AdapterError('invalid_models', 'The backend model list does not match v2.');
	    return value;
	}
	async function getCapabilities(apiKey, signal) {
	    const value = await get('capabilities', apiKey, signal);
	    if (!validateCapabilitiesResponse(value))
	        throw new AdapterError('invalid_capabilities', 'The backend capabilities do not match v2.');
	    return value;
	}
	function requestId() {
	    if (typeof crypto.randomUUID === 'function')
	        return crypto.randomUUID();
	    const bytes = crypto.getRandomValues(new Uint8Array(16));
	    bytes[6] = (bytes[6] & 15) | 64;
	    bytes[8] = (bytes[8] & 63) | 128;
	    const hex = Array.from(bytes, value => value.toString(16).padStart(2, '0')).join('');
	    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
	}
	async function getAnswer(snapshot, config, signal) {
	    const controller = new AbortController();
	    const abort = () => controller.abort();
	    signal === null || signal === void 0 ? void 0 : signal.addEventListener('abort', abort, { once: true });
	    const timer = setTimeout(abort, RESPONSE_TIMEOUT_MS);
	    try {
	        throwIfAborted(signal);
	        const [capabilities, catalog] = await Promise.all([getCapabilities(config.apiKey, controller.signal), getModels(config.apiKey, controller.signal)]);
	        if (!capabilities.schema_versions.includes('2.0') || !capabilities.question_types.includes(snapshot.question.qtype))
	            throw new AdapterError('unsupported_question', 'The backend does not support this question.');
	        const model = catalog.models.find(model => model.id === config.model) || catalog.models.find(model => model.is_default);
	        if (!model || !model.structured_outputs || (Object.keys(snapshot.question.assets).length > 0 && !model.input_modalities.includes('image')))
	            throw new AdapterError('model_not_supported', 'Choose a verified model supporting structured answers and this question’s images.');
	        if (!model.reasoning_levels.some(level => level.key === config.reasoning))
	            throw new AdapterError('reasoning_not_supported', 'Choose an available reasoning level for this model in the extension settings.');
	        const body = { schema_version: '2.0', request_id: requestId(), snapshot_id: snapshot.id, model: model.id, reasoning: config.reasoning, context: config.context || '', question: snapshot.question };
	        if (!validateAnswerRequest(body))
	            throw new AdapterError('invalid_request', 'The question does not satisfy the v2 request contract.');
	        const serialized = JSON.stringify(body);
	        if (new TextEncoder().encode(serialized).length > capabilities.limits.max_request_bytes)
	            throw new AdapterError('request_too_large', 'This question exceeds the backend request limit.');
	        const response = await fetch(`${BACKEND_URL}/api/v2/answer`, { method: 'POST', headers: { Authorization: `Token ${config.apiKey}`, 'Content-Type': 'application/json' }, body: serialized, signal: controller.signal });
	        const value = await responseJSON(response);
	        if (!response.ok)
	            serverError(value);
	        if (!validateAnswerSuccess(value))
	            throw new AdapterError('invalid_answer', 'The backend answer does not satisfy the v2 contract.');
	        const result = value;
	        if (result.request_id !== body.request_id || result.snapshot_id !== snapshot.id || result.question_type !== snapshot.question.qtype)
	            throw new AdapterError('stale_answer', 'The response belongs to a different question.');
	        validateAnswerForQuestion(snapshot.question, result.answer);
	        const storage = await browser.storage.local.get('quizSolver');
	        const current = storage.quizSolver;
	        if ((current === null || current === void 0 ? void 0 : current.apiKey) === config.apiKey)
	            await browser.storage.local.set({ quizSolver: Object.assign(Object.assign({}, current), { credits: result.credits_remaining }) });
	        return result;
	    }
	    catch (error) {
	        if (controller.signal.aborted && !(signal === null || signal === void 0 ? void 0 : signal.aborted))
	            throw new AdapterError('timeout', 'The answer request timed out. Generate a new answer to retry.');
	        throw error;
	    }
	    finally {
	        clearTimeout(timer);
	        signal === null || signal === void 0 ? void 0 : signal.removeEventListener('abort', abort);
	    }
	}

	const OMIT = 'input,textarea,select,button,.specificfeedback,.feedback,.answernumber,.accesshide,.sr-only,.visually-hidden,[data-quiz-solver],.qtype_multichoice_clearchoice,.MathJax_Preview';
	function unavailableSVG() {
	    throw new AdapterError('unsupported_svg', 'This SVG diagram uses external or unavailable resources and cannot be prepared completely.');
	}
	const SVG_PAINT = ['color', 'display', 'visibility', 'opacity', 'fill', 'fill-opacity', 'fill-rule',
	    'stroke', 'stroke-opacity', 'stroke-width', 'stroke-linecap', 'stroke-linejoin', 'stroke-miterlimit', 'stroke-dasharray', 'stroke-dashoffset',
	    'clip-path', 'mask', 'filter', 'marker-start', 'marker-mid', 'marker-end', 'stop-color', 'stop-opacity', 'flood-color', 'flood-opacity', 'lighting-color',
	    'font-family', 'font-size', 'font-weight', 'font-style', 'font-stretch', 'font-variant', 'font-kerning', 'text-anchor', 'dominant-baseline',
	    'alignment-baseline', 'letter-spacing', 'word-spacing', 'text-decoration', 'text-transform', 'white-space', 'paint-order', 'vector-effect',
	    'shape-rendering', 'text-rendering', 'transform', 'transform-origin', 'transform-box'];
	/** Freeze paint/text styles supplied by the surrounding Moodle page before moving SVG into an image document. */
	function preserveSVGPaint(source, copy) {
	    const originals = [source, ...Array.from(source.querySelectorAll('*'))];
	    const copies = [copy, ...Array.from(copy.querySelectorAll('*'))];
	    const view = source.ownerDocument.defaultView;
	    if (!view)
	        unavailableSVG();
	    const page = new URL(source.ownerDocument.URL);
	    page.hash = '';
	    const localURL = (value) => value.replace(/\burl\s*\(\s*(?:"([^"]*)"|'([^']*)'|([^)]*))\s*\)/gi, (match, double, single, bare) => {
	        var _a;
	        const reference = ((_a = double !== null && double !== void 0 ? double : single) !== null && _a !== void 0 ? _a : bare).trim();
	        if (reference.startsWith('#') || reference.startsWith('data:'))
	            return match;
	        try {
	            const resolved = new URL(reference, source.ownerDocument.baseURI);
	            const hash = resolved.hash;
	            resolved.hash = '';
	            if (hash && resolved.href === page.href)
	                return `url("${hash}")`;
	        }
	        catch (_b) {
	            unavailableSVG();
	        }
	        unavailableSVG();
	    });
	    const webFonts = new Set(Array.from(source.ownerDocument.fonts || []).map(font => font.family.replace(/["']/g, '').trim().toLowerCase()));
	    originals.forEach((original, index) => {
	        const target = copies[index];
	        const style = view.getComputedStyle(original);
	        if (style.animationName && style.animationName !== 'none')
	            unavailableSVG();
	        if (/^(?:text|tspan|textpath)$/i.test(original.localName) && style.fontFamily.split(',').some(family => webFonts.has(family.replace(/["']/g, '').trim().toLowerCase())))
	            unavailableSVG();
	        for (const property of SVG_PAINT) {
	            const value = style.getPropertyValue(property);
	            if (value)
	                target.style.setProperty(property, localURL(value), 'important');
	        }
	        if (index === 0)
	            for (const dimension of ['width', 'height']) {
	                const value = style.getPropertyValue(dimension);
	                if (/^\d+(?:\.\d+)?px$/.test(value) && parseFloat(value) > 0)
	                    target.setAttribute(dimension, value);
	            }
	    });
	}
	/** SVG image decoding disables external resources; reject dependencies instead of losing parts of the diagram. */
	function validateStandaloneSVG(svg) {
	    const elements = [svg, ...Array.from(svg.querySelectorAll('*'))];
	    const ids = new Set(elements.map(element => element.id).filter(Boolean));
	    const reference = (source, embeddedImage = false) => {
	        const value = source.trim();
	        if (value.startsWith('#')) {
	            let id;
	            try {
	                id = decodeURIComponent(value.slice(1));
	            }
	            catch (_a) {
	                unavailableSVG();
	            }
	            if (ids.has(id))
	                return;
	        }
	        if (embeddedImage && /^data:image\/(?:png|jpeg|gif|webp);base64,(?=[A-Za-z0-9+/])(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/i.test(value))
	            return;
	        unavailableSVG();
	    };
	    const css = (value) => {
	        const source = value.replace(/\/\*[\s\S]*?\*\//g, '');
	        // Escaped identifiers, variables, imports and image-set strings can conceal resource URLs.
	        if (source.includes('\\') || source.includes('/*') || /@import\b|\b(?:var|(?:-webkit-)?image-set|src)\s*\(/i.test(source))
	            unavailableSVG();
	        const remaining = source.replace(/\burl\s*\(\s*(?:"([^"]*)"|'([^']*)'|([^)]*))\s*\)/gi, (_match, double, single, bare) => {
	            var _a;
	            reference((_a = double !== null && double !== void 0 ? double : single) !== null && _a !== void 0 ? _a : bare, true);
	            return '';
	        });
	        if (/\burl\s*\(/i.test(remaining))
	            unavailableSVG();
	    };
	    const cssAttributes = new Set(['style', 'fill', 'stroke', 'filter', 'clip-path', 'mask', 'cursor', 'marker', 'marker-start', 'marker-mid', 'marker-end', 'color-profile', 'font-family']);
	    for (const element of elements) {
	        const tag = element.localName.toLowerCase();
	        if (tag === 'script' || tag === 'foreignobject' || tag.startsWith('animate') || tag === 'set' || element.getAttribute('xml:base'))
	            unavailableSVG();
	        if (Array.from(element.childNodes).some(child => child.nodeType === Node.PROCESSING_INSTRUCTION_NODE))
	            unavailableSVG();
	        if (tag === 'style')
	            css(element.textContent || '');
	        for (const attribute of Array.from(element.attributes)) {
	            const name = attribute.localName.toLowerCase();
	            if (name === 'base' && attribute.namespaceURI === 'http://www.w3.org/XML/1998/namespace' && attribute.value.trim())
	                unavailableSVG();
	            if (name === 'href' || name === 'src')
	                reference(attribute.value, tag === 'image' || tag === 'feimage');
	            else if (cssAttributes.has(name) || /\burl\s*\(/i.test(attribute.value))
	                css(attribute.value);
	        }
	    }
	}
	function bytesToBase64(bytes) {
	    let binary = '';
	    // Firefox content-script Xrays can deny TypedArray species/constructor access in subarray().
	    // Copy indexed bytes into a local array without invoking a method on the fetched buffer.
	    for (let index = 0; index < bytes.length; index += 8192) {
	        const chunk = [];
	        for (let offset = index; offset < Math.min(index + 8192, bytes.length); offset++)
	            chunk.push(bytes[offset]);
	        binary += String.fromCharCode(...chunk);
	    }
	    return btoa(binary);
	}
	/** TIFF orientation is shared by JPEG APP1 and PNG eXIf chunks. */
	function needsTIFFNormalization(bytes, tiff, end) {
	    if (tiff + 8 > end)
	        return true;
	    const little = bytes[tiff] === 0x49 && bytes[tiff + 1] === 0x49;
	    if (!little && !(bytes[tiff] === 0x4d && bytes[tiff + 1] === 0x4d))
	        return true;
	    // Indexed access avoids Firefox content-script Xray TypedArray method restrictions.
	    const u16 = (at) => little ? bytes[at] + bytes[at + 1] * 256 : bytes[at] * 256 + bytes[at + 1];
	    const u32 = (at) => little ? u16(at) + u16(at + 2) * 65536 : u16(at) * 65536 + u16(at + 2);
	    if (u16(tiff + 2) !== 42)
	        return true;
	    const relative = u32(tiff + 4);
	    const directory = tiff + relative;
	    if (relative < 8 || directory + 2 > end)
	        return true;
	    const count = u16(directory);
	    if (count > Math.floor((end - directory - 2) / 12))
	        return true;
	    for (let index = 0; index < count; index++) {
	        const entry = directory + 2 + index * 12;
	        if (u16(entry) !== 0x0112)
	            continue;
	        if (u16(entry + 2) !== 3 || u32(entry + 4) !== 1)
	            return true;
	        const orientation = u16(entry + 8);
	        if (orientation >= 2 && orientation <= 8)
	            return true;
	    }
	    return false;
	}
	/** Read only the EXIF IFD0 orientation; the browser performs the actual pixel transformation. */
	function needsJPEGNormalization(bytes) {
	    let offset = 2; // JPEG SOI was checked by the caller.
	    while (offset < bytes.length) {
	        if (bytes[offset++] !== 0xff)
	            return true;
	        while (bytes[offset] === 0xff)
	            offset++;
	        const marker = bytes[offset++];
	        if (marker === 0xda || marker === 0xd9)
	            return false; // Scan data or end of image.
	        if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7))
	            continue;
	        if (offset + 2 > bytes.length)
	            return true;
	        const length = bytes[offset] * 256 + bytes[offset + 1];
	        const end = offset + length;
	        if (length < 2 || end > bytes.length)
	            return true;
	        const payload = offset + 2;
	        if (marker === 0xe1 && end - payload >= 6 &&
	            bytes[payload] === 0x45 && bytes[payload + 1] === 0x78 && bytes[payload + 2] === 0x69 &&
	            bytes[payload + 3] === 0x66 && bytes[payload + 4] === 0 && bytes[payload + 5] === 0) {
	            if (needsTIFFNormalization(bytes, payload + 6, end))
	                return true;
	        }
	        offset = end;
	    }
	    return false;
	}
	function needsPNGNormalization(bytes) {
	    let offset = 8; // PNG signature was checked by the caller.
	    while (offset < bytes.length) {
	        if (offset + 12 > bytes.length)
	            return true;
	        const length = bytes[offset] * 16777216 + bytes[offset + 1] * 65536 + bytes[offset + 2] * 256 + bytes[offset + 3];
	        const end = offset + 8 + length;
	        if (end + 4 > bytes.length)
	            return true;
	        if (bytes[offset + 4] === 101 && bytes[offset + 5] === 88 && bytes[offset + 6] === 73 && bytes[offset + 7] === 102 &&
	            needsTIFFNormalization(bytes, offset + 8, end))
	            return true;
	        if (bytes[offset + 4] === 73 && bytes[offset + 5] === 69 && bytes[offset + 6] === 78 && bytes[offset + 7] === 68)
	            return false;
	        offset = end + 4; // Skip chunk CRC; browser decoding and backend verification validate it.
	    }
	    return false;
	}
	async function imageData(image, signal) {
	    throwIfAborted(signal);
	    const source = image.currentSrc || image.src;
	    if (!source)
	        throw new AdapterError('missing_image', 'A required image has no source.');
	    const controller = new AbortController();
	    const cancel = () => controller.abort();
	    signal === null || signal === void 0 ? void 0 : signal.addEventListener('abort', cancel, { once: true });
	    const timer = setTimeout(cancel, 15000);
	    let objectURL;
	    try {
	        let rendered = image;
	        let bytes;
	        let mime;
	        // Preserve existing PNG/JPEG bytes and dimensions when the resource is readable.
	        try {
	            const response = await fetch(source, { credentials: 'include', signal: controller.signal });
	            if (!response.ok)
	                throw new Error('Image fetch failed.');
	            const blob = await response.blob();
	            if (blob.size > 5 * 1024 * 1024)
	                throw new AdapterError('image_too_large', 'A required image exceeds 5 MiB.');
	            bytes = new Uint8Array(await blob.arrayBuffer());
	            if (bytes[0] === 137 && bytes[1] === 80 && bytes[2] === 78 && bytes[3] === 71)
	                mime = 'image/png';
	            else if (bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255)
	                mime = 'image/jpeg';
	            if (!mime && (blob.type.split(';')[0].toLowerCase() === 'image/svg+xml' || /^\s*</.test(new TextDecoder().decode(bytes)))) {
	                const source = await blob.text();
	                if (/<\?xml-stylesheet\b|<!DOCTYPE/i.test(source))
	                    unavailableSVG();
	                const parsed = new DOMParser().parseFromString(source, 'image/svg+xml');
	                if (parsed.querySelector('parsererror') || parsed.documentElement.localName !== 'svg')
	                    unavailableSVG();
	                validateStandaloneSVG(parsed.documentElement);
	            }
	            objectURL = URL.createObjectURL(blob);
	            rendered = new Image();
	            rendered.src = objectURL;
	        }
	        catch (error) {
	            if (controller.signal.aborted || error instanceof AdapterError)
	                throw error;
	            // A previously loaded same-origin image may still be readable through canvas.
	            bytes = undefined;
	            mime = undefined;
	        }
	        await new Promise((resolve, reject) => {
	            const finish = (error) => {
	                rendered.removeEventListener('load', onLoad);
	                rendered.removeEventListener('error', onError);
	                controller.signal.removeEventListener('abort', onAbort);
	                if (error)
	                    reject(error);
	                else
	                    resolve();
	            };
	            const onLoad = () => finish();
	            const onError = () => finish(new AdapterError('missing_image', 'A required image could not be loaded.'));
	            const onAbort = () => finish(new DOMException('Image preparation cancelled or timed out.', 'AbortError'));
	            if (controller.signal.aborted)
	                return onAbort();
	            if (rendered.complete)
	                return rendered.naturalWidth > 0 ? finish() : onError();
	            rendered.addEventListener('load', onLoad, { once: true });
	            rendered.addEventListener('error', onError, { once: true });
	            controller.signal.addEventListener('abort', onAbort, { once: true });
	        });
	        const width = rendered.naturalWidth;
	        const height = rendered.naturalHeight;
	        if (!width || !height || width * height > 64000000)
	            throw new AdapterError('invalid_image', 'A required image has invalid or excessive dimensions.');
	        // naturalWidth/Height and drawImage already respect EXIF, including mirror orientations.
	        // Original image bytes can disagree with those dimensions and the model's coordinate space.
	        if (bytes && mime && !(mime === 'image/jpeg' ? needsJPEGNormalization(bytes) : needsPNGNormalization(bytes))) {
	            return { mime_type: mime, data: bytesToBase64(bytes), width, height };
	        }
	        const canvas = document.createElement('canvas');
	        canvas.width = width;
	        canvas.height = height;
	        const context = canvas.getContext('2d');
	        if (!context)
	            throw new Error('Canvas is unavailable.');
	        context.drawImage(rendered, 0, 0);
	        const data = canvas.toDataURL('image/png').split(',')[1];
	        const decodedBytes = data.length * 3 / 4 - (data.endsWith('==') ? 2 : data.endsWith('=') ? 1 : 0);
	        if (decodedBytes > 5 * 1024 * 1024)
	            throw new AdapterError('image_too_large', 'A required image exceeds 5 MiB.');
	        return { mime_type: 'image/png', data, width, height };
	    }
	    catch (error) {
	        throwIfAborted(signal);
	        if (error instanceof AdapterError)
	            throw error;
	        throw new AdapterError('missing_image', 'A required image could not be read. Allow the image to load and retry.');
	    }
	    finally {
	        clearTimeout(timer);
	        signal === null || signal === void 0 ? void 0 : signal.removeEventListener('abort', cancel);
	        if (objectURL)
	            URL.revokeObjectURL(objectURL);
	    }
	}
	class ContentExtractor {
	    constructor(fieldNodes, id) {
	        this.fieldNodes = fieldNodes;
	        this.id = id;
	        this.sources = new Map();
	        this.images = new Map();
	    }
	    asset(image) {
	        const source = image.currentSrc || image.src;
	        const previous = this.sources.get(source);
	        if (previous)
	            return previous;
	        const id = this.id('a');
	        this.sources.set(source, id);
	        this.images.set(id, image);
	        return id;
	    }
	    content(node) {
	        var _a;
	        if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE)
	            return Array.from(node.childNodes).flatMap(child => this.content(child));
	        if (node.nodeType === Node.TEXT_NODE)
	            return node.textContent ? [{ kind: 'text', text: node.textContent }] : [];
	        if (!(node instanceof Element))
	            return [];
	        const field = this.fieldNodes.get(node);
	        if (field)
	            return [{ kind: 'field', field_id: field }];
	        if (node.matches('script[type^="math/tex"]'))
	            return [{ kind: 'math', format: 'tex', source: node.textContent || '' }];
	        if (node.matches('math'))
	            return [{ kind: 'math', format: 'mathml', source: node.outerHTML }];
	        const tex = node.getAttribute('data-tex') || node.getAttribute('data-latex');
	        if (tex)
	            return [{ kind: 'math', format: 'tex', source: tex }];
	        if (node.matches('mjx-container,.MathJax,.MathJax_Display')) {
	            const annotation = node.querySelector('annotation[encoding="application/x-tex"]');
	            if (annotation)
	                return [{ kind: 'math', format: 'tex', source: annotation.textContent || '' }];
	            const math = node.querySelector('math');
	            if (math)
	                return this.content(math);
	            if ((_a = node.nextElementSibling) === null || _a === void 0 ? void 0 : _a.matches('script[type^="math/tex"]'))
	                return [];
	            const label = node.getAttribute('aria-label');
	            if (label)
	                return [{ kind: 'text', text: label }];
	        }
	        if (node.matches(`${OMIT},script,style,noscript`))
	            return [];
	        if (node.matches('audio,video,iframe,object,embed'))
	            throw new AdapterError('unsupported_media', 'This question contains media outside image and math support.');
	        if (node instanceof HTMLImageElement)
	            return [{ kind: 'image', asset_id: this.asset(node), alt: node.alt || node.title || '' }];
	        if (node instanceof HTMLCanvasElement || node.tagName.toLowerCase() === 'svg') {
	            const image = new Image();
	            try {
	                if (node instanceof HTMLCanvasElement)
	                    image.src = node.toDataURL('image/png');
	                else {
	                    const copy = node.cloneNode(true);
	                    validateStandaloneSVG(copy);
	                    preserveSVGPaint(node, copy);
	                    validateStandaloneSVG(copy);
	                    copy.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns', 'http://www.w3.org/2000/svg');
	                    image.src = `data:image/svg+xml;base64,${bytesToBase64(new TextEncoder().encode(new XMLSerializer().serializeToString(copy)))}`;
	                }
	            }
	            catch (error) {
	                if (error instanceof AdapterError)
	                    throw error;
	                throw new AdapterError('missing_image', 'This diagram cannot be read by the extension.');
	            }
	            return [{ kind: 'image', asset_id: this.asset(image), alt: node.getAttribute('aria-label') || '' }];
	        }
	        if (node.matches('pre'))
	            return [{ kind: 'code', text: node.textContent || '' }];
	        if (node.matches('table')) {
	            const table = node;
	            return [{ kind: 'table', rows: Array.from(table.rows).map(row => ({ cells: Array.from(row.cells).map(cell => ({ header: cell.tagName === 'TH', content: this.children(cell) })) })) }];
	        }
	        if (node.matches('ul,ol'))
	            return [{ kind: 'list', ordered: node.tagName === 'OL', items: Array.from(node.children).filter(child => child.tagName === 'LI').map(child => this.children(child)) }];
	        if (node.matches('br'))
	            return [{ kind: 'text', text: '\n' }];
	        const children = this.children(node);
	        return node.matches('p,h1,h2,h3,h4,h5,h6') ? [{ kind: 'paragraph', children }] : children;
	    }
	    children(node) {
	        return Array.from(node.childNodes).flatMap(child => this.content(child));
	    }
	    async finish(question, signal) {
	        // Bound concurrent decoding and retain every failure; essential media is never silently dropped.
	        const assets = {};
	        const entries = [...this.images.entries()];
	        const hashes = new Map();
	        const aliases = new Map();
	        for (let start = 0; start < entries.length; start += 4) {
	            const batch = await Promise.all(entries.slice(start, start + 4).map(async ([id, image]) => [id, await imageData(image, signal)]));
	            for (const [id, asset] of batch) {
	                const existing = hashes.get(asset.data);
	                if (existing)
	                    aliases.set(id, existing);
	                else {
	                    if (hashes.size >= 64)
	                        throw new AdapterError('too_many_images', 'This question contains more than 64 distinct images.');
	                    hashes.set(asset.data, id);
	                    assets[id] = asset;
	                }
	            }
	        }
	        const rewrite = (value) => {
	            if (!value || typeof value !== 'object')
	                return;
	            if (Array.isArray(value)) {
	                value.forEach(rewrite);
	                return;
	            }
	            const object = value;
	            if (typeof object.asset_id === 'string' && aliases.has(object.asset_id))
	                object.asset_id = aliases.get(object.asset_id);
	            Object.values(object).forEach(rewrite);
	        };
	        rewrite(question);
	        question.assets = assets;
	    }
	}

	function dispatchValueEvents(element) {
	    element.dispatchEvent(new Event('input', { bubbles: true }));
	    element.dispatchEvent(new Event('change', { bubbles: true }));
	}
	function setNativeValue(element, value) {
	    var _a, _b;
	    const prototype = element.tagName === 'SELECT' ? HTMLSelectElement.prototype
	        : element.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
	    (_b = (_a = Object.getOwnPropertyDescriptor(prototype, 'value')) === null || _a === void 0 ? void 0 : _a.set) === null || _b === void 0 ? void 0 : _b.call(element, value);
	    dispatchValueEvents(element);
	    if (element.value !== value)
	        throw new AdapterError('application_failed', 'Moodle did not retain the requested response.');
	}
	function assertEditable(root) {
	    if (!root.isConnected)
	        throw new AdapterError('stale_question', 'This question is no longer on the page.');
	    if (root.matches('.readonly, [aria-readonly="true"]') || root.querySelector('.formulation.readonly')) {
	        throw new AdapterError('readonly', 'This question is read-only.');
	    }
	    const controls = root.querySelectorAll('.formulation input:not([type="hidden"]):not([type="submit"]):not([type="button"]), .formulation textarea, .formulation select');
	    if (Array.from(controls).filter(control => !control.closest('.qtype_multichoice_clearchoice')).some(control => control.disabled || ('readOnly' in control && control.readOnly))) {
	        throw new AdapterError('readonly', 'This question is read-only.');
	    }
	    if (root.querySelector('.formulation [aria-readonly="true"], .formulation .ddarea.readonly')) {
	        throw new AdapterError('readonly', 'This question is read-only.');
	    }
	}
	function isInteractiveTarget(target) {
	    const element = target instanceof Element ? target : target instanceof Node ? target.parentElement : null;
	    return !!(element === null || element === void 0 ? void 0 : element.closest('input, textarea, select, button, label, a, [role="button"], [contenteditable], [data-region="answer-label"], .draghome, .drag, .drop, .dropzone, .marker, .sortableitem, [data-quiz-solver]'));
	}

	function check(elements, signal) {
	    if (signal === null || signal === void 0 ? void 0 : signal.aborted)
	        throw new DOMException('Operation cancelled', 'AbortError');
	    for (const element of elements) {
	        if (!element.isConnected || element.matches(':disabled, [readonly]')) {
	            throw new Error('The question controls are no longer editable.');
	        }
	    }
	}
	function notify(element) {
	    const EventClass = element.ownerDocument.defaultView.Event;
	    element.dispatchEvent(new EventClass('input', { bubbles: true }));
	    element.dispatchEvent(new EventClass('change', { bubbles: true }));
	}
	function value(element, next) {
	    const win = element.ownerDocument.defaultView;
	    const prototype = element.tagName === 'SELECT' ? win.HTMLSelectElement.prototype : win.HTMLInputElement.prototype;
	    Object.getOwnPropertyDescriptor(prototype, 'value').set.call(element, next);
	    notify(element);
	    if (element.value !== next)
	        throw new Error('Moodle did not retain the requested response value.');
	}
	function checked(input, next) {
	    if (input.checked === next)
	        return;
	    if (input.type === 'checkbox' || next)
	        input.click();
	    else {
	        input.checked = false;
	        notify(input);
	    }
	    if (input.checked !== next)
	        throw new Error('Moodle did not accept the selected option.');
	}
	function label$1(input) {
	    var _a, _b;
	    const ids = (input.getAttribute('aria-labelledby') || '').split(/\s+/).filter(Boolean);
	    if (ids.length) {
	        const fragment = input.ownerDocument.createDocumentFragment();
	        for (const id of ids) {
	            const element = input.ownerDocument.getElementById(id);
	            if (element && ((_a = input.closest('.que')) === null || _a === void 0 ? void 0 : _a.contains(element)))
	                fragment.append(element.cloneNode(true));
	        }
	        if (fragment.childNodes.length)
	            return fragment;
	    }
	    return ((_b = input.labels) === null || _b === void 0 ? void 0 : _b[0]) || input.parentElement || input;
	}
	function optionContent(ctx, node) {
	    const copy = node.cloneNode(true);
	    if ('querySelectorAll' in copy) {
	        copy.querySelectorAll('.answernumber, .specificfeedback, .feedbacktrigger, .feedbackspan, .outcome, .accesshide, .sr-only, .visually-hidden, input, select').forEach(el => el.remove());
	    }
	    return ctx.content(copy);
	}
	function makeOptions(ctx, controls) {
	    const options = {};
	    const targets = new Map();
	    for (const control of controls) {
	        const id = ctx.id('c');
	        options[id] = {
	            content: optionContent(ctx, control.tagName === 'OPTION' ? control : label$1(control)),
	            group: null,
	            capacity: null
	        };
	        targets.set(id, control);
	    }
	    if (!targets.size)
	        throw new Error('Moodle has no answer options for this field.');
	    return { options, targets };
	}
	function addChoice(ctx, controls, content = [], placeholder = '', marker, clear) {
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
	    const clearRadio = clear === null || clear === void 0 ? void 0 : clear.querySelector('input[type=radio][value="-1"]');
	    const reset = async (signal) => {
	        var _a, _b;
	        check(controls, signal);
	        if (select) {
	            if (!Array.from(select.options).some(option => option.value === placeholder))
	                throw new Error('Moodle placeholder is missing.');
	            value(select, placeholder);
	        }
	        else if (clearRadio) {
	            // Moodle's native clear link selects the -1 sentinel and hides its wrapper.
	            (_a = clear.querySelector('a[role=button]')) === null || _a === void 0 ? void 0 : _a.click();
	            clearRadio.disabled = false;
	            if (!clearRadio.checked) {
	                clearRadio.checked = true;
	                clear.classList.add('sr-only');
	                clear.setAttribute('aria-hidden', 'true');
	                (_b = clear.querySelector('a')) === null || _b === void 0 ? void 0 : _b.setAttribute('tabindex', '-1');
	            }
	            // This is outside .answer: changing an ordinary option would re-show Clear my choice.
	            notify(clearRadio);
	            if (inputs.some(input => input.checked))
	                throw new Error('Moodle could not clear the selected answer.');
	        }
	        else {
	            inputs.forEach(input => checked(input, false));
	        }
	    };
	    const binding = {
	        elements: controls,
	        read,
	        async apply(answer, signal) {
	            check(controls, signal);
	            if (answer.kind !== kind)
	                throw new Error('Answer kind does not match the Moodle choice field.');
	            const ids = answer.kind === 'multiple_choice' ? answer.option_ids : [answer.option_id];
	            if (new Set(ids).size !== ids.length || ids.some(id => !targets.has(id)))
	                throw new Error('Unknown or duplicate option ID.');
	            const selected = ids.map(id => targets.get(id));
	            if (select) {
	                const target = selected[0];
	                if (!select.contains(target) || target.disabled)
	                    throw new Error('The selected Moodle option changed.');
	                value(select, target.value);
	                if (select.value !== target.value)
	                    throw new Error('Moodle rejected the option.');
	            }
	            else {
	                inputs.forEach(input => checked(input, selected.includes(input)));
	            }
	        },
	        async restore(previous, signal) {
	            check(controls, signal);
	            if (select) {
	                if (typeof previous !== 'string' || !Array.from(select.options).some(option => option.value === previous))
	                    throw new Error('Invalid saved selection.');
	                value(select, previous);
	            }
	            else {
	                if (!Array.isArray(previous) || previous.length !== inputs.length || previous.some(item => typeof item !== 'boolean'))
	                    throw new Error('Invalid saved choices.');
	                if (!previous.some(Boolean))
	                    await reset(signal);
	                else
	                    inputs.forEach((input, index) => checked(input, previous[index]));
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
	        async apply(answer, signal) {
	            check(controls, signal);
	            if (answer.kind !== 'text')
	                throw new Error('Expected a text answer.');
	            value(input, answer.value);
	        },
	        async restore(previous, signal) {
	            check(controls, signal);
	            if (typeof previous !== 'string')
	                throw new Error('Invalid saved text.');
	            value(input, previous);
	        },
	        async reset(signal) { check(controls, signal); value(input, ''); }
	    };
	    const id = ctx.addField({ kind: 'text', content: [] }, binding);
	    ctx.fieldNodes.set(marker || input, id);
	}
	function addNumeric(ctx, input, unitControls) {
	    var _a;
	    const select = ((_a = unitControls[0]) === null || _a === void 0 ? void 0 : _a.tagName) === 'SELECT' ? unitControls[0] : null;
	    const radios = select ? [] : unitControls;
	    const unitItems = select ? Array.from(select.options).filter(option => option.value !== '' && !option.disabled) : radios;
	    const { options: unit_options, targets } = unitItems.length ? makeOptions(ctx, unitItems) : { options: {}, targets: new Map() };
	    const controls = [input, ...unitControls];
	    const binding = {
	        elements: controls,
	        read: () => ({ value: input.value, unit: select ? select.value : radios.map(radio => radio.checked) }),
	        async apply(answer, signal) {
	            check(controls, signal);
	            if (answer.kind !== 'numeric')
	                throw new Error('Expected a numeric answer.');
	            const unit = answer.unit_option_id == null ? null : targets.get(answer.unit_option_id);
	            if ((unitControls.length > 0 && !unit) || (unitControls.length === 0 && answer.unit_option_id != null))
	                throw new Error('Unknown or missing unit option ID.');
	            if (select && unit && (!select.contains(unit) || unit.disabled))
	                throw new Error('Moodle unit options changed.');
	            value(input, answer.value);
	            if (select && unit)
	                value(select, unit.value);
	            else
	                radios.forEach(radio => checked(radio, radio === unit));
	        },
	        async restore(previous, signal) {
	            check(controls, signal);
	            if (!previous || typeof previous !== 'object' || !('value' in previous) || typeof previous.value !== 'string' || !('unit' in previous))
	                throw new Error('Invalid saved numeric answer.');
	            const saved = previous;
	            if (select && (typeof saved.unit !== 'string' || !Array.from(select.options).some(option => option.value === saved.unit)))
	                throw new Error('Invalid saved unit.');
	            if (!select && (!Array.isArray(saved.unit) || saved.unit.length !== radios.length || saved.unit.some(item => typeof item !== 'boolean')))
	                throw new Error('Invalid saved units.');
	            value(input, saved.value);
	            if (select)
	                value(select, saved.unit);
	            else
	                radios.forEach((radio, index) => checked(radio, saved.unit[index]));
	        },
	        async reset(signal) {
	            check(controls, signal);
	            value(input, '');
	            if (select)
	                value(select, '');
	            else
	                radios.forEach(radio => checked(radio, false));
	        }
	    };
	    const id = ctx.addField({ kind: 'numeric', content: [], unit_options }, binding);
	    const wrapper = input.closest('span.answer');
	    ctx.fieldNodes.set(wrapper && unitControls.every(control => wrapper.contains(control)) ? wrapper : input, id);
	    // Unit controls are the same numeric field; the content builder should deduplicate field references.
	    unitControls.forEach(control => ctx.fieldNodes.set(control, id));
	}
	function formulation(ctx) {
	    return ctx.root.matches('.formulation') ? ctx.root : ctx.root.querySelector('.formulation') || ctx.root;
	}
	async function extractStandard(ctx) {
	    const form = formulation(ctx);
	    switch (ctx.qtype) {
	        case 'multichoice':
	        case 'calculatedmulti':
	        case 'truefalse': {
	            const controls = Array.from(form.querySelectorAll('.answer input[type=radio], .answer input[type=checkbox]'))
	                .filter(input => input.value !== '-1' && !input.closest('.qtype_multichoice_clearchoice'));
	            if (!controls.length)
	                throw new Error('Moodle choice controls are missing.');
	            addChoice(ctx, controls, [], '', form.querySelector('.answer') || undefined, form.querySelector('.qtype_multichoice_clearchoice') || undefined);
	            return true;
	        }
	        case 'shortanswer': {
	            const input = form.querySelector('input[type=text][name$="_answer"]');
	            if (!input)
	                throw new Error('Moodle short-answer control is missing.');
	            addText(ctx, input);
	            return true;
	        }
	        case 'numerical':
	        case 'calculated':
	        case 'calculatedsimple': {
	            const input = form.querySelector('input[type=text][name$="_answer"]');
	            if (!input)
	                throw new Error('Moodle numeric answer control is missing.');
	            const units = Array.from(form.querySelectorAll('select[name$="_unit"], input[type=radio][name$="_unit"]'));
	            if (units.some(control => control.tagName === 'SELECT') && units.length !== 1)
	                throw new Error('Ambiguous Moodle unit controls.');
	            addNumeric(ctx, input, units);
	            return true;
	        }
	        case 'match':
	        case 'randomsamatch': {
	            const selects = Array.from(form.querySelectorAll('table.answer select'));
	            if (!selects.length)
	                throw new Error('Moodle matching controls are missing.');
	            for (const select of selects) {
	                const row = select.closest('tr');
	                const stem = row === null || row === void 0 ? void 0 : row.querySelector('td.text');
	                if (!row || !stem)
	                    throw new Error('Moodle matching row is incomplete.');
	                // Initial 4.5 has no aria-describedby or stem IDs. The row association exists in both releases.
	                addChoice(ctx, [select], ctx.content(stem), '0', row);
	            }
	            return true;
	        }
	        case 'multianswer': {
	            if (form.querySelector('.notifyproblem'))
	                throw new Error('This Moodle Cloze question has missing subquestions.');
	            const controls = Array.from(form.querySelectorAll('input[type=text], input[type=radio], input[type=checkbox], select'));
	            const groups = new Map();
	            for (const control of controls) {
	                const match = control.name.match(/^(.*_sub\d+)_(answer|choice\d+)$/);
	                if (!match)
	                    continue;
	                const group = groups.get(match[1]) || [];
	                group.push(control);
	                groups.set(match[1], group);
	            }
	            if (!groups.size)
	                throw new Error('Moodle Cloze subquestion controls are missing.');
	            for (const group of groups.values()) {
	                const first = group[0];
	                if (first.tagName === 'INPUT' && first.type === 'text') {
	                    if (group.length !== 1)
	                        throw new Error('Ambiguous Cloze text field.');
	                    // Moodle deliberately emits identical markup for SHORTANSWER and NUMERICAL subquestions.
	                    // Text preserves both exact textual and numeric/scientific answer strings without guessing a subtype.
	                    addText(ctx, first, first.closest('.subquestion') || first);
	                }
	                else if (first.tagName === 'SELECT') {
	                    if (group.length !== 1)
	                        throw new Error('Ambiguous Cloze selection field.');
	                    addChoice(ctx, group, [], '', first.closest('.subquestion') || first);
	                }
	                else {
	                    addChoice(ctx, group, [], '', first.closest('fieldset.answer') || first);
	                }
	            }
	            return true;
	        }
	        default: return false;
	    }
	}

	let sequence = 0;
	function bridgeCall(root, command, args, signal) {
	    throwIfAborted(signal);
	    if (!root.id)
	        throw new AdapterError('missing_identity', 'Moodle did not provide a question identity.');
	    return new Promise((resolve, reject) => {
	        const id = `b${Date.now()}_${++sequence}`;
	        let cancellation;
	        let cleanupTimer;
	        const finish = (error, value) => {
	            clearTimeout(timer);
	            clearTimeout(cleanupTimer);
	            window.removeEventListener('message', receive);
	            signal === null || signal === void 0 ? void 0 : signal.removeEventListener('abort', abort);
	            if (cancellation || error)
	                reject(cancellation || error);
	            else
	                resolve(value);
	        };
	        const cancel = (error) => {
	            if (cancellation)
	                return;
	            cancellation = error;
	            window.postMessage({ source: 'quiz-solver-v2', direction: 'cancel', id, root_id: root.id }, window.location.origin);
	            cleanupTimer = setTimeout(() => finish(error), 3500);
	        };
	        const abort = () => cancel(new DOMException('Operation cancelled.', 'AbortError'));
	        const receive = (event) => {
	            if (event.source !== window || event.origin !== window.location.origin)
	                return;
	            const message = event.data;
	            if (!message || message.source !== 'quiz-solver-v2' || message.direction !== 'response' || message.id !== id)
	                return;
	            if (message.ok === true)
	                finish(undefined, message.result);
	            else
	                finish(new AdapterError('application_failed', typeof message.error === 'string' ? message.error : 'Moodle could not apply this answer.'));
	        };
	        const timer = setTimeout(() => cancel(new AdapterError('bridge_timeout', 'Moodle did not finish updating the question.')), 15000);
	        window.addEventListener('message', receive);
	        signal === null || signal === void 0 ? void 0 : signal.addEventListener('abort', abort, { once: true });
	        window.postMessage({ source: 'quiz-solver-v2', direction: 'request', id, root_id: root.id, command, args }, window.location.origin);
	    });
	}

	function elements(root, selector) {
	    return Array.from(root.querySelectorAll(selector));
	}
	function suffix(element, prefix) {
	    const token = Array.from(element.classList).find(c => new RegExp(`^${prefix}[0-9]+$`).test(c));
	    return token ? token.slice(prefix.length) : null;
	}
	function unavailable(message) { throw new AdapterError('invalid_controls', message); }
	function checkAnswer(answer, kind) {
	    if (answer.kind !== kind)
	        unavailable('The answer does not match this control.');
	}
	function points(value) {
	    if (!value)
	        return [];
	    return value.split(';').map(part => {
	        const coordinates = part.split(',');
	        const [x, y] = coordinates.map(Number);
	        if (coordinates.length !== 2 || !Number.isFinite(x) || !Number.isFinite(y))
	            unavailable('Moodle has an invalid marker response.');
	        return { x, y };
	    });
	}
	function label(text) { return text ? [{ kind: 'text', text }] : []; }
	function uniqueField(root, predicate) {
	    const found = elements(root, 'input[type="hidden"][name]').filter(predicate);
	    if (found.length !== 1)
	        unavailable('Moodle did not provide one unambiguous response field.');
	    return found[0];
	}
	function ordering(ctx) {
	    const lists = elements(ctx.root, '.formulation .sortablelist');
	    if (lists.length !== 1)
	        unavailable('Ordering list is missing or ambiguous.');
	    const list = lists[0];
	    const items = Array.from(list.children).filter((el) => el instanceof HTMLElement && el.classList.contains('sortableitem'));
	    if (!items.length || items.some(item => !item.id) || new Set(items.map(item => item.id)).size !== items.length)
	        unavailable('Ordering items are missing or read-only.');
	    const response = uniqueField(ctx.root, input => /_response_\d+$/.test(input.name));
	    const opaqueToNative = new Map();
	    const nativeToOpaque = new Map();
	    const itemFields = {};
	    for (const item of items) {
	        const id = ctx.id('i');
	        opaqueToNative.set(id, item.id);
	        nativeToOpaque.set(item.id, id);
	        itemFields[id] = { content: ctx.content(item.querySelector('[data-itemcontent]') || item) };
	    }
	    const initial = items.map(item => nativeToOpaque.get(item.id));
	    const applyIds = async (ids, signal) => {
	        throwIfAborted(signal);
	        if (!Array.isArray(ids) || ids.length !== items.length || new Set(ids).size !== items.length ||
	            ids.some(id => typeof id !== 'string' || !opaqueToNative.has(id)))
	            unavailable('Invalid ordering permutation.');
	        await bridgeCall(ctx.root, 'ordering.set', { listId: list.id, fieldName: response.name,
	            itemIds: ids.map(id => opaqueToNative.get(id)) }, signal);
	    };
	    const binding = {
	        elements: [list, response],
	        read: () => ({ kind: 'ordering', item_ids: Array.from(list.children).filter(el => el.classList.contains('sortableitem'))
	                .map(item => { var _a; return (_a = nativeToOpaque.get(item.id)) !== null && _a !== void 0 ? _a : unavailable('Ordering identities changed.'); }) }),
	        apply: async (answer, signal) => { checkAnswer(answer, 'ordering'); if (answer.kind === 'ordering')
	            await applyIds(answer.item_ids, signal); },
	        restore: async (previous, signal) => { await applyIds(previous.item_ids, signal); },
	        reset: async (signal) => { await applyIds(initial, signal); }
	    };
	    const fieldId = ctx.addField({ kind: 'ordering', content: [], items: itemFields }, binding);
	    ctx.fieldNodes.set(list, fieldId);
	}
	function gapselect(ctx) {
	    const selects = elements(ctx.root, '.formulation select').filter(el => /_p\d+$/.test(el.name));
	    if (!selects.length)
	        unavailable('No gap dropdowns were found.');
	    const groupIds = new Map();
	    const optionIds = new Map();
	    for (const select of selects) {
	        const group = suffix(select.parentElement, 'group');
	        if (!group || select.disabled)
	            unavailable('Gap group is missing or read-only.');
	        if (!groupIds.has(group))
	            groupIds.set(group, ctx.id('g'));
	        const options = {};
	        const native = new Map();
	        for (const option of Array.from(select.options).filter(option => option.value !== '')) {
	            const key = `${group}:${option.value}`;
	            if (!optionIds.has(key))
	                optionIds.set(key, ctx.id('c'));
	            const id = optionIds.get(key);
	            options[id] = { content: label(option.textContent || ''), group: groupIds.get(group), capacity: null };
	            native.set(id, option.value);
	        }
	        const write = async (id, signal) => {
	            throwIfAborted(signal);
	            if (id !== null && (typeof id !== 'string' || !native.has(id)))
	                unavailable('Unknown gap option.');
	            if (!select.isConnected || select.disabled)
	                unavailable('The gap is no longer editable.');
	            const value = id === null ? '' : native.get(id);
	            setNativeValue(select, value);
	            if (select.value !== value)
	                unavailable('Moodle did not accept the selected gap option.');
	        };
	        const fieldId = ctx.addField({ kind: 'single_choice', content: [], options, group: groupIds.get(group), location: null }, {
	            elements: [select],
	            read: () => {
	                var _a, _b;
	                return ({ kind: 'single_choice', option_id: select.value === '' ? null :
	                        (_b = (_a = Array.from(native).find(([, value]) => value === select.value)) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : unavailable('The selected gap option changed.') });
	            },
	            apply: async (answer, signal) => { checkAnswer(answer, 'single_choice'); if (answer.kind === 'single_choice')
	                await write(answer.option_id, signal); },
	            restore: async (previous, signal) => { await write(previous.option_id, signal); },
	            reset: async (signal) => { await write(null, signal); }
	        });
	        ctx.fieldNodes.set(select, fieldId);
	    }
	}
	async function slots(ctx) {
	    var _a;
	    await bridgeCall(ctx.root, 'ready', {});
	    const inputs = elements(ctx.root, 'input.placeinput[name]');
	    if (!inputs.length)
	        unavailable('No drag response fields were found.');
	    const choices = new Map();
	    for (const node of elements(ctx.root, '.draghome:not(.dragplaceholder)')) {
	        const group = suffix(node, 'group'), choice = suffix(node, 'choice');
	        if (group && choice && !choices.has(`${group}:${choice}`))
	            choices.set(`${group}:${choice}`, { id: ctx.id('c'), node });
	    }
	    const groups = new Map();
	    const bg = ctx.qtype === 'ddimageortext' ? ctx.root.querySelector('.dropbackground') : null;
	    const asset = bg ? ctx.asset(bg) : null;
	    for (const input of inputs) {
	        const group = suffix(input, 'group'), place = suffix(input, 'place');
	        if (!group || !place)
	            unavailable('A drag group or place identity is missing.');
	        if (!groups.has(group))
	            groups.set(group, ctx.id('g'));
	        const drop = elements(ctx.root, ctx.qtype === 'ddwtos' ? '.drop' : '.dropzones .dropzone')
	            .find(node => suffix(node, 'place') === place && suffix(node, 'group') === group);
	        if (!drop)
	            unavailable('The native drop zone is not available.');
	        const options = {};
	        const native = new Map();
	        for (const [key, entry] of choices) {
	            if (!key.startsWith(`${group}:`))
	                continue;
	            options[entry.id] = { content: ctx.content(entry.node), group: groups.get(group), capacity: entry.node.classList.contains('infinite') ? null : 1 };
	            native.set(entry.id, key.slice(group.length + 1));
	        }
	        if (!native.size)
	            unavailable('No choices exist for this drag group.');
	        let location = null;
	        if (bg && asset) {
	            const box = bg.getBoundingClientRect(), target = drop.getBoundingClientRect();
	            const style = getComputedStyle(bg);
	            const innerWidth = bg.clientWidth - parseFloat(style.paddingLeft || '0') - parseFloat(style.paddingRight || '0');
	            const scale = innerWidth / bg.naturalWidth;
	            if (!(scale > 0))
	                unavailable('Background image geometry is unavailable.');
	            location = { asset_id: asset, x: Math.max(0, Math.round((target.left - box.left - bg.clientLeft) / scale)),
	                y: Math.max(0, Math.round((target.top - box.top - bg.clientTop) / scale)),
	                width: Math.max(1, Math.round(target.width / scale)), height: Math.max(1, Math.round(target.height / scale)) };
	        }
	        const write = async (id, signal) => {
	            throwIfAborted(signal);
	            if (id !== null && (typeof id !== 'string' || !native.has(id)))
	                unavailable('Unknown drag choice.');
	            await bridgeCall(ctx.root, 'composite.set', { fieldName: input.name, choice: id === null ? null : native.get(id) }, signal);
	        };
	        const id = ctx.addField({ kind: 'single_choice', content: label(((_a = drop.querySelector('.accesshide')) === null || _a === void 0 ? void 0 : _a.textContent) || `Blank ${place}`),
	            options, group: groups.get(group), location }, {
	            elements: [drop, input],
	            read: () => {
	                var _a, _b;
	                return ({ kind: 'single_choice', option_id: !input.value || input.value === '0' ? null :
	                        (_b = (_a = Array.from(native).find(([, value]) => value === input.value)) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : unavailable('The selected drag choice changed.') });
	            },
	            apply: async (answer, signal) => { checkAnswer(answer, 'single_choice'); if (answer.kind === 'single_choice')
	                await write(answer.option_id, signal); },
	            restore: async (previous, signal) => { await write(previous.option_id, signal); },
	            reset: async (signal) => { await write(null, signal); }
	        });
	        ctx.fieldNodes.set(drop, id);
	    }
	    ctx.prepareApply = async (signal) => { await bridgeCall(ctx.root, 'composite.clear', {}, signal); };
	}
	async function markers(ctx) {
	    await bridgeCall(ctx.root, 'ready', {});
	    const bg = ctx.root.querySelector('.dropbackground');
	    if (!bg)
	        unavailable('Marker background is missing.');
	    const asset = ctx.asset(bg);
	    const inputs = elements(ctx.root, 'input.choices[name]');
	    if (!inputs.length)
	        unavailable('Marker response fields are missing.');
	    for (const input of inputs) {
	        const choice = suffix(input, 'choice');
	        const marker = elements(ctx.root, '.draghomes .marker:not(.dragplaceholder), .droparea .marker:not(.dragplaceholder)')
	            .find(node => suffix(node, 'choice') === choice);
	        if (!marker)
	            unavailable('Marker label is missing.');
	        const capacity = input.classList.contains('infinite') ? null : Number(suffix(input, 'noofdrags'));
	        const write = async (value, signal) => {
	            throwIfAborted(signal);
	            if (!Array.isArray(value))
	                unavailable('Invalid marker coordinates.');
	            await bridgeCall(ctx.root, 'marker.set', { fieldName: input.name, points: value }, signal);
	        };
	        const id = ctx.addField({ kind: 'markers', content: ctx.content(marker.querySelector('.markertext') || marker),
	            asset_id: asset, capacity }, {
	            elements: [input],
	            read: () => ({ kind: 'markers', points: points(input.value) }),
	            apply: async (answer, signal) => { checkAnswer(answer, 'markers'); if (answer.kind === 'markers')
	                await write(answer.points, signal); },
	            restore: async (previous, signal) => { await write(previous.points, signal); },
	            reset: async (signal) => { await write([], signal); }
	        });
	        ctx.fieldNodes.set(input, id);
	        for (const node of elements(ctx.root, '.marker').filter(el => suffix(el, 'choice') === choice))
	            ctx.fieldNodes.set(node, id);
	    }
	}
	async function extractComposite(ctx) {
	    switch (ctx.qtype) {
	        case 'ordering':
	            ordering(ctx);
	            return true;
	        case 'gapselect':
	            gapselect(ctx);
	            return true;
	        case 'ddwtos':
	        case 'ddimageortext':
	            await slots(ctx);
	            return true;
	        case 'ddmarker':
	            await markers(ctx);
	            return true;
	        default: return false;
	    }
	}

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

	async function extractEssay(ctx, signal) {
	    if (ctx.qtype !== 'essay')
	        return false;
	    const textarea = Array.from(ctx.root.querySelectorAll('.formulation textarea')).find(element => element.name.endsWith('_answer'));
	    if (!textarea)
	        throw new AdapterError('attachment_only', 'This essay requires file attachments, which are outside this extension’s support.');
	    const editorWrapper = !!textarea.closest('.qtype_essay_editor,.qtype_essay_editorfilepicker');
	    const readiness = editorWrapper ? await bridgeCall(ctx.root, 'essay.ready', { textarea_id: textarea.id }, signal) : null;
	    if (editorWrapper && (!readiness || typeof readiness !== 'object' || !('surface' in readiness)
	        || !['plain', 'tiny', 'atto'].includes(String(readiness.surface)))) {
	        throw new AdapterError('application_failed', 'Moodle did not identify the essay editor.');
	    }
	    const rich = editorWrapper && readiness.surface !== 'plain';
	    const read = () => rich ? editorHTML(ctx.root, textarea) : textarea.value;
	    const apply = async (answer, signal) => {
	        throwIfAborted(signal);
	        if (answer.kind !== 'essay')
	            throw new AdapterError('invalid_answer', 'An essay response is required.');
	        if (rich)
	            await bridgeCall(ctx.root, 'essay.write', { textarea_id: textarea.id, value: answer.value, expected_html: read() }, signal);
	        else
	            await nativeValueChange(textarea, () => setNativeValue(textarea, answer.value), signal);
	    };
	    const restore = async (previous, signal) => {
	        if (typeof previous !== 'string')
	            throw new Error('Invalid essay snapshot.');
	        throwIfAborted(signal);
	        if (rich)
	            await bridgeCall(ctx.root, 'essay.restore', { textarea_id: textarea.id, html: previous, expected_html: read() }, signal);
	        else
	            await nativeValueChange(textarea, () => setNativeValue(textarea, previous), signal);
	    };
	    const current = read();
	    const content = current ? [{ kind: 'text', text: `Existing response or response template (preserve required structure):\n${current}` }] : [];
	    const id = ctx.addField({ kind: 'essay', content }, { elements: [textarea], read, apply, restore, reset: signal => restore('', signal) });
	    ctx.fieldNodes.set(textarea.closest('.qtype_essay_editor,.qtype_essay_editorfilepicker') || textarea, id);
	    return true;
	}

	const QUESTION_TYPES = ['multichoice', 'truefalse', 'shortanswer', 'numerical', 'calculated', 'calculatedsimple', 'calculatedmulti', 'match', 'randomsamatch', 'multianswer', 'gapselect', 'ddwtos', 'ddimageortext', 'ddmarker', 'ordering', 'essay'];
	function questionType(root) {
	    if (root.classList.contains('description'))
	        return 'description';
	    if (root.classList.contains('missingtype'))
	        return 'missingtype';
	    return QUESTION_TYPES.find(type => root.classList.contains(type)) || null;
	}
	function fingerprint(root) {
	    const formulation = root.querySelector('.formulation');
	    if (!formulation)
	        return '';
	    const clone = formulation.cloneNode(true);
	    clone.querySelectorAll('[data-quiz-solver],.specificfeedback,.feedback,.MathJax_Preview').forEach(el => el.remove());
	    // The controller's loading/pending cursor is presentation, not authored question data.
	    clone.querySelectorAll('.qtext').forEach(stem => {
	        stem.style.removeProperty('cursor');
	        if (!stem.getAttribute('style'))
	            stem.removeAttribute('style');
	    });
	    return `${root.id}|${questionType(root)}|${clone.innerHTML}`;
	}
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
	    const nextId = (prefix) => { const count = (counters.get(prefix) || 0) + 1; counters.set(prefix, count); return `${prefix}${count}`; };
	    const fieldNodes = new Map();
	    const extractor = new ContentExtractor(fieldNodes, nextId);
	    const ctx = {
	        root, qtype, fields: {}, bindings: new Map(), fieldNodes,
	        id: nextId,
	        content: node => extractor.content(node),
	        asset: image => extractor.asset(image),
	        addField(field, binding) { const id = nextId('f'); this.fields[id] = field; this.bindings.set(id, binding); return id; }
	    };
	    const handled = await extractStandard(ctx) || await extractComposite(ctx) || await extractEssay(ctx, signal);
	    if (!handled || !ctx.bindings.size)
	        throw new AdapterError('unsupported_question', 'No supported answer controls were found.');
	    const stem = root.querySelector('.qtext') || (qtype === 'multianswer' ? root.querySelector('.formulation') : null);
	    if (!stem)
	        throw new AdapterError('missing_question', 'Moodle did not provide question text.');
	    const question = { qtype, content: ctx.content(stem), fields: ctx.fields, assets: {} };
	    const seen = new Set();
	    const deduplicate = (blocks) => blocks.filter(block => {
	        if (block.kind === 'field') {
	            if (seen.has(block.field_id))
	                return false;
	            seen.add(block.field_id);
	        }
	        if (block.kind === 'paragraph')
	            block.children = deduplicate(block.children);
	        if (block.kind === 'list')
	            block.items = block.items.map(deduplicate);
	        if (block.kind === 'table')
	            block.rows.forEach(row => row.cells.forEach(cell => { cell.content = deduplicate(cell.content); }));
	        return true;
	    });
	    question.content = deduplicate(question.content);
	    // Moodle does not encode passage associations: keep all current-page descriptions separately labelled.
	    root.ownerDocument.querySelectorAll('.que.description .qtext').forEach(description => {
	        question.content.push({ kind: 'paragraph', children: [{ kind: 'text', text: 'Information block from this quiz page:' }, ...ctx.content(description)] });
	    });
	    const initialFingerprint = fingerprint(root);
	    const previous = new Map([...ctx.bindings].map(([id, binding]) => [id, binding.read()]));
	    await extractor.finish(question, signal);
	    throwIfAborted(signal);
	    if (fingerprint(root) !== initialFingerprint || [...ctx.bindings].some(([id, binding]) => JSON.stringify(binding.read()) !== JSON.stringify(previous.get(id))))
	        throw new AdapterError('stale_question', 'The question changed while preparing it. Please retry.');
	    if (!validateQuestion(question))
	        throw new AdapterError('invalid_question', 'This question could not be represented by the v2 contract.');
	    return { id: `s${Date.now()}_${++snapshotSequence}`, root, question, bindings: ctx.bindings, fingerprint: initialFingerprint, previous, prepareApply: ctx.prepareApply };
	}
	let applicationQueue = Promise.resolve();
	function applyAnswer(snapshot, answer, signal, edited = () => false) {
	    validateAnswerForQuestion(snapshot.question, answer);
	    const operation = applicationQueue.catch(() => { }).then(async () => {
	        var _a, _b;
	        throwIfAborted(signal);
	        assertEditable(snapshot.root);
	        if (edited() || fingerprint(snapshot.root) !== snapshot.fingerprint || [...snapshot.bindings].some(([id, binding]) => JSON.stringify(binding.read()) !== JSON.stringify(snapshot.previous.get(id))))
	            throw new AdapterError('stale_question', 'This question was edited after generation began. Generate a fresh answer.');
	        let mutated = false;
	        try {
	            mutated = true;
	            await ((_a = snapshot.prepareApply) === null || _a === void 0 ? void 0 : _a.call(snapshot, signal));
	            for (const [id, binding] of snapshot.bindings) {
	                throwIfAborted(signal);
	                if (edited())
	                    throw new AdapterError('user_edit', 'A manual edit interrupted answer application.');
	                assertEditable(snapshot.root);
	                await binding.apply(answer.fields[id], signal);
	                throwIfAborted(signal);
	                if (edited())
	                    throw new AdapterError('user_edit', 'A manual edit interrupted answer application.');
	            }
	            const applied = new Map([...snapshot.bindings].map(([id, binding]) => [id, binding.read()]));
	            await new Promise(resolve => setTimeout(resolve, 0));
	            throwIfAborted(signal);
	            assertEditable(snapshot.root);
	            if (edited() || [...snapshot.bindings].some(([id, binding]) => JSON.stringify(binding.read()) !== JSON.stringify(applied.get(id))))
	                throw new AdapterError('application_changed', 'Moodle changed the response before verification finished.');
	        }
	        catch (error) {
	            if (mutated && !edited() && snapshot.root.isConnected) {
	                const restoration = new AbortController();
	                const checkEdit = () => { if (edited())
	                    restoration.abort(); };
	                const editEvents = ['input', 'change', 'pointerdown', 'keydown', 'beforeinput', 'paste', 'cut', 'drop', 'click'];
	                editEvents.forEach(event => snapshot.root.addEventListener(event, checkEdit, true));
	                try {
	                    assertEditable(snapshot.root);
	                    await ((_b = snapshot.prepareApply) === null || _b === void 0 ? void 0 : _b.call(snapshot, restoration.signal));
	                    for (const [id, binding] of snapshot.bindings) {
	                        checkEdit();
	                        throwIfAborted(restoration.signal);
	                        await binding.restore(snapshot.previous.get(id), restoration.signal);
	                    }
	                    checkEdit();
	                    throwIfAborted(restoration.signal);
	                    if ([...snapshot.bindings].some(([id, binding]) => JSON.stringify(binding.read()) !== JSON.stringify(snapshot.previous.get(id))))
	                        throw new Error('Restored response differs.');
	                }
	                catch (_c) {
	                    if (edited())
	                        throw new AdapterError('user_edit', 'A manual edit interrupted restoration. Review this question before continuing.');
	                    throw new AdapterError('restoration_failed', 'Moodle could not finish applying or fully restore the answer. Review this question before continuing.');
	                }
	                finally {
	                    editEvents.forEach(event => snapshot.root.removeEventListener(event, checkEdit, true));
	                }
	            }
	            throw error;
	        }
	    });
	    applicationQueue = operation;
	    return operation;
	}

	function initializeV2() {
	    const states = new Map();
	    const cleanups = new Map();
	    const trackEditors = (state) => {
	        for (const [frame, cleanup] of state.frames)
	            if (!frame.isConnected) {
	                cleanup();
	                state.frames.delete(frame);
	            }
	        for (const frame of state.root.querySelectorAll('.tox-edit-area iframe')) {
	            if (state.frames.has(frame))
	                continue;
	            let detach = () => { };
	            const attach = () => {
	                detach();
	                const document = frame.contentDocument;
	                if (!document)
	                    return;
	                const events = ['beforeinput', 'input', 'change', 'pointerdown', 'keydown', 'paste', 'cut', 'drop'];
	                const edit = (event) => {
	                    var _a;
	                    if (!event.isTrusted || (state.phase === 'applying' && (event.type === 'input' || event.type === 'change')))
	                        return;
	                    state.revision++;
	                    if (state.phase === 'applying')
	                        (_a = state.controller) === null || _a === void 0 ? void 0 : _a.abort();
	                };
	                events.forEach(event => document.addEventListener(event, edit, true));
	                detach = () => events.forEach(event => document.removeEventListener(event, edit, true));
	            };
	            frame.addEventListener('load', attach);
	            attach();
	            state.frames.set(frame, () => { detach(); frame.removeEventListener('load', attach); });
	        }
	    };
	    const excluded = (target) => {
	        const element = target instanceof Element ? target : target instanceof Node ? target.parentElement : null;
	        return !!(element === null || element === void 0 ? void 0 : element.closest('.questionflag')) || isInteractiveTarget(target);
	    };
	    const update = (state) => {
	        const cursor = state.cursor && !state.nativeHover
	            ? state.phase === 'generating' || state.phase === 'applying' ? 'wait' : state.phase === 'pending' ? 'copy' : 'pointer'
	            : state.originalCursor;
	        if (cursor)
	            state.info.style.setProperty('cursor', cursor, state.originalCursorPriority);
	        else
	            state.info.style.removeProperty('cursor');
	    };
	    const isCurrent = (state) => state.root.isConnected
	        && state.root.querySelector('.info') === state.info
	        && state.root.querySelector('.formulation') === state.formulation
	        && questionType(state.root) === state.type
	        && (state.root.querySelector('.qtext') || (state.root.classList.contains('multianswer') ? state.root.querySelector('.formulation') : null)) === state.stem;
	    const activate = async (state) => {
	        var _a, _b;
	        if (!isCurrent(state))
	            return;
	        if (state.phase === 'applying')
	            return;
	        if (state.phase === 'generating') {
	            (_a = state.controller) === null || _a === void 0 ? void 0 : _a.abort();
	            return;
	        }
	        if ((_b = window.getSelection()) === null || _b === void 0 ? void 0 : _b.toString().trim())
	            return;
	        const revision = state.revision;
	        const controller = new AbortController();
	        state.controller = controller;
	        const pending = state.pending;
	        state.pending = undefined;
	        state.phase = pending ? 'applying' : 'generating';
	        update(state);
	        try {
	            if (pending)
	                await applyAnswer(pending.snapshot, pending.answer, controller.signal, () => state.revision !== pending.revision);
	            else {
	                if (!state.type || state.type === 'missingtype')
	                    throw new AdapterError('unsupported_question', 'This Moodle question type is unavailable.');
	                const config = await getStoredConfig();
	                throwIfAborted(controller.signal);
	                if (!(config === null || config === void 0 ? void 0 : config.apiKey))
	                    throw new AdapterError('configuration_required', 'Configure the extension with an API key first.');
	                state.cursor = config.cursor !== false;
	                update(state);
	                const snapshot = await extractQuestion(state.root, controller.signal);
	                update(state);
	                const result = await getAnswer(snapshot, config, controller.signal);
	                if (state.controller !== controller)
	                    return;
	                throwIfAborted(controller.signal);
	                if (state.revision !== revision)
	                    throw new AdapterError('stale_question', 'You edited this question. Generate a fresh answer.');
	                if (config.fillOnClick) {
	                    state.pending = { snapshot, answer: result.answer, revision };
	                    state.phase = 'pending';
	                    update(state);
	                    return;
	                }
	                state.phase = 'applying';
	                update(state);
	                await applyAnswer(snapshot, result.answer, controller.signal, () => state.revision !== revision);
	            }
	            state.phase = 'ready';
	            update(state);
	        }
	        catch (error) {
	            if (state.controller !== controller || !isCurrent(state))
	                return;
	            state.phase = 'ready';
	            const cancelled = !(error instanceof AdapterError) && (controller.signal.aborted || (typeof error === 'object' && error !== null && 'name' in error && error.name === 'AbortError'));
	            const message = typeof error === 'object' && error !== null && 'message' in error && typeof error.message === 'string' ? error.message : 'The answer could not be applied.';
	            update(state);
	            if (!cancelled)
	                window.alert(message);
	            else if (state.revision !== revision)
	                window.alert('A manual edit interrupted application. Review this question before continuing.');
	        }
	        finally {
	            if (state.controller === controller)
	                state.controller = undefined;
	        }
	    };
	    const scan = () => {
	        var _a;
	        for (const [root, state] of states)
	            if (!isCurrent(state)) {
	                (_a = cleanups.get(root)) === null || _a === void 0 ? void 0 : _a();
	                cleanups.delete(root);
	                states.delete(root);
	            }
	        for (const root of document.querySelectorAll('.que')) {
	            if (states.has(root))
	                continue;
	            const info = root.querySelector('.info');
	            const type = questionType(root);
	            if (!info || type === 'description')
	                continue;
	            const stem = root.querySelector('.qtext') || (root.classList.contains('multianswer') ? root.querySelector('.formulation') : null);
	            const state = { root, stem, info, type, formulation: root.querySelector('.formulation'),
	                originalCursor: info.style.getPropertyValue('cursor'), originalCursorPriority: info.style.getPropertyPriority('cursor'),
	                nativeHover: false, phase: 'ready', revision: 0, frames: new Map() };
	            states.set(root, state);
	            void getStoredConfig().then(config => {
	                if (states.get(root) !== state || state.controller)
	                    return;
	                state.cursor = (config === null || config === void 0 ? void 0 : config.cursor) !== false;
	                update(state);
	            }).catch(() => { });
	            const click = (event) => { if (!excluded(event.target))
	                void activate(state); };
	            // Restore the inherited native cursor while hovering flag controls or links.
	            const over = (event) => { state.nativeHover = excluded(event.target); update(state); };
	            const out = (event) => {
	                state.nativeHover = event.relatedTarget instanceof Node && info.contains(event.relatedTarget) && excluded(event.relatedTarget);
	                update(state);
	            };
	            const edit = (event) => {
	                var _a;
	                if (!event.isTrusted || !(event.target instanceof Element) || event.target.closest('[data-quiz-solver], .info, .questionflag'))
	                    return;
	                // Native .click() can produce trusted input/change as its default action.
	                // While applying, actual user intent is captured by pointer/key/beforeinput/paste events.
	                if (state.phase === 'applying' && (event.type === 'input' || event.type === 'change'))
	                    return;
	                // Only interactions with answer controls are edits.
	                if (event.type === 'input' || event.type === 'change' || isInteractiveTarget(event.target)) {
	                    state.revision++;
	                    if (state.phase === 'applying')
	                        (_a = state.controller) === null || _a === void 0 ? void 0 : _a.abort();
	                }
	            };
	            info.addEventListener('click', click);
	            info.addEventListener('mouseover', over);
	            info.addEventListener('mouseout', out);
	            const editEvents = ['input', 'change', 'pointerdown', 'keydown', 'beforeinput', 'paste', 'cut', 'drop', 'click'];
	            for (const event of editEvents)
	                root.addEventListener(event, edit, true);
	            cleanups.set(root, () => {
	                const controller = state.controller;
	                state.controller = undefined;
	                controller === null || controller === void 0 ? void 0 : controller.abort();
	                info.removeEventListener('click', click);
	                info.removeEventListener('mouseover', over);
	                info.removeEventListener('mouseout', out);
	                for (const event of editEvents)
	                    root.removeEventListener(event, edit, true);
	                state.cursor = false;
	                update(state);
	                state.frames.forEach(cleanup => cleanup());
	                state.frames.clear();
	            });
	        }
	        states.forEach(trackEditors);
	    };
	    let scheduled;
	    const observer = new MutationObserver(() => { if (!scheduled)
	        scheduled = setTimeout(() => { scheduled = undefined; scan(); }, 100); });
	    scan();
	    observer.observe(document.body, { childList: true, subtree: true });
	    return () => { var _a; observer.disconnect(); clearTimeout(scheduled); for (const state of states.values())
	        (_a = state.controller) === null || _a === void 0 ? void 0 : _a.abort(); cleanups.forEach(cleanup => cleanup()); states.clear(); };
	}

	// Native Moodle events remain intact; the adapters use those events.
	initializeV2();
	void getStoredConfig().then(config => { if (config)
	    initializeCustomPrompt(config); });

}));
//# sourceMappingURL=QuizSolver.js.map
