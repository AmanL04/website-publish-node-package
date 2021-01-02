// Import utility functions
const { down: downAPI } = require("../utils/fetch");
const errorHandler = require("../utils/genericErrorHandler");

// Import regex to validate if the provided domain follows the required format
const {
	subdomainCaptureRegex,
	fulldomainCaptureRegex,
} = require("../utils/regex");

/**
 * @function downCommandHandler
 * @async
 * @description Undeploy the already deployed project by the user. Identify the deployment using the domain it was deployed at.
 * @returns {Promise}
 */
async function downCommandHandler(options) {
	// NOTE: "options" object is available to us through the commander's program instance

	// Check if domain option is provided and if it follows the required format
	if (options.domain && !subdomainCaptureRegex.test(options.domain)) {
		console.error("Invalid domain");
		process.exit();
	}

	// Capture the fulldomain from the regex - this the the domain at which the project was deployed
	// It excludes trailing slashes and "https://" prefix
	const fullDomain = options.domain.match(fulldomainCaptureRegex)[1];

	// Undeploy the deployed project using the down API
	const res = await downAPI(fullDomain).catch(errorHandler);

	// Check success of the response and if success show the URL to which it's deployed
	if (res.success) {
		console.log(res.message);
		console.log(
			"NOTE: It may take a few minutes to propogate across the internet"
		);
	} else {
		console.error(res.message);
	}

	process.exit();
}

/**
 * @function addDownCommand
 * @param {Commander.Command} program - program instance of the "commander" node package
 * @description Adds a command "down" and provides an async handler for the same. Used to undeploy the static files of an frontend application.
 * @returns void
 */
module.exports = function addDownCommand(program) {
	program
		.command("down")
		.description("Remove an already uploaded website")
		.requiredOption("-d, --domain [string]", "string argument")
		.action(downCommandHandler);
};
