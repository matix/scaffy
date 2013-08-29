var _ = require("underscore"),
	fs = require("fs"),
	shell = require("shelljs"),
	TemplateEntry = require("./TemplateEntry");

var Template = function (name, descriptor, templatesFolder, defaults) {
	this.name = name;
	this.descriptor = descriptor;
	this.templatesFolder = templatesFolder;
	this.defaults = defaults;
}

function _walk (object, variables) {
	if(typeof object == "object") {
		return _.map(object, function(object){
			return _walk(object, variables);
		});
	}
	else if(typeof object == "string") {
		return _.template(object, variables)
	}
}

function _touch(path) {
	fs.closeSync(fs.openSync(path, "w"));
}

function _write (path, contents) {
	fs.writeFileSync(path, contents);
}

Template.prototype = {
	realize: function (variables) {
		variables = _.extend({}, this.defaults, variables);

		var self = this,
			realizedDescriptor = _walk(this.descriptor, variables);

		realizedDescriptor.forEach(function (entrySource) {
			var entry = new TemplateEntry(entrySource, self.templatesFolder);

			if(entry.type == "folder") {
				shell.mkdir("-p", entry.dest);
				console.log("Created folder:", entry.dest);
			}
			else {
				shell.mkdir("-p", entry.destPath);

				if(shell.test("-f", entry.source)) {
					var sourceTemplate =  shell.cat(entry.source),
						result = _.template(sourceTemplate, variables);

					_write(entry.dest, result);

					console.log("Created file", entry.dest, "from", entry.source);

				}
				else {
					if(!shell.test("-f", entry.dest)) {
						_touch(entry.dest);
						console.log("Created file", entry.dest);
					}
					else {
						console.log("File already exists: ", entry.dest);
					}
				}
			}
		});
	}
}

module.exports = Template;