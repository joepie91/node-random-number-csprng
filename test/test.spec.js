const { RandomGenerationError } = require('../lib');
const secureRandomNumber = require('../lib');

var expect = require('chai').expect;

describe('RandomNumberGenerator', function() {
	describe('error', function() {
		it('message should be error message', function() {
			const error = new RandomGenerationError("a");
			expect(error instanceof RandomGenerationError).to.equal(true);
			expect(new RandomGenerationError("a").message).to.deep.equal("a");
		});
	});
	describe('use', function() {
		it('missing maximum value', async function() {
			try {
				await secureRandomNumber(5, null);
			}
			catch (err) {
				expect(err instanceof RandomGenerationError).to.equal(true);
				expect(err.message).to.equal('You must specify a maximum value.');
			}
		});
		it('maximum value must be an integer', async function() {
			try {
				await secureRandomNumber(5, "b");
			}
			catch (err) {
				expect(err instanceof RandomGenerationError).to.equal(true);
				expect(err.message).to.equal('The maximum value must be an integer.');
			}
		});
		it('maximum value must be an integer', async function() {
			try {
				await secureRandomNumber(5, 0.5);
			}
			catch (err) {
				expect(err instanceof RandomGenerationError).to.equal(true);
				expect(err.message).to.equal('The maximum value must be an integer.');
			}
		});
		it('missing minimum value', async function() {
			try {
				await secureRandomNumber(null, null);
			}
			catch (err) {
				expect(err instanceof RandomGenerationError).to.equal(true);
				expect(err.message).to.equal('You must specify a minimum value.');
			}
		});
		it('minimum value must be an integer', async function() {
			try {
				await secureRandomNumber("a", "b");
			}
			catch (err) {
				expect(err instanceof RandomGenerationError).to.equal(true);
				expect(err.message).to.equal('The minimum value must be an integer.');
			}
		});
		it('minimum value must be an integer', async function() {
			try {
				await secureRandomNumber(0.5, "b");
			}
			catch (err) {
				expect(err instanceof RandomGenerationError).to.equal(true);
				expect(err.message).to.equal('The minimum value must be an integer.');
			}
		});
		it('maximum value must greater than minimum value', async function() {
			try {
				await secureRandomNumber(4, 3);
			}
			catch (err) {
				expect(err instanceof RandomGenerationError).to.equal(true);
				expect(err.message).to.equal('The maximum value must be greater than the minimum value.');
			}
		});
		it('minimum value must be an MIN_SAFE_INTEGER', async function() {
			try {
				await secureRandomNumber(-9007199254740992, 9007199254740991);
			}
			catch (err) {
				expect(err instanceof RandomGenerationError).to.equal(true);
				expect(err.message).to.equal('The minimum value must be inbetween MIN_SAFE_INTEGER and MAX_SAFE_INTEGER.');
			}
		});
		it('minimum value must be an MAX_SAFE_INTEGER', async function() {
			try {
				await secureRandomNumber(9007199254740992, 9007199254740995);
			}
			catch (err) {
				expect(err instanceof RandomGenerationError).to.equal(true);
				expect(err.message).to.equal('The minimum value must be inbetween MIN_SAFE_INTEGER and MAX_SAFE_INTEGER.');
			}
		});
		it('maximum value must be an MIN_SAFE_INTEGER', async function() {
			// scenario cannot be tested as having value of minimum lower than MIN_SAFE_INTEGER for the min. value of maximum
			// would have already failed a previous check.
		});
		it('maximum value must be an MAX_SAFE_INTEGER', async function() {
			try {
				await secureRandomNumber(1, 9007199254740995);
			}
			catch (err) {
				expect(err instanceof RandomGenerationError).to.equal(true);
				expect(err.message).to.equal('The maximum value must be inbetween MIN_SAFE_INTEGER and MAX_SAFE_INTEGER.');
			}
		});
		it('range must be an MAX_SAFE_INTEGER', async function() {
			// scenario cannot be tested as having range less than MIN_SAFE_INTEGER or greater than MAX_SAFE_INTEGER requires
			// mimimum and maximum values to have exceeded MIN_SAFE_INTEGER and MAX_SAFE_INTEGER ranges.
		});
		it('output between 1 and 10, promise', (done) => {
			secureRandomNumber(1, 10).then((value) => {
				expect(value).above(0);
				expect(value).below(11);
				done();
			}).catch(done);
		});
		it('output between 1 and 10, await', async function() {
			const value = await secureRandomNumber(1, 10);
			expect(value).above(0);
			expect(value).below(11);
		});
		it('output between 1 and 10, callback', () => {
			secureRandomNumber(1, 10, (value) => {
				expect(value).above(0);
				expect(value).below(11);
			});
		});
	});
});
