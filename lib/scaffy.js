var fs = require("fs"),
	path = require("path"),
	grunt = require("grunt"),
	Project = require("./scaffy/Project");

var scaffy = function(project) {
	this.project = new Project(project);
}

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

scaffy.bootstrap = function (args) {
	var cwd = process.cwd(),
		descriptorFileName = args.file || "Templates.json";

	var descriptorFile = _lookupDescriptor(cwd, descriptorFileName);

	if(descriptorFile) {
		var descriptor = grunt.file.readJSON(descriptorFile);
		this.project = new Project(descriptor);
	}
	else {
		throw new Error("Could not find a descriptor File.");
	}
}

scaffy.promptVariables = function () {
	return {};
}

scaffy.realizeTemplate = function (templateName, variables) {
	var template = this.project.getTemplate(templateName);
		template.realize(variables);
}

module.exports = scaffy;