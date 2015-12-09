'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var jhipster = require('generator-jhipster');

// Stores JHipster variables
var jhipsterVar = {
  moduleName: 'swagger2markup'
};

// Stores JHipster functions
var jhipsterFunc = {};

module.exports = yeoman.generators.Base.extend({

  initializing: {
    templates: function() {
      this.composeWith('jhipster:modules', {
        options: {
          jhipsterVar: jhipsterVar,
          jhipsterFunc: jhipsterFunc
        }
      });
    },
    checkMaven: function() {
       if (jhipsterVar.buildTool == 'maven') {
         console.log(chalk.red.bold('ERROR!')
         +' Maven isn\'t supported yet...\n');
         process.exit(1);
       }
     },
  },

  prompting: function() {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the ' + chalk.red('JHipster swagger2markup') + ' generator!'
    ));

    var prompts = [{
      type: 'list',
      name: 'apiDocResultType',
      message: 'Which file types you would like to generate?',
      choices: [{
        value: 'html5',
        name: 'HTML5 '
      }, {
        value: 'pdf',
        name: 'PDF'
      }, {
        value: 'both',
        name: 'Generate HTML5 and PDF'
      }],
      default: 0
    }];

    this.prompt(prompts, function(props) {
      this.props = props;
      // To access props later use this.props.someOption;

      done();
    }.bind(this));
  },

  writing: function() {
    var done = this.async();

    this.packageName = jhipsterVar.packageName;
    this.packageFolder = jhipsterVar.packageFolder;
    this.angularAppName = jhipsterVar.angularAppName;
    var javaDir = jhipsterVar.javaDir;
    var javaTestDir = 'src/test/java/' + this.packageFolder + '/';
    var resourceDir = jhipsterVar.resourceDir;
    var webappDir = jhipsterVar.webappDir;

    this.apiDocResultType = this.props.apiDocResultType;

    this.template('src/docs/asciidoc/_index.adoc', 'src/docs/asciidoc/index.adoc');
    this.template('src/test/java/package/web/rest/_Swagger2MarkupTest.java', javaTestDir + 'web/rest/Swagger2MarkupTest.java');

    this.template('_swagger2markup.gradle', 'swagger2markup.gradle');

    this.template('src/docs/asciidoc/_index.adoc', 'src/docs/asciidoc/index.adoc');

    jhipsterFunc.applyFromGradleScript('swagger2markup');
    jhipsterFunc.addGradleDependency('testCompile', 'io.springfox', 'springfox-staticdocs', '2.0.3');
    jhipsterFunc.addGradlePlugin('org.asciidoctor', 'asciidoctor-gradle-plugin', '1.5.3');
    jhipsterFunc.addGradlePlugin('org.asciidoctor', 'asciidoctorj-pdf', '1.5.0-alpha.10.1');

    done();
  },

  install: function() {
    this.installDependencies();
  }
});
