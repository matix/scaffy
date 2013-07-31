var _ = require("underscore");

function _walk (object, variables) {
	if(typeof object == "object") {
		return _.map(_walk);
	}
	else if(typeof object == "string") {
		return _.template(object, variables)
	}
}

function Project(source) {
	this.source = source;

	if(!this.source) {
		throw new Error("Projects require a source json.");
	}
}

Project.prototype = {
	getDefaults: function () {
		return this.source['defaults'] || {};
	},

	resolve: function(variables) {
		this.variables = _.extend({}, this.getDefaults(), variables);
		this.resolved = _walk(this.source, this.variables);
	}
}

module.exports = Project;