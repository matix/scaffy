var _ = require("underscore"),
	path = require("path"),
	fs = require("fs"),
	shell = require("shelljs");

var Template = function (name, descriptor, templatesFolder, defaults) {
	this.name = name;
	this.descriptor = descriptor;
	this.templatesFolder = templatesFolder;
	this.defaults = defaults;
}

function _walk (object, variables) {
	if(typeof object == "object") {
		return _.map(object, _walk);
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


		_.each(realizedDescriptor, function (entry) {
			if(typeof entry == "string") {
				var lastFileSeparator = entry.lastIndexOf(path.sep);

				if(lastFileSeparator === entry.length-1) {
					shell.mkdir("-p", entry);
					console.log("created folder:", entry);
				}
				else {
					var source = path.resolve(self.templatesFolder, entry),
						dest = path.resolve(".", entry),
						destPath = dest.substring(0, dest.lastIndexOf(path.sep)+1);

					shell.mkdir("-p", destPath);

					if(shell.test("-f", source)) {
						var sourceTemplate =  shell.cat(source),
							result = _.template(sourceTemplate, variables);

						_write(dest, result);

						console.log("Created file", dest, "from", source);

					}
					else {
						if(!shell.test("-f", dest)) {
							_touch(dest);
							console.log("Created file", dest);
						}
						else {
							console.log("File already exists: ", dest);
						}
					}
				}

			}
		});
	}
}

module.exports = Template;