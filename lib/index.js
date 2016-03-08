'use strict';

var Promise = require("bluebird");
var crypto = Promise.promisifyAll(require("crypto"));
var createError = require("create-error");

var RandomGenerationError = createError("RandomGenerationError", {
	code: "RandomGenerationError"
});

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
		mask = mask << 1 | 1; /* 0x00001111 -> 0x00011111 */
		range = range >>> 1; /* 0x01000000 -> 0x00100000 */
	}

	return { bitsNeeded: bitsNeeded, bytesNeeded: bytesNeeded, mask: mask };
}

module.exports = function secureRandomNumber(minimum, maximum, cb) {
	return Promise.try(function () {
		if (crypto == null || crypto.randomBytesAsync == null) {
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

		var range = maximum - minimum;

		var _calculateParameters = calculateParameters(range);

		var bitsNeeded = _calculateParameters.bitsNeeded;
		var bytesNeeded = _calculateParameters.bytesNeeded;
		var mask = _calculateParameters.mask;


		if (bitsNeeded > 53) {
			throw new RandomGenerationError("Cannot generate numbers larger than 53 bits.");
		}

		return Promise.try(function () {
			return crypto.randomBytesAsync(bytesNeeded);
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
	}).nodeify(cb);
};

module.exports.RandomGenerationError = RandomGenerationError;
