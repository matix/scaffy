var _ = require("underscore"),
	path = require("path");

var Template = function (name, descriptor, templatesFolder, defaults) {
	this.name = name;
	this.descriptor = descriptor;
	this.templatesFolder = templatesFolder;
	this.defaults = defaults;
}

function _walk (object, variables) {
	if(typeof object == "object") {
		return _.map(_walk);
	}
	else if(typeof object == "string") {
		return _.template(object, variables)
	}
}

Template.prototype = {
	realize: function (variables) {
		var self = this;

		variables = _.extend({}, this.defaults, variables);

		_.each(this.descriptor, function (entry) {
			if(typeof entry == "string") {
				if(entry.indexOf("/") === entry.length-1) {
					console.log("FOLDER", entry);
				}
				else {
					var source = path.resolve(".", self.templatesFolder, entry);
					console.log("FILE", entry,  " -> ", source);
				}

			}
		});
	}
}

module.exports = Template;