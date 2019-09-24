'use strict';

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var util = require('util');

var randomBytesAsync = util.promisify(require("crypto").randomBytes);

var RandomGenerationError =
/*#__PURE__*/
function (_Error) {
  _inherits(RandomGenerationError, _Error);

  function RandomGenerationError() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, RandomGenerationError);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(RandomGenerationError)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_this), "code", 'RandomGenerationError');

    return _this;
  }

  return RandomGenerationError;
}(_wrapNativeSuper(Error)); // NOTE: Code from https://github.com/then/nodeify/blob/master/index.js


var nextTick;

if (typeof setImmediate === 'function') {
  nextTick = setImmediate;
} else if ((typeof process === "undefined" ? "undefined" : _typeof(process)) === 'object' && process && process.nextTick) {
  nextTick = process.nextTick;
} else {
  nextTick = function nextTick(cb) {
    setTimeout(cb, 0);
  };
}

function nodeify(promise, cb) {
  if (typeof cb !== 'function') return promise;
  return promise.then(function (res) {
    nextTick(function () {
      cb(null, res);
    });
  }, function (err) {
    nextTick(function () {
      cb(err);
    });
  });
}

function calculateParameters(range) {
  /* This does the equivalent of:
   *
   *    bitsNeeded = Math.ceil(Math.log2(range));
   *    bytesNeeded = Math.ceil(bitsNeeded / 8);
   *    mask = Math.pow(2, bitsNeeded) - 1;
   *
   * ... however, it implements it as bitwise operations, to sidestep any
   * possible implementation errors regarding floating point numbers in
   * JavaScript runtimes. This is an easier solution than assessing each
   * runtime and architecture individually.
   */
  var bitsNeeded = 0;
  var bytesNeeded = 0;
  var mask = 1;

  while (range > 0) {
    if (bitsNeeded % 8 === 0) {
      bytesNeeded += 1;
    }

    bitsNeeded += 1;
    mask = mask << 1 | 1;
    /* 0x00001111 -> 0x00011111 */

    /* SECURITY PATCH (March 8, 2016):
     *   As it turns out, `>>` is not the right operator to use here, and
     *   using it would cause strange outputs, that wouldn't fall into
     *   the specified range. This was remedied by switching to `>>>`
     *   instead, and adding checks for input parameters being within the
     *   range of 'safe integers' in JavaScript.
     */

    range = range >>> 1;
    /* 0x01000000 -> 0x00100000 */
  }

  return {
    bitsNeeded: bitsNeeded,
    bytesNeeded: bytesNeeded,
    mask: mask
  };
}

module.exports = function secureRandomNumber(minimum, maximum, cb) {
  var promise = Promise.resolve().then(function () {
    if (randomBytesAsync == null) {
      throw new RandomGenerationError("No suitable random number generator available. Ensure that your runtime is linked against OpenSSL (or an equivalent) correctly.");
    }

    if (minimum == null) {
      throw new RandomGenerationError("You must specify a minimum value.");
    }

    if (maximum == null) {
      throw new RandomGenerationError("You must specify a maximum value.");
    }

    if (minimum % 1 !== 0) {
      throw new RandomGenerationError("The minimum value must be an integer.");
    }

    if (maximum % 1 !== 0) {
      throw new RandomGenerationError("The maximum value must be an integer.");
    }

    if (!(maximum > minimum)) {
      throw new RandomGenerationError("The maximum value must be higher than the minimum value.");
    }
    /* We hardcode the values for the following:
     *
     *   https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Number/MIN_SAFE_INTEGER
     *   https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER
     *
     * ... as Babel does not appear to transpile them, despite being ES6.
     */


    if (minimum < -9007199254740991 || minimum > 9007199254740991) {
      throw new RandomGenerationError("The minimum value must be inbetween MIN_SAFE_INTEGER and MAX_SAFE_INTEGER.");
    }

    if (maximum < -9007199254740991 || maximum > 9007199254740991) {
      throw new RandomGenerationError("The maximum value must be inbetween MIN_SAFE_INTEGER and MAX_SAFE_INTEGER.");
    }

    var range = maximum - minimum;

    if (range < -9007199254740991 || range > 9007199254740991) {
      throw new RandomGenerationError("The range between the minimum and maximum value must be inbetween MIN_SAFE_INTEGER and MAX_SAFE_INTEGER.");
    }

    var _calculateParameters = calculateParameters(range),
        bitsNeeded = _calculateParameters.bitsNeeded,
        bytesNeeded = _calculateParameters.bytesNeeded,
        mask = _calculateParameters.mask;

    return Promise.resolve().then(function () {
      return randomBytesAsync(bytesNeeded);
    }).then(function (randomBytes) {
      var randomValue = 0;
      /* Turn the random bytes into an integer, using bitwise operations. */

      for (var i = 0; i < bytesNeeded; i++) {
        randomValue |= randomBytes[i] << 8 * i;
      }
      /* We apply the mask to reduce the amount of attempts we might need
       * to make to get a number that is in range. This is somewhat like
       * the commonly used 'modulo trick', but without the bias:
       *
       *   "Let's say you invoke secure_rand(0, 60). When the other code
       *    generates a random integer, you might get 243. If you take
       *    (243 & 63)-- noting that the mask is 63-- you get 51. Since
       *    51 is less than 60, we can return this without bias. If we
       *    got 255, then 255 & 63 is 63. 63 > 60, so we try again.
       *
       *    The purpose of the mask is to reduce the number of random
       *    numbers discarded for the sake of ensuring an unbiased
       *    distribution. In the example above, 243 would discard, but
       *    (243 & 63) is in the range of 0 and 60."
       *
       *   (Source: Scott Arciszewski)
       */


      randomValue = randomValue & mask;

      if (randomValue <= range) {
        /* We've been working with 0 as a starting point, so we need to
         * add the `minimum` here. */
        return minimum + randomValue;
      } else {
        /* Outside of the acceptable range, throw it away and try again.
         * We don't try any modulo tricks, as this would introduce bias. */
        return secureRandomNumber(minimum, maximum);
      }
    });
  });
  return nodeify(promise, cb);
};

module.exports.RandomGenerationError = RandomGenerationError;