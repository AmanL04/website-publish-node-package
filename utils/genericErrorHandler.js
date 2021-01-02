/**
 * This callback type is called `errorCallback` and is displayed as a global symbol.
 *
 * @callback errorCallback
 * @param err - Error that has occured
 */

/**
 * @function genericErrorHandler
 * @description Handle errors in callbacks and promises in a generic fashion
 * @param err - Error that has occured
 * @param {boolean} [exitProcess=true]
 * @param {boolean} [logError=true]
 * @param {errorCallback} [callback=undefined]
 * @returns {undefined}
 */
module.exports = function genericErrorHandler(
	err,
	exitProcess = true,
	logError = true,
	callback = undefined
) {
	if (typeof callback == "function") callback(err);
	if (logError) console.log(`An error occured! Error: ${err}`);
	if (exitProcess) process.exit();
};
