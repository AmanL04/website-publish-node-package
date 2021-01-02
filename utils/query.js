// Import package dependencies
const readline = require("readline");

// Create a readline interface with stdin and stdout as the input and output streams
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

/**
 * @function query
 * @description Prompt user to provide input for certain queries
 * @param {string} query The prompt to show to the user
 * @param {Object} [obj={}] - Options
 * @param {boolean} obj.muted - Should the user's input be echoed as a star(*) on the CLI or should it be shown as is
 * @returns {Promise}
 */
module.exports = function query(query, { muted } = {}) {
	// Returns a promise which resolves when the input data is recieved from the CLI
	return new Promise((resolve, reject) => {
		if (muted) {
			/**
			 * If the muted option is true then open the process' stdin and modify it using the following rules for every data
			 * 1. If newline, carraige return or End-of-Transmission then ignore and do not write anything to process' stdout and pause the stdin
			 * 2. Otherwise clear the line and move to cursor the to start of the line to enter N number of stars, where N = line length
			 */
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
				// To clear the history slice the history array excluding the first element
				rl.history = rl.history.slice(1);
				resolve(value);
			});
		} else {
			/**
			 * If muted = false | undefined then just query with the echo-ing of normal characters
			 */
			rl.question(query, resolve);
		}
	});
};
