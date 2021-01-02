/**
 * @description
 * Utility function to create the .website-publish.json file in the home directory.
 * Using appendFile function of the fs promises module as it creates a file if it doesn't already exist
 */
const os = require("os");
const path = require("path");
const fsp = require("fs").promises;
const errorHandler = require("./genericErrorHandler");

const filePath = path.join(os.homedir(), ".website-publish.json");

/**
 *
 * @function createStateFiles
 * @async
 * @description Create files required for the CLI if it doesn't already exist
 */
module.exports = async function createStateFiles() {
	"use strict";

	// Access the file, if an error occurs the file does not exist
	try {
		await fsp.access(filePath, "w");
	} catch (err) {
		if (err.code == "ENOENT")
			return fsp
				.writeFile(filePath, "{}", { encoding: "utf-8" })
				.catch(errorHandler);
		else errorHandler(err);
	}
};
