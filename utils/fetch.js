const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");
const FormData = require("form-data");

const headers = JSON.parse(fs.readFileSync(path.resolve(path.join(__dirname, "cred.json"))));
const jsonHeaders = { Accept: "application/json", "Content-Type": "application/json" };

const api_url = (type, subtype) => `https://publish.amanlodha.tech/v1/${type}/${subtype ? subtype : ""}`;

exports.up = function (zipFilePath, subdomain) {
	const formData = new FormData();
	if (subdomain) formData.append("subdomain", subdomain);
	formData.append("website", fs.createReadStream(zipFilePath));

	return fetch(api_url("website", "deploy"), {
		method: "PUT",
		body: formData,
		headers: { ...headers },
	}).then((res) => res.json());
};

exports.down = function (url) {
	return fetch(api_url("website", "undeploy"), {
		method: "PUT",
		body: JSON.stringify({ url }),
		headers: { ...headers, ...jsonHeaders },
	}).then((res) => res.json());
};

exports.list = function () {
	return fetch(api_url("website", "list"), {
		method: "GET",
		headers: { ...headers, ...jsonHeaders },
	}).then((res) => res.json());
};

exports.user = function () {
	return fetch(api_url("user"), {
		method: "GET",
		headers: { ...headers, ...jsonHeaders },
	}).then((res) => res.json());
};

exports.signin = function (username, password) {
	return fetch(api_url("auth", "signin"), {
		method: "POST",
		body: JSON.stringify({ username, password }),
		headers: jsonHeaders,
	}).then((res) => res.json());
};

exports.signup = function (username, password, fullname) {
	return fetch(api_url("auth", "signup"), {
		method: "PUT",
		body: JSON.stringify({ username, password, fullname }),
		headers: jsonHeaders,
	}).then((res) => res.json());
};
