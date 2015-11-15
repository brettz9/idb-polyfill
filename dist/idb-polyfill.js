(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.idbPolyfill = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/aleksey/.nvm/versions/node/v5.0.0/lib/node_modules/browserify/node_modules/process/browser.js":[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],"/Users/aleksey/code/treojs/fakeIndexedDB/node_modules/array.prototype.find/index.js":[function(require,module,exports){
// Array.prototype.find - MIT License (c) 2013 Paul Miller <http://paulmillr.com>
// For all details and docs: https://github.com/paulmillr/array.prototype.find
// Fixes and tests supplied by Duncan Hall <http://duncanhall.net> 
(function(globals){
  if (Array.prototype.find) return;

  var find = function(predicate) {
    var list = Object(this);
    var length = list.length < 0 ? 0 : list.length >>> 0; // ES.ToUint32;
    if (length === 0) return undefined;
    if (typeof predicate !== 'function' || Object.prototype.toString.call(predicate) !== '[object Function]') {
      throw new TypeError('Array#find: predicate must be a function');
    }
    var thisArg = arguments[1];
    for (var i = 0, value; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) return value;
    }
    return undefined;
  };

  if (Object.defineProperty) {
    try {
      Object.defineProperty(Array.prototype, 'find', {
        value: find, configurable: true, enumerable: false, writable: true
      });
    } catch(e) {}
  }

  if (!Array.prototype.find) {
    Array.prototype.find = find;
  }
})(this);

},{}],"/Users/aleksey/code/treojs/fakeIndexedDB/node_modules/array.prototype.findindex/index.js":[function(require,module,exports){
// Array.prototype.findIndex - MIT License (c) 2013 Paul Miller <http://paulmillr.com>
// For all details and docs: <https://github.com/paulmillr/Array.prototype.findIndex>
(function (globals) {
  if (Array.prototype.findIndex) return;

  var findIndex = function(predicate) {
    var list = Object(this);
    var length = Math.max(0, list.length) >>> 0; // ES.ToUint32;
    if (length === 0) return -1;
    if (typeof predicate !== 'function' || Object.prototype.toString.call(predicate) !== '[object Function]') {
      throw new TypeError('Array#findIndex: predicate must be a function');
    }
    var thisArg = arguments.length > 1 ? arguments[1] : undefined;
    for (var i = 0; i < length; i++) {
      if (predicate.call(thisArg, list[i], i, list)) return i;
    }
    return -1;
  };

  if (Object.defineProperty) {
    try {
      Object.defineProperty(Array.prototype, 'findIndex', {
        value: findIndex, configurable: true, writable: true
      });
    } catch(e) {}
  }

  if (!Array.prototype.findIndex) {
    Array.prototype.findIndex = findIndex;
  }
}(this));

},{}],"/Users/aleksey/code/treojs/fakeIndexedDB/node_modules/deets/index.js":[function(require,module,exports){
/**
 * Get browser info. Name, version, size, etc.
 *
 * @return {Object}
 * @api public
 */

module.exports = function() {
  var result = {}, agent = parse();
  result.userAgent = navigator.userAgent;
  for (var key in agent) result[key] = agent[key];
  result.size = size();
  return result;
}

/**
 * Parses user agent for version and name.
 *
 * @return {Object}
 * @api private
 */

function parse() {
  var name, fullVersion, majorVersion, offset, nameOffset, idx;
  var userAgent = navigator.userAgent;

  // In Opera 15+, the true version is after "OPR/"
  if ((offset = userAgent.indexOf("OPR/")) != -1) {
    name = "Opera";
    fullVersion = userAgent.substring(offset + 4);
  }
  // In older Opera, the true version is after "Opera" or after "Version"
  else if ((offset = userAgent.indexOf("Opera")) != -1) {
    name = "Opera";
    fullVersion = userAgent.substring(offset + 6);
    if ((offset = userAgent.indexOf("Version")) != -1)
      fullVersion = userAgent.substring(offset + 8);
  }
  // In MSIE, the true version is after "MSIE" in userAgent
  else if ((offset = userAgent.indexOf("MSIE")) != -1) {
    name = "Microsoft Internet Explorer";
    fullVersion = userAgent.substring(offset + 5);
  }
  // In Chrome, the true version is after "Chrome"
  else if ((offset = userAgent.indexOf("Chrome")) != -1) {
    name = "Chrome";
    fullVersion = userAgent.substring(offset + 7);
  }
  // In Safari, the true version is after "Safari" or after "Version"
  else if ((offset = userAgent.indexOf("Safari")) != -1) {
    name = "Safari";
    fullVersion = userAgent.substring(offset + 7);
    if ((offset = userAgent.indexOf("Version")) != -1)
      fullVersion = userAgent.substring(offset + 8);
  }
  // In Firefox, the true version is after "Firefox"
  else if ((offset = userAgent.indexOf("Firefox")) != -1) {
    name = "Firefox";
    fullVersion = userAgent.substring(offset + 8);
  }
  // In most other browsers, "name/version" is at the end of userAgent
  else if ((nameOffset = userAgent.lastIndexOf(' ') + 1) <
    (offset = userAgent.lastIndexOf('/'))) {
    name = userAgent.substring(nameOffset, offset);
    fullVersion = userAgent.substring(offset + 1);
    if (name.toLowerCase() == name.toUpperCase()) {
      name = navigator.appName;
    }
  }

  // trim the version string at semicolon/space if present
  if ((idx = fullVersion.indexOf(";")) != -1)
    fullVersion = fullVersion.substring(0, idx);
  if ((idx = fullVersion.indexOf(" ")) != -1)
    fullVersion = fullVersion.substring(0, idx);

  majorVersion = parseInt('' + fullVersion, 10);
  if (isNaN(majorVersion)) {
    fullVersion = '' + parseFloat(navigator.appVersion);
    majorVersion = parseInt(navigator.appVersion, 10);
  }

  return {
    name: name,
    version: {
      full: fullVersion,
      major: majorVersion
    }
  };
}

/**
 * Return size of browser.
 *
 * @return {Object}
 * @api private
 */

function size() {
  return {
    height: height(),
    width: width()
  };
}

/**
 * Return width of browser.
 *
 * @return {Number}
 * @api private
 */

function width() {
  return window.innerWidth
  || document.documentElement.clientWidth
  || document.body.clientWidth;
}

/**
 * Return height of browser.
 *
 * @return {Number}
 * @api private
 */

function height() {
  return window.innerHeight
  || document.documentElement.clientHeight
  || document.body.clientHeight;
}

},{}],"/Users/aleksey/code/treojs/fakeIndexedDB/node_modules/inherits/inherits_browser.js":[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],"/Users/aleksey/code/treojs/fakeIndexedDB/node_modules/is-finite/index.js":[function(require,module,exports){
'use strict';
var numberIsNan = require('number-is-nan');

module.exports = Number.isFinite || function (val) {
	return !(typeof val !== 'number' || numberIsNan(val) || val === Infinity || val === -Infinity);
};

},{"number-is-nan":"/Users/aleksey/code/treojs/fakeIndexedDB/node_modules/number-is-nan/index.js"}],"/Users/aleksey/code/treojs/fakeIndexedDB/node_modules/is-integer/index.js":[function(require,module,exports){
// https://github.com/paulmillr/es6-shim
// http://people.mozilla.org/~jorendorff/es6-draft.html#sec-number.isinteger
var isFinite = require("is-finite");
module.exports = Number.isInteger || function(val) {
  return typeof val === "number" &&
    isFinite(val) &&
    Math.floor(val) === val;
};

},{"is-finite":"/Users/aleksey/code/treojs/fakeIndexedDB/node_modules/is-finite/index.js"}],"/Users/aleksey/code/treojs/fakeIndexedDB/node_modules/is-plain-obj/index.js":[function(require,module,exports){
'use strict';
var toString = Object.prototype.toString;

module.exports = function (x) {
	var prototype;
	return toString.call(x) === '[object Object]' && (prototype = Object.getPrototypeOf(x), prototype === null || prototype === Object.getPrototypeOf({}));
};

},{}],"/Users/aleksey/code/treojs/fakeIndexedDB/node_modules/number-is-nan/index.js":[function(require,module,exports){
'use strict';
module.exports = Number.isNaN || function (x) {
	return x !== x;
};

},{}],"/Users/aleksey/code/treojs/fakeIndexedDB/node_modules/object-values/index.js":[function(require,module,exports){
'use strict';
module.exports = function (obj) {
	var keys = Object.keys(obj);
	var ret = [];

	for (var i = 0; i < keys.length; i++) {
		ret.push(obj[keys[i]]);
	}

	return ret;
};

},{}],"/Users/aleksey/code/treojs/fakeIndexedDB/node_modules/polyfill-function-prototype-bind/bind.js":[function(require,module,exports){
// Taken from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
if (!Function.prototype.bind) {
  Function.prototype.bind = function (oThis) {
    if (typeof this !== "function") {
      // closest thing possible to the ECMAScript 5
      // internal IsCallable function
      throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
    }

    var aArgs = Array.prototype.slice.call(arguments, 1), 
        fToBind = this, 
        fNOP = function () {},
        fBound = function () {
          return fToBind.apply(this instanceof fNOP && oThis
                 ? this
                 : oThis,
                 aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();

    return fBound;
  };
}

},{}],"/Users/aleksey/code/treojs/fakeIndexedDB/node_modules/setimmediate/setImmediate.js":[function(require,module,exports){
(function (process,global){
(function (global, undefined) {
    "use strict";

    if (global.setImmediate) {
        return;
    }

    var nextHandle = 1; // Spec says greater than zero
    var tasksByHandle = {};
    var currentlyRunningATask = false;
    var doc = global.document;
    var setImmediate;

    function addFromSetImmediateArguments(args) {
        tasksByHandle[nextHandle] = partiallyApplied.apply(undefined, args);
        return nextHandle++;
    }

    // This function accepts the same arguments as setImmediate, but
    // returns a function that requires no arguments.
    function partiallyApplied(handler) {
        var args = [].slice.call(arguments, 1);
        return function() {
            if (typeof handler === "function") {
                handler.apply(undefined, args);
            } else {
                (new Function("" + handler))();
            }
        };
    }

    function runIfPresent(handle) {
        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
        // So if we're currently running a task, we'll need to delay this invocation.
        if (currentlyRunningATask) {
            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
            // "too much recursion" error.
            setTimeout(partiallyApplied(runIfPresent, handle), 0);
        } else {
            var task = tasksByHandle[handle];
            if (task) {
                currentlyRunningATask = true;
                try {
                    task();
                } finally {
                    clearImmediate(handle);
                    currentlyRunningATask = false;
                }
            }
        }
    }

    function clearImmediate(handle) {
        delete tasksByHandle[handle];
    }

    function installNextTickImplementation() {
        setImmediate = function() {
            var handle = addFromSetImmediateArguments(arguments);
            process.nextTick(partiallyApplied(runIfPresent, handle));
            return handle;
        };
    }

    function canUsePostMessage() {
        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
        // where `global.postMessage` means something completely different and can't be used for this purpose.
        if (global.postMessage && !global.importScripts) {
            var postMessageIsAsynchronous = true;
            var oldOnMessage = global.onmessage;
            global.onmessage = function() {
                postMessageIsAsynchronous = false;
            };
            global.postMessage("", "*");
            global.onmessage = oldOnMessage;
            return postMessageIsAsynchronous;
        }
    }

    function installPostMessageImplementation() {
        // Installs an event handler on `global` for the `message` event: see
        // * https://developer.mozilla.org/en/DOM/window.postMessage
        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

        var messagePrefix = "setImmediate$" + Math.random() + "$";
        var onGlobalMessage = function(event) {
            if (event.source === global &&
                typeof event.data === "string" &&
                event.data.indexOf(messagePrefix) === 0) {
                runIfPresent(+event.data.slice(messagePrefix.length));
            }
        };

        if (global.addEventListener) {
            global.addEventListener("message", onGlobalMessage, false);
        } else {
            global.attachEvent("onmessage", onGlobalMessage);
        }

        setImmediate = function() {
            var handle = addFromSetImmediateArguments(arguments);
            global.postMessage(messagePrefix + handle, "*");
            return handle;
        };
    }

    function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function(event) {
            var handle = event.data;
            runIfPresent(handle);
        };

        setImmediate = function() {
            var handle = addFromSetImmediateArguments(arguments);
            channel.port2.postMessage(handle);
            return handle;
        };
    }

    function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        setImmediate = function() {
            var handle = addFromSetImmediateArguments(arguments);
            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
            var script = doc.createElement("script");
            script.onreadystatechange = function () {
                runIfPresent(handle);
                script.onreadystatechange = null;
                html.removeChild(script);
                script = null;
            };
            html.appendChild(script);
            return handle;
        };
    }

    function installSetTimeoutImplementation() {
        setImmediate = function() {
            var handle = addFromSetImmediateArguments(arguments);
            setTimeout(partiallyApplied(runIfPresent, handle), 0);
            return handle;
        };
    }

    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

    // Don't get fooled by e.g. browserify environments.
    if ({}.toString.call(global.process) === "[object process]") {
        // For Node.js before 0.9
        installNextTickImplementation();

    } else if (canUsePostMessage()) {
        // For non-IE10 modern browsers
        installPostMessageImplementation();

    } else if (global.MessageChannel) {
        // For web workers, where supported
        installMessageChannelImplementation();

    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
        // For IE 6–8
        installReadyStateChangeImplementation();

    } else {
        // For older browsers
        installSetTimeoutImplementation();
    }

    attachTo.setImmediate = setImmediate;
    attachTo.clearImmediate = clearImmediate;
}(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self));

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"_process":"/Users/aleksey/.nvm/versions/node/v5.0.0/lib/node_modules/browserify/node_modules/process/browser.js"}],"/Users/aleksey/code/treojs/fakeIndexedDB/src/Database.js":[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#dfn-database
module.exports = (function () {
  function Database(name, version) {
    _classCallCheck(this, Database);

    this.deletePending = false;
    this.transactions = [];
    this.rawObjectStores = {};
    this.connections = [];

    this.name = name;
    this.version = version;
  }

  _createClass(Database, [{
    key: 'processTransactions',
    value: function processTransactions() {
      var _this = this;

      setImmediate(function () {
        var anyRunning = _this.transactions.some(function (transaction) {
          return transaction._started && !transaction._finished;
        });

        if (!anyRunning) {
          var next = _this.transactions.find(function (transaction) {
            return !transaction._started && !transaction._finished;
          });

          if (next) {
            next._start();
            next.addEventListener('complete', _this.processTransactions.bind(_this));
            next.addEventListener('abort', _this.processTransactions.bind(_this));
          }
        }
      });
    }
  }]);

  return Database;
})();

},{}],"/Users/aleksey/code/treojs/fakeIndexedDB/src/Event.js":[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

module.exports = (function () {
  function Event(type, eventInitDict) {
    _classCallCheck(this, Event);

    this._eventPath = [];

    // Flags
    this._stopPropagation = false;
    this._stopImmediatePropagation = false;
    this._canceled = false;
    this._initialized = true;
    this._dispatch = false;

    this.type = type;
    this.target = null;
    this.currentTarget = null;

    this.NONE = 0;
    this.CAPTURING_PHASE = 1;
    this.AT_TARGET = 2;
    this.BUBBLING_PHASE = 3;
    this.eventPhase = this.NONE;

    eventInitDict = eventInitDict !== undefined ? eventInitDict : {};
    this.bubbles = eventInitDict.bubbles !== undefined ? eventInitDict.bubbles : false;
    this.cancelable = eventInitDict.cancelable !== undefined ? eventInitDict.cancelable : false;
    this.defaultPrevented = false;
    this.isTrusted = false;
    this.timestamp = Date.now();
  }

  _createClass(Event, [{
    key: "stopPropagation",
    value: function stopPropagation() {
      this._stopPropagation = true;
    }
  }, {
    key: "stopImmediatePropagation",
    value: function stopImmediatePropagation() {
      this._stopPropagation = true;
      this._stopImmediatePropagation = true;
    }
  }, {
    key: "preventDefault",
    value: function preventDefault() {
      if (this.cancelable) {
        this._canceled = true;
      }
    }
  }]);

  return Event;
})();

},{}],"/Users/aleksey/code/treojs/fakeIndexedDB/src/EventTarget.js":[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _InvalidStateError = require('./errors/InvalidStateError');

var _InvalidStateError2 = _interopRequireDefault(_InvalidStateError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

module.exports = (function () {
  function EventTarget() {
    _classCallCheck(this, EventTarget);

    this._listeners = [];
  }

  _createClass(EventTarget, [{
    key: 'addEventListener',
    value: function addEventListener(type, callback) {
      var capture = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

      if (callback === null) return;
      this._listeners.push({ type: type, callback: callback, capture: capture });
    }
  }, {
    key: 'removeEventListener',
    value: function removeEventListener(type, callback) {
      var capture = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

      var i = this._listeners.findIndex(function (listener) {
        return listener.type === type && listener.callback === callback && listener.capture === capture;
      });
      this._listeners.splice(i, 1);
    }

    // http://www.w3.org/TR/dom/#dispatching-events

  }, {
    key: 'dispatchEvent',
    value: function dispatchEvent(event) {
      if (event._dispatch || !event._initialized) {
        throw new _InvalidStateError2.default('The object is in an invalid state.');
      }
      event._isTrusted = false;

      event._dispatch = true;
      event.target = this;
      // NOT SURE WHEN THIS SHOULD BE SET        event._eventPath = []

      event.eventPhase = event.CAPTURING_PHASE;
      event._eventPath.forEach(function (obj) {
        if (!event._stopPropagation) {
          invokeEventListeners(event, obj);
        }
      });

      event.eventPhase = event.AT_TARGET;
      if (!event._stopPropagation) {
        invokeEventListeners(event, event.target);
      }

      if (event.bubbles) {
        event._eventPath.reverse();
        event.eventPhase = event.BUBBLING_PHASE;
        event._eventPath.forEach(function (obj) {
          if (!event._stopPropagation) {
            invokeEventListeners(event, obj);
          }
        });
      }

      event._dispatch = false;
      event.eventPhase = event.NONE;
      event.currentTarget = null;

      if (event._canceled) return false;
      return true;
    }
  }]);

  return EventTarget;
})();

function stop(event, listener) {
  return event._stopImmediatePropagation || event.eventPhase === event.CAPTURING_PHASE && listener.capture === false || event.eventPhase === event.BUBBLING_PHASE && listener.capture === true;
}

// http://www.w3.org/TR/dom/#concept-event-listener-invoke
function invokeEventListeners(event, obj) {
  event.currentTarget = obj;

  obj._listeners.forEach(function (listener) {
    if (event.type !== listener.type || stop(event, listener)) return;
    listener.callback.call(event.currentTarget, event);
  });

  if (event.currentTarget['on' + event.type]) {
    var listener = {
      type: event.type,
      callback: event.currentTarget['on' + event.type],
      capture: false
    };
    if (stop(event, listener)) return;
    listener.callback.call(event.currentTarget, event);
  }
}

},{"./errors/InvalidStateError":"/Users/aleksey/code/treojs/fakeIndexedDB/src/errors/InvalidStateError.js"}],"/Users/aleksey/code/treojs/fakeIndexedDB/src/FDBCursor.js":[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _isInteger = require('is-integer');

var _isInteger2 = _interopRequireDefault(_isInteger);

var _structuredClone = require('./structuredClone');

var _structuredClone2 = _interopRequireDefault(_structuredClone);

var _FDBKeyRange = require('./FDBKeyRange');

var _FDBKeyRange2 = _interopRequireDefault(_FDBKeyRange);

var _DataError = require('./errors/DataError');

var _DataError2 = _interopRequireDefault(_DataError);

var _InvalidStateError = require('./errors/InvalidStateError');

var _InvalidStateError2 = _interopRequireDefault(_InvalidStateError);

var _ReadOnlyError = require('./errors/ReadOnlyError');

var _ReadOnlyError2 = _interopRequireDefault(_ReadOnlyError);

var _TransactionInactiveError = require('./errors/TransactionInactiveError');

var _TransactionInactiveError2 = _interopRequireDefault(_TransactionInactiveError);

var _cmp = require('./cmp');

var _cmp2 = _interopRequireDefault(_cmp);

var _extractKey = require('./extractKey');

var _extractKey2 = _interopRequireDefault(_extractKey);

var _validateKey = require('./validateKey');

var _validateKey2 = _interopRequireDefault(_validateKey);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#cursor
module.exports = (function () {
  function FDBCursor(source, range, direction, request) {
    _classCallCheck(this, FDBCursor);

    this._gotValue = false;
    this._range = range;
    this._position = undefined; // Key of previously returned record
    this._objectStorePosition = undefined;
    this._request = request;

    // readonly properties
    this._ro = {
      source: source,
      direction: direction !== undefined ? direction : 'next',
      key: undefined,
      primaryKey: undefined
    };

    Object.defineProperty(this, 'source', {
      get: function get() {
        return this._ro.source;
      },
      set: function set() {}
    });
    Object.defineProperty(this, 'direction', {
      get: function get() {
        return this._ro.direction;
      },
      set: function set() {}
    });
    Object.defineProperty(this, 'key', {
      get: function get() {
        return this._ro.key;
      },
      set: function set() {}
    });
    Object.defineProperty(this, 'primaryKey', {
      get: function get() {
        return this._ro.primaryKey;
      },
      set: function set() {}
    });
  }

  // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#dfn-steps-for-iterating-a-cursor

  _createClass(FDBCursor, [{
    key: '_iterate',
    value: function _iterate(key) {
      var _this = this;

      var sourceIsObjectStore = !this.source.hasOwnProperty('_rawIndex');
      var records = undefined;

      if (sourceIsObjectStore) {
        records = this.source._rawObjectStore.records;
      } else {
        records = this.source._rawIndex.records;
      }

      var foundRecord = undefined;
      if (this.direction === 'next') {
        foundRecord = records.find(function (record) {
          if (key !== undefined) {
            if ((0, _cmp2.default)(record.key, key) === -1) {
              return false;
            }
          }
          if (_this._position !== undefined && sourceIsObjectStore) {
            if ((0, _cmp2.default)(record.key, _this._position) !== 1) {
              return false;
            }
          }
          if (_this._position !== undefined && !sourceIsObjectStore) {
            var cmpResult = (0, _cmp2.default)(record.key, _this._position);
            if (cmpResult === -1) {
              return false;
            }
            if (cmpResult === 0 && (0, _cmp2.default)(record.value, _this._objectStorePosition) !== 1) {
              return false;
            }
          }
          if (_this._range !== undefined) {
            if (!_FDBKeyRange2.default.check(_this._range, record.key)) {
              return false;
            }
          }
          return true;
        });
      } else if (this.direction === 'nextunique') {
        foundRecord = records.find(function (record) {
          if (key !== undefined) {
            if ((0, _cmp2.default)(record.key, key) === -1) {
              return false;
            }
          }
          if (_this._position !== undefined) {
            if ((0, _cmp2.default)(record.key, _this._position) !== 1) {
              return false;
            }
          }
          if (_this._range !== undefined) {
            if (!_FDBKeyRange2.default.check(_this._range, record.key)) {
              return false;
            }
          }
          return true;
        });
      } else if (this.direction === 'prev') {
        foundRecord = records.reverse().find(function (record) {
          if (key !== undefined) {
            if ((0, _cmp2.default)(record.key, key) === 1) {
              return false;
            }
          }
          if (_this._position !== undefined && sourceIsObjectStore) {
            if ((0, _cmp2.default)(record.key, _this._position) !== -1) {
              return false;
            }
          }
          if (_this._position !== undefined && !sourceIsObjectStore) {
            var cmpResult = (0, _cmp2.default)(record.key, _this._position);
            if (cmpResult === 1) {
              return false;
            }
            if (cmpResult === 0 && (0, _cmp2.default)(record.value, _this._objectStorePosition) !== -1) {
              return false;
            }
          }
          if (_this._range !== undefined) {
            if (!_FDBKeyRange2.default.check(_this._range, record.key)) {
              return false;
            }
          }
          return true;
        });
        records.reverse();
      } else if (this.direction === 'prevunique') {
        (function () {
          var tempRecord = records.reverse().find(function (record) {
            if (key !== undefined) {
              if ((0, _cmp2.default)(record.key, key) === 1) {
                return false;
              }
            }
            if (_this._position !== undefined) {
              if ((0, _cmp2.default)(record.key, _this._position) !== -1) {
                return false;
              }
            }
            if (_this._range !== undefined) {
              if (!_FDBKeyRange2.default.check(_this._range, record.key)) {
                return false;
              }
            }
            return true;
          });
          records.reverse();

          if (tempRecord) {
            foundRecord = records.find(function (record) {
              return (0, _cmp2.default)(record.key, tempRecord.key) === 0;
            });
          }
        })();
      }

      var result = undefined;
      if (!foundRecord) {
        this._ro.key = undefined;
        if (!sourceIsObjectStore) {
          this._objectStorePosition = undefined;
        }
        this.value = undefined;
        result = null;
      } else {
        this._position = foundRecord.key;
        if (!sourceIsObjectStore) {
          this._objectStorePosition = foundRecord.value;
        }
        this._ro.key = foundRecord.key;
        if (sourceIsObjectStore) {
          this.value = (0, _structuredClone2.default)(foundRecord.value);
        } else {
          this.value = (0, _structuredClone2.default)(this.source.objectStore._rawObjectStore.getValue(foundRecord.value));
          this._ro.primaryKey = (0, _structuredClone2.default)(foundRecord.value);
        }
        this._gotValue = true;
        result = this;
      }

      return result;
    }

    // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#widl-IDBCursor-update-IDBRequest-any-value

  }, {
    key: 'update',
    value: function update(value) {
      if (value === undefined) {
        throw new TypeError();
      }

      var effectiveObjectStore = getEffectiveObjectStore(this);
      var effectiveKey = this.source.hasOwnProperty('_rawIndex') ? this.primaryKey : this._position;
      var transaction = effectiveObjectStore.transaction;

      if (transaction.mode === 'readonly') {
        throw new _ReadOnlyError2.default();
      }

      if (!transaction._active) {
        throw new _TransactionInactiveError2.default();
      }

      if (effectiveObjectStore._rawObjectStore.deleted) {
        throw new _InvalidStateError2.default();
      }

      if (!this._gotValue || !this.hasOwnProperty('value')) {
        throw new _InvalidStateError2.default();
      }

      if (effectiveObjectStore.keyPath !== null) {
        var tempKey = undefined;

        try {
          tempKey = (0, _extractKey2.default)(effectiveObjectStore.keyPath, value);
        } catch (err) {/* Handled immediately below */}

        if (tempKey !== effectiveKey) {
          throw new _DataError2.default();
        }
      }

      var record = {
        key: effectiveKey,
        value: (0, _structuredClone2.default)(value)
      };

      return transaction._execRequestAsync({
        source: this,
        operation: effectiveObjectStore._rawObjectStore.storeRecord.bind(effectiveObjectStore._rawObjectStore, record, false, transaction._rollbackLog)
      });
    }

    // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#widl-IDBCursor-advance-void-unsigned-long-count

  }, {
    key: 'advance',
    value: function advance(count) {
      var _this2 = this;

      if (!(0, _isInteger2.default)(count) || count <= 0) {
        throw new TypeError();
      }

      var effectiveObjectStore = getEffectiveObjectStore(this);
      var transaction = effectiveObjectStore.transaction;

      if (!transaction._active) {
        throw new _TransactionInactiveError2.default();
      }

      if (effectiveObjectStore._rawObjectStore.deleted) {
        throw new _InvalidStateError2.default();
      }

      if (!this._gotValue) {
        throw new _InvalidStateError2.default();
      }

      this._request.readyState = 'pending';
      transaction._execRequestAsync({
        source: this.source,
        operation: function operation() {
          var result = undefined;
          for (var i = 0; i < count; i++) {
            result = _this2._iterate();

            // Not sure why this is needed
            if (!result) {
              break;
            }
          }
          return result;
        },
        request: this._request
      });

      this._gotValue = false;
    }

    // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#widl-IDBCursor-continue-void-any-key

  }, {
    key: 'continue',
    value: function _continue(key) {
      var effectiveObjectStore = getEffectiveObjectStore(this);
      var transaction = effectiveObjectStore.transaction;

      if (!transaction._active) {
        throw new _TransactionInactiveError2.default();
      }

      if (effectiveObjectStore._rawObjectStore.deleted) {
        throw new _InvalidStateError2.default();
      }

      if (!this._gotValue) {
        throw new _InvalidStateError2.default();
      }

      if (key !== undefined) {
        (0, _validateKey2.default)(key);
        var cmpResult = (0, _cmp2.default)(key, this._position);
        if (cmpResult <= 0 && (this.direction === 'next' || this.direction === 'nextunique') || cmpResult >= 0 && (this.direction === 'prev' || this.direction === 'prevunique')) {
          throw new _DataError2.default();
        }
      }

      this._request.readyState = 'pending';
      transaction._execRequestAsync({
        source: this.source,
        operation: this._iterate.bind(this, key),
        request: this._request
      });

      this._gotValue = false;
    }
  }, {
    key: 'delete',
    value: function _delete() {
      var effectiveObjectStore = getEffectiveObjectStore(this);
      var effectiveKey = this.source.hasOwnProperty('_rawIndex') ? this.primaryKey : this._position;
      var transaction = effectiveObjectStore.transaction;

      if (transaction.mode === 'readonly') {
        throw new _ReadOnlyError2.default();
      }

      if (!transaction._active) {
        throw new _TransactionInactiveError2.default();
      }

      if (effectiveObjectStore._rawObjectStore.deleted) {
        throw new _InvalidStateError2.default();
      }

      if (!this._gotValue || !this.hasOwnProperty('value')) {
        throw new _InvalidStateError2.default();
      }

      return transaction._execRequestAsync({
        source: this,
        operation: effectiveObjectStore._rawObjectStore.deleteRecord.bind(effectiveObjectStore._rawObjectStore, effectiveKey, transaction._rollbackLog)
      });
    }
  }, {
    key: 'toString',
    value: function toString() {
      return '[object IDBCursor]';
    }
  }]);

  return FDBCursor;
})();

function getEffectiveObjectStore(cursor) {
  if (cursor.source.hasOwnProperty('_rawIndex')) {
    return cursor.source.objectStore;
  }
  return cursor.source;
}

},{"./FDBKeyRange":"/Users/aleksey/code/treojs/fakeIndexedDB/src/FDBKeyRange.js","./cmp":"/Users/aleksey/code/treojs/fakeIndexedDB/src/cmp.js","./errors/DataError":"/Users/aleksey/code/treojs/fakeIndexedDB/src/errors/DataError.js","./errors/InvalidStateError":"/Users/aleksey/code/treojs/fakeIndexedDB/src/errors/InvalidStateError.js","./errors/ReadOnlyError":"/Users/aleksey/code/treojs/fakeIndexedDB/src/errors/ReadOnlyError.js","./errors/TransactionInactiveError":"/Users/aleksey/code/treojs/fakeIndexedDB/src/errors/TransactionInactiveError.js","./extractKey":"/Users/aleksey/code/treojs/fakeIndexedDB/src/extractKey.js","./structuredClone":"/Users/aleksey/code/treojs/fakeIndexedDB/src/structuredClone.js","./validateKey":"/Users/aleksey/code/treojs/fakeIndexedDB/src/validateKey.js","is-integer":"/Users/aleksey/code/treojs/fakeIndexedDB/node_modules/is-integer/index.js"}],"/Users/aleksey/code/treojs/fakeIndexedDB/src/FDBCursorWithValue.js":[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _FDBCursor2 = require('./FDBCursor');

var _FDBCursor3 = _interopRequireDefault(_FDBCursor2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

module.exports = (function (_FDBCursor) {
  _inherits(FDBCursorWithValue, _FDBCursor);

  function FDBCursorWithValue() {
    var _Object$getPrototypeO;

    _classCallCheck(this, FDBCursorWithValue);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var _this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(FDBCursorWithValue)).call.apply(_Object$getPrototypeO, [this].concat(args)));

    _this.value = undefined;
    return _this;
  }

  _createClass(FDBCursorWithValue, [{
    key: 'toString',
    value: function toString() {
      return '[object IDBCursorWithValue]';
    }
  }]);

  return FDBCursorWithValue;
})(_FDBCursor3.default);

},{"./FDBCursor":"/Users/aleksey/code/treojs/fakeIndexedDB/src/FDBCursor.js"}],"/Users/aleksey/code/treojs/fakeIndexedDB/src/FDBDatabase.js":[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _EventTarget2 = require('./EventTarget');

var _EventTarget3 = _interopRequireDefault(_EventTarget2);

var _FDBTransaction = require('./FDBTransaction');

var _FDBTransaction2 = _interopRequireDefault(_FDBTransaction);

var _ObjectStore = require('./ObjectStore');

var _ObjectStore2 = _interopRequireDefault(_ObjectStore);

var _ConstraintError = require('./errors/ConstraintError');

var _ConstraintError2 = _interopRequireDefault(_ConstraintError);

var _InvalidAccessError = require('./errors/InvalidAccessError');

var _InvalidAccessError2 = _interopRequireDefault(_InvalidAccessError);

var _InvalidStateError = require('./errors/InvalidStateError');

var _InvalidStateError2 = _interopRequireDefault(_InvalidStateError);

var _NotFoundError = require('./errors/NotFoundError');

var _NotFoundError2 = _interopRequireDefault(_NotFoundError);

var _TransactionInactiveError = require('./errors/TransactionInactiveError');

var _TransactionInactiveError2 = _interopRequireDefault(_TransactionInactiveError);

var _validateKeyPath = require('./validateKeyPath');

var _validateKeyPath2 = _interopRequireDefault(_validateKeyPath);

var _adapters = require('./adapters');

var _adapters2 = _interopRequireDefault(_adapters);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#database-interface
module.exports = (function (_EventTarget) {
  _inherits(FDBDatabase, _EventTarget);

  function FDBDatabase(rawDatabase) {
    _classCallCheck(this, FDBDatabase);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(FDBDatabase).call(this));

    _this._closePending = false;
    _this._closed = false;
    _this._runningVersionchangeTransaction = false;
    _this._rawDatabase = rawDatabase;
    _this._rawDatabase.connections.push(_this);
    _adapters2.default.pushConnection(_this);

    _this.name = rawDatabase.name;
    _this.version = rawDatabase.version;
    _this.objectStoreNames = Object.keys(rawDatabase.rawObjectStores).sort();
    return _this;
  }

  _createClass(FDBDatabase, [{
    key: 'createObjectStore',
    value: function createObjectStore(name, optionalParameters) {
      if (name === undefined) {
        throw new TypeError();
      }
      var transaction = confirmActiveVersionchangeTransaction(this);

      if (this._rawDatabase.rawObjectStores.hasOwnProperty(name)) {
        throw new _ConstraintError2.default();
      }

      optionalParameters = optionalParameters || {};
      var keyPath = optionalParameters.keyPath !== undefined ? optionalParameters.keyPath : null;
      var autoIncrement = optionalParameters.autoIncrement !== undefined ? optionalParameters.autoIncrement : false;

      if (keyPath !== null) {
        (0, _validateKeyPath2.default)(keyPath);
      }

      if (autoIncrement && (keyPath === '' || Array.isArray(keyPath))) {
        throw new _InvalidAccessError2.default();
      }

      transaction._rollbackLog.push((function rollbackItem(objectStoreNames) {
        this.objectStoreNames = objectStoreNames;
        delete this._rawDatabase.rawObjectStores[name];
      }).bind(this, this.objectStoreNames.slice()));

      var objectStore = new _ObjectStore2.default(this._rawDatabase, name, keyPath, autoIncrement);
      this.objectStoreNames.push(name);
      this.objectStoreNames.sort();
      this._rawDatabase.rawObjectStores[name] = objectStore;

      return transaction.objectStore(name);
    }
  }, {
    key: 'deleteObjectStore',
    value: function deleteObjectStore(name) {
      if (name === undefined) {
        throw new TypeError();
      }
      var transaction = confirmActiveVersionchangeTransaction(this);

      if (!this._rawDatabase.rawObjectStores.hasOwnProperty(name)) {
        throw new _NotFoundError2.default();
      }

      this.objectStoreNames = this.objectStoreNames.filter(function (objectStoreName) {
        return objectStoreName !== name;
      });

      transaction._rollbackLog.push((function roolbackItem(store) {
        store.deleted = false;
        this._rawDatabase.rawObjectStores[name] = store;
        this.objectStoreNames.push(name);
        this.objectStoreNames.sort();
      }).bind(this, this._rawDatabase.rawObjectStores[name]));

      this._rawDatabase.rawObjectStores[name].deleted = true;
      delete this._rawDatabase.rawObjectStores[name];
    }
  }, {
    key: 'transaction',
    value: function transaction(storeNames, mode) {
      var _this2 = this;

      mode = mode !== undefined ? mode : 'readonly';
      if (mode !== 'readonly' && mode !== 'readwrite' && mode !== 'versionchange') {
        throw new TypeError('Invalid mode: ' + mode);
      }
      var hasActiveVersionchange = this._rawDatabase.transactions.some(function (transaction) {
        return transaction._active && transaction.mode === 'versionchange';
      });
      if (hasActiveVersionchange) {
        throw new _InvalidStateError2.default();
      }
      if (this._closePending) {
        throw new _InvalidStateError2.default();
      }
      if (!Array.isArray(storeNames)) {
        storeNames = [storeNames];
      }
      if (storeNames.length === 0 && mode !== 'versionchange') {
        throw new _InvalidAccessError2.default();
      }
      storeNames.forEach(function (storeName) {
        if (_this2.objectStoreNames.indexOf(storeName) < 0) {
          throw new _NotFoundError2.default('No objectStore named ' + storeName + ' in this database');
        }
      });
      var tx = new _FDBTransaction2.default(storeNames, mode);
      tx.db = this;
      this._rawDatabase.transactions.push(tx);
      this._rawDatabase.processTransactions(); // See if can start right away (async)

      return tx;
    }
  }, {
    key: 'close',
    value: function close() {
      closeConnection(this);
    }
  }, {
    key: 'toString',
    value: function toString() {
      return '[object IDBDatabase]';
    }
  }]);

  return FDBDatabase;
})(_EventTarget3.default);

