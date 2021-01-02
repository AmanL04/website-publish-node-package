// Import utility functions
const { list: listAPI } = require("../utils/fetch");
const errorHandler = require("../utils/genericErrorHandler");

/**
 * @function convertDateToLocaleStringInObject
 * @description Convert the created_on field from EPOCH number format to locale string format in the data object
 * @param {object} data deployment object
 * @param {number} data.created_on the date field to be converted to human readable locale date
 * @returns object - created_on field is converted from number to human readable date string
 */
const convertDateToLocaleStringInObject = (data) => ({
	...data,
	created_on: new Date(data.created_on).toLocaleString(),
});

/**
 * @function listCommandHandler
 * @async
 * @description Show all the deployed frontend projects by the current user
 * @returns {Promise}
 */
async function listCommandHandler() {
	// Log to show the handler has started
	console.log("The uploaded websites are: ");

	// Retrieve the list of deployments using the list API
	const res = await listAPI().catch(errorHandler);

	// Check success of the response and if success show the list
	if (res.success) {
		// If list length is 0 it means no deployments have been issued
		if (res.details.length == 0) {
			console.table("No websites active");
		}
		// Otherwise map the list of deployment objects and convert the date to human readable format
		else {
			const mappedData = res.details.map(convertDateToLocaleStringInObject);
			console.table(mappedData);
		}
	} else {
		console.error(res.message);
	}

	process.exit();
}

/**
 * @function addListCommand
 * @param {Commander.Command} program - program instance of the "commander" node package
 * @description Adds a command "list" and provides an async handler for the same
 * @returns void
 */
module.exports = function addListCommand(program) {
	program
		.command("list")
		.description("List all of the uploaded websites by a user")
		.action(listCommandHandler);
};
