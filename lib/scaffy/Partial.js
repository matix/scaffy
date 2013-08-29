var Template = require("./Template");

var Partial = function () {
	return Template.apply(this, arguments);
}

Partial.prototype = Template.prototype;

module.exports = Partial;