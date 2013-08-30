var fs = require("fs"),
	path = require("path"),
	Project = require("./scaffy/Project"),
	pkg = _readJSON(path.resolve(__dirname,"..", "package.json"));

function _readJSON (file) {
	return JSON.parse(fs.readFileSync(file, "utf-8"));
}

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

scaffy.bootstrap = function (args, callback) {
	var cwd = args.cwd || process.cwd(),
		descriptorFileName = args.file || "Templates.json";

	var descriptorFile = _lookupDescriptor(cwd, descriptorFileName);

	if(descriptorFile) {
		var descriptor = _readJSON(descriptorFile);
		this.project = new Project(descriptor);
		callback && callback(scaffy);
	}
	else {
		throw new Error("Could not find a descriptor File.");
	}
}

scaffy.configure = function (callback) {
	this.project.configure(function(){
		callback && callback(scaffy);
	});
}

scaffy.realizeTemplate = function (templateName) {
	var template = this.project.getTemplate(templateName);
		template.configure(function () {
			template.realize();
		});
}

scaffy.realizePartial = function (partialName) {
	var partial = this.project.getPartial(partialName);
		partial.configure(function () {
			partial.realize();
		});
}

scaffy.version = pkg.version;

module.exports = scaffy;