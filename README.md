# random-number-csprng-2

This is a fork of module [random-number-csprng](https://www.npmjs.com/package/random-number-csprng) without external dependencies and updated to be compatible with Node v12 and Babel v7.

## License

[WTFPL](http://www.wtfpl.net/txt/copying/) or [CC0](https://creativecommons.org/publicdomain/zero/1.0/), whichever you prefer. A donation and/or attribution are appreciated, but not required.

## Donate

Income of original module's author consists largely of donations for their projects. If this module is useful to you, consider [making a donation](http://cryto.net/~joepie91/donate.html) to the author!

You can donate using Bitcoin, PayPal, Flattr, cash-in-mail, SEPA transfers, and pretty much anything else.

## Contributing

Pull requests welcome. Please make sure your modifications are in line with the overall code style, and ensure that you're editing the files in `src/`, not those in `lib/`.

Build tool of choice is `gulp`; simply run `gulp` while developing, and it will watch for changes.

Be aware that by making a pull request, you agree to release your modifications under the licenses stated above.

## Usage

This module will return the result asynchronously - this is necessary to avoid blocking your entire application while generating a number.

An example:

```javascript
var randomNumber = require("random-number-csprng-2");

Promise.resolve().then(function() {
	return randomNumber(10, 30);
}).then(function(number) {
	console.log("Your random number:", number);
}).catch(function(err) {
	console.log("Something went wrong: " + err.code);
});
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