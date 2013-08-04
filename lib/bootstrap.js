module.exports = function (program) {
	var fs = require("fs"),
		path = require("path"),
		grunt = require("grunt"),
		scaffy = require("./scaffy");

	var cwd = process.cwd(),
		descriptorFileName = program.file || "Templates.json";

	function _lookupDescriptor (currentDir, descriptorFileName) {
		var testLocation = path.resolve(currentDir, descriptorFileName),
			found = false;

		try {
			found = fs.statSync(testLocation).isFile();
		}
		catch(e) {
			found = false;
		}

		if(found) {
			return testLocation;
		}
		else {
			var nextDir = path.resolve(currentDir, "..");

			if(nextDir != currentDir) {
				return _lookupDescriptor(nextDir, descriptorFileName);
			}
		}
	}

	var descriptorFile = _lookupDescriptor(cwd, descriptorFileName);

	if(descriptorFile) {
		scaffy.run(descriptorFile);
	}
	else {
		// error: could not find a descriptor file
	}
}