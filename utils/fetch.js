// Import package dependencies
const os = require("os");
const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");
const FormData = require("form-data");

// The API keys and username stored locally to continue the session
const credentials = JSON.parse(
	fs.readFileSync(
		path.resolve(path.join(os.homedir(), ".website-publish.json"))
	)
);

// Headers which are common for all the APIs
const jsonHeaders = {
	Accept: "application/json",
	"Content-Type": "application/json",
};

// TODO convert all to async functions rather than using "then"

/**
 * @function createAPIUrl
 * @description Create the RESTful API Url dynamically
 * @param {string} type
 * @param {string} subtype
 * @returns {string}
 */
const createAPIUrl = (type, subtype) =>
	`https://publish.amanlodha.tech/v1/${type}/${subtype ? subtype : ""}`;

/**
 * @typedef Response
 * @property {bool} success True if the API was successfully executed as required.
 * @property {*} details The data (actual response) that the API wants to return.
 * @property {string} message The response message describing how the API ran.
 */

/**
 * @function upAPI
 * @description Make an API call to send the zipped file and subdomain (optional) to deploy the user's project
 * @param {string} zipFilePath
 * @param {string} [subdomain]
 * @returns {Promise<Response|Error>}
 */
exports.up = function upAPI(zipFilePath, subdomain) {
	const formData = new FormData();
	if (subdomain) formData.append("subdomain", subdomain);
	formData.append("website", fs.createReadStream(zipFilePath));

	return fetch(createAPIUrl("website", "deploy"), {
		method: "PUT",
		body: formData,
		headers: { ...credentials },
	}).then((res) => res.json());
};

/**
 * @function downAPI
 * @description Make an API call to undeploy the user's project based on the given URL
 * @param {string} url - the project associated with this URL will be undeployed
 * @returns {Promise<Response|Error>}
 */
exports.down = function downAPI(url) {
	return fetch(createAPIUrl("website", "undeploy"), {
		method: "PUT",
		body: JSON.stringify({ url }),
		headers: { ...credentials, ...jsonHeaders },
	}).then((res) => res.json());
};

/**
 * @function listAPI
 * @description Make an API call to get the list the user's projects which have been deployed
 * @returns {Promise<Response|Error>}
 */
exports.list = function listAPI() {
	return fetch(createAPIUrl("website", "list"), {
		method: "GET",
		headers: { ...credentials, ...jsonHeaders },
	}).then((res) => res.json());
};

/**
 * @function userAPI
 * @description Make an API call to get the user's details
 * @returns {Promise<Response|Error>}
 */
exports.user = function userAPI() {
	return fetch(createAPIUrl("user"), {
		method: "GET",
		headers: { ...credentials, ...jsonHeaders },
	}).then((res) => res.json());
};

/**
 * @function signinAPI
 * @description Make an API call to signin the user using the credentials provided
 * @param {string} username
 * @param {string} password
 * @returns {Promise<Response|Error>}
 */
exports.signin = function signinAPI(username, password) {
	return fetch(createAPIUrl("auth", "signin"), {
		method: "POST",
		body: JSON.stringify({ username, password }),
		headers: jsonHeaders,
	}).then((res) => res.json());
};

/**
 * @function signupAPI
 * @description Make an API call to signup the user using the details provided
 * @param {string} username
 * @param {string} password
 * @param {string} fullname
 * @returns {Promise<Response|Error>}
 */
exports.signup = function signupAPI(username, password, fullname) {
	return fetch(createAPIUrl("auth", "signup"), {
		method: "PUT",
		body: JSON.stringify({ username, password, fullname }),
		headers: jsonHeaders,
	}).then((res) => res.json());
};
