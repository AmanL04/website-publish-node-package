const archiver = require("archiver");
const path = require("path");
const fs = require("fs");

//This is the directory where the zip file will be written into.
const outputDirname = ".";

module.exports = function saveToZip(pathOfContentDirToInsertIntoArchive) {
	//we use the utility package just to get a timestamp string that we put
	//into the output zip filename
	const zipFilepath = path.normalize(
		path.join(outputDirname, Math.round(Math.random() * 1000000000000000) + ".zip")
	);

	return new Promise((resolve, reject) => {
		const ar = archiver.create("zip", {});

		const output = fs.createWriteStream(zipFilepath, { flags: "w" });
		output.on("close", function () {
			//console.log(ar.pointer() + ' total bytes');
			resolve(zipFilepath);
		});

		ar.on("error", function (err) {
			console.error("error compressing: ", err);
			reject(err);
		});

		ar.pipe(output);
		ar.directory(path.normalize(pathOfContentDirToInsertIntoArchive + "/"), "/").finalize();
	});
};
