# random-number-csprng

This is a fork of module random-number-csprng-2 without external dependencies and updated to be compatible with Node v12 and Babel v7.

A CommonJS module for generating cryptographically secure pseudo-random numbers.

Works in Node.js; This fork isn't tested in browser yet. You can help with it.

This module is based on code [originally written](https://gist.github.com/sarciszewski/88a7ed143204d17c3e42) by [Scott Arciszewski](https://github.com/sarciszewski), released under the WTFPL / CC0 / ZAP, [random-number-csprng](https://github.com/joepie91/node-random-number-csprng) by [Sven Slootweg](https://github.com/joepie91), and [random-number-csprng-2](https://github.com/PROger4ever-NodeJS/node-random-number-csprng-2).

## License

[WTFPL](http://www.wtfpl.net/txt/copying/) or [CC0](https://creativecommons.org/publicdomain/zero/1.0/), whichever you prefer.

## Contributing

Pull requests welcome. Please make sure your modifications are in line with the overall code style, and ensure that you're editing the files in `src/`, not those in `lib/`.

Build tool of choice is `gulp`; simply run `npm run build` while developing, and it will watch for changes.

Be aware that by making a pull request, you agree to release your modifications under the licenses stated above.

## Usage

This module will return the result asynchronously - this is necessary to avoid blocking your entire application while generating a number.

Promise example:

```javascript
const randomNumberCsrpg = require("@thzero/random-number-csprng");

Promise.resolve().then(function() {
	return randomNumberCsrpg(10, 30);
}).then(function(number) {
	console.log("Your random number:", number);
}).catch(function(err) {
	console.log("Something went wrong: " + err.code);
});
```

Await example:

```javascript
const randomNumberCsrpg = require("@thzero/random-number-csprng");
const randomNumber = await randomNumberCsrpg(10, 30);
```

## API

### randomNumber(minimum, maximum, [cb])

Returns a Promise that resolves to a random number within the specified range.

Note that the range is __inclusive__, and both numbers __must be integer values__. It is not possible to securely generate a random value for floating point numbers, so if you are working with fractional numbers (eg. `1.24`), you will have to decide on a fixed 'precision' and turn them into integer values (eg. `124`).

* __minimum__: The lowest possible value in the range.
* __maximum__: The highest possible value in the range. Inclusive.

Optionally also accepts a nodeback as `cb`, but seriously, you should be using [Promises](https://gist.github.com/joepie91/791640557e3e5fd80861).

### randomNumber.RandomGenerationError

Any errors that occur during the random number generation process will be of this type. The error object will also have a `code` property, set to the string `"RandomGenerationError"`.

The error message will provide more information, but this kind of error will generally mean that the arguments you've specified are somehow invalid.

## Notes

Don't use ranges any bigger than 2^32 - 1 or 4,294,97,295. Details in [Issue #4 of the original module](https://github.com/joepie91/node-random-number-csprng/issues/4).

This fork isn't tested in browser yet. You can help with it.