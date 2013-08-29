module.exports = function () {

var lib = require('grunt'),
    path = require("path"),
    program = require('commander'),
    colors = require('colors'),
    pkg = lib.file.readJSON(path.resolve(__dirname,"..","package.json")),
    prompt = require('prompt'),
    scaffy = require('./scaffy'),
    _ = require("underscore");


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
    scaffy.configure(function (vars) {
      callback(vars);
    });
  });
}

program
  .usage('create [template]')
  .option('-f, --file [file]', 'The descriptor file name containing scaffolding definitions.')
  .option('-d, --cwd [folder]', 'The folder were the files are going to be created, defaults to current directory')
  .version(pkg.version);

program
  .command('create [template]')
  .description('Create a project from template')
  .action(function(template) {

    _bootstrap_configure(function (vars) {
      scaffy.realizeTemplate(template, vars);
    });

  });

program
  .command('add [partial]')
  .description('Add a new element to the Project.')
  .action(function(partial) {

    _bootstrap_configure(function (vars) {
      scaffy.realizePartial(partial, vars);
    });

  });

program.parse(process.argv);

}