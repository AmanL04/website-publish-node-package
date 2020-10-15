const fs = require("fs");
const path = require("path");

const query = require("../utils/query.js");
const { signin: signinAPI } = require("../utils/fetch");

module.exports = function (program) {
	program
		.command("signin")
		.description("Sign into publisher")
		.action(async () => {
			const username = await query("Username: ");
			const password = await query("Password: ", { muted: true });

			signinAPI(username.trim(), password.trim()).then((res) => {
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
				console.log(res.message);
			});
		});
};
