const readline = require("readline");

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

module.exports = (query, { muted } = {}) =>
	new Promise((resolve, reject) => {
		if (muted) {
			const stdin = process.openStdin();
			process.stdin.on("data", (char) => {
				char = char + "";
				switch (char) {
					case "\n":
					case "\r":
					case "\u0004":
						stdin.pause();
						break;
					default:
						process.stdout.clearLine();
						readline.cursorTo(process.stdout, 0);
						process.stdout.write(query + Array(rl.line.length + 1).join("*"));
						break;
				}
			});
			rl.question(query, (value) => {
				rl.history = rl.history.slice(1);
				resolve(value);
			});
		} else {
			rl.question(query, resolve);
		}
	});
