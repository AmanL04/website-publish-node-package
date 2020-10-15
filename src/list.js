const { list: listAPI } = require("../utils/fetch");

module.exports = function (program) {
	program
		.command("list")
		.description("List all of the uploaded websites by a user")
		.action(() => {
			console.log("The uploaded websites are: ");
			listAPI()
				.then((res) => {
					if (res.success) {
						if (res.details.length == 0) console.table("No websites active");
						else
							console.table(
								res.details.map((x) => ({ ...x, created_on: new Date(x.created_on).toLocaleString() }))
							);
					} else {
						console.log(res.message);
					}
				})
				.then(process.exit);
		});
};
