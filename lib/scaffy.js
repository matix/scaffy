var Project = require("./Project");

var scaffy = function(project) {
	this.project = new Project(project);
}

scaffy.realizeTemplate = function (templateName, variables) {
	var template = this.project.getTemplate(templateName);
	template.realize(variables);
}