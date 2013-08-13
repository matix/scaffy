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

program
  .usage('create [template]')
  .option('-f, --file [file]', 'The descriptor file name containing scaffolding definitions.')
  .version(pkg.version);

program
  .command('create [template]')
  .description('Create a project from template')
  .action(function(template) {

    scaffy.bootstrap(_extractArguments(program));
    scaffy.realizeTemplate(template, scaffy.promptVariables());

  });

program.parse(process.argv);