const fs = require("fs");
const path = require("path");

const query = require("../utils/query");
const createZip = require("../utils/zip");
const removeFile = require("../utils/removeFile");
const { up: upAPI } = require("../utils/fetch");

module.exports = function (program) {
	program
		.command("up")
		.description("Deploy your local website on server with a sharable link")
		.action(async () => {
			const folder = await query("Folder Path: ").then(path.resolve);

			if (!fs.existsSync(folder)) {
				console.log("Folder does not exist");
				process.exit();
			}
			const domain = await query("Domain (optional): ");
			const regex = /^https:\/\/([a-zA-Z0-9_]+)\.publish\.amanlodha\.tech$/;

			if (domain && !regex.test(domain)) {
				console.log("Invalid domain. Format is https://your-subdomain-comes-here.publish.amanlodha.tech");
				process.exit();
			}
			const subdomain = domain.match(regex);

			const zipFilePath = await createZip(folder);

			// TODO Check folder size. It cannot be greater than 20MB

			try {
				const res = await upAPI(zipFilePath, subdomain ? subdomain[1] : undefined);
				console.log(res.message);
				console.log("URL: https://" + res.details);
			} catch (err) {
				console.log(err);
			}
			removeFile(zipFilePath);
			process.exit();
		});
};
