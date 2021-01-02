// Import package dependencies
const fs = require("fs");
const path = require("path");
const archiver = require("archiver");

//This is the directory where the zip file will be written at.
const outputDirPath = ".";

/**
 * @function createZipAndSave
 * @description Create a zip of the folder specified using the folder path and save it in the output directory
 * @param {string} folderPath
 * @returns {Promise}
 */
module.exports = function createZipAndSave(folderPath) {
	// Resolve the file path to get an absolute path after joining the ouput directory path and a random number with "zip" as the extension
	const zipFilePath = path.resolve(
		path.join(
			outputDirPath,
			Math.round(Math.random() * 1000000000000000) + ".zip"
		)
	);

	// Return a promise which resolves after the writeStream piping has completed
	return new Promise((resolve, reject) => {
		// Create an archiver instance in zip format
		const ar = archiver.create("zip", {});

		// Create a write stream which when closed resolves the promise
		const output = fs.createWriteStream(zipFilePath, { flags: "w" });
		output.on("close", () => resolve(zipFilePath));

		ar.on("error", (err) => {
			console.error("error compressing: ", err);
			reject(err);
		});

		// Pipe the stream to the archiver instance
		ar.pipe(output);
		ar.directory(path.normalize(folderPath + "/"), "/");
		ar.finalize();
	});
};
