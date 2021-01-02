// Import package dependencies
const os = require("os");
const path = require("path");
const fsp = require("fs").promises;

// Import utility functions
const query = require("../utils/query.js");
const { signin: signinAPI } = require("../utils/fetch");
const errorHandler = require("../utils/genericErrorHandler");

/**
 * @function signInCommandHandler
 * @async
 * @description Prompt user to provide credentials for the account and sign them in with the keys returned
 * @returns {Promise}
 */
async function signInCommandHandler() {
	// Get the username and password (credentials) from the command line and mute the password echo
	const username = await query("Username: ").catch(errorHandler);
	const password = await query("Password: ", { muted: true }).catch(
		errorHandler
	);

	// Send the credentials to the signin API
	const res = await signinAPI(username.trim(), password.trim());

	// Check success of the response and if success save the keys returned to a file locally
	if (res.success) {
		await fsp
			.writeFile(
				path.resolve(path.join(os.homedir(), ".website-publish.json")),
				JSON.stringify({
					"X-API-KEY1": res.details.key1,
					"X-API-KEY2": res.details.key2,
					"X-API-USERNAME": username,
				})
			)
			.catch(errorHandler);
		console.log(res.message);
	} else {
		console.error(res.message);
	}

	process.exit();
}

/**
 * @function addSignInCommand
 * @param {Commander.Command} program - program instance of the "commander" node package
 * @description Adds a command "signin" and provides an async handler for the same
 * @returns void
 */
module.exports = function addSignInCommand(program) {
	program
		.command("signin")
		.description("Sign in to publisher")
		.action(signInCommandHandler);
};
