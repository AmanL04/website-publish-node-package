// Import package dependencies
const fs = require("fs");
const path = require("path");

// Import utility functions
const query = require("../utils/query");
const createZip = require("../utils/zip");
const { up: upAPI } = require("../utils/fetch");
const removeFile = require("../utils/removeFile");
const errorHandler = require("../utils/genericErrorHandler");

// Import regex to validate if the provided domain follows the required format
const { subdomainCaptureRegex } = require("../utils/regex");

/**
 * @function getSubdomainFromUser
 * @async
 * @description Prompt user to provide deplotment details, validate them and deploy the project if valid
 * @returns object|undefined - subdomain is retrieved from the provided domain
 */
async function getFolderAndSubdomainFromUser() {
	// Prompt user to provide the folder path of the static files
	const folder = await query("Folder Path: ");

	// Resolve the path to an absolute path
	const resolvedFolderPath = path.resolve(folder);

	// Check if the folder exists
	if (!fs.existsSync(resolvedFolderPath)) {
		throw new Error("Folder does not exist");
	}

	// Prompt user to provide the domain to which they want to deploy their static files
	const domain = await query("Domain (optional): ");

	// If domain is provided and is not of the required format
	if (domain && !subdomainCaptureRegex.test(domain)) {
		throw new Error(
			"Invalid domain. Format is https://your-subdomain-comes-here.publish.amanlodha.tech"
		);
	}

	// Retrieve the subdomain from the provided domain
	const matches = domain.match(subdomainCaptureRegex);
	const subdomain = matches ? matches[1] : undefined;

	return { folder: resolvedFolderPath, subdomain: subdomain };
}

/**
 * @function upCommandHandler
 * @async
 * @description Prompt user to provide deployment details, validate them and deploy the project if valid
 * @returns {Promise}
 */
async function upCommandHandler() {
	// Get the subdomain from user
	const { folder, subdomain } = await getFolderAndSubdomainFromUser().catch(
		errorHandler
	);

	// Zip the folder to send through an API
	const zipFilePath = await createZip(folder).catch(errorHandler);

	// TODO Check zip size. It cannot be greater than 20MB

	// Send the zipped folder of static files and subdomain data using up API
	const res = await upAPI(zipFilePath, subdomain).catch(errorHandler);

	// Check success of the response and if success show the URL to which it's deployed
	if (res.success) {
		console.log(res.message);
		console.log("Project deployed @ https://" + res.details);
	} else {
		console.error(res.message);
	}

	// Delete the zip file created
	await removeFile(zipFilePath);

	process.exit();
}

/**
 * @function addUpCommand
 * @param {Commander.Command} program - program instance of the "commander" node package
 * @description Adds a command "up" and provides an async handler for the same. Used to deploy the static files of an frontend application.
 * @returns void
 */
module.exports = function addUpCommand(program) {
	program
		.command("up")
		.description("Deploy your local website on server with a sharable link")
		.action(upCommandHandler);
};
