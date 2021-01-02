// Import package dependencies
const fsp = require("fs").promises;

/**
 * @function removeFile
 * @description Function which unlinks (deletes in our case) the given file path
 * @returns {Promise}
 * */
module.exports = function removeFile(filePath) {
	return fsp.unlink(filePath);
};
