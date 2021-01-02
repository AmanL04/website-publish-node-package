// Import utility functions
const { user: userAPI } = require("../utils/fetch");
const errorHandler = require("../utils/genericErrorHandler");

/**
 * @function userCommandHandler
 * @async
 * @description Show details about the current user in table format
 * @returns {Promise}
 */
async function userCommandHandler() {
	// Retrieve user information using the user API
	const res = await userAPI().catch(errorHandler);

	// Check success of the response and if success show the user data
	if (res.success) {
		/**
		 * To log in table format such that the object's property name is the column header
		 * we have to send an array of objects.
		 * Hence the single user object is converted to an array of single user object
		 */
		console.table([res.details]);
	} else {
		console.error(res.message);
	}

	process.exit();
}

/**
 * @function addUserCommand
 * @param {Commander.Command} program - program instance of the "commander" node package
 * @description Adds a command "user" and provides an async handler for the same
 * @returns void
 */
module.exports = function addUserCommand(program) {
	program
		.command("user")
		.description("Get currently logged in user data")
		.action(userCommandHandler);
};
