var _ = require("underscore"),
    colors = require('colors'),
    prompt = require("prompt");

colors.setTheme({
  silly: 'rainbow',
  input: 'grey',
  verbose: 'cyan',
  prompt: 'grey',
  info: 'green',
  data: 'grey',
  help: 'cyan',
  warn: 'yellow',
  debug: 'blue',
  error: 'red'
});

prompt.message = '';
prompt.delimiter = '';

prompt.start();

var Configurator = {
  configure: function(declarations, callback) {
      var variableName, variableConfig, promptConfig = [];

      for (variableName in declarations) {
          variableConfig = declarations[variableName];

          if(typeof variableConfig == "string") {
              variableConfig = {
                  "default": variableConfig
              }
          }
          else if(!_.isObject(variableConfig)) {
              throw new Error("Invalid variable configuration type.");
          }

          variableConfig.name = variableName;

          if(!variableConfig["default"]) {
              variableConfig.required = true;
          }

          if(!variableConfig.message) {
              variableConfig.message = "Provide a " + (variableConfig["prompt name"] || variableName);
          }

          promptConfig.push(variableConfig);
      }

      prompt.get(promptConfig, function (err, results) {
          if(!err) {
              callback && callback(results);
          }
          else {
              throw new Error("Could not configure action.")
          }
      });
  }
}

module.exports = Configurator;