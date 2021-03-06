var _ = require("underscore"),
    fs = require("fs"),
    shell = require("shelljs"),
    TemplateEntry = require("./TemplateEntry"),
    Configurator = require("./Configurator");

var Template = function (name, descriptor, templatesFolder, defaults) {
  this.name = name;
  this.descriptor = descriptor;
  this.templatesFolder = templatesFolder;
  this.defaults = defaults;

  if(_.isArray(this.descriptor)) {
      this.descriptor = {
          files: this.descriptor
      }
  }
  else if(!_.isObject(this.descriptor)) {
      throw new Error("Invalid descriptor type.")
  }
}

function _walk (object, variables) {
  if(_.isArray(object)) {
      return _.map(object, function(object){
          return _walk(object, variables);
      });
  }
  else if(typeof object == "object") {
      var obj2 = {};
      for (var k in object) {
          obj2[k] = _walk(object[k], variables);
      }
      return obj2;
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
  configure: function (callback) {
      var self = this;
      Configurator.configure(this.descriptor.configure, function (config) {
          self.variables = config;
          callback && callback(config);
      });
  },

  realize: function (variables) {
      var self = this,
      templateVariables = _.extend({}, self.defaults, self.variables, variables),
      processedFiles = _walk(self.descriptor.files, templateVariables);

      processedFiles.forEach(function (entrySource) {
          var entry = new TemplateEntry(entrySource, self.templatesFolder);

          if(entry.type == "folder") {
              shell.mkdir("-p", entry.dest);
              console.log("Created folder:", entry.dest);
          }
          else {
              shell.mkdir("-p", entry.destPath);

              if(shell.test("-f", entry.source)) {
                  var sourceTemplate =  shell.cat(entry.source),
                  result = _.template(sourceTemplate, templateVariables);

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