function confirmActiveVersionchangeTransaction(database) {
  if (!database._runningVersionchangeTransaction) throw new _InvalidStateError2.default();
  var transaction = database._rawDatabase.transactions.find(function (tr) {
    return tr._active && tr.mode === 'versionchange';
  });
  if (!transaction) throw new _TransactionInactiveError2.default();
  return transaction;
}

// http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#database-closing-steps
function closeConnection(connection) {
  connection._closePending = true;

  var transactionsComplete = connection._rawDatabase.transactions.every(function (transaction) {
    return transaction._finished;
  });

  if (transactionsComplete) {
    connection._closed = true;
    connection._rawDatabase.connections = connection._rawDatabase.connections.filter(function (otherConnection) {
      return connection !== otherConnection;
    });
  } else {
    setImmediate(function () {
      closeConnection(connection);
    });
  }
}

},{"./EventTarget":"/Users/aleksey/code/treojs/fakeIndexedDB/src/EventTarget.js","./FDBTransaction":"/Users/aleksey/code/treojs/fakeIndexedDB/src/FDBTransaction.js","./ObjectStore":"/Users/aleksey/code/treojs/fakeIndexedDB/src/ObjectStore.js","./adapters":"/Users/aleksey/code/treojs/fakeIndexedDB/src/adapters/index.js","./errors/ConstraintError":"/Users/aleksey/code/treojs/fakeIndexedDB/src/errors/ConstraintError.js","./errors/InvalidAccessError":"/Users/aleksey/code/treojs/fakeIndexedDB/src/errors/InvalidAccessError.js","./errors/InvalidStateError":"/Users/aleksey/code/treojs/fakeIndexedDB/src/errors/InvalidStateError.js","./errors/NotFoundError":"/Users/aleksey/code/treojs/fakeIndexedDB/src/errors/NotFoundError.js","./errors/TransactionInactiveError":"/Users/aleksey/code/treojs/fakeIndexedDB/src/errors/TransactionInactiveError.js","./validateKeyPath":"/Users/aleksey/code/treojs/fakeIndexedDB/src/validateKeyPath.js"}],"/Users/aleksey/code/treojs/fakeIndexedDB/src/FDBFactory.js":[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _Event = require('./Event');

var _Event2 = _interopRequireDefault(_Event);

var _FDBOpenDBRequest = require('./FDBOpenDBRequest');

var _FDBOpenDBRequest2 = _interopRequireDefault(_FDBOpenDBRequest);

var _FDBDatabase = require('./FDBDatabase');

var _FDBDatabase2 = _interopRequireDefault(_FDBDatabase);

var _FDBVersionChangeEvent = require('./FDBVersionChangeEvent');

var _FDBVersionChangeEvent2 = _interopRequireDefault(_FDBVersionChangeEvent);

var _AbortError = require('./errors/AbortError');

var _AbortError2 = _interopRequireDefault(_AbortError);

var _VersionError = require('./errors/VersionError');

var _VersionError2 = _interopRequireDefault(_VersionError);

var _cmp = require('./cmp');

var _cmp2 = _interopRequireDefault(_cmp);

var _adapters = require('./adapters');

var _adapters2 = _interopRequireDefault(_adapters);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

module.exports = (function () {
  function FDBFactory() {
    _classCallCheck(this, FDBFactory);

    this.cmp = _cmp2.default;
  }

  // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#widl-IDBFactory-deleteDatabase-IDBOpenDBRequest-DOMString-name

  _createClass(FDBFactory, [{
    key: 'deleteDatabase',
    value: function deleteDatabase(name) {
      var request = new _FDBOpenDBRequest2.default();
      request.source = null;

      _adapters2.default.getDatabase(name, function (err1, db) {
        if (err1) return onError(err1);
        var version = db ? db.version : null;

        _deleteDatabase(db, request, function (err2) {
          if (err2) return onError(err2);
          request.result = undefined;
          var event = new _FDBVersionChangeEvent2.default('success', {
            oldVersion: version,
            newVersion: null
          });
          request.dispatchEvent(event);
        });
      });

      return request;

      function onError(err) {
        request.error = new Error();
        request.error.name = err.name;

        var event = new _Event2.default('error', {
          bubbles: true,
          cancelable: false
        });

        event._eventPath = [];
        request.dispatchEvent(event);
      }
    }

    // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#widl-IDBFactory-open-IDBOpenDBRequest-DOMString-name-unsigned-long-long-version

  }, {
    key: 'open',
    value: function open(name, version) {
      if (arguments.length > 1 && (isNaN(version) || version < 1 || version >= 9007199254740992)) {
        throw new TypeError();
      }

      var request = new _FDBOpenDBRequest2.default();
      request.source = null;

      _adapters2.default.openDatabase(name, function (err1, db) {
        if (err1) return onError(err1);

        openDatabase(db, version, request, function (err2, connection) {
          if (err2) return onError(err2);

          request.result = connection;
          var event = new _Event2.default('success');
          event._eventPath = [];
          request.dispatchEvent(event);
        });
      });

      return request;

      function onError(err) {
        request.result = undefined;

        request.error = new Error();
        request.error.name = err.name;

        var event = new _Event2.default('error', {
          bubbles: true,
          cancelable: false
        });

        event._eventPath = [];
        request.dispatchEvent(event);
      }
    }
  }, {
    key: 'toString',
    value: function toString() {
      return '[object IDBFactory]';
    }
  }]);

  return FDBFactory;
})();

// http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#dfn-steps-for-deleting-a-database
function _deleteDatabase(db, request, cb) {
  if (!db) return cb();
  var openDatabases = undefined;

  try {
    db.deletePending = true;
    openDatabases = db.connections.filter(function (connection) {
      return !connection._closed;
    });

    openDatabases.forEach(function (openDb) {
      if (!openDb._closePending) {
        var event = new _FDBVersionChangeEvent2.default('versionchange', {
          oldVersion: db.version,
          newVersion: null
        });
        openDb.dispatchEvent(event);
      }
    });

    var anyOpen = openDatabases.some(function (openDb) {
      return !openDb._closed;
    });

    if (request && anyOpen) {
      var event = new _FDBVersionChangeEvent2.default('blocked', {
        oldVersion: db.version,
        newVersion: null
      });
      request.dispatchEvent(event);
    }
  } catch (err) {
    cb(err);
  }

  function waitForOthersClosed() {
    var hasAnyOpen = openDatabases.some(function (openDb) {
      return !openDb._closed;
    });

    if (hasAnyOpen) {
      setImmediate(waitForOthersClosed);
      return;
    }

    _adapters2.default.deleteDatabase(db.name, cb);
  }

  waitForOthersClosed();
}

// http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#dfn-steps-for-opening-a-database
function openDatabase(db, version, request, cb) {
  if (version === undefined) {
    version = db.version !== 0 ? db.version : 1;
  }

  if (db.version > version) {
    return cb(new _VersionError2.default());
  }

  var connection = new _FDBDatabase2.default(db);

  if (db.version < version) {
    runVersionchangeTransaction(connection, version, request, function (err) {
      if (err) {
        // DO THIS HERE: ensure that connection is closed by running the steps for closing a database connection before these steps are aborted.
        return cb(err);
      }

      cb(null, connection);
    });
  } else {
    cb(null, connection);
  }
}

// http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#dfn-steps-for-running-a-versionchange-transaction
function runVersionchangeTransaction(connection, version, request, cb) {
  connection._runningVersionchangeTransaction = true;
  var oldVersion = connection.version;
  var openDatabases = connection._rawDatabase.connections.filter(function (otherDatabase) {
    return connection !== otherDatabase;
  });

  openDatabases.forEach(function (openDb) {
    if (!openDb._closed) {
      var event = new _FDBVersionChangeEvent2.default('versionchange', {
        oldVersion: oldVersion,
        newVersion: version
      });
      openDb.dispatchEvent(event);
    }
  });

  var anyOpen = openDatabases.some(function (openDb) {
    return !openDb._closed;
  });

  if (anyOpen) {
    var event = new _FDBVersionChangeEvent2.default('blocked', {
      oldVersion: oldVersion,
      newVersion: version
    });
    request.dispatchEvent(event);
  }

  function waitForOthersClosed() {
    var hasAnyOpen = openDatabases.some(function (openDb) {
      return !openDb._closed;
    });

    if (hasAnyOpen) {
      setImmediate(waitForOthersClosed);
      return;
    }

    //  Set the version of database to version. This change is considered part of the transaction, and so if the transaction is aborted, this change is reverted.
    connection._rawDatabase.version = version;
    connection.version = version;

    // Get rid of this setImmediate?
    var transaction = connection.transaction(connection.objectStoreNames, 'versionchange');
    request.result = connection;
    request.transaction = transaction;

    transaction._rollbackLog.push(function () {
      connection._rawDatabase.version = oldVersion;
      connection.version = oldVersion;
    });

    var event = new _FDBVersionChangeEvent2.default('upgradeneeded', {
      oldVersion: oldVersion,
      newVersion: version
    });
    request.dispatchEvent(event);

    request.readyState = 'done';

    transaction.addEventListener('error', function () {
      connection._runningVersionchangeTransaction = false;
      // throw arguments[0].target.error
      // console.log('error in versionchange transaction - not sure if anything needs to be done here', e.target.error.name)
    });

    transaction.addEventListener('abort', function () {
      connection._runningVersionchangeTransaction = false;
      request.transaction = null;
      setImmediate(function () {
        cb(new _AbortError2.default());
      });
    });

    transaction.addEventListener('complete', function () {
      connection._runningVersionchangeTransaction = false;
      request.transaction = null;

      // Let other complete event handlers run before continuing
      setImmediate(function () {
        if (connection._closePending) {
          cb(new _AbortError2.default());
        } else {
          cb(null);
        }
      });
    });
  }

  waitForOthersClosed();
}

},{"./Event":"/Users/aleksey/code/treojs/fakeIndexedDB/src/Event.js","./FDBDatabase":"/Users/aleksey/code/treojs/fakeIndexedDB/src/FDBDatabase.js","./FDBOpenDBRequest":"/Users/aleksey/code/treojs/fakeIndexedDB/src/FDBOpenDBRequest.js","./FDBVersionChangeEvent":"/Users/aleksey/code/treojs/fakeIndexedDB/src/FDBVersionChangeEvent.js","./adapters":"/Users/aleksey/code/treojs/fakeIndexedDB/src/adapters/index.js","./cmp":"/Users/aleksey/code/treojs/fakeIndexedDB/src/cmp.js","./errors/AbortError":"/Users/aleksey/code/treojs/fakeIndexedDB/src/errors/AbortError.js","./errors/VersionError":"/Users/aleksey/code/treojs/fakeIndexedDB/src/errors/VersionError.js"}],"/Users/aleksey/code/treojs/fakeIndexedDB/src/FDBIndex.js":[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _structuredClone = require('./structuredClone');

var _structuredClone2 = _interopRequireDefault(_structuredClone);

var _FDBCursor = require('./FDBCursor');

var _FDBCursor2 = _interopRequireDefault(_FDBCursor);

var _FDBCursorWithValue = require('./FDBCursorWithValue');

var _FDBCursorWithValue2 = _interopRequireDefault(_FDBCursorWithValue);

var _FDBKeyRange = require('./FDBKeyRange');

var _FDBKeyRange2 = _interopRequireDefault(_FDBKeyRange);

var _FDBRequest = require('./FDBRequest');

var _FDBRequest2 = _interopRequireDefault(_FDBRequest);

var _InvalidStateError = require('./errors/InvalidStateError');

var _InvalidStateError2 = _interopRequireDefault(_InvalidStateError);

var _TransactionInactiveError = require('./errors/TransactionInactiveError');

var _TransactionInactiveError2 = _interopRequireDefault(_TransactionInactiveError);

var _cmp = require('./cmp');

var _cmp2 = _interopRequireDefault(_cmp);

var _validateKey = require('./validateKey');

var _validateKey2 = _interopRequireDefault(_validateKey);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#idl-def-IDBIndex
module.exports = (function () {
  function FDBIndex(objectStore, rawIndex) {
    _classCallCheck(this, FDBIndex);

    this._rawIndex = rawIndex;
    this.name = rawIndex.name;
    this.objectStore = objectStore;
    this.keyPath = rawIndex.keyPath;
    this.multiEntry = rawIndex.multiEntry;
    this.unique = rawIndex.unique;
  }

  // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#widl-IDBIndex-openCursor-IDBRequest-any-range-IDBCursorDirection-direction

  _createClass(FDBIndex, [{
    key: 'openCursor',
    value: function openCursor(range, direction) {
      confirmActiveTransaction(this);

      if (range === null) {
        range = undefined;
      }
      if (range !== undefined && !(range instanceof _FDBKeyRange2.default)) {
        range = _FDBKeyRange2.default.only((0, _structuredClone2.default)((0, _validateKey2.default)(range)));
      }

      var request = new _FDBRequest2.default();
      request.source = this;
      request.transaction = this.objectStore.transaction;

      var cursor = new _FDBCursorWithValue2.default(this, range, direction);
      cursor._request = request;

      return this.objectStore.transaction._execRequestAsync({
        source: this,
        operation: cursor._iterate.bind(cursor),
        request: request
      });
    }

    // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#widl-IDBIndex-openKeyCursor-IDBRequest-any-range-IDBCursorDirection-direction

  }, {
    key: 'openKeyCursor',
    value: function openKeyCursor(range, direction) {
      confirmActiveTransaction(this);

      if (range === null) {
        range = undefined;
      }
      if (range !== undefined && !(range instanceof _FDBKeyRange2.default)) {
        range = _FDBKeyRange2.default.only((0, _structuredClone2.default)((0, _validateKey2.default)(range)));
      }

      var request = new _FDBRequest2.default();
      request.source = this;
      request.transaction = this.objectStore.transaction;

      var cursor = new _FDBCursor2.default(this, range, direction);
      cursor._request = request;

      return this.objectStore.transaction._execRequestAsync({
        source: this,
        operation: cursor._iterate.bind(cursor),
        request: request
      });
    }
  }, {
    key: 'get',
    value: function get(key) {
      confirmActiveTransaction(this);

      if (!(key instanceof _FDBKeyRange2.default)) {
        key = (0, _structuredClone2.default)((0, _validateKey2.default)(key));
      }

      return this.objectStore.transaction._execRequestAsync({
        source: this,
        operation: this._rawIndex.getValue.bind(this._rawIndex, key)
      });
    }

    // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#widl-IDBIndex-getKey-IDBRequest-any-key

  }, {
    key: 'getKey',
    value: function getKey(key) {
      confirmActiveTransaction(this);

      if (!(key instanceof _FDBKeyRange2.default)) {
        key = (0, _structuredClone2.default)((0, _validateKey2.default)(key));
      }

      return this.objectStore.transaction._execRequestAsync({
        source: this,
        operation: this._rawIndex.getKey.bind(this._rawIndex, key)
      });
    }

    // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#widl-IDBIndex-count-IDBRequest-any-key

  }, {
    key: 'count',
    value: function count(key) {
      var _this = this;

      confirmActiveTransaction(this);

      if (key !== undefined && !(key instanceof _FDBKeyRange2.default)) {
        key = (0, _structuredClone2.default)((0, _validateKey2.default)(key));
      }

      // Should really use a cursor under the hood
      return this.objectStore.transaction._execRequestAsync({
        source: this,
        operation: function operation() {
          var count = undefined;

          if (key instanceof _FDBKeyRange2.default) {
            count = 0;
            _this._rawIndex.records.forEach(function (record) {
              if (_FDBKeyRange2.default.check(key, record.key)) {
                count += 1;
              }
            });
          } else if (key !== undefined) {
            count = 0;
            _this._rawIndex.records.forEach(function (record) {
              if ((0, _cmp2.default)(record.key, key) === 0) {
                count += 1;
              }
            });
          } else {
            count = _this._rawIndex.records.length;
          }

          return count;
        }
      });
    }
  }, {
    key: 'toString',
    value: function toString() {
      return '[object IDBIndex]';
    }
  }]);

  return FDBIndex;
})();

function confirmActiveTransaction(index) {
  if (!index.objectStore.transaction._active) throw new _TransactionInactiveError2.default();
  if (index._rawIndex.deleted || index.objectStore._rawObjectStore.deleted) throw new _InvalidStateError2.default();
}

},{"./FDBCursor":"/Users/aleksey/code/treojs/fakeIndexedDB/src/FDBCursor.js","./FDBCursorWithValue":"/Users/aleksey/code/treojs/fakeIndexedDB/src/FDBCursorWithValue.js","./FDBKeyRange":"/Users/aleksey/code/treojs/fakeIndexedDB/src/FDBKeyRange.js","./FDBRequest":"/Users/aleksey/code/treojs/fakeIndexedDB/src/FDBRequest.js","./cmp":"/Users/aleksey/code/treojs/fakeIndexedDB/src/cmp.js","./errors/InvalidStateError":"/Users/aleksey/code/treojs/fakeIndexedDB/src/errors/InvalidStateError.js","./errors/TransactionInactiveError":"/Users/aleksey/code/treojs/fakeIndexedDB/src/errors/TransactionInactiveError.js","./structuredClone":"/Users/aleksey/code/treojs/fakeIndexedDB/src/structuredClone.js","./validateKey":"/Users/aleksey/code/treojs/fakeIndexedDB/src/validateKey.js"}],"/Users/aleksey/code/treojs/fakeIndexedDB/src/FDBKeyRange.js":[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _DataError = require('./errors/DataError');

var _DataError2 = _interopRequireDefault(_DataError);

var _cmp = require('./cmp');

var _cmp2 = _interopRequireDefault(_cmp);

var _validateKey = require('./validateKey');

var _validateKey2 = _interopRequireDefault(_validateKey);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#range-concept
module.exports = (function () {
  function FDBKeyRange(lower, upper, lowerOpen, upperOpen) {
    _classCallCheck(this, FDBKeyRange);

    this.lower = lower;
    this.upper = upper;
    this.lowerOpen = lowerOpen;
    this.upperOpen = upperOpen;
  }

  _createClass(FDBKeyRange, [{
    key: 'toString',
    value: function toString() {
      return '[object IDBKeyRange]';
    }
  }], [{
    key: 'only',
    value: function only(value) {
      if (value === undefined) throw new TypeError();
      (0, _validateKey2.default)(value);
      return new FDBKeyRange(value, value, false, false);
    }
  }, {
    key: 'lowerBound',
    value: function lowerBound(lower, open) {
      if (lower === undefined) throw new TypeError();
      (0, _validateKey2.default)(lower);
      return new FDBKeyRange(lower, undefined, open === true ? true : false, true);
    }
  }, {
    key: 'upperBound',
    value: function upperBound(upper, open) {
      if (upper === undefined) throw new TypeError();
      (0, _validateKey2.default)(upper);
      return new FDBKeyRange(undefined, upper, true, open === true ? true : false);
    }
  }, {
    key: 'bound',
    value: function bound(lower, upper, lowerOpen, upperOpen) {
      if (lower === undefined || upper === undefined) throw new TypeError();
      var cmpResult = (0, _cmp2.default)(lower, upper);
      if (cmpResult === 1 || cmpResult === 0 && (lowerOpen || upperOpen)) throw new _DataError2.default();
      (0, _validateKey2.default)(lower);
      (0, _validateKey2.default)(upper);
      return new FDBKeyRange(lower, upper, lowerOpen === true ? true : false, upperOpen === true ? true : false);
    }
  }, {
    key: 'check',
    value: function check(keyRange, key) {
      var cmpResult = undefined;
      if (keyRange.lower !== undefined) {
        cmpResult = (0, _cmp2.default)(keyRange.lower, key);
        if (cmpResult === 1 || cmpResult === 0 && keyRange.lowerOpen) return false;
      }
      if (keyRange.upper !== undefined) {
        cmpResult = (0, _cmp2.default)(keyRange.upper, key);
        if (cmpResult === -1 || cmpResult === 0 && keyRange.upperOpen) return false;
      }
      return true;
    }
  }]);

  return FDBKeyRange;
})();

},{"./cmp":"/Users/aleksey/code/treojs/fakeIndexedDB/src/cmp.js","./errors/DataError":"/Users/aleksey/code/treojs/fakeIndexedDB/src/errors/DataError.js","./validateKey":"/Users/aleksey/code/treojs/fakeIndexedDB/src/validateKey.js"}],"/Users/aleksey/code/treojs/fakeIndexedDB/src/FDBObjectStore.js":[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _structuredClone = require('./structuredClone');

var _structuredClone2 = _interopRequireDefault(_structuredClone);

var _Index = require('./Index');

var _Index2 = _interopRequireDefault(_Index);

var _FDBCursorWithValue = require('./FDBCursorWithValue');

var _FDBCursorWithValue2 = _interopRequireDefault(_FDBCursorWithValue);

var _FDBIndex = require('./FDBIndex');

var _FDBIndex2 = _interopRequireDefault(_FDBIndex);

var _FDBKeyRange = require('./FDBKeyRange');

var _FDBKeyRange2 = _interopRequireDefault(_FDBKeyRange);

var _FDBRequest = require('./FDBRequest');

var _FDBRequest2 = _interopRequireDefault(_FDBRequest);

var _ConstraintError = require('./errors/ConstraintError');

var _ConstraintError2 = _interopRequireDefault(_ConstraintError);

var _DataError = require('./errors/DataError');

var _DataError2 = _interopRequireDefault(_DataError);

var _InvalidAccessError = require('./errors/InvalidAccessError');

var _InvalidAccessError2 = _interopRequireDefault(_InvalidAccessError);

var _InvalidStateError = require('./errors/InvalidStateError');

var _InvalidStateError2 = _interopRequireDefault(_InvalidStateError);

var _NotFoundError = require('./errors/NotFoundError');

var _NotFoundError2 = _interopRequireDefault(_NotFoundError);

var _ReadOnlyError = require('./errors/ReadOnlyError');

var _ReadOnlyError2 = _interopRequireDefault(_ReadOnlyError);

var _TransactionInactiveError = require('./errors/TransactionInactiveError');

var _TransactionInactiveError2 = _interopRequireDefault(_TransactionInactiveError);

var _cmp = require('./cmp');

var _cmp2 = _interopRequireDefault(_cmp);

var _extractKey = require('./extractKey');

var _extractKey2 = _interopRequireDefault(_extractKey);

var _validateKey = require('./validateKey');

var _validateKey2 = _interopRequireDefault(_validateKey);

var _validateKeyPath = require('./validateKeyPath');

var _validateKeyPath2 = _interopRequireDefault(_validateKeyPath);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#object-store
module.exports = (function () {
  function FBObjectStore(transaction, rawObjectStore) {
    _classCallCheck(this, FBObjectStore);

    this._rawObjectStore = rawObjectStore;
    this._rawIndexesCache = {}; // Store the FDBIndex objects

    this.name = rawObjectStore.name;
    this.keyPath = rawObjectStore.keyPath;
    this.indexNames = Object.keys(rawObjectStore.rawIndexes).sort();
    this.autoIncrement = rawObjectStore.autoIncrement;
    this.transaction = transaction;
  }

  _createClass(FBObjectStore, [{
    key: 'put',
    value: function put(value, key) {
      var record = buildRecordAddPut.call(this, value, key);
      return this.transaction._execRequestAsync({
        source: this,
        operation: this._rawObjectStore.storeRecord.bind(this._rawObjectStore, record, false, this.transaction._rollbackLog)
      });
    }
  }, {
    key: 'add',
    value: function add(value, key) {
      var record = buildRecordAddPut.call(this, value, key);
      return this.transaction._execRequestAsync({
        source: this,
        operation: this._rawObjectStore.storeRecord.bind(this._rawObjectStore, record, true, this.transaction._rollbackLog)
      });
    }
  }, {
    key: 'delete',
    value: function _delete(key) {
      if (this.transaction.mode === 'readonly') {
        throw new _ReadOnlyError2.default();
      }
      confirmActiveTransaction(this);

      if (!(key instanceof _FDBKeyRange2.default)) {
        key = (0, _structuredClone2.default)((0, _validateKey2.default)(key));
      }

      return this.transaction._execRequestAsync({
        source: this,
        operation: this._rawObjectStore.deleteRecord.bind(this._rawObjectStore, key, this.transaction._rollbackLog)
      });
    }
  }, {
    key: 'get',
    value: function get(key) {
      confirmActiveTransaction(this);

      if (!(key instanceof _FDBKeyRange2.default)) {
        key = (0, _structuredClone2.default)((0, _validateKey2.default)(key));
      }

      return this.transaction._execRequestAsync({
        source: this,
        operation: this._rawObjectStore.getValue.bind(this._rawObjectStore, key)
      });
    }
  }, {
    key: 'clear',
    value: function clear() {
      if (this.transaction.mode === 'readonly') {
        throw new _ReadOnlyError2.default();
      }
      confirmActiveTransaction(this);

      return this.transaction._execRequestAsync({
        source: this,
        operation: this._rawObjectStore.clear.bind(this._rawObjectStore, this.transaction._rollbackLog)
      });
    }
  }, {
    key: 'openCursor',
    value: function openCursor(range, direction) {
      confirmActiveTransaction(this);

      if (range === null) {
        range = undefined;
      }
      if (range !== undefined && !(range instanceof _FDBKeyRange2.default)) {
        range = _FDBKeyRange2.default.only((0, _structuredClone2.default)((0, _validateKey2.default)(range)));
      }

      var request = new _FDBRequest2.default();
      request.source = this;
      request.transaction = this.transaction;

      var cursor = new _FDBCursorWithValue2.default(this, range, direction);
      cursor._request = request;

      return this.transaction._execRequestAsync({
        source: this,
        operation: cursor._iterate.bind(cursor),
        request: request
      });
    }

    // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#widl-IDBObjectStore-createIndex-IDBIndex-DOMString-name-DOMString-sequence-DOMString--keyPath-IDBIndexParameters-optionalParameters

  }, {
    key: 'createIndex',
    value: function createIndex(name, keyPath, optionalParameters) {
      if (keyPath === undefined) {
        throw new TypeError();
      }

      optionalParameters = optionalParameters !== undefined ? optionalParameters : {};
      var multiEntry = optionalParameters.multiEntry !== undefined ? optionalParameters.multiEntry : false;
      var unique = optionalParameters.unique !== undefined ? optionalParameters.unique : false;

      if (this.transaction.mode !== 'versionchange') {
        throw new _InvalidStateError2.default();
      }

      confirmActiveTransaction(this);

      if (this.indexNames.indexOf(name) >= 0) {
        throw new _ConstraintError2.default();
      }

      (0, _validateKeyPath2.default)(keyPath);

      if (Array.isArray(keyPath) && multiEntry) {
        throw new _InvalidAccessError2.default();
      }

      // The index that is requested to be created can contain constraints on the data allowed in the index's referenced object store, such as requiring uniqueness of the values referenced by the index's keyPath. If the referenced object store already contains data which violates these constraints, this MUST NOT cause the implementation of createIndex to throw an exception or affect what it returns. The implementation MUST still create and return an IDBIndex object. Instead the implementation must queue up an operation to abort the "versionchange" transaction which was used for the createIndex call.

      this.transaction._rollbackLog.push((function rollbackItem(indexNames) {
        this.indexNames = indexNames;
        delete this._rawObjectStore.rawIndexes[name];
      }).bind(this, this.indexNames.slice()));

      var returnIndex = new _Index2.default(this._rawObjectStore, name, keyPath, multiEntry, unique);
      this.indexNames.push(name);
      this.indexNames.sort();
      this._rawObjectStore.rawIndexes[name] = returnIndex;

      returnIndex.initialize(this.transaction); // This is async by design

      return new _FDBIndex2.default(this, returnIndex);
    }
  }, {
    key: 'index',
    value: function index(name) {
      if (name === undefined) {
        throw new TypeError();
      }

      if (this._rawIndexesCache.hasOwnProperty(name)) {
        return this._rawIndexesCache[name];
      }

      if (this.indexNames.indexOf(name) < 0) {
        throw new _NotFoundError2.default();
      }

      if (this._rawObjectStore.deleted) {
        throw new _InvalidStateError2.default();
      }

      var returnIndex = new _FDBIndex2.default(this, this._rawObjectStore.rawIndexes[name]);
      this._rawIndexesCache[name] = returnIndex;

      return returnIndex;
    }
  }, {
    key: 'deleteIndex',
    value: function deleteIndex(name) {
      var _this = this;

      if (name === undefined) {
        throw new TypeError();
      }

      if (this.transaction.mode !== 'versionchange') {
        throw new _InvalidStateError2.default();
      }

      confirmActiveTransaction(this);

      if (!this._rawObjectStore.rawIndexes.hasOwnProperty(name)) {
        throw new _NotFoundError2.default();
      }

      this.transaction._rollbackLog.push((function rollbackItem(index) {
        index.deleted = false;
        this._rawObjectStore.rawIndexes[name] = index;
        this.indexNames.push(name);
        this.indexNames.sort();
      }).bind(this, this._rawObjectStore.rawIndexes[name]));

      this.indexNames = this.indexNames.filter(function (indexName) {
        return indexName !== name;
      });
      this._rawObjectStore.rawIndexes[name].deleted = true; // Not sure if this is supposed to happen synchronously

      this.transaction._execRequestAsync({
        source: this,
        operation: function operation() {
          delete _this._rawObjectStore.rawIndexes[name];
        }
      });
    }

    // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#widl-IDBObjectStore-count-IDBRequest-any-key

  }, {
    key: 'count',
    value: function count(key) {
      var _this2 = this;

      confirmActiveTransaction(this);

      if (key !== undefined && !(key instanceof _FDBKeyRange2.default)) {
        key = (0, _structuredClone2.default)((0, _validateKey2.default)(key));
      }

      // Should really use a cursor under the hood
      return this.transaction._execRequestAsync({
        source: this,
        operation: function operation() {
          var count = undefined;

          if (key instanceof _FDBKeyRange2.default) {
            count = 0;
            _this2._rawObjectStore.records.forEach(function (record) {
              if (_FDBKeyRange2.default.check(key, record.key)) {
                count += 1;
              }
            });
          } else if (key !== undefined) {
            count = 0;
            _this2._rawObjectStore.records.forEach(function (record) {
              if ((0, _cmp2.default)(record.key, key) === 0) {
                count += 1;
              }
            });
          } else {
            count = _this2._rawObjectStore.records.length;
          }

          return count;
        }
      });
    }
  }, {
    key: 'toString',
    value: function toString() {
      return '[object IDBObjectStore]';
    }
  }]);

  return FBObjectStore;
})();

function confirmActiveTransaction(objectStore) {
  if (objectStore._rawObjectStore.deleted) {
    throw new _InvalidStateError2.default();
  }

  if (!objectStore.transaction._active) {
    throw new _TransactionInactiveError2.default();
  }
}

function buildRecordAddPut(value, key) {
  if (this.transaction.mode === 'readonly') {
    throw new _ReadOnlyError2.default();
  }

  confirmActiveTransaction(this);

  if (this.keyPath !== null) {
    if (key !== undefined) {
      throw new _DataError2.default();
    }

    var tempKey = (0, _extractKey2.default)(this.keyPath, value);

    if (tempKey !== undefined) {
      (0, _validateKey2.default)(tempKey);
    } else {
      if (!this._rawObjectStore.keyGenerator) {
        throw new _DataError2.default();
      }
    }
  }

  if (this.keyPath === null && this._rawObjectStore.keyGenerator === null && key === undefined) {
    throw new _DataError2.default();
  }

  if (key !== undefined) {
    (0, _validateKey2.default)(key);
  }

  return {
    key: (0, _structuredClone2.default)(key),
    value: (0, _structuredClone2.default)(value)
  };
}

},{"./FDBCursorWithValue":"/Users/aleksey/code/treojs/fakeIndexedDB/src/FDBCursorWithValue.js","./FDBIndex":"/Users/aleksey/code/treojs/fakeIndexedDB/src/FDBIndex.js","./FDBKeyRange":"/Users/aleksey/code/treojs/fakeIndexedDB/src/FDBKeyRange.js","./FDBRequest":"/Users/aleksey/code/treojs/fakeIndexedDB/src/FDBRequest.js","./Index":"/Users/aleksey/code/treojs/fakeIndexedDB/src/Index.js","./cmp":"/Users/aleksey/code/treojs/fakeIndexedDB/src/cmp.js","./errors/ConstraintError":"/Users/aleksey/code/treojs/fakeIndexedDB/src/errors/ConstraintError.js","./errors/DataError":"/Users/aleksey/code/treojs/fakeIndexedDB/src/errors/DataError.js","./errors/InvalidAccessError":"/Users/aleksey/code/treojs/fakeIndexedDB/src/errors/InvalidAccessError.js","./errors/InvalidStateError":"/Users/aleksey/code/treojs/fakeIndexedDB/src/errors/InvalidStateError.js","./errors/NotFoundError":"/Users/aleksey/code/treojs/fakeIndexedDB/src/errors/NotFoundError.js","./errors/ReadOnlyError":"/Users/aleksey/code/treojs/fakeIndexedDB/src/errors/ReadOnlyError.js","./errors/TransactionInactiveError":"/Users/aleksey/code/treojs/fakeIndexedDB/src/errors/TransactionInactiveError.js","./extractKey":"/Users/aleksey/code/treojs/fakeIndexedDB/src/extractKey.js","./structuredClone":"/Users/aleksey/code/treojs/fakeIndexedDB/src/structuredClone.js","./validateKey":"/Users/aleksey/code/treojs/fakeIndexedDB/src/validateKey.js","./validateKeyPath":"/Users/aleksey/code/treojs/fakeIndexedDB/src/validateKeyPath.js"}],"/Users/aleksey/code/treojs/fakeIndexedDB/src/FDBOpenDBRequest.js":[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _FDBRequest2 = require('./FDBRequest');

var _FDBRequest3 = _interopRequireDefault(_FDBRequest2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

module.exports = (function (_FDBRequest) {
  _inherits(FDBOpenDBRequest, _FDBRequest);

  function FDBOpenDBRequest() {
    _classCallCheck(this, FDBOpenDBRequest);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(FDBOpenDBRequest).call(this));

    _this.onupgradeneeded = null;
    _this.onblocked = null;
    return _this;
  }

  _createClass(FDBOpenDBRequest, [{
    key: 'toString',
    value: function toString() {
      return '[object IDBOpenDBRequest]';
    }
  }]);

  return FDBOpenDBRequest;
})(_FDBRequest3.default);

},{"./FDBRequest":"/Users/aleksey/code/treojs/fakeIndexedDB/src/FDBRequest.js"}],"/Users/aleksey/code/treojs/fakeIndexedDB/src/FDBRequest.js":[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _EventTarget2 = require('./EventTarget');

var _EventTarget3 = _interopRequireDefault(_EventTarget2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

module.exports = (function (_EventTarget) {
  _inherits(FDBRequest, _EventTarget);

  function FDBRequest() {
    _classCallCheck(this, FDBRequest);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(FDBRequest).call(this));

    _this.result = null;
    _this.error = null;
    _this.source = null;
    _this.transaction = null;
    _this.readyState = 'pending';
    _this.onsuccess = null;
    _this.onerror = null;
    return _this;
  }

  _createClass(FDBRequest, [{
    key: 'toString',
    value: function toString() {
      return '[object IDBRequest]';
    }
  }]);

  return FDBRequest;
})(_EventTarget3.default);

},{"./EventTarget":"/Users/aleksey/code/treojs/fakeIndexedDB/src/EventTarget.js"}],"/Users/aleksey/code/treojs/fakeIndexedDB/src/FDBTransaction.js":[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _Event = require('./Event');

var _Event2 = _interopRequireDefault(_Event);

var _EventTarget2 = require('./EventTarget');

var _EventTarget3 = _interopRequireDefault(_EventTarget2);

var _FDBObjectStore = require('./FDBObjectStore');

var _FDBObjectStore2 = _interopRequireDefault(_FDBObjectStore);

var _FDBRequest = require('./FDBRequest');

var _FDBRequest2 = _interopRequireDefault(_FDBRequest);

var _AbortError = require('./errors/AbortError');

var _AbortError2 = _interopRequireDefault(_AbortError);

var _TransactionInactiveError = require('./errors/TransactionInactiveError');

var _TransactionInactiveError2 = _interopRequireDefault(_TransactionInactiveError);

var _NotFoundError = require('./errors/NotFoundError');

var _NotFoundError2 = _interopRequireDefault(_NotFoundError);

var _InvalidStateError = require('./errors/InvalidStateError');

var _InvalidStateError2 = _interopRequireDefault(_InvalidStateError);

var _adapters = require('./adapters');

var _adapters2 = _interopRequireDefault(_adapters);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#transaction
module.exports = (function (_EventTarget) {
  _inherits(FDBTransaction, _EventTarget);

  function FDBTransaction(storeNames, mode) {
    _classCallCheck(this, FDBTransaction);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(FDBTransaction).call(this));

    _this._scope = storeNames;
    _this._started = false;
    _this._active = true;
    _this._finished = false; // Set true after commit or abort
    _this._requests = [];
    _this._rollbackLog = [];

    _this.mode = mode;
    _this.db = null;
    _this.error = null;
    _this.onabort = null;
    _this.oncomplete = null;
    _this.onerror = null;
    return _this;
  }

  // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#dfn-steps-for-aborting-a-transaction

  _createClass(FDBTransaction, [{
    key: '_abort',
    value: function _abort(error) {
      var _this2 = this;

      this._rollbackLog.reverse().forEach(function (f) {
        return f();
      });
      var e = undefined;
      if (error !== null) {
        e = new Error();
        e.name = error;
        this.error = e;
      }

      // Should this directly remove from _requests?
      this._requests.forEach(function (r) {
        var request = r.request;
        if (request.readyState !== 'done') {
          request.readyState = 'done'; // This will cancel execution of this request's operation
          if (request.source) {
            request.result = undefined;
            request.error = new _AbortError2.default();

            var event = new _Event2.default('error', {
              bubbles: true,
              cancelable: true
            });
            event._eventPath = [_this2.db, _this2];
            request.dispatchEvent(event);
          }
        }
      });

      setImmediate(function () {
        var event = new _Event2.default('abort', {
          bubbles: true,
          cancelable: false
        });
        event._eventPath = [_this2.db];
        _this2.dispatchEvent(event);
      });

      this._finished = true;
    }
  }, {
    key: 'abort',
    value: function abort() {
      if (this._finished) throw new _InvalidStateError2.default();
      this._active = false;
      this._abort(null);
    }
  }, {
    key: 'objectStore',
    value: function objectStore(name) {
      if (this._scope.indexOf(name) < 0) throw new _NotFoundError2.default();
      if (!this._active) throw new _InvalidStateError2.default();
      return new _FDBObjectStore2.default(this, this.db._rawDatabase.rawObjectStores[name]);
    }

    // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#dfn-steps-for-asynchronously-executing-a-request

  }, {
    key: '_execRequestAsync',
    value: function _execRequestAsync(obj) {
      if (!this._active) throw new _TransactionInactiveError2.default();
      var source = obj.source;
      var operation = obj.operation;
      var request = obj.hasOwnProperty('request') ? obj.request : null;

      // Request should only be passed for cursors
      if (!request) {
        if (!source) {
          // Special requests like indexes that just need to run some coe
          request = { readyState: 'pending' };
        } else {
          request = new _FDBRequest2.default();
          request.source = source;
          request.transaction = source.transaction;
        }
      }

      this._requests.push({ request: request, operation: operation });
      return request;
    }
  }, {
    key: '_start',
    value: function _start() {
      var _this3 = this;

      var event = undefined;
      this._started = true;

      // Remove from request queue - cursor ones will be added back if necessary by cursor.continue and such
      var operation = undefined;
      var request = undefined;

      while (this._requests.length > 0) {
        var r = this._requests.shift();

        // This should only be false if transaction was aborted
        if (r.request.readyState !== 'done') {
          request = r.request;
          operation = r.operation;
          break;
        }
      }

      if (request) {
        if (!request.source) {
          // Special requests like indexes that just need to run some code, with error handling already built into operation
          operation();
        } else {
          var defaultAction = undefined;
          try {
            var result = operation();
            request.readyState = 'done';
            request.result = result;
            request.error = undefined;

            // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#dfn-fire-a-success-event
            this._active = true;
            event = new _Event2.default('success', {
              bubbles: false,
              cancelable: false
            });
          } catch (err) {
            request.readyState = 'done';
            request.result = undefined;
            request.error = err;

            // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#dfn-fire-an-error-event
            this._active = true;
            event = new _Event2.default('error', {
              bubbles: true,
              cancelable: true
            });

            defaultAction = this._abort.bind(this, err.name);
          }

          try {
            event._eventPath = [this.db, this];
            request.dispatchEvent(event);

            // You're supposed to set this._active to false here, but I'm skipping that.
            // Why? Because scheduling gets tricky when promises are involved. I know that
            // promises and IndexedDB transactions in general are tricky
            // https://lists.w3.org/Archives/Public/public-webapps/2015AprJun/0126.html but
            // for some reason I still tend to do it. So this line is commented out for me,
            // and for any other masochists who do similar things. It doesn't seem to break
            // any tests or functionality, and in fact if I uncomment this line it does make
            // transaction/promise interactions wonky.
            // this._active = false
          } catch (err) {
            this._abort('AbortError');
            throw err;
          }

          // Default action of event
          if (!event._canceled) {
            if (defaultAction) {
              defaultAction();
            }
          }
        }

        // On to the next one
        if (this._requests.length > 0) {
          this._start();
        } else {
          // Give it another chance for new handlers to be set before finishing
          setImmediate(this._start.bind(this));
        }
        return;
      }

      // Check if transaction complete event needs to be fired
      if (!this._finished) {
        // Either aborted or committed already
        this._active = false;
        this._finished = true;

        if (!this.error) {
          _adapters2.default.submitTransaction(this, function (err) {
            if (err) {
              _this3._abort('AbortError');
              throw err;
            } else {
              event = new _Event2.default();
              event.type = 'complete';
              _this3.dispatchEvent(event);
            }
          });
        }
      }
    }
  }, {
    key: 'toString',
    value: function toString() {
      return '[object IDBRequest]';
    }
  }]);

  return FDBTransaction;
})(_EventTarget3.default);

},{"./Event":"/Users/aleksey/code/treojs/fakeIndexedDB/src/Event.js","./EventTarget":"/Users/aleksey/code/treojs/fakeIndexedDB/src/EventTarget.js","./FDBObjectStore":"/Users/aleksey/code/treojs/fakeIndexedDB/src/FDBObjectStore.js","./FDBRequest":"/Users/aleksey/code/treojs/fakeIndexedDB/src/FDBRequest.js","./adapters":"/Users/aleksey/code/treojs/fakeIndexedDB/src/adapters/index.js","./errors/AbortError":"/Users/aleksey/code/treojs/fakeIndexedDB/src/errors/AbortError.js","./errors/InvalidStateError":"/Users/aleksey/code/treojs/fakeIndexedDB/src/errors/InvalidStateError.js","./errors/NotFoundError":"/Users/aleksey/code/treojs/fakeIndexedDB/src/errors/NotFoundError.js","./errors/TransactionInactiveError":"/Users/aleksey/code/treojs/fakeIndexedDB/src/errors/TransactionInactiveError.js"}],"/Users/aleksey/code/treojs/fakeIndexedDB/src/FDBVersionChangeEvent.js":[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _Event2 = require('./Event');

var _Event3 = _interopRequireDefault(_Event2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

module.exports = (function (_Event) {
  _inherits(FDBVersionChangeEvent, _Event);

  function FDBVersionChangeEvent(type) {
    var parameters = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, FDBVersionChangeEvent);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(FDBVersionChangeEvent).call(this, type));

    _this.oldVersion = parameters.oldVersion !== undefined ? parameters.oldVersion : 0;
    _this.newVersion = parameters.newVersion !== undefined ? parameters.newVersion : null;
    return _this;
  }

  _createClass(FDBVersionChangeEvent, [{
    key: 'toString',
    value: function toString() {
      return '[object IDBVersionChangeEvent]';
    }
  }]);

  return FDBVersionChangeEvent;
})(_Event3.default);

},{"./Event":"/Users/aleksey/code/treojs/fakeIndexedDB/src/Event.js"}],"/Users/aleksey/code/treojs/fakeIndexedDB/src/Index.js":[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _FDBKeyRange = require('./FDBKeyRange');

var _FDBKeyRange2 = _interopRequireDefault(_FDBKeyRange);

var _ConstraintError = require('./errors/ConstraintError');

var _ConstraintError2 = _interopRequireDefault(_ConstraintError);

var _cmp = require('./cmp');

var _cmp2 = _interopRequireDefault(_cmp);

var _extractKey = require('./extractKey');

var _extractKey2 = _interopRequireDefault(_extractKey);

var _validateKey = require('./validateKey');

var _validateKey2 = _interopRequireDefault(_validateKey);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#dfn-index
module.exports = (function () {
  function Index(rawObjectStore, name, keyPath, multiEntry, unique) {
    var records = arguments.length <= 5 || arguments[5] === undefined ? [] : arguments[5];

    _classCallCheck(this, Index);

    this.records = records;
    this.rawObjectStore = rawObjectStore;
    this.initialized = false;
    this.deleted = false;

    // Initialized should be used to decide whether to throw an error or abort the versionchange transaction when there is a constraint
    this.name = name;
    this.keyPath = keyPath;
    this.multiEntry = multiEntry;
    this.unique = unique;
  }

  // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#dfn-steps-for-storing-a-record-into-an-object-store (step 7)

  _createClass(Index, [{
    key: 'storeRecord',
    value: function storeRecord(newRecord) {
      var _this = this;

      var indexKey = (0, _extractKey2.default)(this.keyPath, newRecord.value);
      if (indexKey === undefined) return;

      if (!this.multiEntry || !Array.isArray(indexKey)) {
        try {
          (0, _validateKey2.default)(indexKey);
        } catch (e) {
          return;
        }
      } else {
        (function () {
          // remove any elements from index key that are not valid keys and remove any duplicate elements from index key such that only one instance of the duplicate value remains.
          var keep = [];
          indexKey.forEach(function (part) {
            if (keep.indexOf(part) < 0) {
              try {
                (0, _validateKey2.default)(part);
                keep.push(part);
              } catch (err) {/* Do nothing */}
            }
          });
          indexKey = keep;
        })();
      }

      if (!this.multiEntry || !Array.isArray(indexKey)) {
        if (this.unique) {
          var i = this.records.findIndex(function (record) {
            return (0, _cmp2.default)(record.key, indexKey) === 0;
          });
          if (i >= 0) {
            throw new _ConstraintError2.default();
          }
        }
      } else {
        if (this.unique) {
          indexKey.forEach(function (individualIndexKey) {
            _this.records.forEach(function (record) {
              if ((0, _cmp2.default)(record.key, individualIndexKey) === 0) {
                throw new _ConstraintError2.default();
              }
            });
          });
        }
      }

      // Store record {key (indexKey) and value (recordKey)} sorted ascending by key (primarily) and value (secondarily)
      var storeInIndex = function storeInIndex(newNewRecord) {
        var i = _this.records.findIndex(function (record) {
          return (0, _cmp2.default)(record.key, newNewRecord.key) >= 0;
        });

        // If no matching key, add to end
        if (i === -1) {
          i = _this.records.length;
        } else {
          // If matching key, advance to appropriate position based on value
          while (i < _this.records.length && (0, _cmp2.default)(_this.records[i].key, newNewRecord.key) === 0) {
            if ((0, _cmp2.default)(_this.records[i].value, newNewRecord.value) !== -1) {
              // Record value >= newNewRecord value, so insert here
              break;
            }

            i += 1; // Look at next record
          }
        }

        _this.records.splice(i, 0, newNewRecord);
      };

      if (!this.multiEntry || !Array.isArray(indexKey)) {
        storeInIndex({
          key: indexKey,
          value: newRecord.key
        });
      } else {
        indexKey.forEach(function (individualIndexKey) {
          storeInIndex({
            key: individualIndexKey,
            value: newRecord.key
          });
        });
      }
    }
  }, {
    key: '_getRecord',
    value: function _getRecord(key) {
      var record = undefined;
      if (key instanceof _FDBKeyRange2.default) {
        record = this.records.find(function (r) {
          return _FDBKeyRange2.default.check(key, r.key);
        });
      } else {
        record = this.records.find(function (r) {
          return (0, _cmp2.default)(r.key, key) === 0;
        });
      }
      return record;
    }

    // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#dfn-steps-for-retrieving-a-value-from-an-index

  }, {
    key: 'getKey',
    value: function getKey(key) {
      var record = this._getRecord(key);
      return record !== undefined ? record.value : undefined;
    }

    // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#index-referenced-value-retrieval-operation

  }, {
    key: 'getValue',
    value: function getValue(key) {
      var record = this._getRecord(key);
      return record !== undefined ? this.rawObjectStore.getValue(record.value) : undefined;
    }
  }, {
    key: 'initialize',
    value: function initialize(transaction) {
      var _this2 = this;

      if (this.initialized) throw new Error('Index already initialized');
      transaction._execRequestAsync({
        source: null,
        operation: function operation() {
          try {
            // Create index based on current value of objectstore
            _this2.rawObjectStore.records.forEach(function (record) {
              _this2.storeRecord(record);
            });
            _this2.initialized = true;
          } catch (err) {
            transaction._abort(err.name);
          }
        }
      });
    }
  }]);

  return Index;
})();

},{"./FDBKeyRange":"/Users/aleksey/code/treojs/fakeIndexedDB/src/FDBKeyRange.js","./cmp":"/Users/aleksey/code/treojs/fakeIndexedDB/src/cmp.js","./errors/ConstraintError":"/Users/aleksey/code/treojs/fakeIndexedDB/src/errors/ConstraintError.js","./extractKey":"/Users/aleksey/code/treojs/fakeIndexedDB/src/extractKey.js","./validateKey":"/Users/aleksey/code/treojs/fakeIndexedDB/src/validateKey.js"}],"/Users/aleksey/code/treojs/fakeIndexedDB/src/KeyGenerator.js":[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _ConstraintError = require('./errors/ConstraintError');

var _ConstraintError2 = _interopRequireDefault(_ConstraintError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

module.exports = (function () {
  function KeyGenerator() {
    _classCallCheck(this, KeyGenerator);

    // This is kind of wrong. Should start at 1 and increment only after record is saved
    this.num = 0;
  }

  _createClass(KeyGenerator, [{
    key: 'next',
    value: function next() {
      if (this.num >= 9007199254740992) throw new _ConstraintError2.default();
      this.num += 1;
      return this.num;
    }
  }, {
    key: 'setIfLarger',
    value: function setIfLarger(num) {
      if (num > 9007199254740992) throw new _ConstraintError2.default();
      if (num > this.num) this.num = Math.floor(num);
    }
  }]);

  return KeyGenerator;
})();

},{"./errors/ConstraintError":"/Users/aleksey/code/treojs/fakeIndexedDB/src/errors/ConstraintError.js"}],"/Users/aleksey/code/treojs/fakeIndexedDB/src/ObjectStore.js":[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _structuredClone = require('./structuredClone');

var _structuredClone2 = _interopRequireDefault(_structuredClone);

var _FDBKeyRange = require('./FDBKeyRange');

var _FDBKeyRange2 = _interopRequireDefault(_FDBKeyRange);

var _KeyGenerator = require('./KeyGenerator');

var _KeyGenerator2 = _interopRequireDefault(_KeyGenerator);

var _ConstraintError = require('./errors/ConstraintError');

var _ConstraintError2 = _interopRequireDefault(_ConstraintError);

var _DataError = require('./errors/DataError');

var _DataError2 = _interopRequireDefault(_DataError);

var _cmp = require('./cmp');

var _cmp2 = _interopRequireDefault(_cmp);

var _extractKey = require('./extractKey');

var _extractKey2 = _interopRequireDefault(_extractKey);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#dfn-object-store
module.exports = (function () {
  function ObjectStore(rawDatabase, name, keyPath, autoIncrement) {
    var records = arguments.length <= 4 || arguments[4] === undefined ? [] : arguments[4];

    _classCallCheck(this, ObjectStore);

    this.rawDatabase = rawDatabase;
    this.records = records;
    this.rawIndexes = {};
    this.keyGenerator = autoIncrement === true ? new _KeyGenerator2.default() : null;
    this.deleted = false;

    this.name = name;
    this.keyPath = keyPath;
    this.autoIncrement = autoIncrement;
  }

  // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#dfn-steps-for-retrieving-a-value-from-an-object-store

  _createClass(ObjectStore, [{
    key: 'getValue',
    value: function getValue(key) {
      var record = undefined;
      if (key instanceof _FDBKeyRange2.default) {
        record = this.records.find(function (r) {
          return _FDBKeyRange2.default.check(key, r.key);
        });
      } else {
        record = this.records.find(function (r) {
          return (0, _cmp2.default)(r.key, key) === 0;
        });
      }

      return record !== undefined ? (0, _structuredClone2.default)(record.value) : undefined;
    }

    // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#dfn-steps-for-storing-a-record-into-an-object-store

  }, {
    key: 'storeRecord',
    value: function storeRecord(newRecord, noOverwrite, rollbackLog) {
      var _this = this;

      if (this.keyPath !== null) {
        var key = (0, _extractKey2.default)(this.keyPath, newRecord.value);
        if (key !== undefined) {
          newRecord.key = key;
        }
      }

      var i = undefined;
      if (this.keyGenerator !== null && newRecord.key === undefined) {
        if (rollbackLog) {
          rollbackLog.push((function rollbackItem(keyGeneratorBefore) {
            this.keyGenerator.num = keyGeneratorBefore;
          }).bind(this, this.keyGenerator.num));
        }

        newRecord.key = this.keyGenerator.next();

        // Set in value if keyPath defiend but led to no key
        // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#dfn-steps-to-assign-a-key-to-a-value-using-a-key-path
        if (this.keyPath !== null) {
          var remainingKeyPath = this.keyPath;
          var object = newRecord.value;
          var identifier = undefined;

          i = 0; // Just to run the loop at least once
          while (i >= 0) {
            if ((typeof object === 'undefined' ? 'undefined' : _typeof(object)) !== 'object') {
              throw new _DataError2.default();
            }

            i = remainingKeyPath.indexOf('.');
            if (i >= 0) {
              identifier = remainingKeyPath.slice(0, i);
              remainingKeyPath = remainingKeyPath.slice(i + 1);

              if (!object.hasOwnProperty(identifier)) {
                object[identifier] = {};
              }

              object = object[identifier];
            }
          }

          identifier = remainingKeyPath;

          object[identifier] = newRecord.key;
        }
      } else if (this.keyGenerator !== null && typeof newRecord.key === 'number') {
        this.keyGenerator.setIfLarger(newRecord.key);
      }

      i = this.records.findIndex(function (r) {
        return (0, _cmp2.default)(r.key, newRecord.key) === 0;
      });

      if (i >= 0) {
        if (noOverwrite) throw new _ConstraintError2.default();
        this.deleteRecord(newRecord.key, rollbackLog);
      }

      // Find where to put it so it's sorted by key
      if (this.records.length === 0) {
        i = 0;
      }
      i = this.records.findIndex(function (record) {
        return (0, _cmp2.default)(record.key, newRecord.key) === 1;
      });
      if (i === -1) {
        i = this.records.length;
      }
      this.records.splice(i, 0, newRecord);

      // Update indexes
      Object.keys(this.rawIndexes).forEach(function (name) {
        if (_this.rawIndexes[name].initialized) {
          _this.rawIndexes[name].storeRecord(newRecord);
        }
      });

      if (rollbackLog) {
        rollbackLog.push(this.deleteRecord.bind(this, newRecord.key));
      }

      return newRecord.key;
    }

    // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#dfn-steps-for-deleting-records-from-an-object-store

  }, {
    key: 'deleteRecord',
    value: function deleteRecord(key, rollbackLog) {
      var _this2 = this;

      var range = undefined;
      if (key instanceof _FDBKeyRange2.default) {
        range = key;
      } else {
        range = _FDBKeyRange2.default.only(key);
      }

      this.records = this.records.filter(function (record) {
        var shouldDelete = _FDBKeyRange2.default.check(range, record.key);

        if (shouldDelete && rollbackLog) {
          rollbackLog.push(_this2.storeRecord.bind(_this2, record, true));
        }

        return !shouldDelete;
      });

      Object.keys(this.rawIndexes).forEach(function (name) {
        var rawIndex = _this2.rawIndexes[name];
        rawIndex.records = rawIndex.records.filter(function (record) {
          return !_FDBKeyRange2.default.check(range, record.value);
        });
      });
    }

    // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#dfn-steps-for-clearing-an-object-store

  }, {
    key: 'clear',
    value: function clear(rollbackLog) {
      var _this3 = this;

      if (rollbackLog) {
        this.records.forEach(function (record) {
          rollbackLog.push(_this3.storeRecord.bind(_this3, record, true));
        });
      }

      this.records = [];
      Object.keys(this.rawIndexes).forEach(function (name) {
        var rawIndex = _this3.rawIndexes[name];
        rawIndex.records = [];
      });
    }
  }]);

  return ObjectStore;
})();

},{"./FDBKeyRange":"/Users/aleksey/code/treojs/fakeIndexedDB/src/FDBKeyRange.js","./KeyGenerator":"/Users/aleksey/code/treojs/fakeIndexedDB/src/KeyGenerator.js","./cmp":"/Users/aleksey/code/treojs/fakeIndexedDB/src/cmp.js","./errors/ConstraintError":"/Users/aleksey/code/treojs/fakeIndexedDB/src/errors/ConstraintError.js","./errors/DataError":"/Users/aleksey/code/treojs/fakeIndexedDB/src/errors/DataError.js","./extractKey":"/Users/aleksey/code/treojs/fakeIndexedDB/src/extractKey.js","./structuredClone":"/Users/aleksey/code/treojs/fakeIndexedDB/src/structuredClone.js"}],"/Users/aleksey/code/treojs/fakeIndexedDB/src/adapters/index.js":[function(require,module,exports){
'use strict';

module.exports = typeof localStorage === 'undefined' ? require('./memory') : require('./storage');

},{"./memory":"/Users/aleksey/code/treojs/fakeIndexedDB/src/adapters/memory.js","./storage":"/Users/aleksey/code/treojs/fakeIndexedDB/src/adapters/storage.js"}],"/Users/aleksey/code/treojs/fakeIndexedDB/src/adapters/memory.js":[function(require,module,exports){
'use strict';

var _Database = require('../Database');

var _Database2 = _interopRequireDefault(_Database);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var databases = Object.create(null);

exports.getDatabase = function (name, cb) {
  setImmediate(function () {
    cb(null, databases[name]);
  });
};

exports.openDatabase = function (name, cb) {
  setImmediate(function () {
    if (!databases[name]) databases[name] = new _Database2.default(name, 0);
    cb(null, databases[name]);
  });
};

exports.deleteDatabase = function (name, cb) {
  setImmediate(function () {
    delete databases[name];
    cb();
  });
};

exports.submitTransaction = function (tr, cb) {
  setImmediate(function () {
    cb();
  });
};

exports.pushConnection = function () {};

},{"../Database":"/Users/aleksey/code/treojs/fakeIndexedDB/src/Database.js"}],"/Users/aleksey/code/treojs/fakeIndexedDB/src/adapters/storage.js":[function(require,module,exports){
'use strict';

var _objectValues = require('object-values');

var _objectValues2 = _interopRequireDefault(_objectValues);

var _Database = require('../Database');

var _Database2 = _interopRequireDefault(_Database);

var _ObjectStore = require('../ObjectStore');

var _ObjectStore2 = _interopRequireDefault(_ObjectStore);

var _Index = require('../Index');

var _Index2 = _interopRequireDefault(_Index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var prefix = '__idb__';
var connections = {};
var isDate = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/;

var storage = {
  get: function get(key, cb) {
    setImmediate(function () {
      try {
        cb(null, JSON.parse(localStorage.getItem(key), dateReviewer));
      } catch (err) {
        cb(err);
      }
    });
  },
  set: function set(key, val, cb) {
    setImmediate(function () {
      try {
        localStorage.setItem(key, JSON.stringify(val));
        cb();
      } catch (err) {
        cb(err);
      }
    });
  },
  del: function del(key, cb) {
    setImmediate(function () {
      try {
        localStorage.removeItem(key);
        cb();
      } catch (err) {
        cb(err);
      }
    });
  }
};

exports.getDatabase = function (name, cb) {
  storage.get(prefix + name, function (err, rawDb) {
    if (err) return cb(err);
    if (!rawDb) return cb();
    cb(null, initDb(rawDb));
  });
};

exports.openDatabase = function (name, cb) {
  storage.get(prefix + name, function (err, rawDb) {
    if (err) return cb(err);
    cb(null, rawDb ? initDb(rawDb) : new _Database2.default(name, 0));
  });
};

exports.deleteDatabase = function (name, cb) {
  storage.del(prefix + name, cb);
};

exports.submitTransaction = function (tr, cb) {
  if (tr.mode === 'readonly') return setImmediate(cb);
  var newVal = {
    name: tr.db.name,
    version: tr.db.version,
    stores: (0, _objectValues2.default)(tr.db._rawDatabase.rawObjectStores).map(function (s) {
      return {
        name: s.name,
        keyPath: s.keyPath,
        autoIncrement: s.autoIncrement,
        records: s.records,
        indexes: (0, _objectValues2.default)(s.rawIndexes).map(function (i) {
          return {
            name: i.name,
            keyPath: i.keyPath,
            multiEntry: i.multiEntry,
            unique: i.unique,
            records: i.records
          };
        })
      };
    })
  };
  storage.set(prefix + tr.db.name, newVal, cb);
};

exports.pushConnection = function (fdb) {
  if (!connections[fdb._rawDatabase.name]) connections[fdb._rawDatabase.name] = [];
  connections[fdb._rawDatabase.name].push(fdb);
};

function initDb(rawDb) {
  var db = new _Database2.default(rawDb.name, rawDb.version);
  if (connections[rawDb.name]) db.connections = connections[rawDb.name];

  rawDb.stores.forEach(function (s) {
    var store = new _ObjectStore2.default(db, s.name, s.keyPath, s.autoIncrement, s.records);
    s.indexes.forEach(function (i) {
      store.rawIndexes[i.name] = new _Index2.default(store, i.name, i.keyPath, i.multiEntry, i.unique, i.records);
      store.rawIndexes[i.name].initialized = true;
    });
    db.rawObjectStores[s.name] = store;
  });

  return db;
}

function dateReviewer(key, value) {
  if (typeof value === 'string' && isDate.exec(value)) return new Date(value);
  return value;
}

},{"../Database":"/Users/aleksey/code/treojs/fakeIndexedDB/src/Database.js","../Index":"/Users/aleksey/code/treojs/fakeIndexedDB/src/Index.js","../ObjectStore":"/Users/aleksey/code/treojs/fakeIndexedDB/src/ObjectStore.js","object-values":"/Users/aleksey/code/treojs/fakeIndexedDB/node_modules/object-values/index.js"}],"/Users/aleksey/code/treojs/fakeIndexedDB/src/cmp.js":[function(require,module,exports){
'use strict';

var _DataError = require('./errors/DataError');

var _DataError2 = _interopRequireDefault(_DataError);

var _validateKey = require('./validateKey');

var _validateKey2 = _interopRequireDefault(_validateKey);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getType(x) {
  if (typeof x === 'number') return 'Number';
  if (x instanceof Date) return 'Date';
  if (Array.isArray(x)) return 'Array';
  if (typeof x === 'string') return 'String';
  throw new _DataError2.default();
}

// http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#widl-IDBFactory-cmp-short-any-first-any-second
module.exports = function cmp(first, second) {
  if (second === undefined) throw new TypeError();

  (0, _validateKey2.default)(first);
  (0, _validateKey2.default)(second);

  var t1 = getType(first);
  var t2 = getType(second);

  if (t1 !== t2) {
    if (t1 === 'Array') return 1;
    if (t1 === 'String' && (t2 === 'Date' || t2 === 'Number')) return 1;
    if (t1 === 'Date' && t2 === 'Number') return 1;
    return -1;
  }

  if (t1 === 'Array') {
    var length = Math.min(first.length, second.length);
    for (var i = 0; i < length; i++) {
      var result = cmp(first[i], second[i]);
      if (result !== 0) return result;
    }

    if (first.length > second.length) return 1;
    if (first.length < second.length) return -1;
    return 0;
  }

  if (t1 === 'Date') {
    if (first.getTime() === second.getTime()) return 0;
  } else {
    if (first === second) {
      return 0;
    }
  }

  return first > second ? 1 : -1;
};

},{"./errors/DataError":"/Users/aleksey/code/treojs/fakeIndexedDB/src/errors/DataError.js","./validateKey":"/Users/aleksey/code/treojs/fakeIndexedDB/src/validateKey.js"}],"/Users/aleksey/code/treojs/fakeIndexedDB/src/errors/AbortError.js":[function(require,module,exports){
'use strict';

var _inherits = require('inherits');

var _inherits2 = _interopRequireDefault(_inherits);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = AbortError;

function AbortError() {
  var message = arguments.length <= 0 || arguments[0] === undefined ? 'A request was aborted, for example through a call to IDBTransaction.abort.' : arguments[0];

  this.name = 'AbortError';
  this.message = message;
  if (Error.captureStackTrace) Error.captureStackTrace(this, AbortError);
}
(0, _inherits2.default)(AbortError, Error);

},{"inherits":"/Users/aleksey/code/treojs/fakeIndexedDB/node_modules/inherits/inherits_browser.js"}],"/Users/aleksey/code/treojs/fakeIndexedDB/src/errors/ConstraintError.js":[function(require,module,exports){
'use strict';

var _inherits = require('inherits');

var _inherits2 = _interopRequireDefault(_inherits);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = ConstraintError;

function ConstraintError() {
  var message = arguments.length <= 0 || arguments[0] === undefined ? ' A mutation operation in the transaction failed because a constraint was not satisfied. For example, an object such as an object store or index already exists and a request attempted to create a new one.' : arguments[0];

  this.name = 'ConstraintError';
  this.message = message;
  if (Error.captureStackTrace) Error.captureStackTrace(this, ConstraintError);
}
(0, _inherits2.default)(ConstraintError, Error);

},{"inherits":"/Users/aleksey/code/treojs/fakeIndexedDB/node_modules/inherits/inherits_browser.js"}],"/Users/aleksey/code/treojs/fakeIndexedDB/src/errors/DataCloneError.js":[function(require,module,exports){
'use strict';

var _inherits = require('inherits');

var _inherits2 = _interopRequireDefault(_inherits);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = DataCloneError;

function DataCloneError() {
  var message = arguments.length <= 0 || arguments[0] === undefined ? 'The data being stored could not be cloned by the internal structured cloning algorithm.' : arguments[0];

  this.name = 'DataCloneError';
  this.message = message;
  if (Error.captureStackTrace) Error.captureStackTrace(this, DataCloneError);
}
(0, _inherits2.default)(DataCloneError, Error);

},{"inherits":"/Users/aleksey/code/treojs/fakeIndexedDB/node_modules/inherits/inherits_browser.js"}],"/Users/aleksey/code/treojs/fakeIndexedDB/src/errors/DataError.js":[function(require,module,exports){
'use strict';

var _inherits = require('inherits');

var _inherits2 = _interopRequireDefault(_inherits);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = DataError;

function DataError() {
  var message = arguments.length <= 0 || arguments[0] === undefined ? 'Data provided to an operation does not meet requirements.' : arguments[0];

  this.name = 'DataError';
  this.message = message;
  if (Error.captureStackTrace) Error.captureStackTrace(this, DataError);
}
(0, _inherits2.default)(DataError, Error);

},{"inherits":"/Users/aleksey/code/treojs/fakeIndexedDB/node_modules/inherits/inherits_browser.js"}],"/Users/aleksey/code/treojs/fakeIndexedDB/src/errors/InvalidAccessError.js":[function(require,module,exports){
'use strict';

var _inherits = require('inherits');

var _inherits2 = _interopRequireDefault(_inherits);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = InvalidAccessError;

function InvalidAccessError() {
  var message = arguments.length <= 0 || arguments[0] === undefined ? 'An invalid operation was performed on an object. For example transaction creation attempt was made, but an empty scope was provided.' : arguments[0];

  this.name = 'InvalidAccessError';
  this.message = message;
  if (Error.captureStackTrace) Error.captureStackTrace(this, InvalidAccessError);
}
(0, _inherits2.default)(InvalidAccessError, Error);

},{"inherits":"/Users/aleksey/code/treojs/fakeIndexedDB/node_modules/inherits/inherits_browser.js"}],"/Users/aleksey/code/treojs/fakeIndexedDB/src/errors/InvalidStateError.js":[function(require,module,exports){
'use strict';

var _inherits = require('inherits');

var _inherits2 = _interopRequireDefault(_inherits);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = InvalidStateError;

function InvalidStateError() {
  var message = arguments.length <= 0 || arguments[0] === undefined ? 'An operation was called on an object on which it is not allowed or at a time when it is not allowed. Also occurs if a request is made on a source object that has been deleted or removed. Use TransactionInactiveError or ReadOnlyError when possible, as they are more specific variations of InvalidStateError.' : arguments[0];

  this.name = 'InvalidStateError';
  this.message = message;
  if (Error.captureStackTrace) Error.captureStackTrace(this, InvalidStateError);
}
(0, _inherits2.default)(InvalidStateError, Error);

},{"inherits":"/Users/aleksey/code/treojs/fakeIndexedDB/node_modules/inherits/inherits_browser.js"}],"/Users/aleksey/code/treojs/fakeIndexedDB/src/errors/NotFoundError.js":[function(require,module,exports){
'use strict';

var _inherits = require('inherits');

var _inherits2 = _interopRequireDefault(_inherits);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = NotFoundError;

function NotFoundError() {
  var message = arguments.length <= 0 || arguments[0] === undefined ? 'The operation failed because the requested database object could not be found. For example, an object store did not exist but was being opened.' : arguments[0];

  this.name = 'NotFoundError';
  this.message = message;
  if (Error.captureStackTrace) Error.captureStackTrace(this, NotFoundError);
}
(0, _inherits2.default)(NotFoundError, Error);

},{"inherits":"/Users/aleksey/code/treojs/fakeIndexedDB/node_modules/inherits/inherits_browser.js"}],"/Users/aleksey/code/treojs/fakeIndexedDB/src/errors/ReadOnlyError.js":[function(require,module,exports){
'use strict';

var _inherits = require('inherits');

var _inherits2 = _interopRequireDefault(_inherits);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = ReadOnlyError;

function ReadOnlyError() {
  var message = arguments.length <= 0 || arguments[0] === undefined ? 'The mutating operation was attempted in a "readonly" transaction.' : arguments[0];

  this.name = 'ReadOnlyError';
  this.message = message;
  if (Error.captureStackTrace) Error.captureStackTrace(this, ReadOnlyError);
}
(0, _inherits2.default)(ReadOnlyError, Error);

},{"inherits":"/Users/aleksey/code/treojs/fakeIndexedDB/node_modules/inherits/inherits_browser.js"}],"/Users/aleksey/code/treojs/fakeIndexedDB/src/errors/TransactionInactiveError.js":[function(require,module,exports){
'use strict';

var _inherits = require('inherits');

var _inherits2 = _interopRequireDefault(_inherits);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = TransactionInactiveError;

function TransactionInactiveError() {
  var message = arguments.length <= 0 || arguments[0] === undefined ? 'A request was placed against a transaction which is currently not active, or which is finished.' : arguments[0];

  this.name = 'TransactionInactiveError';
  this.message = message;
  if (Error.captureStackTrace) Error.captureStackTrace(this, TransactionInactiveError);
}
(0, _inherits2.default)(TransactionInactiveError, Error);

},{"inherits":"/Users/aleksey/code/treojs/fakeIndexedDB/node_modules/inherits/inherits_browser.js"}],"/Users/aleksey/code/treojs/fakeIndexedDB/src/errors/VersionError.js":[function(require,module,exports){
'use strict';

var _inherits = require('inherits');

var _inherits2 = _interopRequireDefault(_inherits);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = VersionError;

function VersionError() {
  var message = arguments.length <= 0 || arguments[0] === undefined ? 'An attempt was made to open a database using a lower version than the existing version.' : arguments[0];

  this.name = 'VersionError';
  this.message = message;
  if (Error.captureStackTrace) Error.captureStackTrace(this, VersionError);
}
(0, _inherits2.default)(VersionError, Error);

},{"inherits":"/Users/aleksey/code/treojs/fakeIndexedDB/node_modules/inherits/inherits_browser.js"}],"/Users/aleksey/code/treojs/fakeIndexedDB/src/extractKey.js":[function(require,module,exports){
'use strict';

var _structuredClone = require('./structuredClone');

var _structuredClone2 = _interopRequireDefault(_structuredClone);

var _validateKey = require('./validateKey');

var _validateKey2 = _interopRequireDefault(_validateKey);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

// http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#dfn-steps-for-extracting-a-key-from-a-value-using-a-key-path
module.exports = function extractKey(keyPath, value) {
  if (Array.isArray(keyPath)) {
    var _ret = (function () {
      var result = [];

      keyPath.forEach(function (item) {
        // This doesn't make sense to me based on the spec, but it is needed to pass the W3C KeyPath tests (see same comment in validateKey)
        if (item !== undefined && item !== null && typeof item !== 'string' && item.toString) {
          item = item.toString();
        }
        result.push((0, _structuredClone2.default)((0, _validateKey2.default)(extractKey(item, value))));
      });

      return {
        v: result
      };
    })();

    if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
  }

  if (keyPath === '') {
    return value;
  }

  var remainingKeyPath = keyPath;
  var object = value;

  while (remainingKeyPath !== null) {
    var i = remainingKeyPath.indexOf('.');
    var identifier = undefined;

    if (i >= 0) {
      identifier = remainingKeyPath.slice(0, i);
      remainingKeyPath = remainingKeyPath.slice(i + 1);
    } else {
      identifier = remainingKeyPath;
      remainingKeyPath = null;
    }

    if (!object.hasOwnProperty(identifier)) {
      return undefined;
    }

    object = object[identifier];
  }

  return object;
};

},{"./structuredClone":"/Users/aleksey/code/treojs/fakeIndexedDB/src/structuredClone.js","./validateKey":"/Users/aleksey/code/treojs/fakeIndexedDB/src/validateKey.js"}],"/Users/aleksey/code/treojs/fakeIndexedDB/src/idb-polyfill.js":[function(require,module,exports){
(function (global){
'use strict';

require('array.prototype.find');

require('array.prototype.findindex');

require('setimmediate');

require('polyfill-function-prototype-bind');

var _deets = require('deets');

var _deets2 = _interopRequireDefault(_deets);

var _FDBFactory = require('./FDBFactory');

var _FDBFactory2 = _interopRequireDefault(_FDBFactory);

var _FDBKeyRange = require('./FDBKeyRange');

var _FDBKeyRange2 = _interopRequireDefault(_FDBKeyRange);

var _FDBCursor = require('./FDBCursor');

var _FDBCursor2 = _interopRequireDefault(_FDBCursor);

var _FDBCursorWithValue = require('./FDBCursorWithValue');

var _FDBCursorWithValue2 = _interopRequireDefault(_FDBCursorWithValue);

var _FDBDatabase = require('./FDBDatabase');

var _FDBDatabase2 = _interopRequireDefault(_FDBDatabase);

var _FDBIndex = require('./FDBIndex');

var _FDBIndex2 = _interopRequireDefault(_FDBIndex);

var _FDBObjectStore = require('./FDBObjectStore');

var _FDBObjectStore2 = _interopRequireDefault(_FDBObjectStore);

var _FDBOpenDBRequest = require('./FDBOpenDBRequest');

var _FDBOpenDBRequest2 = _interopRequireDefault(_FDBOpenDBRequest);

var _FDBRequest = require('./FDBRequest');

var _FDBRequest2 = _interopRequireDefault(_FDBRequest);

var _FDBTransaction = require('./FDBTransaction');

var _FDBTransaction2 = _interopRequireDefault(_FDBTransaction);

var _FDBVersionChangeEvent = require('./FDBVersionChangeEvent');

var _FDBVersionChangeEvent2 = _interopRequireDefault(_FDBVersionChangeEvent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var indexedDb = new _FDBFactory2.default();
module.exports = {
  indexedDb: indexedDb,
  IDBCursor: _FDBCursor2.default,
  IDBCursorWithValue: _FDBCursorWithValue2.default,
  IDBDatabase: _FDBDatabase2.default,
  IDBFactory: _FDBFactory2.default,
  IDBIndex: _FDBIndex2.default,
  IDBKeyRange: _FDBKeyRange2.default,
  IDBObjectStore: _FDBObjectStore2.default,
  IDBOpenDBRequest: _FDBOpenDBRequest2.default,
  IDBRequest: _FDBRequest2.default,
  IDBTransaction: _FDBTransaction2.default,
  IDBVersionChangeEvent: _FDBVersionChangeEvent2.default,

  polyfill: function polyfill() {
    global.pIndexedDb = indexedDb;
    global.pIDBCursor = _FDBCursor2.default;
    global.pIDBCursorWithValue = _FDBCursorWithValue2.default;
    global.pIDBDatabase = _FDBDatabase2.default;
    global.pIDBFactory = _FDBFactory2.default;
    global.pIDBIndex = _FDBIndex2.default;
    global.pIDBKeyRange = _FDBKeyRange2.default;
    global.pIDBObjectStore = _FDBObjectStore2.default;
    global.pIDBOpenDBRequest = _FDBOpenDBRequest2.default;
    global.pIDBRequest = _FDBRequest2.default;
    global.pIDBTransaction = _FDBTransaction2.default;
    global.pIDBVersionChangeEvent = _FDBVersionChangeEvent2.default;
  },
  polyfillExcept: function polyfillExcept() {
    var browsers = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

    var browser = (0, _deets2.default)();
    if (browsers.indexOf(browser.name) === -1) this.polyfill();
  }
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./FDBCursor":"/Users/aleksey/code/treojs/fakeIndexedDB/src/FDBCursor.js","./FDBCursorWithValue":"/Users/aleksey/code/treojs/fakeIndexedDB/src/FDBCursorWithValue.js","./FDBDatabase":"/Users/aleksey/code/treojs/fakeIndexedDB/src/FDBDatabase.js","./FDBFactory":"/Users/aleksey/code/treojs/fakeIndexedDB/src/FDBFactory.js","./FDBIndex":"/Users/aleksey/code/treojs/fakeIndexedDB/src/FDBIndex.js","./FDBKeyRange":"/Users/aleksey/code/treojs/fakeIndexedDB/src/FDBKeyRange.js","./FDBObjectStore":"/Users/aleksey/code/treojs/fakeIndexedDB/src/FDBObjectStore.js","./FDBOpenDBRequest":"/Users/aleksey/code/treojs/fakeIndexedDB/src/FDBOpenDBRequest.js","./FDBRequest":"/Users/aleksey/code/treojs/fakeIndexedDB/src/FDBRequest.js","./FDBTransaction":"/Users/aleksey/code/treojs/fakeIndexedDB/src/FDBTransaction.js","./FDBVersionChangeEvent":"/Users/aleksey/code/treojs/fakeIndexedDB/src/FDBVersionChangeEvent.js","array.prototype.find":"/Users/aleksey/code/treojs/fakeIndexedDB/node_modules/array.prototype.find/index.js","array.prototype.findindex":"/Users/aleksey/code/treojs/fakeIndexedDB/node_modules/array.prototype.findindex/index.js","deets":"/Users/aleksey/code/treojs/fakeIndexedDB/node_modules/deets/index.js","polyfill-function-prototype-bind":"/Users/aleksey/code/treojs/fakeIndexedDB/node_modules/polyfill-function-prototype-bind/bind.js","setimmediate":"/Users/aleksey/code/treojs/fakeIndexedDB/node_modules/setimmediate/setImmediate.js"}],"/Users/aleksey/code/treojs/fakeIndexedDB/src/structuredClone.js":[function(require,module,exports){
'use strict';

var _isPlainObj = require('is-plain-obj');

var _isPlainObj2 = _interopRequireDefault(_isPlainObj);

var _DataCloneError = require('./errors/DataCloneError');

var _DataCloneError2 = _interopRequireDefault(_DataCloneError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

module.exports = structuredClone;

// http://www.w3.org/TR/html5/infrastructure.html#internal-structured-cloning-algorithm
function structuredClone(input, memory) {
  memory = memory !== undefined ? memory : [];

  for (var i = 0; i < memory.length; i++) {
    if (memory[i].source === input) {
      return memory[i].destination;
    }
  }

  var type = typeof input === 'undefined' ? 'undefined' : _typeof(input);
  var output = undefined;
  var deepClone = 'none';

  if (type === 'string' || type === 'number' || type === 'boolean' || type === 'undefined' || input === null) {
    return input;
  }

  if (input instanceof Boolean || input instanceof Number || input instanceof String || input instanceof Date) {
    output = new input.constructor(input.valueOf());
  } else if (input instanceof RegExp) {
    output = new RegExp(input.source, 'g'.substr(0, Number(input.global)) + 'i'.substr(0, Number(input.ignoreCase)) + 'm'.substr(0, Number(input.multiline)));

    // Supposed to also handle Blob, FileList, ImageData, ImageBitmap, ArrayBuffer, and "object with a [[DataView]] internal slot", but fuck it
  } else if (Array.isArray(input)) {
      output = new Array(input.length);
      deepClone = 'own';
    } else if ((0, _isPlainObj2.default)(input)) {
      output = {};
      deepClone = 'own';
    } else {
      throw new _DataCloneError2.default();
    }

  memory.push({
    source: input,
    destination: output
  });

  if (deepClone === 'own') {
    Object.keys(input).forEach(function (name) {
      if (input.hasOwnProperty(name)) {
        var sourceValue = input[name];
        var clonedValue = structuredClone(sourceValue, memory);
        output[name] = clonedValue;
      }
    });
  }

  return output;
}

},{"./errors/DataCloneError":"/Users/aleksey/code/treojs/fakeIndexedDB/src/errors/DataCloneError.js","is-plain-obj":"/Users/aleksey/code/treojs/fakeIndexedDB/node_modules/is-plain-obj/index.js"}],"/Users/aleksey/code/treojs/fakeIndexedDB/src/validateKey.js":[function(require,module,exports){
'use strict';

var _DataError = require('./errors/DataError');

var _DataError2 = _interopRequireDefault(_DataError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

// http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#dfn-valid-key
module.exports = function validateKey(key, seen) {
  if (typeof key === 'number') {
    if (isNaN(key)) {
      throw new _DataError2.default();
    }
  } else if (key instanceof Date) {
    if (isNaN(key.valueOf())) {
      throw new _DataError2.default();
    }
  } else if (Array.isArray(key)) {
    seen = seen !== undefined ? seen : [];
    key.forEach(function (x) {
      // Only need to test objects, because otherwise [0, 0] shows up as circular
      if ((typeof x === 'undefined' ? 'undefined' : _typeof(x)) === 'object' && seen.indexOf(x) >= 0) {
        throw new _DataError2.default();
      }
      seen.push(x);
    });

    var count = 0;
    key = key.map(function (item) {
      count += 1;
      return validateKey(item, seen);
    });
    if (count !== key.length) {
      throw new _DataError2.default();
    }
    return key;
  } else if (typeof key !== 'string') {
    throw new _DataError2.default();
  }

  return key;
};

},{"./errors/DataError":"/Users/aleksey/code/treojs/fakeIndexedDB/src/errors/DataError.js"}],"/Users/aleksey/code/treojs/fakeIndexedDB/src/validateKeyPath.js":[function(require,module,exports){
'use strict';

// http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#dfn-valid-key-path
module.exports = function validateKeyPath(keyPath, parent) {
  // This doesn't make sense to me based on the spec, but it is needed to pass the W3C KeyPath tests (see same comment in extractKey)
  if (keyPath !== undefined && keyPath !== null && typeof keyPath !== 'string' && keyPath.toString && (parent === 'array' || !Array.isArray(keyPath))) {
    keyPath = keyPath.toString();
  }

  if (typeof keyPath === 'string') {
    if (keyPath === '' && parent !== 'string') {
      return;
    }
    try {
      // https://mathiasbynens.be/demo/javascript-identifier-regex for ECMAScript 5.1 / Unicode v7.0.0, with reserved words at beginning removed
      var validIdentifierRegex = /^(?:[\$A-Z_a-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B2\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA7AD\uA7B0\uA7B1\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB5F\uAB64\uAB65\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC])(?:[\$0-9A-Z_a-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u08A0-\u08B2\u08E4-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58\u0C59\u0C60-\u0C63\u0C66-\u0C6F\u0C81-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D01-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D57\u0D60-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19D9\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABD\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1CD0-\u1CD2\u1CD4-\u1CF6\u1CF8\u1CF9\u1D00-\u1DF5\u1DFC-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200C\u200D\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u2E2F\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099\u309A\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA69D\uA69F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA7AD\uA7B0\uA7B1\uA7F7-\uA827\uA840-\uA873\uA880-\uA8C4\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB5F\uAB64\uAB65\uABC0-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2D\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC])*$/;
      if (keyPath.length >= 1 && validIdentifierRegex.test(keyPath)) {
        return;
      }
    } catch (err) {
      throw new SyntaxError(err.message);
    }
    if (keyPath.indexOf(' ') >= 0) {
      throw new SyntaxError('The keypath argument contains an invalid key path (no spaces allowed).');
    }
  }

  if (Array.isArray(keyPath) && keyPath.length > 0) {
    if (parent) {
      // No nested arrays
      throw new SyntaxError('The keypath argument contains an invalid key path (nested arrays).');
    }
    keyPath.forEach(function (part) {
      validateKeyPath(part, 'array');
    });
    return;
  } else if (typeof keyPath === 'string' && keyPath.indexOf('.') >= 0) {
    keyPath = keyPath.split('.');
    keyPath.forEach(function (part) {
      validateKeyPath(part, 'string');
    });
    return;
  }

  throw new SyntaxError();
};

},{}]},{},["/Users/aleksey/code/treojs/fakeIndexedDB/src/idb-polyfill.js"])("/Users/aleksey/code/treojs/fakeIndexedDB/src/idb-polyfill.js")
});