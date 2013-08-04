var _ = require("underscore");

var Template = function (name, descriptor, templatesFolder, defaults) {
	this.name = name;
	this.descriptor = descriptor;
	this.templatesFolder = this.templatesFolder;
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
		variables = _.extend({}, this.defaults, variables);

		
	}
}

module.exports = Template;