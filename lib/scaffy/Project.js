var Configurator = require("./Configurator"),
	Template = require("./Template"),
	Partial = require("./Partial");

function Project(source) {
	this.source = source;
	this.templates = {};
	this.partials = {};

	if(!this.source) {
		throw new Error("Projects require a source json.");
	}
}

Project.prototype = {

	configure: function (callback) {
		var self = this;
		if(this.source.configure) {
			Configurator.configure(this.source.configure, function (config) {
				self.defaults = config;
				callback && callback(config);
			});
		}
		else {
			callback({});
		}
	},

	getDefaults: function () {
		return this.defaults || {};
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
	},

	getPartial: function (partialName) {
		if(!this.partials[partialName]) {

			if(!this.source.partials[partialName]) {
				throw new Error("Partial not found: "+ partialName);
			}

			this.partials[partialName] = new Partial(partialName, 
										 			 this.source.partials[partialName],
													 this.getTemplatesFolder(),
													 this.getDefaults());

			return this.partials[partialName];
		}
	}
}

module.exports = Project;