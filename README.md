# random-number-csprng

A CommonJS module for generating cryptographically secure pseudo-random numbers.

Works in Node.js, and should work in the browser as well, using Webpack or Browserify.

This module is based on code [originally written](https://gist.github.com/sarciszewski/88a7ed143204d17c3e42) by [Scott Arciszewski](https://github.com/sarciszewski), released under the WTFPL / CC0 / ZAP.

## License

[WTFPL](http://www.wtfpl.net/txt/copying/) or [CC0](https://creativecommons.org/publicdomain/zero/1.0/), whichever you prefer. A donation and/or attribution are appreciated, but not required.

## Donating

The income of Sven Slootweg, the original author of this NPM package, consists largely of donations for his projects. If this module is useful to you, consider [making a donation](http://cryto.net/~joepie91/donate.html)!

You can donate in bitcoin, or using PayPal, Flattr, cash-in-mail, SEPA transfers, and pretty much anything else.

## Contributing

Pull requests are welcome. Please make sure your modifications are in line with the overall code style.

Build tool of choice is `gulp`; simply run `gulp` while developing, and it will watch for changes.

Be aware that by making a pull request, you agree to release your modifications under the licenses stated above.

## Usage

This module will return the result asynchronously. This is necessary to avoid blocking the event loop while generating a number.

### Example

```javascript
var Promise = require("bluebird");
var randomNumber = require("random-number-csprng");

Promise.try(function() {
    return randomNumber(10, 30);
}).then(function(number) {
    console.log("A random number:", number);
}).catch({ code: "RandomGenerationError" }, function(err) {
    console.log("Something went wrong!");
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

## Changelog

* __1.1.0__ (November 22, 2017): Add TypeScript type definitions.
* __1.0.2__ (March 8, 2016): __*Security release!*__ Patch handling of large numbers; input values are now checked for `MIN_SAFE_INTEGER` and `MAX_SAFE_INTEGER`, and the correct bitwise operator is used (`>>>` rather than `>>`).
* __1.0.1__ (March 8, 2016): Unimportant file cleanup.
* __1.0.0__ (March 8, 2016): Initial release.