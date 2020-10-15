const fs = require("fs");

module.exports = function (filePath) {
	fs.unlinkSync(filePath);
};
