const { user: userAPI } = require("../utils/fetch");

module.exports = function (program) {
	program
		.command("user")
		.description("Get currently logged in user data")
		.action(() => {
			userAPI()
				.then((res) => {
					if (res.success) {
						console.table([res.details]);
					} else {
						console.log(res.message);
					}
				})
				.then(process.exit);
		});
};
