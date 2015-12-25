'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var packagejs = require(__dirname + '/../../package.json');

// Stores JHipster variables
var jhipsterVar = {
  moduleName: 'swagger2markup'
};

// Stores JHipster functions
var jhipsterFunc = {};

module.exports = yeoman.generators.Base.extend({

  initializing: {
    templates: function (args) {
      this.composeWith('jhipster:modules', {
        options: {
          jhipsterVar: jhipsterVar,
          jhipsterFunc: jhipsterFunc
        }
      });
      if (args == 'default') {
        this.swagger2markupDefault = 'default';
      }
    }
  },

  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the ' + chalk.red('JHipster swagger2markup') + ' generator! ' + chalk.yellow('v' + packagejs.version)
    ));

    var prompts = [
      {
        type: 'confirm',
        name: 'installAsciidocSample',
        message: 'Do you want to have a Asciidoc sample?',
        default: false
      },
      {
        type: 'checkbox',
        name: 'apiDocResultType',
        message: 'Which file types you would like to generate?',
        choices: [
          {name: 'HTML5', value: 'html5'},
          {name: 'PDF', value: 'pdf'}
        ],
        default: ['none']
      }
    ];

    if (this.swagger2markupDefault == 'default') {
      this.apiDocResultType = ["html5", "pdf"];
      this.installAsciidocSample = true;
      done();
    } else {
      this.prompt(prompts, function (props) {
        this.props = props;
        // To access props later use this.props.someOption;

        this.apiDocResultType = this.props.apiDocResultType;
        this.installAsciidocSample = this.props.installAsciidocSample;
        done();
      }.bind(this));
    }
  },

  writing: function () {
    var done = this.async();

    this.packageName = jhipsterVar.packageName;
    this.packageFolder = jhipsterVar.packageFolder;
    this.angularAppName = jhipsterVar.angularAppName;
    this.buildTool = jhipsterVar.buildTool;
    var javaTestDir = 'src/test/java/' + this.packageFolder + '/';

    // if no selection, do nothing
    if (this.apiDocResultType.length === 0) {
      this.log('Nothing to do...');
      return;
    }

    if (this.installAsciidocSample) {
      this.template('src/docs/asciidoc/overview/_index.adoc', 'src/docs/asciidoc/overview/index.adoc');
      this.template('src/docs/asciidoc/overview/_security&authentication.adoc', 'src/docs/asciidoc/overview/security&authentication.adoc');
      this.template('src/docs/asciidoc/overview/_limitation.adoc', 'src/docs/asciidoc/overview/limitation.adoc');
      this.template('src/docs/asciidoc/overview/_workflow.adoc', 'src/docs/asciidoc/overview/workflow.adoc');
      this.template('src/docs/asciidoc/overview/_contact.adoc', 'src/docs/asciidoc/overview/contact.adoc');
      this.template('src/docs/asciidoc/overview/_information.adoc', 'src/docs/asciidoc/overview/information.adoc');
    }

    this.template('src/docs/asciidoc/_index.adoc', 'src/docs/asciidoc/index.adoc');
    this.template('src/test/java/package/web/rest/_Swagger2MarkupIntTest.java', javaTestDir + 'web/rest/Swagger2MarkupIntTest.java', this, {});
    this.template('src/docs/asciidoc/_index.adoc', 'src/docs/asciidoc/index.adoc');

    if (this.buildTool === 'gradle') {

      this.template('_swagger2markup.gradle', 'swagger2markup.gradle');
      jhipsterFunc.applyFromGradleScript('swagger2markup');
      jhipsterFunc.addGradleDependency('testCompile', 'io.springfox', 'springfox-staticdocs', '2.0.3');
      jhipsterFunc.addGradlePlugin('org.asciidoctor', 'asciidoctor-gradle-plugin', '1.5.3');
      jhipsterFunc.addGradlePlugin('org.asciidoctor', 'asciidoctorj-pdf', '1.5.0-alpha.10.1');
      jhipsterFunc.addGradlePlugin('io.github.robwin', 'swagger2markup-gradle-plugin', '0.9.1');

    } else if (this.buildTool === 'maven') {

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

      // Start executions
      var executions = '<executions>\n';

      if (this.apiDocResultType.indexOf('html5') !== -1) {
        executions += '<execution>\n' +
        '    <id>output-html</id>\n' +
        '    <phase>install</phase>\n' +
        '    <goals>\n' +
        '        <goal>process-asciidoc</goal>\n' +
        '    </goals>\n' +
        '    <configuration>\n' +
        '        <backend>html5</backend>\n' +
        '        <outputDirectory>${project.basedir}/target/asciidoc/html5</outputDirectory>\n' +
        '    </configuration>\n' +
        '</execution>\n';
      }

      if (this.apiDocResultType.indexOf('pdf') !== -1) {
        executions += '<execution>\n' +
        '    <id>output-pdf</id>\n' +
        '    <phase>install</phase>\n' +
        '    <goals>\n' +
        '        <goal>process-asciidoc</goal>\n' +
        '    </goals>\n' +
        '    <configuration>\n' +
        '        <backend>pdf</backend>\n' +
        '        <outputDirectory>${project.basedir}/target/asciidoc/pdf</outputDirectory>\n' +
        '    </configuration>\n' +
        '</execution>\n';
      }

      executions += '</executions>\n';
      // End executions

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

  install: function () {
    // No op required here currently
  }
});
