var lib = require('grunt'),
    path = require("path"),
    program = require('commander'),
    colors = require('colors'),
    pkg = lib.file.readJSON(path.resolve(__dirname,"..","package.json")),
    prompt = require('prompt'),
    bootstrap = require('./bootstrap');


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

program
  .usage('create [template]')
  .option('-f, --file', 'The descriptor file name containing scaffolding definitions.')
  .version(pkg.version)

program
  .command('create [template]')
  .description('Create a project from template')
  .action(function(template){
    console.log('create project: ', template);
  });

program
  .command('create')
  .description('Create a project from template')
  .action(function(){
    prompt.get({
        properties: {
          template: {
            description: 'Choose a template to generate the project:',
            required: true
          }
        }
    },
    function(err, result){
        console.log('create project: ', result.template);
    });
  });

bootstrap(program);

program.parse(process.argv);