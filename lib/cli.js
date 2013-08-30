module.exports = function () {

var program = require('commander'),
    scaffy = require('./scaffy'),
    _ = require("underscore");

function _extractArguments (program) {
  return _.pluck(program.options, "long")
          .map(function (longname) {
            return longname.replace("--","");
          })
          .reduce(function (args, argName) {
            args[argName] = program[argName];
            return args;
          }, {});
}

function _bootstrap_configure (callback) {
  scaffy.bootstrap(_extractArguments(program), function () {        
    scaffy.configure(function () {
      callback();
    });
  });
}

program
  .usage('create [template]')
  .option('-f, --file [file]', 'The descriptor file name containing scaffolding definitions.')
  .option('-d, --cwd [folder]', 'The folder were the files are going to be created, defaults to current directory')
  .version(scaffy.version);

program
  .command('create [template]')
  .description('Create a project from template')
  .action(function(template) {

    _bootstrap_configure(function () {
      scaffy.realizeTemplate(template);
    });

  });

program
  .command('add [partial]')
  .description('Add a new element to the Project.')
  .action(function(partial) {

    _bootstrap_configure(function () {
      scaffy.realizePartial(partial);
    });

  });

program.parse(process.argv);

}