var _ = require("underscore"),
	Template = require("./Template");

function Project(source) {
	this.source = source;
	this.templates = {};

	if(!this.source) {
		throw new Error("Projects require a source json.");
	}
}

Project.prototype = {
	getDefaults: function () {
		return this.source['defaults'] || {};
	},

	getTemplatesFolder: function () {
		return this.source.templatesFolder || "templates";
	},

	getTemplate: function (templateName) {
		if(!this.templates[templateName]) {

			if(!this.source.templates[templateName]) {
				throw new Error("Template not found: "+ templateName);
			}

			this.templates[templateName] = new Template(templateName, 
														this.source.templates[templateName],
														this.getTemplatesFolder(),
														this.getDefaults());

			return this.templates[templateName];
		}
	}
}

module.exports = Project;