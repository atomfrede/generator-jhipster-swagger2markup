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
    this.buildTool = jhipsterVar.buildTool;
    var javaDir = jhipsterVar.javaDir;
    var javaTestDir = 'src/test/java/' + this.packageFolder + '/';
    var resourceDir = jhipsterVar.resourceDir;
    var webappDir = jhipsterVar.webappDir;


    this.apiDocResultType = this.props.apiDocResultType;

    this.template('src/docs/asciidoc/_index.adoc', 'src/docs/asciidoc/index.adoc');
    this.template('src/test/java/package/web/rest/_Swagger2MarkupIntTest.java', javaTestDir + 'web/rest/Swagger2MarkupIntTest.java', this, {});
    this.template('src/docs/asciidoc/_index.adoc', 'src/docs/asciidoc/index.adoc');

    if (this.buildTool == 'gradle') {

      this.template('_swagger2markup.gradle', 'swagger2markup.gradle');
      jhipsterFunc.applyFromGradleScript('swagger2markup');
      jhipsterFunc.addGradleDependency('testCompile', 'io.springfox', 'springfox-staticdocs', '2.0.3');
      jhipsterFunc.addGradlePlugin('org.asciidoctor', 'asciidoctor-gradle-plugin', '1.5.3');
      jhipsterFunc.addGradlePlugin('org.asciidoctor', 'asciidoctorj-pdf', '1.5.0-alpha.10.1');
      jhipsterFunc.addGradlePlugin('io.github.robwin', 'swagger2markup-gradle-plugin', '0.9.1')

    } else if (this.buildTool == 'maven') {

      var swagger2markupConfiguration = '<executions>\n' +
        '<execution>\n' +
        '<id>convert-swagger</id>\n' +
        '<phase>install</phase>\n' +
        '<goals>\n' +
        '<goal>process-swagger</goal>\n' +
        '</goals>\n' +
        '</execution>\n' +
        '</executions>\n' +
        '<configuration>\n' +
        '<outputDirectory>${project.basedir}/target/docs/asciidoc</outputDirectory>\n' +
        '<inputDirectory>${project.basedir}/target/swagger</inputDirectory>\n' +
        '</configuration>\n';

      var pluginDependencies = '<dependencies>\n' +
        '<dependency>\n' +
        '<groupId>org.asciidoctor</groupId>\n' +
        '<artifactId>asciidoctorj-pdf</artifactId>\n' +
        '<version>1.5.0-alpha.10.1</version>\n' +
        '</dependency>\n' +
        '<dependency>\n' +
        '<groupId>org.asciidoctor</groupId>\n' +
        '<artifactId>asciidoctorj</artifactId>\n' +
        '<version>1.5.3.2</version>\n' +
        '</dependency>\n' +
        '</dependencies>';

      var htmlOutput = '<execution>\n' +
        '<id>output-html</id>\n' +
        '<phase>install</phase>\n' +
        '<goals>\n' +
        '<goal>process-asciidoc</goal>\n' +
        '</goals>\n' +
        '<configuration>\n' +
        '<backend>html5</backend>\n' +
        '<outputDirectory>${project.basedir}/target/asciidoc/html5</outputDirectory>\n' +
        '</configuration>\n' +
        '</execution>\n';

      var pdfOutput = '<execution>\n' +
        '<id>output-pdf</id>\n' +
        '<phase>install</phase>\n' +
        '<goals>\n' +
        '<goal>process-asciidoc</goal>\n' +
        '</goals>\n' +
        '<configuration>\n' +
        '<backend>pdf</backend>\n' +
        '<outputDirectory>${project.basedir}/target/asciidoc/pdf</outputDirectory>\n' +
        '</configuration>\n' +
        '</execution>\n';

      var executions;

      if (this.apiDocResultType === 'both') {
        executions = '<executions>\n' + htmlOutput + pdfOutput + '</executions>\n';
      } else if (this.apiDocResultType === 'html5') {
        executions = '<executions>\n' + htmlOutput + '</executions>\n';
      } else if (this.apiDocResultType === 'pdf') {
        executions = '<executions>\n' + pdfOutput + '</executions>\n';
      }

      var asiidoctorjConfiguration = '<configuration>\n' +
        '<sourceDirectory>${project.basedir}/src/docs/asciidoc</sourceDirectory>\n' +
        '<sourceDocumentName>index.adoc</sourceDocumentName>\n' +
        '<attributes>\n' +
        '<doctype>book</doctype>\n' +
        '<toc>left</toc>\n' +
        '<toclevels>3</toclevels>\n' +
        '<generated>${project.basedir}/target/docs/asciidoc</generated>\n' +
        '</attributes>\n' +
        '</configuration>\n';

      jhipsterFunc.addMavenDependency('io.springfox', 'springfox-staticdocs', '2.0.3', '<scope>test</scope>');
      jhipsterFunc.addMavenPlugin('com.redowlanalytics', 'swagger2markup-maven-plugin', '0.8.0', swagger2markupConfiguration);
      jhipsterFunc.addMavenPlugin('org.asciidoctor', 'asciidoctor-maven-plugin', '1.5.2.1', executions + pluginDependencies + asiidoctorjConfiguration);
    }


    done();
  },

  install: function() {
    // No op required here currently
  }
});
