const fs = require("fs");
const path = require("path");

const query = require("../utils/query.js");
const { signup: signupAPI } = require("../utils/fetch");

module.exports = function (program) {
	program
		.command("signup")
		.description("Create a publisher account")
		.action(async () => {
			const username = await query("Username: ");
			const fullname = await query("Full Name: ");
			const password = await query("Password: ", { muted: true });

			signupAPI(username.trim(), password.trim(), fullname.trim()).then((res) => {
				if (res.success) {
					fs.writeFileSync(
						path.resolve("utils/cred.json"),
						JSON.stringify({
							"X-API-KEY1": res.details.key1,
							"X-API-KEY2": res.details.key2,
							"X-API-USERNAME": username,
						})
					);
				}
				console.log(res.success ? res.message : "Error: " + res.message);
			});
		});
};
