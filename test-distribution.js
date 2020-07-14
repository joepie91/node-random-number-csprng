const secureRandomNumber = require("./");

async function start() {
	const stats = {};
	for (let i = 0; i < 2000000; i++) {
		if (i % 1000 === 0) {
			console.log('Getting random number #' + i);
		}

		const number = await secureRandomNumber(10, 30);
		if (stats[number] == null) {
			stats[number] = 0;
		}
		stats[number] += 1;
	}
	console.log(stats);
}

start().catch(function (err) {
	console.error(err);
});
