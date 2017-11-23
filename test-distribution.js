const Promise = require("bluebird");
const randomNumber = require("./");

Promise.map((new Array(2000000)), () => {
	return randomNumber(10, 30);
}).reduce((stats, number) => {
	if (stats[number] == null) {
		stats[number] = 0;
	}

	stats[number] += 1;

	return stats;
}, {}).then((stats) => {
	console.log(stats);
});