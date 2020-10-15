const { down: downAPI } = require("../utils/fetch");

module.exports = function (program) {
	program
		.command("down")
		.description("Remove an already uploaded website")
		.requiredOption("-d, --domain [string]", "string argument")
		.action(async (options) => {
			const regex = /^https:\/\/([a-zA-Z0-9_-]+)\.publish\.amanlodha\.tech$/;
			if (options.domain && !regex.test(options.domain)) {
				console.log("Invalid domain");
				process.exit();
			}

			const regexMainDomain = /^https:\/\/([a-zA-Z0-9_-]+\.publish\.amanlodha\.tech)(\/)?$/;
			try {
				const res = await downAPI(options.domain.match(regexMainDomain)[1]);
				console.log(res.message);
				console.log("NOTE: It may take a few minutes to propogate across the internet");
			} catch (err) {
				console.log(err);
			}
			process.exit();
		});
};
