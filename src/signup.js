// Import package dependencies
const os = require("os");
const path = require("path");
const fsp = require("fs").promises;

// Import utility functions
const query = require("../utils/query.js");
const { signup: signupAPI } = require("../utils/fetch");
const errorHandler = require("../utils/genericErrorHandler");

/**
 * @function signUpCommandHandler
 * @async
 * @description Prompt user to provide account details and sign them up. Use with the keys returned to sign them in as well
 * @returns {Promise}
 */
async function signUpCommandHandler() {
	// Get the username, full name and password from the command line and mute the password echo
	const username = await query("Username: ").catch(errorHandler);
	const fullname = await query("Full Name: ").catch(errorHandler);
	const password = await query("Password: ", { muted: true }).catch(
		errorHandler
	);

	// Send the account data (trimmed) to the signup API
	const res = await signupAPI(
		username.trim(),
		password.trim(),
		fullname.trim()
	).catch(errorHandler);

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
 * @function addSignUpCommand
 * @param {Commander.Command} program - program instance of the "commander" node package
 * @description Adds a command "signup" and provides an async handler for the same
 * @returns void
 */
module.exports = function addSignUpCommand(program) {
	program
		.command("signup")
		.description("Create a publisher account")
		.action(signUpCommandHandler);
};
