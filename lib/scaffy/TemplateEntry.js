var path = require("path"),
    _ = require("underscore");

function _getTypeFromName (entry) {
  var lastFileSeparator = entry.lastIndexOf(path.sep);

  if(lastFileSeparator === entry.length-1) {
      return "folder";
  }
  else {
      return "file";
  }
}

function _getSourcePath (entry, templatesFolder) {
  return path.resolve(templatesFolder, entry);
}

function _getDestinationPath (entry) {
  return path.resolve(".", entry);
}

function _getDestinationPathFolder (dest) {
  return dest.substring(0, dest.lastIndexOf(path.sep)+1);
}

var TemplateEntry = function(entry, templatesFolder) {
  this.templatesFolder = templatesFolder;

  if(!entry) {
      throw new Error("TemplateEntry requires a source.")
  }

  if(typeof entry === "string") {
      var file = entry;
      entry = {}
      entry.file = file;
  }
  else if (!_.isObject(entry)) {
      throw new Error("Invalid entry type.")
  }

  if(!entry.file) {
      throw new Error("Entry must specify file.")
  }

  this.type     = entry.type || _getTypeFromName(entry.file);
  this.source   = entry.template? 
                            _getSourcePath(entry.template, this.templatesFolder)
                          : _getSourcePath(entry.file,     this.templatesFolder);
  this.dest     = _getDestinationPath(entry.file);
  this.destPath = _getDestinationPathFolder(this.dest);
};

module.exports = TemplateEntry;