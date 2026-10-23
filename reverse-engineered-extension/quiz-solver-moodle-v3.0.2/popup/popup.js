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

	/******************************************************************************
	Copyright (c) Microsoft Corporation.

	Permission to use, copy, modify, and/or distribute this software for any
	purpose with or without fee is hereby granted.

	THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
	REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
	AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
	INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
	LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
	OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
	PERFORMANCE OF THIS SOFTWARE.
	***************************************************************************** */
	/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


	function __decorate(decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	}

	typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
	    var e = new Error(message);
	    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
	};

	/**
	 * @license
	 * Copyright 2019 Google LLC
	 * SPDX-License-Identifier: BSD-3-Clause
	 */
	const t$2=globalThis,e$2=t$2.ShadowRoot&&(void 0===t$2.ShadyCSS||t$2.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s$2=Symbol(),o$4=new WeakMap;let n$3 = class n{constructor(t,e,o){if(this._$cssResult$=true,o!==s$2)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e;}get styleSheet(){let t=this.o;const s=this.t;if(e$2&&void 0===t){const e=void 0!==s&&1===s.length;e&&(t=o$4.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&o$4.set(s,t));}return t}toString(){return this.cssText}};const r$4=t=>new n$3("string"==typeof t?t:t+"",void 0,s$2),S$1=(s,o)=>{if(e$2)s.adoptedStyleSheets=o.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet));else for(const e of o){const o=document.createElement("style"),n=t$2.litNonce;void 0!==n&&o.setAttribute("nonce",n),o.textContent=e.cssText,s.appendChild(o);}},c$2=e$2?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return r$4(e)})(t):t;

	/**
	 * @license
	 * Copyright 2017 Google LLC
	 * SPDX-License-Identifier: BSD-3-Clause
	 */const{is:i$2,defineProperty:e$1,getOwnPropertyDescriptor:h$1,getOwnPropertyNames:r$3,getOwnPropertySymbols:o$3,getPrototypeOf:n$2}=Object,a$1=globalThis,c$1=a$1.trustedTypes,l$1=c$1?c$1.emptyScript:"",p$1=a$1.reactiveElementPolyfillSupport,d$1=(t,s)=>t,u$1={toAttribute(t,s){switch(s){case Boolean:t=t?l$1:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t);}return t},fromAttribute(t,s){let i=t;switch(s){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t);}catch(t){i=null;}}return i}},f$1=(t,s)=>!i$2(t,s),b={attribute:true,type:String,converter:u$1,reflect:false,useDefault:false,hasChanged:f$1};Symbol.metadata??=Symbol("metadata"),a$1.litPropertyMetadata??=new WeakMap;let y$1 = class y extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t);}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,s=b){if(s.state&&(s.attribute=false),this._$Ei(),this.prototype.hasOwnProperty(t)&&((s=Object.create(s)).wrapped=true),this.elementProperties.set(t,s),!s.noAccessor){const i=Symbol(),h=this.getPropertyDescriptor(t,i,s);void 0!==h&&e$1(this.prototype,t,h);}}static getPropertyDescriptor(t,s,i){const{get:e,set:r}=h$1(this.prototype,t)??{get(){return this[s]},set(t){this[s]=t;}};return {get:e,set(s){const h=e?.call(this);r?.call(this,s),this.requestUpdate(t,h,i);},configurable:true,enumerable:true}}static getPropertyOptions(t){return this.elementProperties.get(t)??b}static _$Ei(){if(this.hasOwnProperty(d$1("elementProperties")))return;const t=n$2(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties);}static finalize(){if(this.hasOwnProperty(d$1("finalized")))return;if(this.finalized=true,this._$Ei(),this.hasOwnProperty(d$1("properties"))){const t=this.properties,s=[...r$3(t),...o$3(t)];for(const i of s)this.createProperty(i,t[i]);}const t=this[Symbol.metadata];if(null!==t){const s=litPropertyMetadata.get(t);if(void 0!==s)for(const[t,i]of s)this.elementProperties.set(t,i);}this._$Eh=new Map;for(const[t,s]of this.elementProperties){const i=this._$Eu(t,s);void 0!==i&&this._$Eh.set(i,t);}this.elementStyles=this.finalizeStyles(this.styles);}static finalizeStyles(s){const i=[];if(Array.isArray(s)){const e=new Set(s.flat(1/0).reverse());for(const s of e)i.unshift(c$2(s));}else void 0!==s&&i.push(c$2(s));return i}static _$Eu(t,s){const i=s.attribute;return  false===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=false,this.hasUpdated=false,this._$Em=null,this._$Ev();}_$Ev(){this._$ES=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach((t=>t(this)));}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.();}removeController(t){this._$EO?.delete(t);}_$E_(){const t=new Map,s=this.constructor.elementProperties;for(const i of s.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t);}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return S$1(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(true),this._$EO?.forEach((t=>t.hostConnected?.()));}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach((t=>t.hostDisconnected?.()));}attributeChangedCallback(t,s,i){this._$AK(t,i);}_$ET(t,s){const i=this.constructor.elementProperties.get(t),e=this.constructor._$Eu(t,i);if(void 0!==e&&true===i.reflect){const h=(void 0!==i.converter?.toAttribute?i.converter:u$1).toAttribute(s,i.type);this._$Em=t,null==h?this.removeAttribute(e):this.setAttribute(e,h),this._$Em=null;}}_$AK(t,s){const i=this.constructor,e=i._$Eh.get(t);if(void 0!==e&&this._$Em!==e){const t=i.getPropertyOptions(e),h="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:u$1;this._$Em=e;const r=h.fromAttribute(s,t.type);this[e]=r??this._$Ej?.get(e)??r,this._$Em=null;}}requestUpdate(t,s,i){if(void 0!==t){const e=this.constructor,h=this[t];if(i??=e.getPropertyOptions(t),!((i.hasChanged??f$1)(h,s)||i.useDefault&&i.reflect&&h===this._$Ej?.get(t)&&!this.hasAttribute(e._$Eu(t,i))))return;this.C(t,s,i);} false===this.isUpdatePending&&(this._$ES=this._$EP());}C(t,s,{useDefault:i,reflect:e,wrapped:h},r){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??s??this[t]),true!==h||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||i||(s=void 0),this._$AL.set(t,s)),true===e&&this._$Em!==t&&(this._$Eq??=new Set).add(t));}async _$EP(){this.isUpdatePending=true;try{await this._$ES;}catch(t){Promise.reject(t);}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,s]of this._$Ep)this[t]=s;this._$Ep=void 0;}const t=this.constructor.elementProperties;if(t.size>0)for(const[s,i]of t){const{wrapped:t}=i,e=this[s];true!==t||this._$AL.has(s)||void 0===e||this.C(s,void 0,i,e);}}let t=false;const s=this._$AL;try{t=this.shouldUpdate(s),t?(this.willUpdate(s),this._$EO?.forEach((t=>t.hostUpdate?.())),this.update(s)):this._$EM();}catch(s){throw t=false,this._$EM(),s}t&&this._$AE(s);}willUpdate(t){}_$AE(t){this._$EO?.forEach((t=>t.hostUpdated?.())),this.hasUpdated||(this.hasUpdated=true,this.firstUpdated(t)),this.updated(t);}_$EM(){this._$AL=new Map,this.isUpdatePending=false;}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return  true}update(t){this._$Eq&&=this._$Eq.forEach((t=>this._$ET(t,this[t]))),this._$EM();}updated(t){}firstUpdated(t){}};y$1.elementStyles=[],y$1.shadowRootOptions={mode:"open"},y$1[d$1("elementProperties")]=new Map,y$1[d$1("finalized")]=new Map,p$1?.({ReactiveElement:y$1}),(a$1.reactiveElementVersions??=[]).push("2.1.1");

	/**
	 * @license
	 * Copyright 2017 Google LLC
	 * SPDX-License-Identifier: BSD-3-Clause
	 */
	const t$1=globalThis,i$1=t$1.trustedTypes,s$1=i$1?i$1.createPolicy("lit-html",{createHTML:t=>t}):void 0,e="$lit$",h=`lit$${Math.random().toFixed(9).slice(2)}$`,o$2="?"+h,n$1=`<${o$2}>`,r$2=document,l=()=>r$2.createComment(""),c=t=>null===t||"object"!=typeof t&&"function"!=typeof t,a=Array.isArray,u=t=>a(t)||"function"==typeof t?.[Symbol.iterator],d="[ \t\n\f\r]",f=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,v=/-->/g,_=/>/g,m=RegExp(`>|${d}(?:([^\\s"'>=/]+)(${d}*=${d}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),p=/'/g,g=/"/g,$=/^(?:script|style|textarea|title)$/i,y=t=>(i,...s)=>({_$litType$:t,strings:i,values:s}),x=y(1),T=Symbol.for("lit-noChange"),E=Symbol.for("lit-nothing"),A=new WeakMap,C=r$2.createTreeWalker(r$2,129);function P(t,i){if(!a(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==s$1?s$1.createHTML(i):i}const V=(t,i)=>{const s=t.length-1,o=[];let r,l=2===i?"<svg>":3===i?"<math>":"",c=f;for(let i=0;i<s;i++){const s=t[i];let a,u,d=-1,y=0;for(;y<s.length&&(c.lastIndex=y,u=c.exec(s),null!==u);)y=c.lastIndex,c===f?"!--"===u[1]?c=v:void 0!==u[1]?c=_:void 0!==u[2]?($.test(u[2])&&(r=RegExp("</"+u[2],"g")),c=m):void 0!==u[3]&&(c=m):c===m?">"===u[0]?(c=r??f,d=-1):void 0===u[1]?d=-2:(d=c.lastIndex-u[2].length,a=u[1],c=void 0===u[3]?m:'"'===u[3]?g:p):c===g||c===p?c=m:c===v||c===_?c=f:(c=m,r=void 0);const x=c===m&&t[i+1].startsWith("/>")?" ":"";l+=c===f?s+n$1:d>=0?(o.push(a),s.slice(0,d)+e+s.slice(d)+h+x):s+h+(-2===d?i:x);}return [P(t,l+(t[s]||"<?>")+(2===i?"</svg>":3===i?"</math>":"")),o]};class N{constructor({strings:t,_$litType$:s},n){let r;this.parts=[];let c=0,a=0;const u=t.length-1,d=this.parts,[f,v]=V(t,s);if(this.el=N.createElement(f,n),C.currentNode=this.el.content,2===s||3===s){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes);}for(;null!==(r=C.nextNode())&&d.length<u;){if(1===r.nodeType){if(r.hasAttributes())for(const t of r.getAttributeNames())if(t.endsWith(e)){const i=v[a++],s=r.getAttribute(t).split(h),e=/([.?@])?(.*)/.exec(i);d.push({type:1,index:c,name:e[2],strings:s,ctor:"."===e[1]?H:"?"===e[1]?I:"@"===e[1]?L:k}),r.removeAttribute(t);}else t.startsWith(h)&&(d.push({type:6,index:c}),r.removeAttribute(t));if($.test(r.tagName)){const t=r.textContent.split(h),s=t.length-1;if(s>0){r.textContent=i$1?i$1.emptyScript:"";for(let i=0;i<s;i++)r.append(t[i],l()),C.nextNode(),d.push({type:2,index:++c});r.append(t[s],l());}}}else if(8===r.nodeType)if(r.data===o$2)d.push({type:2,index:c});else {let t=-1;for(;-1!==(t=r.data.indexOf(h,t+1));)d.push({type:7,index:c}),t+=h.length-1;}c++;}}static createElement(t,i){const s=r$2.createElement("template");return s.innerHTML=t,s}}function S(t,i,s=t,e){if(i===T)return i;let h=void 0!==e?s._$Co?.[e]:s._$Cl;const o=c(i)?void 0:i._$litDirective$;return h?.constructor!==o&&(h?._$AO?.(false),void 0===o?h=void 0:(h=new o(t),h._$AT(t,s,e)),void 0!==e?(s._$Co??=[])[e]=h:s._$Cl=h),void 0!==h&&(i=S(t,h._$AS(t,i.values),h,e)),i}class M{constructor(t,i){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=i;}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:i},parts:s}=this._$AD,e=(t?.creationScope??r$2).importNode(i,true);C.currentNode=e;let h=C.nextNode(),o=0,n=0,l=s[0];for(;void 0!==l;){if(o===l.index){let i;2===l.type?i=new R(h,h.nextSibling,this,t):1===l.type?i=new l.ctor(h,l.name,l.strings,this,t):6===l.type&&(i=new z(h,this,t)),this._$AV.push(i),l=s[++n];}o!==l?.index&&(h=C.nextNode(),o++);}return C.currentNode=r$2,e}p(t){let i=0;for(const s of this._$AV) void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,i),i+=s.strings.length-2):s._$AI(t[i])),i++;}}class R{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,i,s,e){this.type=2,this._$AH=E,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=s,this.options=e,this._$Cv=e?.isConnected??true;}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return void 0!==i&&11===t?.nodeType&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=S(this,t,i),c(t)?t===E||null==t||""===t?(this._$AH!==E&&this._$AR(),this._$AH=E):t!==this._$AH&&t!==T&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):u(t)?this.k(t):this._(t);}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t));}_(t){this._$AH!==E&&c(this._$AH)?this._$AA.nextSibling.data=t:this.T(r$2.createTextNode(t)),this._$AH=t;}$(t){const{values:i,_$litType$:s}=t,e="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=N.createElement(P(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===e)this._$AH.p(i);else {const t=new M(e,this),s=t.u(this.options);t.p(i),this.T(s),this._$AH=t;}}_$AC(t){let i=A.get(t.strings);return void 0===i&&A.set(t.strings,i=new N(t)),i}k(t){a(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let s,e=0;for(const h of t)e===i.length?i.push(s=new R(this.O(l()),this.O(l()),this,this.options)):s=i[e],s._$AI(h),e++;e<i.length&&(this._$AR(s&&s._$AB.nextSibling,e),i.length=e);}_$AR(t=this._$AA.nextSibling,i){for(this._$AP?.(false,true,i);t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i;}}setConnected(t){ void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t));}}class k{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,i,s,e,h){this.type=1,this._$AH=E,this._$AN=void 0,this.element=t,this.name=i,this._$AM=e,this.options=h,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=E;}_$AI(t,i=this,s,e){const h=this.strings;let o=false;if(void 0===h)t=S(this,t,i,0),o=!c(t)||t!==this._$AH&&t!==T,o&&(this._$AH=t);else {const e=t;let n,r;for(t=h[0],n=0;n<h.length-1;n++)r=S(this,e[s+n],i,n),r===T&&(r=this._$AH[n]),o||=!c(r)||r!==this._$AH[n],r===E?t=E:t!==E&&(t+=(r??"")+h[n+1]),this._$AH[n]=r;}o&&!e&&this.j(t);}j(t){t===E?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"");}}class H extends k{constructor(){super(...arguments),this.type=3;}j(t){this.element[this.name]=t===E?void 0:t;}}class I extends k{constructor(){super(...arguments),this.type=4;}j(t){this.element.toggleAttribute(this.name,!!t&&t!==E);}}class L extends k{constructor(t,i,s,e,h){super(t,i,s,e,h),this.type=5;}_$AI(t,i=this){if((t=S(this,t,i,0)??E)===T)return;const s=this._$AH,e=t===E&&s!==E||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,h=t!==E&&(s===E||e);e&&this.element.removeEventListener(this.name,this,s),h&&this.element.addEventListener(this.name,this,t),this._$AH=t;}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t);}}class z{constructor(t,i,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=s;}get _$AU(){return this._$AM._$AU}_$AI(t){S(this,t);}}const j=t$1.litHtmlPolyfillSupport;j?.(N,R),(t$1.litHtmlVersions??=[]).push("3.3.1");const B=(t,i,s)=>{const e=s?.renderBefore??i;let h=e._$litPart$;if(void 0===h){const t=s?.renderBefore??null;e._$litPart$=h=new R(i.insertBefore(l(),t),t,void 0,s??{});}return h._$AI(t),h};

	/**
	 * @license
	 * Copyright 2017 Google LLC
	 * SPDX-License-Identifier: BSD-3-Clause
	 */const s=globalThis;class i extends y$1{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0;}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const r=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=B(r,this.renderRoot,this.renderOptions);}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(true);}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(false);}render(){return T}}i._$litElement$=true,i["finalized"]=true,s.litElementHydrateSupport?.({LitElement:i});const o$1=s.litElementPolyfillSupport;o$1?.({LitElement:i});(s.litElementVersions??=[]).push("4.2.1");

	/**
	 * @license
	 * Copyright 2017 Google LLC
	 * SPDX-License-Identifier: BSD-3-Clause
	 */
	const t=t=>(e,o)=>{ void 0!==o?o.addInitializer((()=>{customElements.define(t,e);})):customElements.define(t,e);};

	/**
	 * @license
	 * Copyright 2017 Google LLC
	 * SPDX-License-Identifier: BSD-3-Clause
	 */const o={attribute:true,type:String,converter:u$1,reflect:false,hasChanged:f$1},r$1=(t=o,e,r)=>{const{kind:n,metadata:i}=r;let s=globalThis.litPropertyMetadata.get(i);if(void 0===s&&globalThis.litPropertyMetadata.set(i,s=new Map),"setter"===n&&((t=Object.create(t)).wrapped=true),s.set(r.name,t),"accessor"===n){const{name:o}=r;return {set(r){const n=e.get.call(this);e.set.call(this,r),this.requestUpdate(o,n,t);},init(e){return void 0!==e&&this.C(o,void 0,t,e),e}}}if("setter"===n){const{name:o}=r;return function(r){const n=this[o];e.call(this,r),this.requestUpdate(o,n,t);}}throw Error("Unsupported decorator location: "+n)};function n(t){return (e,o)=>"object"==typeof o?r$1(t,e,o):((t,e,o)=>{const r=e.hasOwnProperty(o);return e.constructor.createProperty(o,t),r?Object.getOwnPropertyDescriptor(e,o):void 0})(t,e,o)}

	/**
	 * @license
	 * Copyright 2017 Google LLC
	 * SPDX-License-Identifier: BSD-3-Clause
	 */function r(r){return n({...r,state:true,attribute:false})}

	let AlertItem = class AlertItem extends i {
	    constructor() {
	        super(...arguments);
	        this.message = '';
	        this.type = 'info';
	        this.autoDismiss = false;
	        this.dismissDelay = 3000;
	        this.isVisible = true;
	    }
	    createRenderRoot() {
	        return this;
	    }
	    firstUpdated() {
	        if (this.autoDismiss && this.type === 'success') {
	            setTimeout(() => this.dismiss(), this.dismissDelay);
	        }
	    }
	    dismiss() {
	        this.isVisible = false;
	        this.dispatchEvent(new CustomEvent('dismiss', { bubbles: true, composed: true }));
	    }
	    handleClose() {
	        this.dismiss();
	    }
	    render() {
	        if (!this.isVisible)
	            return x ``;
	        return x `
      <div class="alert alert-${this.type} alert-dismissible fade show" role="alert">
        ${this.message}
        <button
          type="button"
          class="btn-close"
          aria-label="Close"
          @click=${this.handleClose}
        ></button>
      </div>
    `;
	    }
	};
	__decorate([
	    n({ type: String })
	], AlertItem.prototype, "message", void 0);
	__decorate([
	    n({ type: String })
	], AlertItem.prototype, "type", void 0);
	__decorate([
	    n({ type: Boolean, attribute: 'auto-dismiss' })
	], AlertItem.prototype, "autoDismiss", void 0);
	__decorate([
	    n({ type: Number, attribute: 'dismiss-delay' })
	], AlertItem.prototype, "dismissDelay", void 0);
	__decorate([
	    r()
	], AlertItem.prototype, "isVisible", void 0);
	AlertItem = __decorate([
	    t('alert-item')
	], AlertItem);
	let Alert = class Alert extends i {
	    constructor() {
	        super(...arguments);
	        this.alerts = [];
	        this.alertIdCounter = 0;
	    }
	    createRenderRoot() {
	        return this;
	    }
	    showAlert(message, type = 'info', autoDismiss = type === 'success') {
	        const id = `alert-${++this.alertIdCounter}`;
	        this.alerts = [
	            ...this.alerts,
	            {
	                id,
	                message,
	                type,
	                autoDismiss
	            }
	        ];
	        return id;
	    }
	    removeAlert(id) {
	        this.alerts = this.alerts.filter(alert => alert.id !== id);
	    }
	    handleAlertDismiss(id) {
	        this.removeAlert(id);
	    }
	    render() {
	        if (this.alerts.length === 0) {
	            return x ``;
	        }
	        return x `
      <div style="width: 100%;">
        ${this.alerts.map(alert => x `
            <alert-item
              .message=${alert.message}
              .type=${alert.type}
              .autoDismiss=${alert.autoDismiss}
              @dismiss=${() => this.handleAlertDismiss(alert.id)}
            ></alert-item>
          `)}
      </div>
    `;
	    }
	};
	__decorate([
	    r()
	], Alert.prototype, "alerts", void 0);
	Alert = __decorate([
	    t('alert-container')
	], Alert);

	/** A special constant with type `never` */
	function $constructor(name, initializer, params) {
	    function init(inst, def) {
	        if (!inst._zod) {
	            Object.defineProperty(inst, "_zod", {
	                value: {
	                    def,
	                    constr: _,
	                    traits: new Set(),
	                },
	                enumerable: false,
	            });
	        }
	        if (inst._zod.traits.has(name)) {
	            return;
	        }
	        inst._zod.traits.add(name);
	        initializer(inst, def);
	        // support prototype modifications
	        const proto = _.prototype;
	        const keys = Object.keys(proto);
	        for (let i = 0; i < keys.length; i++) {
	            const k = keys[i];
	            if (!(k in inst)) {
	                inst[k] = proto[k].bind(inst);
	            }
	        }
	    }
	    // doesn't work if Parent has a constructor with arguments
	    const Parent = params?.Parent ?? Object;
	    class Definition extends Parent {
	    }
	    Object.defineProperty(Definition, "name", { value: name });
	    function _(def) {
	        var _a;
	        const inst = params?.Parent ? new Definition() : this;
	        init(inst, def);
	        (_a = inst._zod).deferred ?? (_a.deferred = []);
	        for (const fn of inst._zod.deferred) {
	            fn();
	        }
	        return inst;
	    }
	    Object.defineProperty(_, "init", { value: init });
	    Object.defineProperty(_, Symbol.hasInstance, {
	        value: (inst) => {
	            if (params?.Parent && inst instanceof params.Parent)
	                return true;
	            return inst?._zod?.traits?.has(name);
	        },
	    });
	    Object.defineProperty(_, "name", { value: name });
	    return _;
	}
	class $ZodAsyncError extends Error {
	    constructor() {
	        super(`Encountered Promise during synchronous parse. Use .parseAsync() instead.`);
	    }
	}
	class $ZodEncodeError extends Error {
	    constructor(name) {
	        super(`Encountered unidirectional transform during encode: ${name}`);
	        this.name = "ZodEncodeError";
	    }
	}
	const globalConfig = {};
	function config(newConfig) {
	    return globalConfig;
	}

	// functions
	function getEnumValues(entries) {
	    const numericValues = Object.values(entries).filter((v) => typeof v === "number");
	    const values = Object.entries(entries)
	        .filter(([k, _]) => numericValues.indexOf(+k) === -1)
	        .map(([_, v]) => v);
	    return values;
	}
	function jsonStringifyReplacer(_, value) {
	    if (typeof value === "bigint")
	        return value.toString();
	    return value;
	}
	function cached(getter) {
	    return {
	        get value() {
	            {
	                const value = getter();
	                Object.defineProperty(this, "value", { value });
	                return value;
	            }
	        },
	    };
	}
	function nullish(input) {
	    return input === null || input === undefined;
	}
	function cleanRegex(source) {
	    const start = source.startsWith("^") ? 1 : 0;
	    const end = source.endsWith("$") ? source.length - 1 : source.length;
	    return source.slice(start, end);
	}
	function floatSafeRemainder(val, step) {
	    const valDecCount = (val.toString().split(".")[1] || "").length;
	    const stepString = step.toString();
	    let stepDecCount = (stepString.split(".")[1] || "").length;
	    if (stepDecCount === 0 && /\d?e-\d?/.test(stepString)) {
	        const match = stepString.match(/\d?e-(\d?)/);
	        if (match?.[1]) {
	            stepDecCount = Number.parseInt(match[1]);
	        }
	    }
	    const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
	    const valInt = Number.parseInt(val.toFixed(decCount).replace(".", ""));
	    const stepInt = Number.parseInt(step.toFixed(decCount).replace(".", ""));
	    return (valInt % stepInt) / 10 ** decCount;
	}
	const EVALUATING = Symbol("evaluating");
	function defineLazy(object, key, getter) {
	    let value = undefined;
	    Object.defineProperty(object, key, {
	        get() {
	            if (value === EVALUATING) {
	                // Circular reference detected, return undefined to break the cycle
	                return undefined;
	            }
	            if (value === undefined) {
	                value = EVALUATING;
	                value = getter();
	            }
	            return value;
	        },
	        set(v) {
	            Object.defineProperty(object, key, {
	                value: v,
	                // configurable: true,
	            });
	            // object[key] = v;
	        },
	        configurable: true,
	    });
	}
	function assignProp(target, prop, value) {
	    Object.defineProperty(target, prop, {
	        value,
	        writable: true,
	        enumerable: true,
	        configurable: true,
	    });
	}
	function mergeDefs(...defs) {
	    const mergedDescriptors = {};
	    for (const def of defs) {
	        const descriptors = Object.getOwnPropertyDescriptors(def);
	        Object.assign(mergedDescriptors, descriptors);
	    }
	    return Object.defineProperties({}, mergedDescriptors);
	}
	function esc(str) {
	    return JSON.stringify(str);
	}
	function slugify(input) {
	    return input
	        .toLowerCase()
	        .trim()
	        .replace(/[^\w\s-]/g, "")
	        .replace(/[\s_-]+/g, "-")
	        .replace(/^-+|-+$/g, "");
	}
	const captureStackTrace = ("captureStackTrace" in Error ? Error.captureStackTrace : (..._args) => { });
	function isObject(data) {
	    return typeof data === "object" && data !== null && !Array.isArray(data);
	}
	const allowsEval = cached(() => {
	    // @ts-ignore
	    if (typeof navigator !== "undefined" && navigator?.userAgent?.includes("Cloudflare")) {
	        return false;
	    }
	    try {
	        const F = Function;
	        new F("");
	        return true;
	    }
	    catch (_) {
	        return false;
	    }
	});
	function isPlainObject(o) {
	    if (isObject(o) === false)
	        return false;
	    // modified constructor
	    const ctor = o.constructor;
	    if (ctor === undefined)
	        return true;
	    if (typeof ctor !== "function")
	        return true;
	    // modified prototype
	    const prot = ctor.prototype;
	    if (isObject(prot) === false)
	        return false;
	    // ctor doesn't have static `isPrototypeOf`
	    if (Object.prototype.hasOwnProperty.call(prot, "isPrototypeOf") === false) {
	        return false;
	    }
	    return true;
	}
	function shallowClone(o) {
	    if (isPlainObject(o))
	        return { ...o };
	    if (Array.isArray(o))
	        return [...o];
	    return o;
	}
	const propertyKeyTypes = new Set(["string", "number", "symbol"]);
	function escapeRegex(str) {
	    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	}
	// zod-specific utils
	function clone(inst, def, params) {
	    const cl = new inst._zod.constr(def ?? inst._zod.def);
	    if (!def || params?.parent)
	        cl._zod.parent = inst;
	    return cl;
	}
	function normalizeParams(_params) {
	    const params = _params;
	    if (!params)
	        return {};
	    if (typeof params === "string")
	        return { error: () => params };
	    if (params?.message !== undefined) {
	        if (params?.error !== undefined)
	            throw new Error("Cannot specify both `message` and `error` params");
	        params.error = params.message;
	    }
	    delete params.message;
	    if (typeof params.error === "string")
	        return { ...params, error: () => params.error };
	    return params;
	}
	function optionalKeys(shape) {
	    return Object.keys(shape).filter((k) => {
	        return shape[k]._zod.optin === "optional" && shape[k]._zod.optout === "optional";
	    });
	}
	const NUMBER_FORMAT_RANGES = {
	    safeint: [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
	    int32: [-2147483648, 2147483647],
	    uint32: [0, 4294967295],
	    float32: [-34028234663852886e22, 3.4028234663852886e38],
	    float64: [-Number.MAX_VALUE, Number.MAX_VALUE],
	};
	function pick(schema, mask) {
	    const currDef = schema._zod.def;
	    const def = mergeDefs(schema._zod.def, {
	        get shape() {
	            const newShape = {};
	            for (const key in mask) {
	                if (!(key in currDef.shape)) {
	                    throw new Error(`Unrecognized key: "${key}"`);
	                }
	                if (!mask[key])
	                    continue;
	                newShape[key] = currDef.shape[key];
	            }
	            assignProp(this, "shape", newShape); // self-caching
	            return newShape;
	        },
	        checks: [],
	    });
	    return clone(schema, def);
	}
	function omit(schema, mask) {
	    const currDef = schema._zod.def;
	    const def = mergeDefs(schema._zod.def, {
	        get shape() {
	            const newShape = { ...schema._zod.def.shape };
	            for (const key in mask) {
	                if (!(key in currDef.shape)) {
	                    throw new Error(`Unrecognized key: "${key}"`);
	                }
	                if (!mask[key])
	                    continue;
	                delete newShape[key];
	            }
	            assignProp(this, "shape", newShape); // self-caching
	            return newShape;
	        },
	        checks: [],
	    });
	    return clone(schema, def);
	}
	function extend(schema, shape) {
	    if (!isPlainObject(shape)) {
	        throw new Error("Invalid input to extend: expected a plain object");
	    }
	    const checks = schema._zod.def.checks;
	    const hasChecks = checks && checks.length > 0;
	    if (hasChecks) {
	        throw new Error("Object schemas containing refinements cannot be extended. Use `.safeExtend()` instead.");
	    }
	    const def = mergeDefs(schema._zod.def, {
	        get shape() {
	            const _shape = { ...schema._zod.def.shape, ...shape };
	            assignProp(this, "shape", _shape); // self-caching
	            return _shape;
	        },
	        checks: [],
	    });
	    return clone(schema, def);
	}
	function safeExtend(schema, shape) {
	    if (!isPlainObject(shape)) {
	        throw new Error("Invalid input to safeExtend: expected a plain object");
	    }
	    const def = {
	        ...schema._zod.def,
	        get shape() {
	            const _shape = { ...schema._zod.def.shape, ...shape };
	            assignProp(this, "shape", _shape); // self-caching
	            return _shape;
	        },
	        checks: schema._zod.def.checks,
	    };
	    return clone(schema, def);
	}
	function merge(a, b) {
	    const def = mergeDefs(a._zod.def, {
	        get shape() {
	            const _shape = { ...a._zod.def.shape, ...b._zod.def.shape };
	            assignProp(this, "shape", _shape); // self-caching
	            return _shape;
	        },
	        get catchall() {
	            return b._zod.def.catchall;
	        },
	        checks: [], // delete existing checks
	    });
	    return clone(a, def);
	}
	function partial(Class, schema, mask) {
	    const def = mergeDefs(schema._zod.def, {
	        get shape() {
	            const oldShape = schema._zod.def.shape;
	            const shape = { ...oldShape };
	            if (mask) {
	                for (const key in mask) {
	                    if (!(key in oldShape)) {
	                        throw new Error(`Unrecognized key: "${key}"`);
	                    }
	                    if (!mask[key])
	                        continue;
	                    // if (oldShape[key]!._zod.optin === "optional") continue;
	                    shape[key] = Class
	                        ? new Class({
	                            type: "optional",
	                            innerType: oldShape[key],
	                        })
	                        : oldShape[key];
	                }
	            }
	            else {
	                for (const key in oldShape) {
	                    // if (oldShape[key]!._zod.optin === "optional") continue;
	                    shape[key] = Class
	                        ? new Class({
	                            type: "optional",
	                            innerType: oldShape[key],
	                        })
	                        : oldShape[key];
	                }
	            }
	            assignProp(this, "shape", shape); // self-caching
	            return shape;
	        },
	        checks: [],
	    });
	    return clone(schema, def);
	}
	function required(Class, schema, mask) {
	    const def = mergeDefs(schema._zod.def, {
	        get shape() {
	            const oldShape = schema._zod.def.shape;
	            const shape = { ...oldShape };
	            if (mask) {
	                for (const key in mask) {
	                    if (!(key in shape)) {
	                        throw new Error(`Unrecognized key: "${key}"`);
	                    }
	                    if (!mask[key])
	                        continue;
	                    // overwrite with non-optional
	                    shape[key] = new Class({
	                        type: "nonoptional",
	                        innerType: oldShape[key],
	                    });
	                }
	            }
	            else {
	                for (const key in oldShape) {
	                    // overwrite with non-optional
	                    shape[key] = new Class({
	                        type: "nonoptional",
	                        innerType: oldShape[key],
	                    });
	                }
	            }
	            assignProp(this, "shape", shape); // self-caching
	            return shape;
	        },
	        checks: [],
	    });
	    return clone(schema, def);
	}
	// invalid_type | too_big | too_small | invalid_format | not_multiple_of | unrecognized_keys | invalid_union | invalid_key | invalid_element | invalid_value | custom
	function aborted(x, startIndex = 0) {
	    if (x.aborted === true)
	        return true;
	    for (let i = startIndex; i < x.issues.length; i++) {
	        if (x.issues[i]?.continue !== true) {
	            return true;
	        }
	    }
	    return false;
	}
	function prefixIssues(path, issues) {
	    return issues.map((iss) => {
	        var _a;
	        (_a = iss).path ?? (_a.path = []);
	        iss.path.unshift(path);
	        return iss;
	    });
	}
	function unwrapMessage(message) {
	    return typeof message === "string" ? message : message?.message;
	}
	function finalizeIssue(iss, ctx, config) {
	    const full = { ...iss, path: iss.path ?? [] };
	    // for backwards compatibility
	    if (!iss.message) {
	        const message = unwrapMessage(iss.inst?._zod.def?.error?.(iss)) ??
	            unwrapMessage(ctx?.error?.(iss)) ??
	            unwrapMessage(config.customError?.(iss)) ??
	            unwrapMessage(config.localeError?.(iss)) ??
	            "Invalid input";
	        full.message = message;
	    }
	    // delete (full as any).def;
	    delete full.inst;
	    delete full.continue;
	    if (!ctx?.reportInput) {
	        delete full.input;
	    }
	    return full;
	}
	function getLengthableOrigin(input) {
	    if (Array.isArray(input))
	        return "array";
	    if (typeof input === "string")
	        return "string";
	    return "unknown";
	}
	function issue(...args) {
	    const [iss, input, inst] = args;
	    if (typeof iss === "string") {
	        return {
	            message: iss,
	            code: "custom",
	            input,
	            inst,
	        };
	    }
	    return { ...iss };
	}

	const initializer$1 = (inst, def) => {
	    inst.name = "$ZodError";
	    Object.defineProperty(inst, "_zod", {
	        value: inst._zod,
	        enumerable: false,
	    });
	    Object.defineProperty(inst, "issues", {
	        value: def,
	        enumerable: false,
	    });
	    inst.message = JSON.stringify(def, jsonStringifyReplacer, 2);
	    Object.defineProperty(inst, "toString", {
	        value: () => inst.message,
	        enumerable: false,
	    });
	};
	const $ZodError = $constructor("$ZodError", initializer$1);
	const $ZodRealError = $constructor("$ZodError", initializer$1, { Parent: Error });
	function flattenError(error, mapper = (issue) => issue.message) {
	    const fieldErrors = {};
	    const formErrors = [];
	    for (const sub of error.issues) {
	        if (sub.path.length > 0) {
	            fieldErrors[sub.path[0]] = fieldErrors[sub.path[0]] || [];
	            fieldErrors[sub.path[0]].push(mapper(sub));
	        }
	        else {
	            formErrors.push(mapper(sub));
	        }
	    }
	    return { formErrors, fieldErrors };
	}
	function formatError(error, mapper = (issue) => issue.message) {
	    const fieldErrors = { _errors: [] };
	    const processError = (error) => {
	        for (const issue of error.issues) {
	            if (issue.code === "invalid_union" && issue.errors.length) {
	                issue.errors.map((issues) => processError({ issues }));
	            }
	            else if (issue.code === "invalid_key") {
	                processError({ issues: issue.issues });
	            }
	            else if (issue.code === "invalid_element") {
	                processError({ issues: issue.issues });
	            }
	            else if (issue.path.length === 0) {
	                fieldErrors._errors.push(mapper(issue));
	            }
	            else {
	                let curr = fieldErrors;
	                let i = 0;
	                while (i < issue.path.length) {
	                    const el = issue.path[i];
	                    const terminal = i === issue.path.length - 1;
	                    if (!terminal) {
	                        curr[el] = curr[el] || { _errors: [] };
	                    }
	                    else {
	                        curr[el] = curr[el] || { _errors: [] };
	                        curr[el]._errors.push(mapper(issue));
	                    }
	                    curr = curr[el];
	                    i++;
	                }
	            }
	        }
	    };
	    processError(error);
	    return fieldErrors;
	}

	const _parse = (_Err) => (schema, value, _ctx, _params) => {
	    const ctx = _ctx ? Object.assign(_ctx, { async: false }) : { async: false };
	    const result = schema._zod.run({ value, issues: [] }, ctx);
	    if (result instanceof Promise) {
	        throw new $ZodAsyncError();
	    }
	    if (result.issues.length) {
	        const e = new (_params?.Err ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
	        captureStackTrace(e, _params?.callee);
	        throw e;
	    }
	    return result.value;
	};
	const _parseAsync = (_Err) => async (schema, value, _ctx, params) => {
	    const ctx = _ctx ? Object.assign(_ctx, { async: true }) : { async: true };
	    let result = schema._zod.run({ value, issues: [] }, ctx);
	    if (result instanceof Promise)
	        result = await result;
	    if (result.issues.length) {
	        const e = new (params?.Err ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
	        captureStackTrace(e, params?.callee);
	        throw e;
	    }
	    return result.value;
	};
	const _safeParse = (_Err) => (schema, value, _ctx) => {
	    const ctx = _ctx ? { ..._ctx, async: false } : { async: false };
	    const result = schema._zod.run({ value, issues: [] }, ctx);
	    if (result instanceof Promise) {
	        throw new $ZodAsyncError();
	    }
	    return result.issues.length
	        ? {
	            success: false,
	            error: new (_Err ?? $ZodError)(result.issues.map((iss) => finalizeIssue(iss, ctx, config()))),
	        }
	        : { success: true, data: result.value };
	};
	const safeParse$1 = /* @__PURE__*/ _safeParse($ZodRealError);
	const _safeParseAsync = (_Err) => async (schema, value, _ctx) => {
	    const ctx = _ctx ? Object.assign(_ctx, { async: true }) : { async: true };
	    let result = schema._zod.run({ value, issues: [] }, ctx);
	    if (result instanceof Promise)
	        result = await result;
	    return result.issues.length
	        ? {
	            success: false,
	            error: new _Err(result.issues.map((iss) => finalizeIssue(iss, ctx, config()))),
	        }
	        : { success: true, data: result.value };
	};
	const safeParseAsync$1 = /* @__PURE__*/ _safeParseAsync($ZodRealError);
	const _encode = (_Err) => (schema, value, _ctx) => {
	    const ctx = _ctx ? Object.assign(_ctx, { direction: "backward" }) : { direction: "backward" };
	    return _parse(_Err)(schema, value, ctx);
	};
	const _decode = (_Err) => (schema, value, _ctx) => {
	    return _parse(_Err)(schema, value, _ctx);
	};
	const _encodeAsync = (_Err) => async (schema, value, _ctx) => {
	    const ctx = _ctx ? Object.assign(_ctx, { direction: "backward" }) : { direction: "backward" };
	    return _parseAsync(_Err)(schema, value, ctx);
	};
	const _decodeAsync = (_Err) => async (schema, value, _ctx) => {
	    return _parseAsync(_Err)(schema, value, _ctx);
	};
	const _safeEncode = (_Err) => (schema, value, _ctx) => {
	    const ctx = _ctx ? Object.assign(_ctx, { direction: "backward" }) : { direction: "backward" };
	    return _safeParse(_Err)(schema, value, ctx);
	};
	const _safeDecode = (_Err) => (schema, value, _ctx) => {
	    return _safeParse(_Err)(schema, value, _ctx);
	};
	const _safeEncodeAsync = (_Err) => async (schema, value, _ctx) => {
	    const ctx = _ctx ? Object.assign(_ctx, { direction: "backward" }) : { direction: "backward" };
	    return _safeParseAsync(_Err)(schema, value, ctx);
	};
	const _safeDecodeAsync = (_Err) => async (schema, value, _ctx) => {
	    return _safeParseAsync(_Err)(schema, value, _ctx);
	};

	const cuid = /^[cC][^\s-]{8,}$/;
	const cuid2 = /^[0-9a-z]+$/;
	const ulid = /^[0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{26}$/;
	const xid = /^[0-9a-vA-V]{20}$/;
	const ksuid = /^[A-Za-z0-9]{27}$/;
	const nanoid = /^[a-zA-Z0-9_-]{21}$/;
	/** ISO 8601-1 duration regex. Does not support the 8601-2 extensions like negative durations or fractional/negative components. */
	const duration$1 = /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/;
	/** A regex for any UUID-like identifier: 8-4-4-4-12 hex pattern */
	const guid = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/;
	/** Returns a regex for validating an RFC 9562/4122 UUID.
	 *
	 * @param version Optionally specify a version 1-8. If no version is specified, all versions are supported. */
	const uuid = (version) => {
	    if (!version)
	        return /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/;
	    return new RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${version}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`);
	};
	/** Practical email validation */
	const email = /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/;
	// from https://thekevinscott.com/emojis-in-javascript/#writing-a-regular-expression
	const _emoji$1 = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
	function emoji() {
	    return new RegExp(_emoji$1, "u");
	}
	const ipv4 = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
	const ipv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/;
	const cidrv4 = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/;
	const cidrv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
	// https://stackoverflow.com/questions/7860392/determine-if-string-is-in-base64-using-javascript
	const base64 = /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/;
	const base64url = /^[A-Za-z0-9_-]*$/;
	// https://blog.stevenlevithan.com/archives/validate-phone-number#r4-3 (regex sans spaces)
	const e164 = /^\+(?:[0-9]){6,14}[0-9]$/;
	// const dateSource = `((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))`;
	const dateSource = `(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))`;
	const date$1 = /*@__PURE__*/ new RegExp(`^${dateSource}$`);
	function timeSource(args) {
	    const hhmm = `(?:[01]\\d|2[0-3]):[0-5]\\d`;
	    const regex = typeof args.precision === "number"
	        ? args.precision === -1
	            ? `${hhmm}`
	            : args.precision === 0
	                ? `${hhmm}:[0-5]\\d`
	                : `${hhmm}:[0-5]\\d\\.\\d{${args.precision}}`
	        : `${hhmm}(?::[0-5]\\d(?:\\.\\d+)?)?`;
	    return regex;
	}
	function time$1(args) {
	    return new RegExp(`^${timeSource(args)}$`);
	}
	// Adapted from https://stackoverflow.com/a/3143231
	function datetime$1(args) {
	    const time = timeSource({ precision: args.precision });
	    const opts = ["Z"];
	    if (args.local)
	        opts.push("");
	    // if (args.offset) opts.push(`([+-]\\d{2}:\\d{2})`);
	    if (args.offset)
	        opts.push(`([+-](?:[01]\\d|2[0-3]):[0-5]\\d)`);
	    const timeRegex = `${time}(?:${opts.join("|")})`;
	    return new RegExp(`^${dateSource}T(?:${timeRegex})$`);
	}
	const string$1 = (params) => {
	    const regex = params ? `[\\s\\S]{${params?.minimum ?? 0},${params?.maximum ?? ""}}` : `[\\s\\S]*`;
	    return new RegExp(`^${regex}$`);
	};
	const integer = /^-?\d+$/;
	const number$1 = /^-?\d+(?:\.\d+)?/;
	const boolean$1 = /^(?:true|false)$/i;
	// regex for string with no uppercase letters
	const lowercase = /^[^A-Z]*$/;
	// regex for string with no lowercase letters
	const uppercase = /^[^a-z]*$/;

	// import { $ZodType } from "./schemas.js";
	const $ZodCheck = /*@__PURE__*/ $constructor("$ZodCheck", (inst, def) => {
	    var _a;
	    inst._zod ?? (inst._zod = {});
	    inst._zod.def = def;
	    (_a = inst._zod).onattach ?? (_a.onattach = []);
	});
	const numericOriginMap = {
	    number: "number",
	    bigint: "bigint",
	    object: "date",
	};
	const $ZodCheckLessThan = /*@__PURE__*/ $constructor("$ZodCheckLessThan", (inst, def) => {
	    $ZodCheck.init(inst, def);
	    const origin = numericOriginMap[typeof def.value];
	    inst._zod.onattach.push((inst) => {
	        const bag = inst._zod.bag;
	        const curr = (def.inclusive ? bag.maximum : bag.exclusiveMaximum) ?? Number.POSITIVE_INFINITY;
	        if (def.value < curr) {
	            if (def.inclusive)
	                bag.maximum = def.value;
	            else
	                bag.exclusiveMaximum = def.value;
	        }
	    });
	    inst._zod.check = (payload) => {
	        if (def.inclusive ? payload.value <= def.value : payload.value < def.value) {
	            return;
	        }
	        payload.issues.push({
	            origin,
	            code: "too_big",
	            maximum: def.value,
	            input: payload.value,
	            inclusive: def.inclusive,
	            inst,
	            continue: !def.abort,
	        });
	    };
	});
	const $ZodCheckGreaterThan = /*@__PURE__*/ $constructor("$ZodCheckGreaterThan", (inst, def) => {
	    $ZodCheck.init(inst, def);
	    const origin = numericOriginMap[typeof def.value];
	    inst._zod.onattach.push((inst) => {
	        const bag = inst._zod.bag;
	        const curr = (def.inclusive ? bag.minimum : bag.exclusiveMinimum) ?? Number.NEGATIVE_INFINITY;
	        if (def.value > curr) {
	            if (def.inclusive)
	                bag.minimum = def.value;
	            else
	                bag.exclusiveMinimum = def.value;
	        }
	    });
	    inst._zod.check = (payload) => {
	        if (def.inclusive ? payload.value >= def.value : payload.value > def.value) {
	            return;
	        }
	        payload.issues.push({
	            origin,
	            code: "too_small",
	            minimum: def.value,
	            input: payload.value,
	            inclusive: def.inclusive,
	            inst,
	            continue: !def.abort,
	        });
	    };
	});
	const $ZodCheckMultipleOf = 
	/*@__PURE__*/ $constructor("$ZodCheckMultipleOf", (inst, def) => {
	    $ZodCheck.init(inst, def);
	    inst._zod.onattach.push((inst) => {
	        var _a;
	        (_a = inst._zod.bag).multipleOf ?? (_a.multipleOf = def.value);
	    });
	    inst._zod.check = (payload) => {
	        if (typeof payload.value !== typeof def.value)
	            throw new Error("Cannot mix number and bigint in multiple_of check.");
	        const isMultiple = typeof payload.value === "bigint"
	            ? payload.value % def.value === BigInt(0)
	            : floatSafeRemainder(payload.value, def.value) === 0;
	        if (isMultiple)
	            return;
	        payload.issues.push({
	            origin: typeof payload.value,
	            code: "not_multiple_of",
	            divisor: def.value,
	            input: payload.value,
	            inst,
	            continue: !def.abort,
	        });
	    };
	});
	const $ZodCheckNumberFormat = /*@__PURE__*/ $constructor("$ZodCheckNumberFormat", (inst, def) => {
	    $ZodCheck.init(inst, def); // no format checks
	    def.format = def.format || "float64";
	    const isInt = def.format?.includes("int");
	    const origin = isInt ? "int" : "number";
	    const [minimum, maximum] = NUMBER_FORMAT_RANGES[def.format];
	    inst._zod.onattach.push((inst) => {
	        const bag = inst._zod.bag;
	        bag.format = def.format;
	        bag.minimum = minimum;
	        bag.maximum = maximum;
	        if (isInt)
	            bag.pattern = integer;
	    });
	    inst._zod.check = (payload) => {
	        const input = payload.value;
	        if (isInt) {
	            if (!Number.isInteger(input)) {
	                // invalid_format issue
	                // payload.issues.push({
	                //   expected: def.format,
	                //   format: def.format,
	                //   code: "invalid_format",
	                //   input,
	                //   inst,
	                // });
	                // invalid_type issue
	                payload.issues.push({
	                    expected: origin,
	                    format: def.format,
	                    code: "invalid_type",
	                    continue: false,
	                    input,
	                    inst,
	                });
	                return;
	                // not_multiple_of issue
	                // payload.issues.push({
	                //   code: "not_multiple_of",
	                //   origin: "number",
	                //   input,
	                //   inst,
	                //   divisor: 1,
	                // });
	            }
	            if (!Number.isSafeInteger(input)) {
	                if (input > 0) {
	                    // too_big
	                    payload.issues.push({
	                        input,
	                        code: "too_big",
	                        maximum: Number.MAX_SAFE_INTEGER,
	                        note: "Integers must be within the safe integer range.",
	                        inst,
	                        origin,
	                        continue: !def.abort,
	                    });
	                }
	                else {
	                    // too_small
	                    payload.issues.push({
	                        input,
	                        code: "too_small",
	                        minimum: Number.MIN_SAFE_INTEGER,
	                        note: "Integers must be within the safe integer range.",
	                        inst,
	                        origin,
	                        continue: !def.abort,
	                    });
	                }
	                return;
	            }
	        }
	        if (input < minimum) {
	            payload.issues.push({
	                origin: "number",
	                input,
	                code: "too_small",
	                minimum,
	                inclusive: true,
	                inst,
	                continue: !def.abort,
	            });
	        }
	        if (input > maximum) {
	            payload.issues.push({
	                origin: "number",
	                input,
	                code: "too_big",
	                maximum,
	                inst,
	            });
	        }
	    };
	});
	const $ZodCheckMaxLength = /*@__PURE__*/ $constructor("$ZodCheckMaxLength", (inst, def) => {
	    var _a;
	    $ZodCheck.init(inst, def);
	    (_a = inst._zod.def).when ?? (_a.when = (payload) => {
	        const val = payload.value;
	        return !nullish(val) && val.length !== undefined;
	    });
	    inst._zod.onattach.push((inst) => {
	        const curr = (inst._zod.bag.maximum ?? Number.POSITIVE_INFINITY);
	        if (def.maximum < curr)
	            inst._zod.bag.maximum = def.maximum;
	    });
	    inst._zod.check = (payload) => {
	        const input = payload.value;
	        const length = input.length;
	        if (length <= def.maximum)
	            return;
	        const origin = getLengthableOrigin(input);
	        payload.issues.push({
	            origin,
	            code: "too_big",
	            maximum: def.maximum,
	            inclusive: true,
	            input,
	            inst,
	            continue: !def.abort,
	        });
	    };
	});
	const $ZodCheckMinLength = /*@__PURE__*/ $constructor("$ZodCheckMinLength", (inst, def) => {
	    var _a;
	    $ZodCheck.init(inst, def);
	    (_a = inst._zod.def).when ?? (_a.when = (payload) => {
	        const val = payload.value;
	        return !nullish(val) && val.length !== undefined;
	    });
	    inst._zod.onattach.push((inst) => {
	        const curr = (inst._zod.bag.minimum ?? Number.NEGATIVE_INFINITY);
	        if (def.minimum > curr)
	            inst._zod.bag.minimum = def.minimum;
	    });
	    inst._zod.check = (payload) => {
	        const input = payload.value;
	        const length = input.length;
	        if (length >= def.minimum)
	            return;
	        const origin = getLengthableOrigin(input);
	        payload.issues.push({
	            origin,
	            code: "too_small",
	            minimum: def.minimum,
	            inclusive: true,
	            input,
	            inst,
	            continue: !def.abort,
	        });
	    };
	});
	const $ZodCheckLengthEquals = /*@__PURE__*/ $constructor("$ZodCheckLengthEquals", (inst, def) => {
	    var _a;
	    $ZodCheck.init(inst, def);
	    (_a = inst._zod.def).when ?? (_a.when = (payload) => {
	        const val = payload.value;
	        return !nullish(val) && val.length !== undefined;
	    });
	    inst._zod.onattach.push((inst) => {
	        const bag = inst._zod.bag;
	        bag.minimum = def.length;
	        bag.maximum = def.length;
	        bag.length = def.length;
	    });
	    inst._zod.check = (payload) => {
	        const input = payload.value;
	        const length = input.length;
	        if (length === def.length)
	            return;
	        const origin = getLengthableOrigin(input);
	        const tooBig = length > def.length;
	        payload.issues.push({
	            origin,
	            ...(tooBig ? { code: "too_big", maximum: def.length } : { code: "too_small", minimum: def.length }),
	            inclusive: true,
	            exact: true,
	            input: payload.value,
	            inst,
	            continue: !def.abort,
	        });
	    };
	});
	const $ZodCheckStringFormat = /*@__PURE__*/ $constructor("$ZodCheckStringFormat", (inst, def) => {
	    var _a, _b;
	    $ZodCheck.init(inst, def);
	    inst._zod.onattach.push((inst) => {
	        const bag = inst._zod.bag;
	        bag.format = def.format;
	        if (def.pattern) {
	            bag.patterns ?? (bag.patterns = new Set());
	            bag.patterns.add(def.pattern);
	        }
	    });
	    if (def.pattern)
	        (_a = inst._zod).check ?? (_a.check = (payload) => {
	            def.pattern.lastIndex = 0;
	            if (def.pattern.test(payload.value))
	                return;
	            payload.issues.push({
	                origin: "string",
	                code: "invalid_format",
	                format: def.format,
	                input: payload.value,
	                ...(def.pattern ? { pattern: def.pattern.toString() } : {}),
	                inst,
	                continue: !def.abort,
	            });
	        });
	    else
	        (_b = inst._zod).check ?? (_b.check = () => { });
	});
	const $ZodCheckRegex = /*@__PURE__*/ $constructor("$ZodCheckRegex", (inst, def) => {
	    $ZodCheckStringFormat.init(inst, def);
	    inst._zod.check = (payload) => {
	        def.pattern.lastIndex = 0;
	        if (def.pattern.test(payload.value))
	            return;
	        payload.issues.push({
	            origin: "string",
	            code: "invalid_format",
	            format: "regex",
	            input: payload.value,
	            pattern: def.pattern.toString(),
	            inst,
	            continue: !def.abort,
	        });
	    };
	});
	const $ZodCheckLowerCase = /*@__PURE__*/ $constructor("$ZodCheckLowerCase", (inst, def) => {
	    def.pattern ?? (def.pattern = lowercase);
	    $ZodCheckStringFormat.init(inst, def);
	});
	const $ZodCheckUpperCase = /*@__PURE__*/ $constructor("$ZodCheckUpperCase", (inst, def) => {
	    def.pattern ?? (def.pattern = uppercase);
	    $ZodCheckStringFormat.init(inst, def);
	});
	const $ZodCheckIncludes = /*@__PURE__*/ $constructor("$ZodCheckIncludes", (inst, def) => {
	    $ZodCheck.init(inst, def);
	    const escapedRegex = escapeRegex(def.includes);
	    const pattern = new RegExp(typeof def.position === "number" ? `^.{${def.position}}${escapedRegex}` : escapedRegex);
	    def.pattern = pattern;
	    inst._zod.onattach.push((inst) => {
	        const bag = inst._zod.bag;
	        bag.patterns ?? (bag.patterns = new Set());
	        bag.patterns.add(pattern);
	    });
	    inst._zod.check = (payload) => {
	        if (payload.value.includes(def.includes, def.position))
	            return;
	        payload.issues.push({
	            origin: "string",
	            code: "invalid_format",
	            format: "includes",
	            includes: def.includes,
	            input: payload.value,
	            inst,
	            continue: !def.abort,
	        });
	    };
	});
	const $ZodCheckStartsWith = /*@__PURE__*/ $constructor("$ZodCheckStartsWith", (inst, def) => {
	    $ZodCheck.init(inst, def);
	    const pattern = new RegExp(`^${escapeRegex(def.prefix)}.*`);
	    def.pattern ?? (def.pattern = pattern);
	    inst._zod.onattach.push((inst) => {
	        const bag = inst._zod.bag;
	        bag.patterns ?? (bag.patterns = new Set());
	        bag.patterns.add(pattern);
	    });
	    inst._zod.check = (payload) => {
	        if (payload.value.startsWith(def.prefix))
	            return;
	        payload.issues.push({
	            origin: "string",
	            code: "invalid_format",
	            format: "starts_with",
	            prefix: def.prefix,
	            input: payload.value,
	            inst,
	            continue: !def.abort,
	        });
	    };
	});
	const $ZodCheckEndsWith = /*@__PURE__*/ $constructor("$ZodCheckEndsWith", (inst, def) => {
	    $ZodCheck.init(inst, def);
	    const pattern = new RegExp(`.*${escapeRegex(def.suffix)}$`);
	    def.pattern ?? (def.pattern = pattern);
	    inst._zod.onattach.push((inst) => {
	        const bag = inst._zod.bag;
	        bag.patterns ?? (bag.patterns = new Set());
	        bag.patterns.add(pattern);
	    });
	    inst._zod.check = (payload) => {
	        if (payload.value.endsWith(def.suffix))
	            return;
	        payload.issues.push({
	            origin: "string",
	            code: "invalid_format",
	            format: "ends_with",
	            suffix: def.suffix,
	            input: payload.value,
	            inst,
	            continue: !def.abort,
	        });
	    };
	});
	const $ZodCheckOverwrite = /*@__PURE__*/ $constructor("$ZodCheckOverwrite", (inst, def) => {
	    $ZodCheck.init(inst, def);
	    inst._zod.check = (payload) => {
	        payload.value = def.tx(payload.value);
	    };
	});

	class Doc {
	    constructor(args = []) {
	        this.content = [];
	        this.indent = 0;
	        if (this)
	            this.args = args;
	    }
	    indented(fn) {
	        this.indent += 1;
	        fn(this);
	        this.indent -= 1;
	    }
	    write(arg) {
	        if (typeof arg === "function") {
	            arg(this, { execution: "sync" });
	            arg(this, { execution: "async" });
	            return;
	        }
	        const content = arg;
	        const lines = content.split("\n").filter((x) => x);
	        const minIndent = Math.min(...lines.map((x) => x.length - x.trimStart().length));
	        const dedented = lines.map((x) => x.slice(minIndent)).map((x) => " ".repeat(this.indent * 2) + x);
	        for (const line of dedented) {
	            this.content.push(line);
	        }
	    }
	    compile() {
	        const F = Function;
	        const args = this?.args;
	        const content = this?.content ?? [``];
	        const lines = [...content.map((x) => `  ${x}`)];
	        // console.log(lines.join("\n"));
	        return new F(...args, lines.join("\n"));
	    }
	}

	const version = {
	    major: 4,
	    minor: 1,
	    patch: 13,
	};

	const $ZodType = /*@__PURE__*/ $constructor("$ZodType", (inst, def) => {
	    var _a;
	    inst ?? (inst = {});
	    inst._zod.def = def; // set _def property
	    inst._zod.bag = inst._zod.bag || {}; // initialize _bag object
	    inst._zod.version = version;
	    const checks = [...(inst._zod.def.checks ?? [])];
	    // if inst is itself a checks.$ZodCheck, run it as a check
	    if (inst._zod.traits.has("$ZodCheck")) {
	        checks.unshift(inst);
	    }
	    for (const ch of checks) {
	        for (const fn of ch._zod.onattach) {
	            fn(inst);
	        }
	    }
	    if (checks.length === 0) {
	        // deferred initializer
	        // inst._zod.parse is not yet defined
	        (_a = inst._zod).deferred ?? (_a.deferred = []);
	        inst._zod.deferred?.push(() => {
	            inst._zod.run = inst._zod.parse;
	        });
	    }
	    else {
	        const runChecks = (payload, checks, ctx) => {
	            let isAborted = aborted(payload);
	            let asyncResult;
	            for (const ch of checks) {
	                if (ch._zod.def.when) {
	                    const shouldRun = ch._zod.def.when(payload);
	                    if (!shouldRun)
	                        continue;
	                }
	                else if (isAborted) {
	                    continue;
	                }
	                const currLen = payload.issues.length;
	                const _ = ch._zod.check(payload);
	                if (_ instanceof Promise && ctx?.async === false) {
	                    throw new $ZodAsyncError();
	                }
	                if (asyncResult || _ instanceof Promise) {
	                    asyncResult = (asyncResult ?? Promise.resolve()).then(async () => {
	                        await _;
	                        const nextLen = payload.issues.length;
	                        if (nextLen === currLen)
	                            return;
	                        if (!isAborted)
	                            isAborted = aborted(payload, currLen);
	                    });
	                }
	                else {
	                    const nextLen = payload.issues.length;
	                    if (nextLen === currLen)
	                        continue;
	                    if (!isAborted)
	                        isAborted = aborted(payload, currLen);
	                }
	            }
	            if (asyncResult) {
	                return asyncResult.then(() => {
	                    return payload;
	                });
	            }
	            return payload;
	        };
	        // const handleChecksResult = (
	        //   checkResult: ParsePayload,
	        //   originalResult: ParsePayload,
	        //   ctx: ParseContextInternal
	        // ): util.MaybeAsync<ParsePayload> => {
	        //   // if the checks mutated the value && there are no issues, re-parse the result
	        //   if (checkResult.value !== originalResult.value && !checkResult.issues.length)
	        //     return inst._zod.parse(checkResult, ctx);
	        //   return originalResult;
	        // };
	        const handleCanaryResult = (canary, payload, ctx) => {
	            // abort if the canary is aborted
	            if (aborted(canary)) {
	                canary.aborted = true;
	                return canary;
	            }
	            // run checks first, then
	            const checkResult = runChecks(payload, checks, ctx);
	            if (checkResult instanceof Promise) {
	                if (ctx.async === false)
	                    throw new $ZodAsyncError();
	                return checkResult.then((checkResult) => inst._zod.parse(checkResult, ctx));
	            }
	            return inst._zod.parse(checkResult, ctx);
	        };
	        inst._zod.run = (payload, ctx) => {
	            if (ctx.skipChecks) {
	                return inst._zod.parse(payload, ctx);
	            }
	            if (ctx.direction === "backward") {
	                // run canary
	                // initial pass (no checks)
	                const canary = inst._zod.parse({ value: payload.value, issues: [] }, { ...ctx, skipChecks: true });
	                if (canary instanceof Promise) {
	                    return canary.then((canary) => {
	                        return handleCanaryResult(canary, payload, ctx);
	                    });
	                }
	                return handleCanaryResult(canary, payload, ctx);
	            }
	            // forward
	            const result = inst._zod.parse(payload, ctx);
	            if (result instanceof Promise) {
	                if (ctx.async === false)
	                    throw new $ZodAsyncError();
	                return result.then((result) => runChecks(result, checks, ctx));
	            }
	            return runChecks(result, checks, ctx);
	        };
	    }
	    inst["~standard"] = {
	        validate: (value) => {
	            try {
	                const r = safeParse$1(inst, value);
	                return r.success ? { value: r.data } : { issues: r.error?.issues };
	            }
	            catch (_) {
	                return safeParseAsync$1(inst, value).then((r) => (r.success ? { value: r.data } : { issues: r.error?.issues }));
	            }
	        },
	        vendor: "zod",
	        version: 1,
	    };
	});
	const $ZodString = /*@__PURE__*/ $constructor("$ZodString", (inst, def) => {
	    $ZodType.init(inst, def);
	    inst._zod.pattern = [...(inst?._zod.bag?.patterns ?? [])].pop() ?? string$1(inst._zod.bag);
	    inst._zod.parse = (payload, _) => {
	        if (def.coerce)
	            try {
	                payload.value = String(payload.value);
	            }
	            catch (_) { }
	        if (typeof payload.value === "string")
	            return payload;
	        payload.issues.push({
	            expected: "string",
	            code: "invalid_type",
	            input: payload.value,
	            inst,
	        });
	        return payload;
	    };
	});
	const $ZodStringFormat = /*@__PURE__*/ $constructor("$ZodStringFormat", (inst, def) => {
	    // check initialization must come first
	    $ZodCheckStringFormat.init(inst, def);
	    $ZodString.init(inst, def);
	});
	const $ZodGUID = /*@__PURE__*/ $constructor("$ZodGUID", (inst, def) => {
	    def.pattern ?? (def.pattern = guid);
	    $ZodStringFormat.init(inst, def);
	});
	const $ZodUUID = /*@__PURE__*/ $constructor("$ZodUUID", (inst, def) => {
	    if (def.version) {
	        const versionMap = {
	            v1: 1,
	            v2: 2,
	            v3: 3,
	            v4: 4,
	            v5: 5,
	            v6: 6,
	            v7: 7,
	            v8: 8,
	        };
	        const v = versionMap[def.version];
	        if (v === undefined)
	            throw new Error(`Invalid UUID version: "${def.version}"`);
	        def.pattern ?? (def.pattern = uuid(v));
	    }
	    else
	        def.pattern ?? (def.pattern = uuid());
	    $ZodStringFormat.init(inst, def);
	});
	const $ZodEmail = /*@__PURE__*/ $constructor("$ZodEmail", (inst, def) => {
	    def.pattern ?? (def.pattern = email);
	    $ZodStringFormat.init(inst, def);
	});
	const $ZodURL = /*@__PURE__*/ $constructor("$ZodURL", (inst, def) => {
	    $ZodStringFormat.init(inst, def);
	    inst._zod.check = (payload) => {
	        try {
	            // Trim whitespace from input
	            const trimmed = payload.value.trim();
	            // @ts-ignore
	            const url = new URL(trimmed);
	            if (def.hostname) {
	                def.hostname.lastIndex = 0;
	                if (!def.hostname.test(url.hostname)) {
	                    payload.issues.push({
	                        code: "invalid_format",
	                        format: "url",
	                        note: "Invalid hostname",
	                        pattern: def.hostname.source,
	                        input: payload.value,
	                        inst,
	                        continue: !def.abort,
	                    });
	                }
	            }
	            if (def.protocol) {
	                def.protocol.lastIndex = 0;
	                if (!def.protocol.test(url.protocol.endsWith(":") ? url.protocol.slice(0, -1) : url.protocol)) {
	                    payload.issues.push({
	                        code: "invalid_format",
	                        format: "url",
	                        note: "Invalid protocol",
	                        pattern: def.protocol.source,
	                        input: payload.value,
	                        inst,
	                        continue: !def.abort,
	                    });
	                }
	            }
	            // Set the output value based on normalize flag
	            if (def.normalize) {
	                // Use normalized URL
	                payload.value = url.href;
	            }
	            else {
	                // Preserve the original input (trimmed)
	                payload.value = trimmed;
	            }
	            return;
	        }
	        catch (_) {
	            payload.issues.push({
	                code: "invalid_format",
	                format: "url",
	                input: payload.value,
	                inst,
	                continue: !def.abort,
	            });
	        }
	    };
	});
	const $ZodEmoji = /*@__PURE__*/ $constructor("$ZodEmoji", (inst, def) => {
	    def.pattern ?? (def.pattern = emoji());
	    $ZodStringFormat.init(inst, def);
	});
	const $ZodNanoID = /*@__PURE__*/ $constructor("$ZodNanoID", (inst, def) => {
	    def.pattern ?? (def.pattern = nanoid);
	    $ZodStringFormat.init(inst, def);
	});
	const $ZodCUID = /*@__PURE__*/ $constructor("$ZodCUID", (inst, def) => {
	    def.pattern ?? (def.pattern = cuid);
	    $ZodStringFormat.init(inst, def);
	});
	const $ZodCUID2 = /*@__PURE__*/ $constructor("$ZodCUID2", (inst, def) => {
	    def.pattern ?? (def.pattern = cuid2);
	    $ZodStringFormat.init(inst, def);
	});
	const $ZodULID = /*@__PURE__*/ $constructor("$ZodULID", (inst, def) => {
	    def.pattern ?? (def.pattern = ulid);
	    $ZodStringFormat.init(inst, def);
	});
	const $ZodXID = /*@__PURE__*/ $constructor("$ZodXID", (inst, def) => {
	    def.pattern ?? (def.pattern = xid);
	    $ZodStringFormat.init(inst, def);
	});
	const $ZodKSUID = /*@__PURE__*/ $constructor("$ZodKSUID", (inst, def) => {
	    def.pattern ?? (def.pattern = ksuid);
	    $ZodStringFormat.init(inst, def);
	});
	const $ZodISODateTime = /*@__PURE__*/ $constructor("$ZodISODateTime", (inst, def) => {
	    def.pattern ?? (def.pattern = datetime$1(def));
	    $ZodStringFormat.init(inst, def);
	});
	const $ZodISODate = /*@__PURE__*/ $constructor("$ZodISODate", (inst, def) => {
	    def.pattern ?? (def.pattern = date$1);
	    $ZodStringFormat.init(inst, def);
	});
	const $ZodISOTime = /*@__PURE__*/ $constructor("$ZodISOTime", (inst, def) => {
	    def.pattern ?? (def.pattern = time$1(def));
	    $ZodStringFormat.init(inst, def);
	});
	const $ZodISODuration = /*@__PURE__*/ $constructor("$ZodISODuration", (inst, def) => {
	    def.pattern ?? (def.pattern = duration$1);
	    $ZodStringFormat.init(inst, def);
	});
	const $ZodIPv4 = /*@__PURE__*/ $constructor("$ZodIPv4", (inst, def) => {
	    def.pattern ?? (def.pattern = ipv4);
	    $ZodStringFormat.init(inst, def);
	    inst._zod.bag.format = `ipv4`;
	});
	const $ZodIPv6 = /*@__PURE__*/ $constructor("$ZodIPv6", (inst, def) => {
	    def.pattern ?? (def.pattern = ipv6);
	    $ZodStringFormat.init(inst, def);
	    inst._zod.bag.format = `ipv6`;
	    inst._zod.check = (payload) => {
	        try {
	            // @ts-ignore
	            new URL(`http://[${payload.value}]`);
	            // return;
	        }
	        catch {
	            payload.issues.push({
	                code: "invalid_format",
	                format: "ipv6",
	                input: payload.value,
	                inst,
	                continue: !def.abort,
	            });
	        }
	    };
	});
	const $ZodCIDRv4 = /*@__PURE__*/ $constructor("$ZodCIDRv4", (inst, def) => {
	    def.pattern ?? (def.pattern = cidrv4);
	    $ZodStringFormat.init(inst, def);
	});
	const $ZodCIDRv6 = /*@__PURE__*/ $constructor("$ZodCIDRv6", (inst, def) => {
	    def.pattern ?? (def.pattern = cidrv6); // not used for validation
	    $ZodStringFormat.init(inst, def);
	    inst._zod.check = (payload) => {
	        const parts = payload.value.split("/");
	        try {
	            if (parts.length !== 2)
	                throw new Error();
	            const [address, prefix] = parts;
	            if (!prefix)
	                throw new Error();
	            const prefixNum = Number(prefix);
	            if (`${prefixNum}` !== prefix)
	                throw new Error();
	            if (prefixNum < 0 || prefixNum > 128)
	                throw new Error();
	            // @ts-ignore
	            new URL(`http://[${address}]`);
	        }
	        catch {
	            payload.issues.push({
	                code: "invalid_format",
	                format: "cidrv6",
	                input: payload.value,
	                inst,
	                continue: !def.abort,
	            });
	        }
	    };
	});
	//////////////////////////////   ZodBase64   //////////////////////////////
	function isValidBase64(data) {
	    if (data === "")
	        return true;
	    if (data.length % 4 !== 0)
	        return false;
	    try {
	        // @ts-ignore
	        atob(data);
	        return true;
	    }
	    catch {
	        return false;
	    }
	}
	const $ZodBase64 = /*@__PURE__*/ $constructor("$ZodBase64", (inst, def) => {
	    def.pattern ?? (def.pattern = base64);
	    $ZodStringFormat.init(inst, def);
	    inst._zod.bag.contentEncoding = "base64";
	    inst._zod.check = (payload) => {
	        if (isValidBase64(payload.value))
	            return;
	        payload.issues.push({
	            code: "invalid_format",
	            format: "base64",
	            input: payload.value,
	            inst,
	            continue: !def.abort,
	        });
	    };
	});
	//////////////////////////////   ZodBase64   //////////////////////////////
	function isValidBase64URL(data) {
	    if (!base64url.test(data))
	        return false;
	    const base64 = data.replace(/[-_]/g, (c) => (c === "-" ? "+" : "/"));
	    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
	    return isValidBase64(padded);
	}
	const $ZodBase64URL = /*@__PURE__*/ $constructor("$ZodBase64URL", (inst, def) => {
	    def.pattern ?? (def.pattern = base64url);
	    $ZodStringFormat.init(inst, def);
	    inst._zod.bag.contentEncoding = "base64url";
	    inst._zod.check = (payload) => {
	        if (isValidBase64URL(payload.value))
	            return;
	        payload.issues.push({
	            code: "invalid_format",
	            format: "base64url",
	            input: payload.value,
	            inst,
	            continue: !def.abort,
	        });
	    };
	});
	const $ZodE164 = /*@__PURE__*/ $constructor("$ZodE164", (inst, def) => {
	    def.pattern ?? (def.pattern = e164);
	    $ZodStringFormat.init(inst, def);
	});
	//////////////////////////////   ZodJWT   //////////////////////////////
	function isValidJWT(token, algorithm = null) {
	    try {
	        const tokensParts = token.split(".");
	        if (tokensParts.length !== 3)
	            return false;
	        const [header] = tokensParts;
	        if (!header)
	            return false;
	        // @ts-ignore
	        const parsedHeader = JSON.parse(atob(header));
	        if ("typ" in parsedHeader && parsedHeader?.typ !== "JWT")
	            return false;
	        if (!parsedHeader.alg)
	            return false;
	        if (algorithm && (!("alg" in parsedHeader) || parsedHeader.alg !== algorithm))
	            return false;
	        return true;
	    }
	    catch {
	        return false;
	    }
	}
	const $ZodJWT = /*@__PURE__*/ $constructor("$ZodJWT", (inst, def) => {
	    $ZodStringFormat.init(inst, def);
	    inst._zod.check = (payload) => {
	        if (isValidJWT(payload.value, def.alg))
	            return;
	        payload.issues.push({
	            code: "invalid_format",
	            format: "jwt",
	            input: payload.value,
	            inst,
	            continue: !def.abort,
	        });
	    };
	});
	const $ZodNumber = /*@__PURE__*/ $constructor("$ZodNumber", (inst, def) => {
	    $ZodType.init(inst, def);
	    inst._zod.pattern = inst._zod.bag.pattern ?? number$1;
	    inst._zod.parse = (payload, _ctx) => {
	        if (def.coerce)
	            try {
	                payload.value = Number(payload.value);
	            }
	            catch (_) { }
	        const input = payload.value;
	        if (typeof input === "number" && !Number.isNaN(input) && Number.isFinite(input)) {
	            return payload;
	        }
	        const received = typeof input === "number"
	            ? Number.isNaN(input)
	                ? "NaN"
	                : !Number.isFinite(input)
	                    ? "Infinity"
	                    : undefined
	            : undefined;
	        payload.issues.push({
	            expected: "number",
	            code: "invalid_type",
	            input,
	            inst,
	            ...(received ? { received } : {}),
	        });
	        return payload;
	    };
	});
	const $ZodNumberFormat = /*@__PURE__*/ $constructor("$ZodNumberFormat", (inst, def) => {
	    $ZodCheckNumberFormat.init(inst, def);
	    $ZodNumber.init(inst, def); // no format checks
	});
	const $ZodBoolean = /*@__PURE__*/ $constructor("$ZodBoolean", (inst, def) => {
	    $ZodType.init(inst, def);
	    inst._zod.pattern = boolean$1;
	    inst._zod.parse = (payload, _ctx) => {
	        if (def.coerce)
	            try {
	                payload.value = Boolean(payload.value);
	            }
	            catch (_) { }
	        const input = payload.value;
	        if (typeof input === "boolean")
	            return payload;
	        payload.issues.push({
	            expected: "boolean",
	            code: "invalid_type",
	            input,
	            inst,
	        });
	        return payload;
	    };
	});
	const $ZodUnknown = /*@__PURE__*/ $constructor("$ZodUnknown", (inst, def) => {
	    $ZodType.init(inst, def);
	    inst._zod.parse = (payload) => payload;
	});
	const $ZodNever = /*@__PURE__*/ $constructor("$ZodNever", (inst, def) => {
	    $ZodType.init(inst, def);
	    inst._zod.parse = (payload, _ctx) => {
	        payload.issues.push({
	            expected: "never",
	            code: "invalid_type",
	            input: payload.value,
	            inst,
	        });
	        return payload;
	    };
	});
	function handleArrayResult(result, final, index) {
	    if (result.issues.length) {
	        final.issues.push(...prefixIssues(index, result.issues));
	    }
	    final.value[index] = result.value;
	}
	const $ZodArray = /*@__PURE__*/ $constructor("$ZodArray", (inst, def) => {
	    $ZodType.init(inst, def);
	    inst._zod.parse = (payload, ctx) => {
	        const input = payload.value;
	        if (!Array.isArray(input)) {
	            payload.issues.push({
	                expected: "array",
	                code: "invalid_type",
	                input,
	                inst,
	            });
	            return payload;
	        }
	        payload.value = Array(input.length);
	        const proms = [];
	        for (let i = 0; i < input.length; i++) {
	            const item = input[i];
	            const result = def.element._zod.run({
	                value: item,
	                issues: [],
	            }, ctx);
	            if (result instanceof Promise) {
	                proms.push(result.then((result) => handleArrayResult(result, payload, i)));
	            }
	            else {
	                handleArrayResult(result, payload, i);
	            }
	        }
	        if (proms.length) {
	            return Promise.all(proms).then(() => payload);
	        }
	        return payload; //handleArrayResultsAsync(parseResults, final);
	    };
	});
	function handlePropertyResult(result, final, key, input) {
	    if (result.issues.length) {
	        final.issues.push(...prefixIssues(key, result.issues));
	    }
	    if (result.value === undefined) {
	        if (key in input) {
	            final.value[key] = undefined;
	        }
	    }
	    else {
	        final.value[key] = result.value;
	    }
	}
	function normalizeDef(def) {
	    const keys = Object.keys(def.shape);
	    for (const k of keys) {
	        if (!def.shape?.[k]?._zod?.traits?.has("$ZodType")) {
	            throw new Error(`Invalid element at key "${k}": expected a Zod schema`);
	        }
	    }
	    const okeys = optionalKeys(def.shape);
	    return {
	        ...def,
	        keys,
	        keySet: new Set(keys),
	        numKeys: keys.length,
	        optionalKeys: new Set(okeys),
	    };
	}
	function handleCatchall(proms, input, payload, ctx, def, inst) {
	    const unrecognized = [];
	    // iterate over input keys
	    const keySet = def.keySet;
	    const _catchall = def.catchall._zod;
	    const t = _catchall.def.type;
	    for (const key in input) {
	        if (keySet.has(key))
	            continue;
	        if (t === "never") {
	            unrecognized.push(key);
	            continue;
	        }
	        const r = _catchall.run({ value: input[key], issues: [] }, ctx);
	        if (r instanceof Promise) {
	            proms.push(r.then((r) => handlePropertyResult(r, payload, key, input)));
	        }
	        else {
	            handlePropertyResult(r, payload, key, input);
	        }
	    }
	    if (unrecognized.length) {
	        payload.issues.push({
	            code: "unrecognized_keys",
	            keys: unrecognized,
	            input,
	            inst,
	        });
	    }
	    if (!proms.length)
	        return payload;
	    return Promise.all(proms).then(() => {
	        return payload;
	    });
	}
	const $ZodObject = /*@__PURE__*/ $constructor("$ZodObject", (inst, def) => {
	    // requires cast because technically $ZodObject doesn't extend
	    $ZodType.init(inst, def);
	    // const sh = def.shape;
	    const desc = Object.getOwnPropertyDescriptor(def, "shape");
	    if (!desc?.get) {
	        const sh = def.shape;
	        Object.defineProperty(def, "shape", {
	            get: () => {
	                const newSh = { ...sh };
	                Object.defineProperty(def, "shape", {
	                    value: newSh,
	                });
	                return newSh;
	            },
	        });
	    }
	    const _normalized = cached(() => normalizeDef(def));
	    defineLazy(inst._zod, "propValues", () => {
	        const shape = def.shape;
	        const propValues = {};
	        for (const key in shape) {
	            const field = shape[key]._zod;
	            if (field.values) {
	                propValues[key] ?? (propValues[key] = new Set());
	                for (const v of field.values)
	                    propValues[key].add(v);
	            }
	        }
	        return propValues;
	    });
	    const isObject$1 = isObject;
	    const catchall = def.catchall;
	    let value;
	    inst._zod.parse = (payload, ctx) => {
	        value ?? (value = _normalized.value);
	        const input = payload.value;
	        if (!isObject$1(input)) {
	            payload.issues.push({
	                expected: "object",
	                code: "invalid_type",
	                input,
	                inst,
	            });
	            return payload;
	        }
	        payload.value = {};
	        const proms = [];
	        const shape = value.shape;
	        for (const key of value.keys) {
	            const el = shape[key];
	            const r = el._zod.run({ value: input[key], issues: [] }, ctx);
	            if (r instanceof Promise) {
	                proms.push(r.then((r) => handlePropertyResult(r, payload, key, input)));
	            }
	            else {
	                handlePropertyResult(r, payload, key, input);
	            }
	        }
	        if (!catchall) {
	            return proms.length ? Promise.all(proms).then(() => payload) : payload;
	        }
	        return handleCatchall(proms, input, payload, ctx, _normalized.value, inst);
	    };
	});
	const $ZodObjectJIT = /*@__PURE__*/ $constructor("$ZodObjectJIT", (inst, def) => {
	    // requires cast because technically $ZodObject doesn't extend
	    $ZodObject.init(inst, def);
	    const superParse = inst._zod.parse;
	    const _normalized = cached(() => normalizeDef(def));
	    const generateFastpass = (shape) => {
	        const doc = new Doc(["shape", "payload", "ctx"]);
	        const normalized = _normalized.value;
	        const parseStr = (key) => {
	            const k = esc(key);
	            return `shape[${k}]._zod.run({ value: input[${k}], issues: [] }, ctx)`;
	        };
	        doc.write(`const input = payload.value;`);
	        const ids = Object.create(null);
	        let counter = 0;
	        for (const key of normalized.keys) {
	            ids[key] = `key_${counter++}`;
	        }
	        // A: preserve key order {
	        doc.write(`const newResult = {};`);
	        for (const key of normalized.keys) {
	            const id = ids[key];
	            const k = esc(key);
	            doc.write(`const ${id} = ${parseStr(key)};`);
	            doc.write(`
        if (${id}.issues.length) {
          payload.issues = payload.issues.concat(${id}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${k}, ...iss.path] : [${k}]
          })));
        }
        
        
        if (${id}.value === undefined) {
          if (${k} in input) {
            newResult[${k}] = undefined;
          }
        } else {
          newResult[${k}] = ${id}.value;
        }
        
      `);
	        }
	        doc.write(`payload.value = newResult;`);
	        doc.write(`return payload;`);
	        const fn = doc.compile();
	        return (payload, ctx) => fn(shape, payload, ctx);
	    };
	    let fastpass;
	    const isObject$1 = isObject;
	    const jit = !globalConfig.jitless;
	    const allowsEval$1 = allowsEval;
	    const fastEnabled = jit && allowsEval$1.value; // && !def.catchall;
	    const catchall = def.catchall;
	    let value;
	    inst._zod.parse = (payload, ctx) => {
	        value ?? (value = _normalized.value);
	        const input = payload.value;
	        if (!isObject$1(input)) {
	            payload.issues.push({
	                expected: "object",
	                code: "invalid_type",
	                input,
	                inst,
	            });
	            return payload;
	        }
	        if (jit && fastEnabled && ctx?.async === false && ctx.jitless !== true) {
	            // always synchronous
	            if (!fastpass)
	                fastpass = generateFastpass(def.shape);
	            payload = fastpass(payload, ctx);
	            if (!catchall)
	                return payload;
	            return handleCatchall([], input, payload, ctx, value, inst);
	        }
	        return superParse(payload, ctx);
	    };
	});
	function handleUnionResults(results, final, inst, ctx) {
	    for (const result of results) {
	        if (result.issues.length === 0) {
	            final.value = result.value;
	            return final;
	        }
	    }
	    const nonaborted = results.filter((r) => !aborted(r));
	    if (nonaborted.length === 1) {
	        final.value = nonaborted[0].value;
	        return nonaborted[0];
	    }
	    final.issues.push({
	        code: "invalid_union",
	        input: final.value,
	        inst,
	        errors: results.map((result) => result.issues.map((iss) => finalizeIssue(iss, ctx, config()))),
	    });
	    return final;
	}
	const $ZodUnion = /*@__PURE__*/ $constructor("$ZodUnion", (inst, def) => {
	    $ZodType.init(inst, def);
	    defineLazy(inst._zod, "optin", () => def.options.some((o) => o._zod.optin === "optional") ? "optional" : undefined);
	    defineLazy(inst._zod, "optout", () => def.options.some((o) => o._zod.optout === "optional") ? "optional" : undefined);
	    defineLazy(inst._zod, "values", () => {
	        if (def.options.every((o) => o._zod.values)) {
	            return new Set(def.options.flatMap((option) => Array.from(option._zod.values)));
	        }
	        return undefined;
	    });
	    defineLazy(inst._zod, "pattern", () => {
	        if (def.options.every((o) => o._zod.pattern)) {
	            const patterns = def.options.map((o) => o._zod.pattern);
	            return new RegExp(`^(${patterns.map((p) => cleanRegex(p.source)).join("|")})$`);
	        }
	        return undefined;
	    });
	    const single = def.options.length === 1;
	    const first = def.options[0]._zod.run;
	    inst._zod.parse = (payload, ctx) => {
	        if (single) {
	            return first(payload, ctx);
	        }
	        let async = false;
	        const results = [];
	        for (const option of def.options) {
	            const result = option._zod.run({
	                value: payload.value,
	                issues: [],
	            }, ctx);
	            if (result instanceof Promise) {
	                results.push(result);
	                async = true;
	            }
	            else {
	                if (result.issues.length === 0)
	                    return result;
	                results.push(result);
	            }
	        }
	        if (!async)
	            return handleUnionResults(results, payload, inst, ctx);
	        return Promise.all(results).then((results) => {
	            return handleUnionResults(results, payload, inst, ctx);
	        });
	    };
	});
	const $ZodIntersection = /*@__PURE__*/ $constructor("$ZodIntersection", (inst, def) => {
	    $ZodType.init(inst, def);
	    inst._zod.parse = (payload, ctx) => {
	        const input = payload.value;
	        const left = def.left._zod.run({ value: input, issues: [] }, ctx);
	        const right = def.right._zod.run({ value: input, issues: [] }, ctx);
	        const async = left instanceof Promise || right instanceof Promise;
	        if (async) {
	            return Promise.all([left, right]).then(([left, right]) => {
	                return handleIntersectionResults(payload, left, right);
	            });
	        }
	        return handleIntersectionResults(payload, left, right);
	    };
	});
	function mergeValues(a, b) {
	    // const aType = parse.t(a);
	    // const bType = parse.t(b);
	    if (a === b) {
	        return { valid: true, data: a };
	    }
	    if (a instanceof Date && b instanceof Date && +a === +b) {
	        return { valid: true, data: a };
	    }
	    if (isPlainObject(a) && isPlainObject(b)) {
	        const bKeys = Object.keys(b);
	        const sharedKeys = Object.keys(a).filter((key) => bKeys.indexOf(key) !== -1);
	        const newObj = { ...a, ...b };
	        for (const key of sharedKeys) {
	            const sharedValue = mergeValues(a[key], b[key]);
	            if (!sharedValue.valid) {
	                return {
	                    valid: false,
	                    mergeErrorPath: [key, ...sharedValue.mergeErrorPath],
	                };
	            }
	            newObj[key] = sharedValue.data;
	        }
	        return { valid: true, data: newObj };
	    }
	    if (Array.isArray(a) && Array.isArray(b)) {
	        if (a.length !== b.length) {
	            return { valid: false, mergeErrorPath: [] };
	        }
	        const newArray = [];
	        for (let index = 0; index < a.length; index++) {
	            const itemA = a[index];
	            const itemB = b[index];
	            const sharedValue = mergeValues(itemA, itemB);
	            if (!sharedValue.valid) {
	                return {
	                    valid: false,
	                    mergeErrorPath: [index, ...sharedValue.mergeErrorPath],
	                };
	            }
	            newArray.push(sharedValue.data);
	        }
	        return { valid: true, data: newArray };
	    }
	    return { valid: false, mergeErrorPath: [] };
	}
	function handleIntersectionResults(result, left, right) {
	    if (left.issues.length) {
	        result.issues.push(...left.issues);
	    }
	    if (right.issues.length) {
	        result.issues.push(...right.issues);
	    }
	    if (aborted(result))
	        return result;
	    const merged = mergeValues(left.value, right.value);
	    if (!merged.valid) {
	        throw new Error(`Unmergable intersection. Error path: ` + `${JSON.stringify(merged.mergeErrorPath)}`);
	    }
	    result.value = merged.data;
	    return result;
	}
	const $ZodEnum = /*@__PURE__*/ $constructor("$ZodEnum", (inst, def) => {
	    $ZodType.init(inst, def);
	    const values = getEnumValues(def.entries);
	    const valuesSet = new Set(values);
	    inst._zod.values = valuesSet;
	    inst._zod.pattern = new RegExp(`^(${values
        .filter((k) => propertyKeyTypes.has(typeof k))
        .map((o) => (typeof o === "string" ? escapeRegex(o) : o.toString()))
        .join("|")})$`);
	    inst._zod.parse = (payload, _ctx) => {
	        const input = payload.value;
	        if (valuesSet.has(input)) {
	            return payload;
	        }
	        payload.issues.push({
	            code: "invalid_value",
	            values,
	            input,
	            inst,
	        });
	        return payload;
	    };
	});
	const $ZodTransform = /*@__PURE__*/ $constructor("$ZodTransform", (inst, def) => {
	    $ZodType.init(inst, def);
	    inst._zod.parse = (payload, ctx) => {
	        if (ctx.direction === "backward") {
	            throw new $ZodEncodeError(inst.constructor.name);
	        }
	        const _out = def.transform(payload.value, payload);
	        if (ctx.async) {
	            const output = _out instanceof Promise ? _out : Promise.resolve(_out);
	            return output.then((output) => {
	                payload.value = output;
	                return payload;
	            });
	        }
	        if (_out instanceof Promise) {
	            throw new $ZodAsyncError();
	        }
	        payload.value = _out;
	        return payload;
	    };
	});
	function handleOptionalResult(result, input) {
	    if (result.issues.length && input === undefined) {
	        return { issues: [], value: undefined };
	    }
	    return result;
	}
	const $ZodOptional = /*@__PURE__*/ $constructor("$ZodOptional", (inst, def) => {
	    $ZodType.init(inst, def);
	    inst._zod.optin = "optional";
	    inst._zod.optout = "optional";
	    defineLazy(inst._zod, "values", () => {
	        return def.innerType._zod.values ? new Set([...def.innerType._zod.values, undefined]) : undefined;
	    });
	    defineLazy(inst._zod, "pattern", () => {
	        const pattern = def.innerType._zod.pattern;
	        return pattern ? new RegExp(`^(${cleanRegex(pattern.source)})?$`) : undefined;
	    });
	    inst._zod.parse = (payload, ctx) => {
	        if (def.innerType._zod.optin === "optional") {
	            const result = def.innerType._zod.run(payload, ctx);
	            if (result instanceof Promise)
	                return result.then((r) => handleOptionalResult(r, payload.value));
	            return handleOptionalResult(result, payload.value);
	        }
	        if (payload.value === undefined) {
	            return payload;
	        }
	        return def.innerType._zod.run(payload, ctx);
	    };
	});
	const $ZodNullable = /*@__PURE__*/ $constructor("$ZodNullable", (inst, def) => {
	    $ZodType.init(inst, def);
	    defineLazy(inst._zod, "optin", () => def.innerType._zod.optin);
	    defineLazy(inst._zod, "optout", () => def.innerType._zod.optout);
	    defineLazy(inst._zod, "pattern", () => {
	        const pattern = def.innerType._zod.pattern;
	        return pattern ? new RegExp(`^(${cleanRegex(pattern.source)}|null)$`) : undefined;
	    });
	    defineLazy(inst._zod, "values", () => {
	        return def.innerType._zod.values ? new Set([...def.innerType._zod.values, null]) : undefined;
	    });
	    inst._zod.parse = (payload, ctx) => {
	        // Forward direction (decode): allow null to pass through
	        if (payload.value === null)
	            return payload;
	        return def.innerType._zod.run(payload, ctx);
	    };
	});
	const $ZodDefault = /*@__PURE__*/ $constructor("$ZodDefault", (inst, def) => {
	    $ZodType.init(inst, def);
	    // inst._zod.qin = "true";
	    inst._zod.optin = "optional";
	    defineLazy(inst._zod, "values", () => def.innerType._zod.values);
	    inst._zod.parse = (payload, ctx) => {
	        if (ctx.direction === "backward") {
	            return def.innerType._zod.run(payload, ctx);
	        }
	        // Forward direction (decode): apply defaults for undefined input
	        if (payload.value === undefined) {
	            payload.value = def.defaultValue;
	            /**
	             * $ZodDefault returns the default value immediately in forward direction.
	             * It doesn't pass the default value into the validator ("prefault"). There's no reason to pass the default value through validation. The validity of the default is enforced by TypeScript statically. Otherwise, it's the responsibility of the user to ensure the default is valid. In the case of pipes with divergent in/out types, you can specify the default on the `in` schema of your ZodPipe to set a "prefault" for the pipe.   */
	            return payload;
	        }
	        // Forward direction: continue with default handling
	        const result = def.innerType._zod.run(payload, ctx);
	        if (result instanceof Promise) {
	            return result.then((result) => handleDefaultResult(result, def));
	        }
	        return handleDefaultResult(result, def);
	    };
	});
	function handleDefaultResult(payload, def) {
	    if (payload.value === undefined) {
	        payload.value = def.defaultValue;
	    }
	    return payload;
	}
	const $ZodPrefault = /*@__PURE__*/ $constructor("$ZodPrefault", (inst, def) => {
	    $ZodType.init(inst, def);
	    inst._zod.optin = "optional";
	    defineLazy(inst._zod, "values", () => def.innerType._zod.values);
	    inst._zod.parse = (payload, ctx) => {
	        if (ctx.direction === "backward") {
	            return def.innerType._zod.run(payload, ctx);
	        }
	        // Forward direction (decode): apply prefault for undefined input
	        if (payload.value === undefined) {
	            payload.value = def.defaultValue;
	        }
	        return def.innerType._zod.run(payload, ctx);
	    };
	});
	const $ZodNonOptional = /*@__PURE__*/ $constructor("$ZodNonOptional", (inst, def) => {
	    $ZodType.init(inst, def);
	    defineLazy(inst._zod, "values", () => {
	        const v = def.innerType._zod.values;
	        return v ? new Set([...v].filter((x) => x !== undefined)) : undefined;
	    });
	    inst._zod.parse = (payload, ctx) => {
	        const result = def.innerType._zod.run(payload, ctx);
	        if (result instanceof Promise) {
	            return result.then((result) => handleNonOptionalResult(result, inst));
	        }
	        return handleNonOptionalResult(result, inst);
	    };
	});
	function handleNonOptionalResult(payload, inst) {
	    if (!payload.issues.length && payload.value === undefined) {
	        payload.issues.push({
	            code: "invalid_type",
	            expected: "nonoptional",
	            input: payload.value,
	            inst,
	        });
	    }
	    return payload;
	}
	const $ZodCatch = /*@__PURE__*/ $constructor("$ZodCatch", (inst, def) => {
	    $ZodType.init(inst, def);
	    defineLazy(inst._zod, "optin", () => def.innerType._zod.optin);
	    defineLazy(inst._zod, "optout", () => def.innerType._zod.optout);
	    defineLazy(inst._zod, "values", () => def.innerType._zod.values);
	    inst._zod.parse = (payload, ctx) => {
	        if (ctx.direction === "backward") {
	            return def.innerType._zod.run(payload, ctx);
	        }
	        // Forward direction (decode): apply catch logic
	        const result = def.innerType._zod.run(payload, ctx);
	        if (result instanceof Promise) {
	            return result.then((result) => {
	                payload.value = result.value;
	                if (result.issues.length) {
	                    payload.value = def.catchValue({
	                        ...payload,
	                        error: {
	                            issues: result.issues.map((iss) => finalizeIssue(iss, ctx, config())),
	                        },
	                        input: payload.value,
	                    });
	                    payload.issues = [];
	                }
	                return payload;
	            });
	        }
	        payload.value = result.value;
	        if (result.issues.length) {
	            payload.value = def.catchValue({
	                ...payload,
	                error: {
	                    issues: result.issues.map((iss) => finalizeIssue(iss, ctx, config())),
	                },
	                input: payload.value,
	            });
	            payload.issues = [];
	        }
	        return payload;
	    };
	});
	const $ZodPipe = /*@__PURE__*/ $constructor("$ZodPipe", (inst, def) => {
	    $ZodType.init(inst, def);
	    defineLazy(inst._zod, "values", () => def.in._zod.values);
	    defineLazy(inst._zod, "optin", () => def.in._zod.optin);
	    defineLazy(inst._zod, "optout", () => def.out._zod.optout);
	    defineLazy(inst._zod, "propValues", () => def.in._zod.propValues);
	    inst._zod.parse = (payload, ctx) => {
	        if (ctx.direction === "backward") {
	            const right = def.out._zod.run(payload, ctx);
	            if (right instanceof Promise) {
	                return right.then((right) => handlePipeResult(right, def.in, ctx));
	            }
	            return handlePipeResult(right, def.in, ctx);
	        }
	        const left = def.in._zod.run(payload, ctx);
	        if (left instanceof Promise) {
	            return left.then((left) => handlePipeResult(left, def.out, ctx));
	        }
	        return handlePipeResult(left, def.out, ctx);
	    };
	});
	function handlePipeResult(left, next, ctx) {
	    if (left.issues.length) {
	        // prevent further checks
	        left.aborted = true;
	        return left;
	    }
	    return next._zod.run({ value: left.value, issues: left.issues }, ctx);
	}
	const $ZodReadonly = /*@__PURE__*/ $constructor("$ZodReadonly", (inst, def) => {
	    $ZodType.init(inst, def);
	    defineLazy(inst._zod, "propValues", () => def.innerType._zod.propValues);
	    defineLazy(inst._zod, "values", () => def.innerType._zod.values);
	    defineLazy(inst._zod, "optin", () => def.innerType?._zod?.optin);
	    defineLazy(inst._zod, "optout", () => def.innerType?._zod?.optout);
	    inst._zod.parse = (payload, ctx) => {
	        if (ctx.direction === "backward") {
	            return def.innerType._zod.run(payload, ctx);
	        }
	        const result = def.innerType._zod.run(payload, ctx);
	        if (result instanceof Promise) {
	            return result.then(handleReadonlyResult);
	        }
	        return handleReadonlyResult(result);
	    };
	});
	function handleReadonlyResult(payload) {
	    payload.value = Object.freeze(payload.value);
	    return payload;
	}
	const $ZodCustom = /*@__PURE__*/ $constructor("$ZodCustom", (inst, def) => {
	    $ZodCheck.init(inst, def);
	    $ZodType.init(inst, def);
	    inst._zod.parse = (payload, _) => {
	        return payload;
	    };
	    inst._zod.check = (payload) => {
	        const input = payload.value;
	        const r = def.fn(input);
	        if (r instanceof Promise) {
	            return r.then((r) => handleRefineResult(r, payload, input, inst));
	        }
	        handleRefineResult(r, payload, input, inst);
	        return;
	    };
	});
	function handleRefineResult(result, payload, input, inst) {
	    if (!result) {
	        const _iss = {
	            code: "custom",
	            input,
	            inst, // incorporates params.error into issue reporting
	            path: [...(inst._zod.def.path ?? [])], // incorporates params.error into issue reporting
	            continue: !inst._zod.def.abort,
	            // params: inst._zod.def.params,
	        };
	        if (inst._zod.def.params)
	            _iss.params = inst._zod.def.params;
	        payload.issues.push(issue(_iss));
	    }
	}

	var _a;
	class $ZodRegistry {
	    constructor() {
	        this._map = new WeakMap();
	        this._idmap = new Map();
	    }
	    add(schema, ..._meta) {
	        const meta = _meta[0];
	        this._map.set(schema, meta);
	        if (meta && typeof meta === "object" && "id" in meta) {
	            if (this._idmap.has(meta.id)) {
	                throw new Error(`ID ${meta.id} already exists in the registry`);
	            }
	            this._idmap.set(meta.id, schema);
	        }
	        return this;
	    }
	    clear() {
	        this._map = new WeakMap();
	        this._idmap = new Map();
	        return this;
	    }
	    remove(schema) {
	        const meta = this._map.get(schema);
	        if (meta && typeof meta === "object" && "id" in meta) {
	            this._idmap.delete(meta.id);
	        }
	        this._map.delete(schema);
	        return this;
	    }
	    get(schema) {
	        // return this._map.get(schema) as any;
	        // inherit metadata
	        const p = schema._zod.parent;
	        if (p) {
	            const pm = { ...(this.get(p) ?? {}) };
	            delete pm.id; // do not inherit id
	            const f = { ...pm, ...this._map.get(schema) };
	            return Object.keys(f).length ? f : undefined;
	        }
	        return this._map.get(schema);
	    }
	    has(schema) {
	        return this._map.has(schema);
	    }
	}
	// registries
	function registry() {
	    return new $ZodRegistry();
	}
	(_a = globalThis).__zod_globalRegistry ?? (_a.__zod_globalRegistry = registry());
	const globalRegistry = globalThis.__zod_globalRegistry;

	function _string(Class, params) {
	    return new Class({
	        type: "string",
	        ...normalizeParams(params),
	    });
	}
	function _email(Class, params) {
	    return new Class({
	        type: "string",
	        format: "email",
	        check: "string_format",
	        abort: false,
	        ...normalizeParams(params),
	    });
	}
	function _guid(Class, params) {
	    return new Class({
	        type: "string",
	        format: "guid",
	        check: "string_format",
	        abort: false,
	        ...normalizeParams(params),
	    });
	}
	function _uuid(Class, params) {
	    return new Class({
	        type: "string",
	        format: "uuid",
	        check: "string_format",
	        abort: false,
	        ...normalizeParams(params),
	    });
	}
	function _uuidv4(Class, params) {
	    return new Class({
	        type: "string",
	        format: "uuid",
	        check: "string_format",
	        abort: false,
	        version: "v4",
	        ...normalizeParams(params),
	    });
	}
	function _uuidv6(Class, params) {
	    return new Class({
	        type: "string",
	        format: "uuid",
	        check: "string_format",
	        abort: false,
	        version: "v6",
	        ...normalizeParams(params),
	    });
	}
	function _uuidv7(Class, params) {
	    return new Class({
	        type: "string",
	        format: "uuid",
	        check: "string_format",
	        abort: false,
	        version: "v7",
	        ...normalizeParams(params),
	    });
	}
	function _url(Class, params) {
	    return new Class({
	        type: "string",
	        format: "url",
	        check: "string_format",
	        abort: false,
	        ...normalizeParams(params),
	    });
	}
	function _emoji(Class, params) {
	    return new Class({
	        type: "string",
	        format: "emoji",
	        check: "string_format",
	        abort: false,
	        ...normalizeParams(params),
	    });
	}
	function _nanoid(Class, params) {
	    return new Class({
	        type: "string",
	        format: "nanoid",
	        check: "string_format",
	        abort: false,
	        ...normalizeParams(params),
	    });
	}
	function _cuid(Class, params) {
	    return new Class({
	        type: "string",
	        format: "cuid",
	        check: "string_format",
	        abort: false,
	        ...normalizeParams(params),
	    });
	}
	function _cuid2(Class, params) {
	    return new Class({
	        type: "string",
	        format: "cuid2",
	        check: "string_format",
	        abort: false,
	        ...normalizeParams(params),
	    });
	}
	function _ulid(Class, params) {
	    return new Class({
	        type: "string",
	        format: "ulid",
	        check: "string_format",
	        abort: false,
	        ...normalizeParams(params),
	    });
	}
	function _xid(Class, params) {
	    return new Class({
	        type: "string",
	        format: "xid",
	        check: "string_format",
	        abort: false,
	        ...normalizeParams(params),
	    });
	}
	function _ksuid(Class, params) {
	    return new Class({
	        type: "string",
	        format: "ksuid",
	        check: "string_format",
	        abort: false,
	        ...normalizeParams(params),
	    });
	}
	function _ipv4(Class, params) {
	    return new Class({
	        type: "string",
	        format: "ipv4",
	        check: "string_format",
	        abort: false,
	        ...normalizeParams(params),
	    });
	}
	function _ipv6(Class, params) {
	    return new Class({
	        type: "string",
	        format: "ipv6",
	        check: "string_format",
	        abort: false,
	        ...normalizeParams(params),
	    });
	}
	function _cidrv4(Class, params) {
	    return new Class({
	        type: "string",
	        format: "cidrv4",
	        check: "string_format",
	        abort: false,
	        ...normalizeParams(params),
	    });
	}
	function _cidrv6(Class, params) {
	    return new Class({
	        type: "string",
	        format: "cidrv6",
	        check: "string_format",
	        abort: false,
	        ...normalizeParams(params),
	    });
	}
	function _base64(Class, params) {
	    return new Class({
	        type: "string",
	        format: "base64",
	        check: "string_format",
	        abort: false,
	        ...normalizeParams(params),
	    });
	}
	function _base64url(Class, params) {
	    return new Class({
	        type: "string",
	        format: "base64url",
	        check: "string_format",
	        abort: false,
	        ...normalizeParams(params),
	    });
	}
	function _e164(Class, params) {
	    return new Class({
	        type: "string",
	        format: "e164",
	        check: "string_format",
	        abort: false,
	        ...normalizeParams(params),
	    });
	}
	function _jwt(Class, params) {
	    return new Class({
	        type: "string",
	        format: "jwt",
	        check: "string_format",
	        abort: false,
	        ...normalizeParams(params),
	    });
	}
	function _isoDateTime(Class, params) {
	    return new Class({
	        type: "string",
	        format: "datetime",
	        check: "string_format",
	        offset: false,
	        local: false,
	        precision: null,
	        ...normalizeParams(params),
	    });
	}
	function _isoDate(Class, params) {
	    return new Class({
	        type: "string",
	        format: "date",
	        check: "string_format",
	        ...normalizeParams(params),
	    });
	}
	function _isoTime(Class, params) {
	    return new Class({
	        type: "string",
	        format: "time",
	        check: "string_format",
	        precision: null,
	        ...normalizeParams(params),
	    });
	}
	function _isoDuration(Class, params) {
	    return new Class({
	        type: "string",
	        format: "duration",
	        check: "string_format",
	        ...normalizeParams(params),
	    });
	}
	function _number(Class, params) {
	    return new Class({
	        type: "number",
	        checks: [],
	        ...normalizeParams(params),
	    });
	}
	function _int(Class, params) {
	    return new Class({
	        type: "number",
	        check: "number_format",
	        abort: false,
	        format: "safeint",
	        ...normalizeParams(params),
	    });
	}
	function _boolean(Class, params) {
	    return new Class({
	        type: "boolean",
	        ...normalizeParams(params),
	    });
	}
	function _unknown(Class) {
	    return new Class({
	        type: "unknown",
	    });
	}
	function _never(Class, params) {
	    return new Class({
	        type: "never",
	        ...normalizeParams(params),
	    });
	}
	function _lt(value, params) {
	    return new $ZodCheckLessThan({
	        check: "less_than",
	        ...normalizeParams(params),
	        value,
	        inclusive: false,
	    });
	}
	function _lte(value, params) {
	    return new $ZodCheckLessThan({
	        check: "less_than",
	        ...normalizeParams(params),
	        value,
	        inclusive: true,
	    });
	}
	function _gt(value, params) {
	    return new $ZodCheckGreaterThan({
	        check: "greater_than",
	        ...normalizeParams(params),
	        value,
	        inclusive: false,
	    });
	}
	function _gte(value, params) {
	    return new $ZodCheckGreaterThan({
	        check: "greater_than",
	        ...normalizeParams(params),
	        value,
	        inclusive: true,
	    });
	}
	function _multipleOf(value, params) {
	    return new $ZodCheckMultipleOf({
	        check: "multiple_of",
	        ...normalizeParams(params),
	        value,
	    });
	}
	function _maxLength(maximum, params) {
	    const ch = new $ZodCheckMaxLength({
	        check: "max_length",
	        ...normalizeParams(params),
	        maximum,
	    });
	    return ch;
	}
	function _minLength(minimum, params) {
	    return new $ZodCheckMinLength({
	        check: "min_length",
	        ...normalizeParams(params),
	        minimum,
	    });
	}
	function _length(length, params) {
	    return new $ZodCheckLengthEquals({
	        check: "length_equals",
	        ...normalizeParams(params),
	        length,
	    });
	}
	function _regex(pattern, params) {
	    return new $ZodCheckRegex({
	        check: "string_format",
	        format: "regex",
	        ...normalizeParams(params),
	        pattern,
	    });
	}
	function _lowercase(params) {
	    return new $ZodCheckLowerCase({
	        check: "string_format",
	        format: "lowercase",
	        ...normalizeParams(params),
	    });
	}
	function _uppercase(params) {
	    return new $ZodCheckUpperCase({
	        check: "string_format",
	        format: "uppercase",
	        ...normalizeParams(params),
	    });
	}
	function _includes(includes, params) {
	    return new $ZodCheckIncludes({
	        check: "string_format",
	        format: "includes",
	        ...normalizeParams(params),
	        includes,
	    });
	}
	function _startsWith(prefix, params) {
	    return new $ZodCheckStartsWith({
	        check: "string_format",
	        format: "starts_with",
	        ...normalizeParams(params),
	        prefix,
	    });
	}
	function _endsWith(suffix, params) {
	    return new $ZodCheckEndsWith({
	        check: "string_format",
	        format: "ends_with",
	        ...normalizeParams(params),
	        suffix,
	    });
	}
	function _overwrite(tx) {
	    return new $ZodCheckOverwrite({
	        check: "overwrite",
	        tx,
	    });
	}
	// normalize
	function _normalize(form) {
	    return _overwrite((input) => input.normalize(form));
	}
	// trim
	function _trim() {
	    return _overwrite((input) => input.trim());
	}
	// toLowerCase
	function _toLowerCase() {
	    return _overwrite((input) => input.toLowerCase());
	}
	// toUpperCase
	function _toUpperCase() {
	    return _overwrite((input) => input.toUpperCase());
	}
	// slugify
	function _slugify() {
	    return _overwrite((input) => slugify(input));
	}
	function _array(Class, element, params) {
	    return new Class({
	        type: "array",
	        element,
	        // get element() {
	        //   return element;
	        // },
	        ...normalizeParams(params),
	    });
	}
	// same as _custom but defaults to abort:false
	function _refine(Class, fn, _params) {
	    const schema = new Class({
	        type: "custom",
	        check: "custom",
	        fn: fn,
	        ...normalizeParams(_params),
	    });
	    return schema;
	}
	function _superRefine(fn) {
	    const ch = _check((payload) => {
	        payload.addIssue = (issue$1) => {
	            if (typeof issue$1 === "string") {
	                payload.issues.push(issue(issue$1, payload.value, ch._zod.def));
	            }
	            else {
	                // for Zod 3 backwards compatibility
	                const _issue = issue$1;
	                if (_issue.fatal)
	                    _issue.continue = false;
	                _issue.code ?? (_issue.code = "custom");
	                _issue.input ?? (_issue.input = payload.value);
	                _issue.inst ?? (_issue.inst = ch);
	                _issue.continue ?? (_issue.continue = !ch._zod.def.abort); // abort is always undefined, so this is always true...
	                payload.issues.push(issue(_issue));
	            }
	        };
	        return fn(payload.value, payload);
	    });
	    return ch;
	}
	function _check(fn, params) {
	    const ch = new $ZodCheck({
	        check: "custom",
	        ...normalizeParams(params),
	    });
	    ch._zod.check = fn;
	    return ch;
	}

	const ZodISODateTime = /*@__PURE__*/ $constructor("ZodISODateTime", (inst, def) => {
	    $ZodISODateTime.init(inst, def);
	    ZodStringFormat.init(inst, def);
	});
	function datetime(params) {
	    return _isoDateTime(ZodISODateTime, params);
	}
	const ZodISODate = /*@__PURE__*/ $constructor("ZodISODate", (inst, def) => {
	    $ZodISODate.init(inst, def);
	    ZodStringFormat.init(inst, def);
	});
	function date(params) {
	    return _isoDate(ZodISODate, params);
	}
	const ZodISOTime = /*@__PURE__*/ $constructor("ZodISOTime", (inst, def) => {
	    $ZodISOTime.init(inst, def);
	    ZodStringFormat.init(inst, def);
	});
	function time(params) {
	    return _isoTime(ZodISOTime, params);
	}
	const ZodISODuration = /*@__PURE__*/ $constructor("ZodISODuration", (inst, def) => {
	    $ZodISODuration.init(inst, def);
	    ZodStringFormat.init(inst, def);
	});
	function duration(params) {
	    return _isoDuration(ZodISODuration, params);
	}

	const initializer = (inst, issues) => {
	    $ZodError.init(inst, issues);
	    inst.name = "ZodError";
	    Object.defineProperties(inst, {
	        format: {
	            value: (mapper) => formatError(inst, mapper),
	            // enumerable: false,
	        },
	        flatten: {
	            value: (mapper) => flattenError(inst, mapper),
	            // enumerable: false,
	        },
	        addIssue: {
	            value: (issue) => {
	                inst.issues.push(issue);
	                inst.message = JSON.stringify(inst.issues, jsonStringifyReplacer, 2);
	            },
	            // enumerable: false,
	        },
	        addIssues: {
	            value: (issues) => {
	                inst.issues.push(...issues);
	                inst.message = JSON.stringify(inst.issues, jsonStringifyReplacer, 2);
	            },
	            // enumerable: false,
	        },
	        isEmpty: {
	            get() {
	                return inst.issues.length === 0;
	            },
	            // enumerable: false,
	        },
	    });
	    // Object.defineProperty(inst, "isEmpty", {
	    //   get() {
	    //     return inst.issues.length === 0;
	    //   },
	    // });
	};
	const ZodRealError = $constructor("ZodError", initializer, {
	    Parent: Error,
	});
	// /** @deprecated Use `z.core.$ZodErrorMapCtx` instead. */
	// export type ErrorMapCtx = core.$ZodErrorMapCtx;

	const parse = /* @__PURE__ */ _parse(ZodRealError);
	const parseAsync = /* @__PURE__ */ _parseAsync(ZodRealError);
	const safeParse = /* @__PURE__ */ _safeParse(ZodRealError);
	const safeParseAsync = /* @__PURE__ */ _safeParseAsync(ZodRealError);
	// Codec functions
	const encode = /* @__PURE__ */ _encode(ZodRealError);
	const decode = /* @__PURE__ */ _decode(ZodRealError);
	const encodeAsync = /* @__PURE__ */ _encodeAsync(ZodRealError);
	const decodeAsync = /* @__PURE__ */ _decodeAsync(ZodRealError);
	const safeEncode = /* @__PURE__ */ _safeEncode(ZodRealError);
	const safeDecode = /* @__PURE__ */ _safeDecode(ZodRealError);
	const safeEncodeAsync = /* @__PURE__ */ _safeEncodeAsync(ZodRealError);
	const safeDecodeAsync = /* @__PURE__ */ _safeDecodeAsync(ZodRealError);

	const ZodType = /*@__PURE__*/ $constructor("ZodType", (inst, def) => {
	    $ZodType.init(inst, def);
	    inst.def = def;
	    inst.type = def.type;
	    Object.defineProperty(inst, "_def", { value: def });
	    // base methods
	    inst.check = (...checks) => {
	        return inst.clone(mergeDefs(def, {
	            checks: [
	                ...(def.checks ?? []),
	                ...checks.map((ch) => typeof ch === "function" ? { _zod: { check: ch, def: { check: "custom" }, onattach: [] } } : ch),
	            ],
	        }));
	    };
	    inst.clone = (def, params) => clone(inst, def, params);
	    inst.brand = () => inst;
	    inst.register = ((reg, meta) => {
	        reg.add(inst, meta);
	        return inst;
	    });
	    // parsing
	    inst.parse = (data, params) => parse(inst, data, params, { callee: inst.parse });
	    inst.safeParse = (data, params) => safeParse(inst, data, params);
	    inst.parseAsync = async (data, params) => parseAsync(inst, data, params, { callee: inst.parseAsync });
	    inst.safeParseAsync = async (data, params) => safeParseAsync(inst, data, params);
	    inst.spa = inst.safeParseAsync;
	    // encoding/decoding
	    inst.encode = (data, params) => encode(inst, data, params);
	    inst.decode = (data, params) => decode(inst, data, params);
	    inst.encodeAsync = async (data, params) => encodeAsync(inst, data, params);
	    inst.decodeAsync = async (data, params) => decodeAsync(inst, data, params);
	    inst.safeEncode = (data, params) => safeEncode(inst, data, params);
	    inst.safeDecode = (data, params) => safeDecode(inst, data, params);
	    inst.safeEncodeAsync = async (data, params) => safeEncodeAsync(inst, data, params);
	    inst.safeDecodeAsync = async (data, params) => safeDecodeAsync(inst, data, params);
	    // refinements
	    inst.refine = (check, params) => inst.check(refine(check, params));
	    inst.superRefine = (refinement) => inst.check(superRefine(refinement));
	    inst.overwrite = (fn) => inst.check(_overwrite(fn));
	    // wrappers
	    inst.optional = () => optional(inst);
	    inst.nullable = () => nullable(inst);
	    inst.nullish = () => optional(nullable(inst));
	    inst.nonoptional = (params) => nonoptional(inst, params);
	    inst.array = () => array(inst);
	    inst.or = (arg) => union([inst, arg]);
	    inst.and = (arg) => intersection(inst, arg);
	    inst.transform = (tx) => pipe(inst, transform(tx));
	    inst.default = (def) => _default(inst, def);
	    inst.prefault = (def) => prefault(inst, def);
	    // inst.coalesce = (def, params) => coalesce(inst, def, params);
	    inst.catch = (params) => _catch(inst, params);
	    inst.pipe = (target) => pipe(inst, target);
	    inst.readonly = () => readonly(inst);
	    // meta
	    inst.describe = (description) => {
	        const cl = inst.clone();
	        globalRegistry.add(cl, { description });
	        return cl;
	    };
	    Object.defineProperty(inst, "description", {
	        get() {
	            return globalRegistry.get(inst)?.description;
	        },
	        configurable: true,
	    });
	    inst.meta = (...args) => {
	        if (args.length === 0) {
	            return globalRegistry.get(inst);
	        }
	        const cl = inst.clone();
	        globalRegistry.add(cl, args[0]);
	        return cl;
	    };
	    // helpers
	    inst.isOptional = () => inst.safeParse(undefined).success;
	    inst.isNullable = () => inst.safeParse(null).success;
	    return inst;
	});
	/** @internal */
	const _ZodString = /*@__PURE__*/ $constructor("_ZodString", (inst, def) => {
	    $ZodString.init(inst, def);
	    ZodType.init(inst, def);
	    const bag = inst._zod.bag;
	    inst.format = bag.format ?? null;
	    inst.minLength = bag.minimum ?? null;
	    inst.maxLength = bag.maximum ?? null;
	    // validations
	    inst.regex = (...args) => inst.check(_regex(...args));
	    inst.includes = (...args) => inst.check(_includes(...args));
	    inst.startsWith = (...args) => inst.check(_startsWith(...args));
	    inst.endsWith = (...args) => inst.check(_endsWith(...args));
	    inst.min = (...args) => inst.check(_minLength(...args));
	    inst.max = (...args) => inst.check(_maxLength(...args));
	    inst.length = (...args) => inst.check(_length(...args));
	    inst.nonempty = (...args) => inst.check(_minLength(1, ...args));
	    inst.lowercase = (params) => inst.check(_lowercase(params));
	    inst.uppercase = (params) => inst.check(_uppercase(params));
	    // transforms
	    inst.trim = () => inst.check(_trim());
	    inst.normalize = (...args) => inst.check(_normalize(...args));
	    inst.toLowerCase = () => inst.check(_toLowerCase());
	    inst.toUpperCase = () => inst.check(_toUpperCase());
	    inst.slugify = () => inst.check(_slugify());
	});
	const ZodString = /*@__PURE__*/ $constructor("ZodString", (inst, def) => {
	    $ZodString.init(inst, def);
	    _ZodString.init(inst, def);
	    inst.email = (params) => inst.check(_email(ZodEmail, params));
	    inst.url = (params) => inst.check(_url(ZodURL, params));
	    inst.jwt = (params) => inst.check(_jwt(ZodJWT, params));
	    inst.emoji = (params) => inst.check(_emoji(ZodEmoji, params));
	    inst.guid = (params) => inst.check(_guid(ZodGUID, params));
	    inst.uuid = (params) => inst.check(_uuid(ZodUUID, params));
	    inst.uuidv4 = (params) => inst.check(_uuidv4(ZodUUID, params));
	    inst.uuidv6 = (params) => inst.check(_uuidv6(ZodUUID, params));
	    inst.uuidv7 = (params) => inst.check(_uuidv7(ZodUUID, params));
	    inst.nanoid = (params) => inst.check(_nanoid(ZodNanoID, params));
	    inst.guid = (params) => inst.check(_guid(ZodGUID, params));
	    inst.cuid = (params) => inst.check(_cuid(ZodCUID, params));
	    inst.cuid2 = (params) => inst.check(_cuid2(ZodCUID2, params));
	    inst.ulid = (params) => inst.check(_ulid(ZodULID, params));
	    inst.base64 = (params) => inst.check(_base64(ZodBase64, params));
	    inst.base64url = (params) => inst.check(_base64url(ZodBase64URL, params));
	    inst.xid = (params) => inst.check(_xid(ZodXID, params));
	    inst.ksuid = (params) => inst.check(_ksuid(ZodKSUID, params));
	    inst.ipv4 = (params) => inst.check(_ipv4(ZodIPv4, params));
	    inst.ipv6 = (params) => inst.check(_ipv6(ZodIPv6, params));
	    inst.cidrv4 = (params) => inst.check(_cidrv4(ZodCIDRv4, params));
	    inst.cidrv6 = (params) => inst.check(_cidrv6(ZodCIDRv6, params));
	    inst.e164 = (params) => inst.check(_e164(ZodE164, params));
	    // iso
	    inst.datetime = (params) => inst.check(datetime(params));
	    inst.date = (params) => inst.check(date(params));
	    inst.time = (params) => inst.check(time(params));
	    inst.duration = (params) => inst.check(duration(params));
	});
	function string(params) {
	    return _string(ZodString, params);
	}
	const ZodStringFormat = /*@__PURE__*/ $constructor("ZodStringFormat", (inst, def) => {
	    $ZodStringFormat.init(inst, def);
	    _ZodString.init(inst, def);
	});
	const ZodEmail = /*@__PURE__*/ $constructor("ZodEmail", (inst, def) => {
	    // ZodStringFormat.init(inst, def);
	    $ZodEmail.init(inst, def);
	    ZodStringFormat.init(inst, def);
	});
	const ZodGUID = /*@__PURE__*/ $constructor("ZodGUID", (inst, def) => {
	    // ZodStringFormat.init(inst, def);
	    $ZodGUID.init(inst, def);
	    ZodStringFormat.init(inst, def);
	});
	const ZodUUID = /*@__PURE__*/ $constructor("ZodUUID", (inst, def) => {
	    // ZodStringFormat.init(inst, def);
	    $ZodUUID.init(inst, def);
	    ZodStringFormat.init(inst, def);
	});
	const ZodURL = /*@__PURE__*/ $constructor("ZodURL", (inst, def) => {
	    // ZodStringFormat.init(inst, def);
	    $ZodURL.init(inst, def);
	    ZodStringFormat.init(inst, def);
	});
	const ZodEmoji = /*@__PURE__*/ $constructor("ZodEmoji", (inst, def) => {
	    // ZodStringFormat.init(inst, def);
	    $ZodEmoji.init(inst, def);
	    ZodStringFormat.init(inst, def);
	});
	const ZodNanoID = /*@__PURE__*/ $constructor("ZodNanoID", (inst, def) => {
	    // ZodStringFormat.init(inst, def);
	    $ZodNanoID.init(inst, def);
	    ZodStringFormat.init(inst, def);
	});
	const ZodCUID = /*@__PURE__*/ $constructor("ZodCUID", (inst, def) => {
	    // ZodStringFormat.init(inst, def);
	    $ZodCUID.init(inst, def);
	    ZodStringFormat.init(inst, def);
	});
	const ZodCUID2 = /*@__PURE__*/ $constructor("ZodCUID2", (inst, def) => {
	    // ZodStringFormat.init(inst, def);
	    $ZodCUID2.init(inst, def);
	    ZodStringFormat.init(inst, def);
	});
	const ZodULID = /*@__PURE__*/ $constructor("ZodULID", (inst, def) => {
	    // ZodStringFormat.init(inst, def);
	    $ZodULID.init(inst, def);
	    ZodStringFormat.init(inst, def);
	});
	const ZodXID = /*@__PURE__*/ $constructor("ZodXID", (inst, def) => {
	    // ZodStringFormat.init(inst, def);
	    $ZodXID.init(inst, def);
	    ZodStringFormat.init(inst, def);
	});
	const ZodKSUID = /*@__PURE__*/ $constructor("ZodKSUID", (inst, def) => {
	    // ZodStringFormat.init(inst, def);
	    $ZodKSUID.init(inst, def);
	    ZodStringFormat.init(inst, def);
	});
	const ZodIPv4 = /*@__PURE__*/ $constructor("ZodIPv4", (inst, def) => {
	    // ZodStringFormat.init(inst, def);
	    $ZodIPv4.init(inst, def);
	    ZodStringFormat.init(inst, def);
	});
	const ZodIPv6 = /*@__PURE__*/ $constructor("ZodIPv6", (inst, def) => {
	    // ZodStringFormat.init(inst, def);
	    $ZodIPv6.init(inst, def);
	    ZodStringFormat.init(inst, def);
	});
	const ZodCIDRv4 = /*@__PURE__*/ $constructor("ZodCIDRv4", (inst, def) => {
	    $ZodCIDRv4.init(inst, def);
	    ZodStringFormat.init(inst, def);
	});
	const ZodCIDRv6 = /*@__PURE__*/ $constructor("ZodCIDRv6", (inst, def) => {
	    $ZodCIDRv6.init(inst, def);
	    ZodStringFormat.init(inst, def);
	});
	const ZodBase64 = /*@__PURE__*/ $constructor("ZodBase64", (inst, def) => {
	    // ZodStringFormat.init(inst, def);
	    $ZodBase64.init(inst, def);
	    ZodStringFormat.init(inst, def);
	});
	const ZodBase64URL = /*@__PURE__*/ $constructor("ZodBase64URL", (inst, def) => {
	    // ZodStringFormat.init(inst, def);
	    $ZodBase64URL.init(inst, def);
	    ZodStringFormat.init(inst, def);
	});
	const ZodE164 = /*@__PURE__*/ $constructor("ZodE164", (inst, def) => {
	    // ZodStringFormat.init(inst, def);
	    $ZodE164.init(inst, def);
	    ZodStringFormat.init(inst, def);
	});
	const ZodJWT = /*@__PURE__*/ $constructor("ZodJWT", (inst, def) => {
	    // ZodStringFormat.init(inst, def);
	    $ZodJWT.init(inst, def);
	    ZodStringFormat.init(inst, def);
	});
	const ZodNumber = /*@__PURE__*/ $constructor("ZodNumber", (inst, def) => {
	    $ZodNumber.init(inst, def);
	    ZodType.init(inst, def);
	    inst.gt = (value, params) => inst.check(_gt(value, params));
	    inst.gte = (value, params) => inst.check(_gte(value, params));
	    inst.min = (value, params) => inst.check(_gte(value, params));
	    inst.lt = (value, params) => inst.check(_lt(value, params));
	    inst.lte = (value, params) => inst.check(_lte(value, params));
	    inst.max = (value, params) => inst.check(_lte(value, params));
	    inst.int = (params) => inst.check(int(params));
	    inst.safe = (params) => inst.check(int(params));
	    inst.positive = (params) => inst.check(_gt(0, params));
	    inst.nonnegative = (params) => inst.check(_gte(0, params));
	    inst.negative = (params) => inst.check(_lt(0, params));
	    inst.nonpositive = (params) => inst.check(_lte(0, params));
	    inst.multipleOf = (value, params) => inst.check(_multipleOf(value, params));
	    inst.step = (value, params) => inst.check(_multipleOf(value, params));
	    // inst.finite = (params) => inst.check(core.finite(params));
	    inst.finite = () => inst;
	    const bag = inst._zod.bag;
	    inst.minValue =
	        Math.max(bag.minimum ?? Number.NEGATIVE_INFINITY, bag.exclusiveMinimum ?? Number.NEGATIVE_INFINITY) ?? null;
	    inst.maxValue =
	        Math.min(bag.maximum ?? Number.POSITIVE_INFINITY, bag.exclusiveMaximum ?? Number.POSITIVE_INFINITY) ?? null;
	    inst.isInt = (bag.format ?? "").includes("int") || Number.isSafeInteger(bag.multipleOf ?? 0.5);
	    inst.isFinite = true;
	    inst.format = bag.format ?? null;
	});
	function number(params) {
	    return _number(ZodNumber, params);
	}
	const ZodNumberFormat = /*@__PURE__*/ $constructor("ZodNumberFormat", (inst, def) => {
	    $ZodNumberFormat.init(inst, def);
	    ZodNumber.init(inst, def);
	});
	function int(params) {
	    return _int(ZodNumberFormat, params);
	}
	const ZodBoolean = /*@__PURE__*/ $constructor("ZodBoolean", (inst, def) => {
	    $ZodBoolean.init(inst, def);
	    ZodType.init(inst, def);
	});
	function boolean(params) {
	    return _boolean(ZodBoolean, params);
	}
	const ZodUnknown = /*@__PURE__*/ $constructor("ZodUnknown", (inst, def) => {
	    $ZodUnknown.init(inst, def);
	    ZodType.init(inst, def);
	});
	function unknown() {
	    return _unknown(ZodUnknown);
	}
	const ZodNever = /*@__PURE__*/ $constructor("ZodNever", (inst, def) => {
	    $ZodNever.init(inst, def);
	    ZodType.init(inst, def);
	});
	function never(params) {
	    return _never(ZodNever, params);
	}
	const ZodArray = /*@__PURE__*/ $constructor("ZodArray", (inst, def) => {
	    $ZodArray.init(inst, def);
	    ZodType.init(inst, def);
	    inst.element = def.element;
	    inst.min = (minLength, params) => inst.check(_minLength(minLength, params));
	    inst.nonempty = (params) => inst.check(_minLength(1, params));
	    inst.max = (maxLength, params) => inst.check(_maxLength(maxLength, params));
	    inst.length = (len, params) => inst.check(_length(len, params));
	    inst.unwrap = () => inst.element;
	});
	function array(element, params) {
	    return _array(ZodArray, element, params);
	}
	const ZodObject = /*@__PURE__*/ $constructor("ZodObject", (inst, def) => {
	    $ZodObjectJIT.init(inst, def);
	    ZodType.init(inst, def);
	    defineLazy(inst, "shape", () => {
	        return def.shape;
	    });
	    inst.keyof = () => _enum(Object.keys(inst._zod.def.shape));
	    inst.catchall = (catchall) => inst.clone({ ...inst._zod.def, catchall: catchall });
	    inst.passthrough = () => inst.clone({ ...inst._zod.def, catchall: unknown() });
	    inst.loose = () => inst.clone({ ...inst._zod.def, catchall: unknown() });
	    inst.strict = () => inst.clone({ ...inst._zod.def, catchall: never() });
	    inst.strip = () => inst.clone({ ...inst._zod.def, catchall: undefined });
	    inst.extend = (incoming) => {
	        return extend(inst, incoming);
	    };
	    inst.safeExtend = (incoming) => {
	        return safeExtend(inst, incoming);
	    };
	    inst.merge = (other) => merge(inst, other);
	    inst.pick = (mask) => pick(inst, mask);
	    inst.omit = (mask) => omit(inst, mask);
	    inst.partial = (...args) => partial(ZodOptional, inst, args[0]);
	    inst.required = (...args) => required(ZodNonOptional, inst, args[0]);
	});
	function object(shape, params) {
	    const def = {
	        type: "object",
	        shape: shape ?? {},
	        ...normalizeParams(params),
	    };
	    return new ZodObject(def);
	}
	const ZodUnion = /*@__PURE__*/ $constructor("ZodUnion", (inst, def) => {
	    $ZodUnion.init(inst, def);
	    ZodType.init(inst, def);
	    inst.options = def.options;
	});
	function union(options, params) {
	    return new ZodUnion({
	        type: "union",
	        options: options,
	        ...normalizeParams(params),
	    });
	}
	const ZodIntersection = /*@__PURE__*/ $constructor("ZodIntersection", (inst, def) => {
	    $ZodIntersection.init(inst, def);
	    ZodType.init(inst, def);
	});
	function intersection(left, right) {
	    return new ZodIntersection({
	        type: "intersection",
	        left: left,
	        right: right,
	    });
	}
	const ZodEnum = /*@__PURE__*/ $constructor("ZodEnum", (inst, def) => {
	    $ZodEnum.init(inst, def);
	    ZodType.init(inst, def);
	    inst.enum = def.entries;
	    inst.options = Object.values(def.entries);
	    const keys = new Set(Object.keys(def.entries));
	    inst.extract = (values, params) => {
	        const newEntries = {};
	        for (const value of values) {
	            if (keys.has(value)) {
	                newEntries[value] = def.entries[value];
	            }
	            else
	                throw new Error(`Key ${value} not found in enum`);
	        }
	        return new ZodEnum({
	            ...def,
	            checks: [],
	            ...normalizeParams(params),
	            entries: newEntries,
	        });
	    };
	    inst.exclude = (values, params) => {
	        const newEntries = { ...def.entries };
	        for (const value of values) {
	            if (keys.has(value)) {
	                delete newEntries[value];
	            }
	            else
	                throw new Error(`Key ${value} not found in enum`);
	        }
	        return new ZodEnum({
	            ...def,
	            checks: [],
	            ...normalizeParams(params),
	            entries: newEntries,
	        });
	    };
	});
	function _enum(values, params) {
	    const entries = Array.isArray(values) ? Object.fromEntries(values.map((v) => [v, v])) : values;
	    return new ZodEnum({
	        type: "enum",
	        entries,
	        ...normalizeParams(params),
	    });
	}
	const ZodTransform = /*@__PURE__*/ $constructor("ZodTransform", (inst, def) => {
	    $ZodTransform.init(inst, def);
	    ZodType.init(inst, def);
	    inst._zod.parse = (payload, _ctx) => {
	        if (_ctx.direction === "backward") {
	            throw new $ZodEncodeError(inst.constructor.name);
	        }
	        payload.addIssue = (issue$1) => {
	            if (typeof issue$1 === "string") {
	                payload.issues.push(issue(issue$1, payload.value, def));
	            }
	            else {
	                // for Zod 3 backwards compatibility
	                const _issue = issue$1;
	                if (_issue.fatal)
	                    _issue.continue = false;
	                _issue.code ?? (_issue.code = "custom");
	                _issue.input ?? (_issue.input = payload.value);
	                _issue.inst ?? (_issue.inst = inst);
	                // _issue.continue ??= true;
	                payload.issues.push(issue(_issue));
	            }
	        };
	        const output = def.transform(payload.value, payload);
	        if (output instanceof Promise) {
	            return output.then((output) => {
	                payload.value = output;
	                return payload;
	            });
	        }
	        payload.value = output;
	        return payload;
	    };
	});
	function transform(fn) {
	    return new ZodTransform({
	        type: "transform",
	        transform: fn,
	    });
	}
	const ZodOptional = /*@__PURE__*/ $constructor("ZodOptional", (inst, def) => {
	    $ZodOptional.init(inst, def);
	    ZodType.init(inst, def);
	    inst.unwrap = () => inst._zod.def.innerType;
	});
	function optional(innerType) {
	    return new ZodOptional({
	        type: "optional",
	        innerType: innerType,
	    });
	}
	const ZodNullable = /*@__PURE__*/ $constructor("ZodNullable", (inst, def) => {
	    $ZodNullable.init(inst, def);
	    ZodType.init(inst, def);
	    inst.unwrap = () => inst._zod.def.innerType;
	});
	function nullable(innerType) {
	    return new ZodNullable({
	        type: "nullable",
	        innerType: innerType,
	    });
	}
	const ZodDefault = /*@__PURE__*/ $constructor("ZodDefault", (inst, def) => {
	    $ZodDefault.init(inst, def);
	    ZodType.init(inst, def);
	    inst.unwrap = () => inst._zod.def.innerType;
	    inst.removeDefault = inst.unwrap;
	});
	function _default(innerType, defaultValue) {
	    return new ZodDefault({
	        type: "default",
	        innerType: innerType,
	        get defaultValue() {
	            return typeof defaultValue === "function" ? defaultValue() : shallowClone(defaultValue);
	        },
	    });
	}
	const ZodPrefault = /*@__PURE__*/ $constructor("ZodPrefault", (inst, def) => {
	    $ZodPrefault.init(inst, def);
	    ZodType.init(inst, def);
	    inst.unwrap = () => inst._zod.def.innerType;
	});
	function prefault(innerType, defaultValue) {
	    return new ZodPrefault({
	        type: "prefault",
	        innerType: innerType,
	        get defaultValue() {
	            return typeof defaultValue === "function" ? defaultValue() : shallowClone(defaultValue);
	        },
	    });
	}
	const ZodNonOptional = /*@__PURE__*/ $constructor("ZodNonOptional", (inst, def) => {
	    $ZodNonOptional.init(inst, def);
	    ZodType.init(inst, def);
	    inst.unwrap = () => inst._zod.def.innerType;
	});
	function nonoptional(innerType, params) {
	    return new ZodNonOptional({
	        type: "nonoptional",
	        innerType: innerType,
	        ...normalizeParams(params),
	    });
	}
	const ZodCatch = /*@__PURE__*/ $constructor("ZodCatch", (inst, def) => {
	    $ZodCatch.init(inst, def);
	    ZodType.init(inst, def);
	    inst.unwrap = () => inst._zod.def.innerType;
	    inst.removeCatch = inst.unwrap;
	});
	function _catch(innerType, catchValue) {
	    return new ZodCatch({
	        type: "catch",
	        innerType: innerType,
	        catchValue: (typeof catchValue === "function" ? catchValue : () => catchValue),
	    });
	}
	const ZodPipe = /*@__PURE__*/ $constructor("ZodPipe", (inst, def) => {
	    $ZodPipe.init(inst, def);
	    ZodType.init(inst, def);
	    inst.in = def.in;
	    inst.out = def.out;
	});
	function pipe(in_, out) {
	    return new ZodPipe({
	        type: "pipe",
	        in: in_,
	        out: out,
	        // ...util.normalizeParams(params),
	    });
	}
	const ZodReadonly = /*@__PURE__*/ $constructor("ZodReadonly", (inst, def) => {
	    $ZodReadonly.init(inst, def);
	    ZodType.init(inst, def);
	    inst.unwrap = () => inst._zod.def.innerType;
	});
	function readonly(innerType) {
	    return new ZodReadonly({
	        type: "readonly",
	        innerType: innerType,
	    });
	}
	const ZodCustom = /*@__PURE__*/ $constructor("ZodCustom", (inst, def) => {
	    $ZodCustom.init(inst, def);
	    ZodType.init(inst, def);
	});
	function refine(fn, _params = {}) {
	    return _refine(ZodCustom, fn, _params);
	}
	// superRefine
	function superRefine(fn) {
	    return _superRefine(fn);
	}

	const ModelSchema = object({
	    id: string(),
	    name: string(),
	    is_default: boolean()
	});
	object({
	    models: array(ModelSchema),
	    credits_remaining: number().nullable().optional()
	});
	const Config = object({
	    apiKey: string().min(1, 'API key is required').trim(),
	    model: string().min(1, 'Model is required'),
	    reasoning: string().min(1).max(64).default('low'),
	    cursor: boolean().default(false),
	    fillOnClick: boolean().default(true),
	    context: string()
	        .max(75000, 'Context must be at most 75,000 characters')
	        .optional(),
	    credits: number().optional()
	});

	const BACKEND_URL = "https://quizsolverformoodle.com";

	class ModelConfigurationError extends Error {
	}
	function getDefaultModel(models) {
	    const defaultModels = models.filter(model => model.is_default);
	    if (defaultModels.length !== 1) {
	        throw new ModelConfigurationError('The server must provide exactly one default model.');
	    }
	    return defaultModels[0];
	}
	function resolveModel(models, selectedModelId) {
	    var _a;
	    const defaultModel = getDefaultModel(models);
	    return (_a = models.find(model => model.id === selectedModelId)) !== null && _a !== void 0 ? _a : defaultModel;
	}
	async function resolveAndPersistModel(models, selectedModelId, persist) {
	    const model = resolveModel(models, selectedModelId);
	    if (model.id !== selectedModelId) {
	        await persist(model.id);
	    }
	    return model;
	}
	function getModelLabel(model) {
	    return model.is_default ? `${model.name} (Default)` : model.name;
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
	runtimeHelper1Module.default || runtimeHelper1Module;
	const func1 = runtimeHelper0;const validateModelsResponse = validate63;const schema56 = {"properties":{"models":{"items":{"properties":{"input_modalities":{"items":{"enum":["text","image"]}}}}}}};function validate63(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){let vErrors = null;let errors = 0;const evaluated0 = validate63.evaluated;if(evaluated0.dynamicProps){evaluated0.props = undefined;}if(evaluated0.dynamicItems){evaluated0.items = undefined;}if(data && typeof data == "object" && !Array.isArray(data)){if(data.schema_version === undefined){const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "schema_version"},message:"must have required property '"+"schema_version"+"'"};if(vErrors === null){vErrors = [err0];}else {vErrors.push(err0);}errors++;}if(data.models === undefined){const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "models"},message:"must have required property '"+"models"+"'"};if(vErrors === null){vErrors = [err1];}else {vErrors.push(err1);}errors++;}if(data.credits_remaining === undefined){const err2 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "credits_remaining"},message:"must have required property '"+"credits_remaining"+"'"};if(vErrors === null){vErrors = [err2];}else {vErrors.push(err2);}errors++;}for(const key0 in data){if(!(((key0 === "schema_version") || (key0 === "models")) || (key0 === "credits_remaining"))){const err3 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err3];}else {vErrors.push(err3);}errors++;}}if(data.schema_version !== undefined){if("2.0" !== data.schema_version){const err4 = {instancePath:instancePath+"/schema_version",schemaPath:"#/properties/schema_version/const",keyword:"const",params:{allowedValue: "2.0"},message:"must be equal to constant"};if(vErrors === null){vErrors = [err4];}else {vErrors.push(err4);}errors++;}}if(data.models !== undefined){let data1 = data.models;if(Array.isArray(data1)){const len0 = data1.length;for(let i0=0; i0<len0; i0++){let data2 = data1[i0];if(data2 && typeof data2 == "object" && !Array.isArray(data2)){if(data2.id === undefined){const err5 = {instancePath:instancePath+"/models/" + i0,schemaPath:"#/properties/models/items/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};if(vErrors === null){vErrors = [err5];}else {vErrors.push(err5);}errors++;}if(data2.name === undefined){const err6 = {instancePath:instancePath+"/models/" + i0,schemaPath:"#/properties/models/items/required",keyword:"required",params:{missingProperty: "name"},message:"must have required property '"+"name"+"'"};if(vErrors === null){vErrors = [err6];}else {vErrors.push(err6);}errors++;}if(data2.is_default === undefined){const err7 = {instancePath:instancePath+"/models/" + i0,schemaPath:"#/properties/models/items/required",keyword:"required",params:{missingProperty: "is_default"},message:"must have required property '"+"is_default"+"'"};if(vErrors === null){vErrors = [err7];}else {vErrors.push(err7);}errors++;}if(data2.display_order === undefined){const err8 = {instancePath:instancePath+"/models/" + i0,schemaPath:"#/properties/models/items/required",keyword:"required",params:{missingProperty: "display_order"},message:"must have required property '"+"display_order"+"'"};if(vErrors === null){vErrors = [err8];}else {vErrors.push(err8);}errors++;}if(data2.input_modalities === undefined){const err9 = {instancePath:instancePath+"/models/" + i0,schemaPath:"#/properties/models/items/required",keyword:"required",params:{missingProperty: "input_modalities"},message:"must have required property '"+"input_modalities"+"'"};if(vErrors === null){vErrors = [err9];}else {vErrors.push(err9);}errors++;}if(data2.structured_outputs === undefined){const err10 = {instancePath:instancePath+"/models/" + i0,schemaPath:"#/properties/models/items/required",keyword:"required",params:{missingProperty: "structured_outputs"},message:"must have required property '"+"structured_outputs"+"'"};if(vErrors === null){vErrors = [err10];}else {vErrors.push(err10);}errors++;}if(data2.reasoning_levels === undefined){const err11 = {instancePath:instancePath+"/models/" + i0,schemaPath:"#/properties/models/items/required",keyword:"required",params:{missingProperty: "reasoning_levels"},message:"must have required property '"+"reasoning_levels"+"'"};if(vErrors === null){vErrors = [err11];}else {vErrors.push(err11);}errors++;}for(const key1 in data2){if(!(((((((key1 === "id") || (key1 === "name")) || (key1 === "is_default")) || (key1 === "display_order")) || (key1 === "input_modalities")) || (key1 === "structured_outputs")) || (key1 === "reasoning_levels"))){const err12 = {instancePath:instancePath+"/models/" + i0,schemaPath:"#/properties/models/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err12];}else {vErrors.push(err12);}errors++;}}if(data2.id !== undefined){if(typeof data2.id !== "string"){const err13 = {instancePath:instancePath+"/models/" + i0+"/id",schemaPath:"#/properties/models/items/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err13];}else {vErrors.push(err13);}errors++;}}if(data2.name !== undefined){if(typeof data2.name !== "string"){const err14 = {instancePath:instancePath+"/models/" + i0+"/name",schemaPath:"#/properties/models/items/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err14];}else {vErrors.push(err14);}errors++;}}if(data2.is_default !== undefined){if(typeof data2.is_default !== "boolean"){const err15 = {instancePath:instancePath+"/models/" + i0+"/is_default",schemaPath:"#/properties/models/items/properties/is_default/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};if(vErrors === null){vErrors = [err15];}else {vErrors.push(err15);}errors++;}}if(data2.display_order !== undefined){let data6 = data2.display_order;if(!((typeof data6 == "number") && (!(data6 % 1) && !isNaN(data6)))){const err16 = {instancePath:instancePath+"/models/" + i0+"/display_order",schemaPath:"#/properties/models/items/properties/display_order/type",keyword:"type",params:{type: "integer"},message:"must be integer"};if(vErrors === null){vErrors = [err16];}else {vErrors.push(err16);}errors++;}}if(data2.input_modalities !== undefined){let data7 = data2.input_modalities;if(Array.isArray(data7)){if(data7.length < 1){const err17 = {instancePath:instancePath+"/models/" + i0+"/input_modalities",schemaPath:"#/properties/models/items/properties/input_modalities/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};if(vErrors === null){vErrors = [err17];}else {vErrors.push(err17);}errors++;}const len1 = data7.length;for(let i1=0; i1<len1; i1++){let data8 = data7[i1];if(typeof data8 !== "string"){const err18 = {instancePath:instancePath+"/models/" + i0+"/input_modalities/" + i1,schemaPath:"#/properties/models/items/properties/input_modalities/items/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err18];}else {vErrors.push(err18);}errors++;}if(!((data8 === "text") || (data8 === "image"))){const err19 = {instancePath:instancePath+"/models/" + i0+"/input_modalities/" + i1,schemaPath:"#/properties/models/items/properties/input_modalities/items/enum",keyword:"enum",params:{allowedValues: schema56.properties.models.items.properties.input_modalities.items.enum},message:"must be equal to one of the allowed values"};if(vErrors === null){vErrors = [err19];}else {vErrors.push(err19);}errors++;}}let i2 = data7.length;let j0;if(i2 > 1){const indices0 = {};for(;i2--;){let item0 = data7[i2];if(typeof item0 !== "string"){continue;}if(typeof indices0[item0] == "number"){j0 = indices0[item0];const err20 = {instancePath:instancePath+"/models/" + i0+"/input_modalities",schemaPath:"#/properties/models/items/properties/input_modalities/uniqueItems",keyword:"uniqueItems",params:{i: i2, j: j0},message:"must NOT have duplicate items (items ## "+j0+" and "+i2+" are identical)"};if(vErrors === null){vErrors = [err20];}else {vErrors.push(err20);}errors++;break;}indices0[item0] = i2;}}}else {const err21 = {instancePath:instancePath+"/models/" + i0+"/input_modalities",schemaPath:"#/properties/models/items/properties/input_modalities/type",keyword:"type",params:{type: "array"},message:"must be array"};if(vErrors === null){vErrors = [err21];}else {vErrors.push(err21);}errors++;}}if(data2.structured_outputs !== undefined){if(typeof data2.structured_outputs !== "boolean"){const err22 = {instancePath:instancePath+"/models/" + i0+"/structured_outputs",schemaPath:"#/properties/models/items/properties/structured_outputs/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};if(vErrors === null){vErrors = [err22];}else {vErrors.push(err22);}errors++;}}if(data2.reasoning_levels !== undefined){let data10 = data2.reasoning_levels;if(Array.isArray(data10)){if(data10.length > 7){const err23 = {instancePath:instancePath+"/models/" + i0+"/reasoning_levels",schemaPath:"#/properties/models/items/properties/reasoning_levels/maxItems",keyword:"maxItems",params:{limit: 7},message:"must NOT have more than 7 items"};if(vErrors === null){vErrors = [err23];}else {vErrors.push(err23);}errors++;}if(data10.length < 1){const err24 = {instancePath:instancePath+"/models/" + i0+"/reasoning_levels",schemaPath:"#/properties/models/items/properties/reasoning_levels/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};if(vErrors === null){vErrors = [err24];}else {vErrors.push(err24);}errors++;}const len2 = data10.length;for(let i3=0; i3<len2; i3++){let data11 = data10[i3];if(data11 && typeof data11 == "object" && !Array.isArray(data11)){if(data11.key === undefined){const err25 = {instancePath:instancePath+"/models/" + i0+"/reasoning_levels/" + i3,schemaPath:"#/$defs/ReasoningLevel/required",keyword:"required",params:{missingProperty: "key"},message:"must have required property '"+"key"+"'"};if(vErrors === null){vErrors = [err25];}else {vErrors.push(err25);}errors++;}if(data11.label === undefined){const err26 = {instancePath:instancePath+"/models/" + i0+"/reasoning_levels/" + i3,schemaPath:"#/$defs/ReasoningLevel/required",keyword:"required",params:{missingProperty: "label"},message:"must have required property '"+"label"+"'"};if(vErrors === null){vErrors = [err26];}else {vErrors.push(err26);}errors++;}for(const key2 in data11){if(!((key2 === "key") || (key2 === "label"))){const err27 = {instancePath:instancePath+"/models/" + i0+"/reasoning_levels/" + i3,schemaPath:"#/$defs/ReasoningLevel/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key2},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err27];}else {vErrors.push(err27);}errors++;}}if(data11.key !== undefined){let data12 = data11.key;if(typeof data12 === "string"){if(func1(data12) > 32){const err28 = {instancePath:instancePath+"/models/" + i0+"/reasoning_levels/" + i3+"/key",schemaPath:"#/$defs/ReasoningLevel/properties/key/maxLength",keyword:"maxLength",params:{limit: 32},message:"must NOT have more than 32 characters"};if(vErrors === null){vErrors = [err28];}else {vErrors.push(err28);}errors++;}if(func1(data12) < 1){const err29 = {instancePath:instancePath+"/models/" + i0+"/reasoning_levels/" + i3+"/key",schemaPath:"#/$defs/ReasoningLevel/properties/key/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};if(vErrors === null){vErrors = [err29];}else {vErrors.push(err29);}errors++;}}else {const err30 = {instancePath:instancePath+"/models/" + i0+"/reasoning_levels/" + i3+"/key",schemaPath:"#/$defs/ReasoningLevel/properties/key/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err30];}else {vErrors.push(err30);}errors++;}}if(data11.label !== undefined){let data13 = data11.label;if(typeof data13 === "string"){if(func1(data13) > 80){const err31 = {instancePath:instancePath+"/models/" + i0+"/reasoning_levels/" + i3+"/label",schemaPath:"#/$defs/ReasoningLevel/properties/label/maxLength",keyword:"maxLength",params:{limit: 80},message:"must NOT have more than 80 characters"};if(vErrors === null){vErrors = [err31];}else {vErrors.push(err31);}errors++;}if(func1(data13) < 1){const err32 = {instancePath:instancePath+"/models/" + i0+"/reasoning_levels/" + i3+"/label",schemaPath:"#/$defs/ReasoningLevel/properties/label/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};if(vErrors === null){vErrors = [err32];}else {vErrors.push(err32);}errors++;}}else {const err33 = {instancePath:instancePath+"/models/" + i0+"/reasoning_levels/" + i3+"/label",schemaPath:"#/$defs/ReasoningLevel/properties/label/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err33];}else {vErrors.push(err33);}errors++;}}}else {const err34 = {instancePath:instancePath+"/models/" + i0+"/reasoning_levels/" + i3,schemaPath:"#/$defs/ReasoningLevel/type",keyword:"type",params:{type: "object"},message:"must be object"};if(vErrors === null){vErrors = [err34];}else {vErrors.push(err34);}errors++;}}}else {const err35 = {instancePath:instancePath+"/models/" + i0+"/reasoning_levels",schemaPath:"#/properties/models/items/properties/reasoning_levels/type",keyword:"type",params:{type: "array"},message:"must be array"};if(vErrors === null){vErrors = [err35];}else {vErrors.push(err35);}errors++;}}}else {const err36 = {instancePath:instancePath+"/models/" + i0,schemaPath:"#/properties/models/items/type",keyword:"type",params:{type: "object"},message:"must be object"};if(vErrors === null){vErrors = [err36];}else {vErrors.push(err36);}errors++;}}}else {const err37 = {instancePath:instancePath+"/models",schemaPath:"#/properties/models/type",keyword:"type",params:{type: "array"},message:"must be array"};if(vErrors === null){vErrors = [err37];}else {vErrors.push(err37);}errors++;}}if(data.credits_remaining !== undefined){let data14 = data.credits_remaining;if(!((typeof data14 == "number") && (!(data14 % 1) && !isNaN(data14)))){const err38 = {instancePath:instancePath+"/credits_remaining",schemaPath:"#/properties/credits_remaining/type",keyword:"type",params:{type: "integer"},message:"must be integer"};if(vErrors === null){vErrors = [err38];}else {vErrors.push(err38);}errors++;}if(typeof data14 == "number"){if(data14 < 0 || isNaN(data14)){const err39 = {instancePath:instancePath+"/credits_remaining",schemaPath:"#/properties/credits_remaining/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};if(vErrors === null){vErrors = [err39];}else {vErrors.push(err39);}errors++;}}}}else {const err40 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};if(vErrors === null){vErrors = [err40];}else {vErrors.push(err40);}errors++;}validate63.errors = vErrors;return errors === 0;}validate63.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

	class AdapterError extends Error {
	    constructor(code, message) {
	        super(message);
	        this.code = code;
	        this.name = 'AdapterError';
	    }
	}

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

	let ConfigPopup = class ConfigPopup extends i {
	    constructor() {
	        super(...arguments);
	        this.DEFAULT_FORM_DATA = {
	            apiKey: '',
	            model: '',
	            reasoning: 'low',
	            cursor: true,
	            fillOnClick: false,
	            context: ''
	        };
	        this.formData = Object.assign({}, this.DEFAULT_FORM_DATA);
	        this.hasApiKey = false;
	        this.isApiKeyValidated = false;
	        this.isApiKeyInvalid = false;
	        this.availableModels = [];
	        this.modelCatalog = [];
	        this.isLoadingModels = false;
	        this.credits = undefined;
	        this.catalogRevision = 0;
	        this.alertContainer = null;
	        this.validateDebounceTimer = null;
	    }
	    createRenderRoot() {
	        return this;
	    }
	    connectedCallback() {
	        super.connectedCallback();
	        this.loadConfiguration().then(() => {
	            if (this.formData.apiKey) {
	                this.fetchOrValidate();
	            }
	        });
	    }
	    firstUpdated() {
	        this.alertContainer = this.querySelector('alert-container');
	    }
	    showAlert(message, type = 'info') {
	        if (this.alertContainer) {
	            this.alertContainer.showAlert(message, type, false);
	        }
	    }
	    async loadConfiguration() {
	        try {
	            const storageData = await browser.storage.local.get(['quizSolver']);
	            const config = storageData.quizSolver;
	            if (config) {
	                this.formData = {
	                    apiKey: config.apiKey || '',
	                    model: config.model || '',
	                    reasoning: config.reasoning || 'low',
	                    cursor: config.cursor !== false,
	                    fillOnClick: config.fillOnClick !== false,
	                    context: config.context || '',
	                    credits: config.credits
	                };
	                this.credits = config.credits;
	            }
	            this.hasApiKey = Boolean(this.formData.apiKey && this.formData.apiKey.trim() !== '');
	        }
	        catch (error) {
	            this.showAlert(`Failed to load configuration: ${error instanceof Error ? error.message : String(error)}`, 'danger');
	        }
	        this.requestUpdate();
	    }
	    async fetchOrValidate() {
	        if (!this.formData.apiKey)
	            return;
	        const revision = ++this.catalogRevision;
	        const apiKey = this.formData.apiKey;
	        this.isApiKeyValidated = false;
	        this.modelCatalog = [];
	        try {
	            const storageData = await browser.storage.local.get(['quizSolver']);
	            if (revision !== this.catalogRevision || apiKey !== this.formData.apiKey)
	                return;
	            const config = storageData.quizSolver;
	            const cachedModels = (config === null || config === void 0 ? void 0 : config.cachedModelsV2) || [];
	            if (cachedModels.length > 0) {
	                this.availableModels = cachedModels
	                    .map(m => ({ name: m.id, label: m.is_default ? `${m.name} (Default)` : m.name }));
	                this.isLoadingModels = false;
	            }
	            else {
	                this.isLoadingModels = true;
	            }
	            await this.fetchModels(Date.now(), revision, apiKey);
	            if (revision === this.catalogRevision && apiKey === this.formData.apiKey)
	                this.isApiKeyValidated = true;
	        }
	        catch (error) {
	            if (revision === this.catalogRevision && apiKey === this.formData.apiKey)
	                await this.handleApiError(error);
	        }
	        finally {
	            if (revision === this.catalogRevision)
	                this.isLoadingModels = false;
	            this.requestUpdate();
	        }
	    }
	    async fetchModels(timestamp, revision, apiKey) {
	        var _a;
	        const response = await fetch(`${BACKEND_URL}/api/v2/models`, {
	            headers: {
	                'Authorization': `Token ${apiKey}`,
	                'Content-Type': 'application/json'
	            }
	        });
	        if (!response.ok)
	            throw response;
	        const json = parseStrictJSON(await response.text());
	        if (!validateModelsResponse(json))
	            throw new Error('The backend did not return a valid v2 model catalog.');
	        if (revision !== this.catalogRevision || apiKey !== this.formData.apiKey)
	            return;
	        const data = json;
	        if (!data.models.length)
	            throw new Error('No verified v2 models are currently enabled on the backend.');
	        this.modelCatalog = data.models;
	        await resolveAndPersistModel(data.models, this.formData.model, modelId => this.updateFormData('model', modelId));
	        if (revision !== this.catalogRevision || apiKey !== this.formData.apiKey)
	            return;
	        this.normalizeReasoning();
	        await this.saveConfiguration();
	        if (revision !== this.catalogRevision || apiKey !== this.formData.apiKey)
	            return;
	        this.availableModels = data.models
	            .map(m => ({
	            name: m.id,
	            label: getModelLabel(m)
	        }));
	        this.credits = (_a = data.credits_remaining) !== null && _a !== void 0 ? _a : undefined;
	        this.updateFormData('credits', this.credits);
	        // Cache models and timestamp
	        const storageData = await browser.storage.local.get(['quizSolver']);
	        if (revision !== this.catalogRevision || apiKey !== this.formData.apiKey)
	            return;
	        await browser.storage.local.set({
	            quizSolver: Object.assign(Object.assign({}, storageData.quizSolver), { cachedModelsV2: data.models, lastModelFetch: timestamp, credits: this.credits })
	        });
	    }
	    async handleApiError(error) {
	        var _a, _b;
	        this.isApiKeyValidated = false;
	        let message = String(error);
	        let isAuthError = false;
	        if (error instanceof Response) {
	            if (error.status === 401) {
	                isAuthError = true;
	            }
	            else {
	                try {
	                    const body = await error.json();
	                    if (((_a = body === null || body === void 0 ? void 0 : body.error) === null || _a === void 0 ? void 0 : _a.code) === 'authentication_required') {
	                        isAuthError = true;
	                    }
	                    else if ((_b = body === null || body === void 0 ? void 0 : body.error) === null || _b === void 0 ? void 0 : _b.message) {
	                        message = body.error.message;
	                    }
	                    else if (body === null || body === void 0 ? void 0 : body.message) {
	                        message = body.message;
	                    }
	                    else if (body === null || body === void 0 ? void 0 : body.detail) {
	                        message = body.detail;
	                    }
	                    else if (error.status === 429) {
	                        message = 'Too many requests';
	                    }
	                    else {
	                        message = 'Failed to connect to server';
	                    }
	                }
	                catch (_c) {
	                    if (error.status === 429) {
	                        message = 'Too many requests';
	                    }
	                    else {
	                        message = 'Failed to connect to server';
	                    }
	                }
	            }
	            if (isAuthError) {
	                this.isApiKeyInvalid = true;
	                await this.clearAndResetConfig();
	                return;
	            }
	        }
	        else if (error instanceof Error) {
	            message = error.message;
	        }
	        this.showAlert(message, 'danger');
	    }
	    async updateFormData(field, value) {
	        var _a;
	        if (field === 'model' && !this.modelCatalog.some(model => model.id === value))
	            return;
	        if (field === 'reasoning' && !this.reasoningLevels.some(level => level.key === value))
	            return;
	        this.formData = Object.assign(Object.assign({}, this.formData), { [field]: value });
	        if (field === 'model')
	            this.normalizeReasoning();
	        if (field === 'apiKey') {
	            this.catalogRevision++;
	            this.modelCatalog = [];
	            this.availableModels = [];
	            const trimmedValue = (_a = value === null || value === void 0 ? void 0 : value.trim()) !== null && _a !== void 0 ? _a : '';
	            this.hasApiKey = Boolean(trimmedValue);
	            this.isApiKeyValidated = false;
	            this.isApiKeyInvalid = false;
	            if (this.validateDebounceTimer) {
	                clearTimeout(this.validateDebounceTimer);
	                this.validateDebounceTimer = null;
	            }
	            if (this.hasApiKey) {
	                this.validateDebounceTimer = setTimeout(() => {
	                    this.fetchOrValidate();
	                }, 500);
	            }
	            else {
	                await this.clearAndResetConfig();
	            }
	        }
	        this.requestUpdate();
	        await this.saveConfiguration();
	    }
	    get reasoningLevels() {
	        var _a;
	        return ((_a = this.modelCatalog.find(model => model.id === this.formData.model)) === null || _a === void 0 ? void 0 : _a.reasoning_levels) || [];
	    }
	    normalizeReasoning() {
	        const levels = this.reasoningLevels;
	        if (levels.length && !levels.some(level => level.key === this.formData.reasoning)) {
	            this.formData = Object.assign(Object.assign({}, this.formData), { reasoning: levels[0].key });
	        }
	    }
	    async saveConfiguration() {
	        var _a;
	        const validationResult = Config.safeParse(this.formData);
	        if (!validationResult.success) {
	            return;
	        }
	        const { apiKey, model, reasoning, cursor, fillOnClick, context, credits } = validationResult.data;
	        try {
	            const storageSnapshot = (await browser.storage.local.get(['quizSolver']));
	            if (apiKey !== this.formData.apiKey)
	                return;
	            const nextConfig = Object.assign(Object.assign({}, ((_a = storageSnapshot.quizSolver) !== null && _a !== void 0 ? _a : {})), { apiKey,
	                model,
	                reasoning,
	                cursor,
	                fillOnClick,
	                context,
	                credits });
	            await browser.storage.local.set({
	                quizSolver: nextConfig
	            });
	        }
	        catch (error) {
	            console.error('Failed to save configuration:', error);
	        }
	    }
	    /**
	     * Resets config values to defaults while preserving the API key.
	     * Also clears cached models.
	     */
	    async clearAndResetConfig() {
	        const currentApiKey = this.formData.apiKey;
	        this.formData = Object.assign(Object.assign({}, this.DEFAULT_FORM_DATA), { apiKey: currentApiKey });
	        this.availableModels = [];
	        this.modelCatalog = [];
	        this.catalogRevision++;
	        this.credits = undefined;
	        this.hasApiKey = Boolean(currentApiKey === null || currentApiKey === void 0 ? void 0 : currentApiKey.trim());
	        this.isApiKeyValidated = false;
	        try {
	            await browser.storage.local.set({
	                quizSolver: {
	                    apiKey: currentApiKey,
	                    model: '',
	                    reasoning: 'low',
	                    cursor: true,
	                    fillOnClick: false,
	                    context: ''
	                }
	            });
	        }
	        catch (error) {
	            console.error('Failed to reset configuration:', error);
	        }
	        this.requestUpdate();
	    }
	    render() {
	        var _a;
	        return x `
      <div id="alert-container" style="min-height: 0; margin: 0; padding: 0;">
        <alert-container></alert-container>
      </div>

      <form novalidate>
        ${this.hasApiKey && this.isApiKeyValidated
            ? x `
              <div class="card mb-3 border-primary">
                <div class="card-body d-flex justify-content-between align-items-center py-2">
                  <div>
                    <div class="d-flex align-items-baseline gap-2">
                      <p class="display-6 mb-0 fw-bold">${this.credits}</p>
                      <span class="text-muted text-uppercase small fw-semibold tracking-wider">Credits</span>
                    </div>
                  </div>
                  <a
                    href="${BACKEND_URL}/billing/checkout/"
                    target="_blank"
                    class="btn btn btn-primary"
                  >
                    Top-up <i class="fa-solid fa-bolt me-1"></i>
                  </a>
                </div>
              </div>
            `
            : this.isApiKeyInvalid
                ? x `
              <div class="card mb-3 border-danger">
                <div class="card-body d-flex justify-content-between align-items-center py-2">
                  <div>
                    <p class="mb-1 fw-bold">Invalid API key</p>
                    <p class="mb-0 small text-muted">Regenerate your API key.</p>
                  </div>
                  <div class="d-flex gap-2 flex-shrink-0">
                    <a
                      href="${BACKEND_URL}/dashboard/"
                      target="_blank"
                      class="btn btn-danger"
                    >
                      Regenerate
                    </a>
                  </div>
                </div>
              </div>
            `
                : !this.hasApiKey
                    ? x `
              <div class="card mb-3 border-warning">
                <div class="card-body d-flex justify-content-between align-items-center py-2">
                  <div>
                    <p class="mb-1 fw-bold">No API Key</p>
                    <p class="mb-0 small text-muted">Register to get started.</p>
                  </div>
                  <div class="d-flex gap-2 flex-shrink-0">
                    <a
                      href="${BACKEND_URL}"
                      target="_blank"
                      class="btn btn-warning"
                    >
                      Register
                    </a>
                  </div>
                </div>
              </div>
            `
                    : ''}

        <div class="mb-3">
          <label for="apiKey" class="form-label"
            >API Key <span class="text-danger">*</span></label
          >
          <input
            type="password"
            class="form-control"
            id="apiKey"
            .value=${this.formData.apiKey}
            @input=${(e) => this.updateFormData('apiKey', e.target.value)}
            required
          />
        </div>

        <div class="mb-3">
          <label for="model" class="form-label">Model <span class="text-danger">*</span></label>
          <select
            class="form-select"
            id="model"
            @change=${(e) => this.updateFormData('model', e.target.value)}
            required
            ?disabled=${this.isLoadingModels || !this.isApiKeyValidated}
          >
            <option value="">Select a model</option>
            ${this.availableModels.map(model => x `<option value=${model.name} ?selected=${this.formData.model === model.name}>
                  ${model.label}
                </option>`)}
          </select>
        </div>

        <div class="mb-3">
          <label for="reasoning" class="form-label"
            >Reasoning <span class="text-danger">*</span></label
          >
          <select
            class="form-select"
            id="reasoning"
            ?disabled=${!this.isApiKeyValidated}
            @change=${(e) => this.updateFormData('reasoning', e.target.value)}
            required
          >
            ${this.reasoningLevels.map(level => x `<option value=${level.key} ?selected=${this.formData.reasoning === level.key}>${level.label}</option>`)}
          </select>
        </div>

        <div class="mb-4">
          <label for="context" class="form-label">Context</label>
          <textarea
            class="form-control"
            id="context"
            rows="3"
            ?disabled=${!this.isApiKeyValidated}
            .value=${(_a = this.formData.context) !== null && _a !== void 0 ? _a : ''}
            @input=${(e) => this.updateFormData('context', e.target.value)}
          ></textarea>
        </div>

        <div class="mb-4">
          <div class="d-flex align-items-center mb-3">
            <i class="fa-solid fa-gear me-2"></i>
            <h6 class="mb-0">Options</h6>
          </div>

          <div class="form-check mb-2">
            <div class="d-flex align-items-center">
              <input
                class="form-check-input mt-0"
                type="checkbox"
                id="cursor"
                ?disabled=${!this.isApiKeyValidated}
                ?checked=${this.formData.cursor}
                @change=${(e) => this.updateFormData('cursor', e.target.checked)}
              />
              <label class="form-check-label ms-2" for="cursor">Show loading cursor</label>
            </div>
            <div class="form-text mt-0" style="font-size: 0.75rem; ${!this.isApiKeyValidated ? 'opacity: 0.5' : ''}">
              Changes the cursor to a spinner while the AI is thinking.
            </div>
          </div>

          <div class="form-check mb-2">
            <div class="d-flex align-items-center">
              <input
                class="form-check-input mt-0"
                type="checkbox"
                id="fillOnClick"
                ?disabled=${!this.isApiKeyValidated}
                ?checked=${this.formData.fillOnClick}
                @change=${(e) => this.updateFormData('fillOnClick', e.target.checked)}
              />
              <label class="form-check-label ms-2" for="fillOnClick">Fill answer on click</label>
            </div>
            <div class="form-text mt-0" style="font-size: 0.75rem; ${!this.isApiKeyValidated ? 'opacity: 0.5' : ''}">
              Require a click to fill the answer after AI generates it.
            </div>
          </div>
        </div>
      </form>
    `;
	    }
	};
	__decorate([
	    r()
	], ConfigPopup.prototype, "formData", void 0);
	__decorate([
	    r()
	], ConfigPopup.prototype, "hasApiKey", void 0);
	__decorate([
	    r()
	], ConfigPopup.prototype, "isApiKeyValidated", void 0);
	__decorate([
	    r()
	], ConfigPopup.prototype, "isApiKeyInvalid", void 0);
	__decorate([
	    r()
	], ConfigPopup.prototype, "availableModels", void 0);
	__decorate([
	    r()
	], ConfigPopup.prototype, "modelCatalog", void 0);
	__decorate([
	    r()
	], ConfigPopup.prototype, "isLoadingModels", void 0);
	__decorate([
	    r()
	], ConfigPopup.prototype, "credits", void 0);
	ConfigPopup = __decorate([
	    t('config-popup')
	], ConfigPopup);

}));
//# sourceMappingURL=popup.js.map
