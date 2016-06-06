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
      },
      {
        type: 'confirm',
        name: 'springRestDocSamples',
        message: 'Do you want to have example request generated via Spring RestDocs?',
        default: false
      }
    ];

    if (this.swagger2markupDefault == 'default') {
      this.apiDocResultType = ["html5"];
      this.installAsciidocSample = true;
      this.springRestDocSamples = true;
      done();
    } else {
      this.prompt(prompts, function (props) {
        this.props = props;
        // To access props later use this.props.someOption;

        this.apiDocResultType = this.props.apiDocResultType;
        this.installAsciidocSample = this.props.installAsciidocSample;
        this.springRestDocSamples = this.props.springRestDocSamples;
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
    this.mainClass = jhipsterVar.mainClassName;
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

      this.template('gradle/_swagger2markup.gradle', 'gradle/swagger2markup.gradle');
      jhipsterFunc.applyFromGradleScript('gradle/swagger2markup');
      jhipsterFunc.addGradleDependency('testCompile', 'io.springfox', 'springfox-staticdocs', '2.4.0');
      if (this.springRestDocSamples) {
        jhipsterFunc.addGradleDependency('testCompile', 'org.springframework.restdocs', 'spring-restdocs-mockmvc', '1.1.0.RELEASE');
      }
      jhipsterFunc.addGradlePlugin('org.asciidoctor', 'asciidoctor-gradle-plugin', '1.5.3');
      jhipsterFunc.addGradlePlugin('org.asciidoctor', 'asciidoctorj-pdf', '1.5.0-alpha.11');
      jhipsterFunc.addGradlePlugin('io.github.robwin', 'swagger2markup-gradle-plugin', '1.0.0');

    } else if (this.buildTool === 'maven') {

      var swagger2markupConfiguration = '                <configuration>\n' +
        '                    <outputDirectory>${project.basedir}/target/docs/asciidoc</outputDirectory>\n' +
        '                    <inputDirectory>${project.basedir}/target/swagger</inputDirectory>\n' +
        '                    <pathsGroupedBy>TAGS</pathsGroupedBy>\n';
        if (this.springRestDocSamples) {
          swagger2markupConfiguration += '                    <examplesDirectory>${project.basedir}/target/asciidoc</examplesDirectory>\n';
        }
        swagger2markupConfiguration += '               </configuration>';

      var pluginDependencies = '                <dependencies>\n' +
        '                    <dependency>\n' +
        '                        <groupId>org.asciidoctor</groupId>\n' +
        '                        <artifactId>asciidoctorj-pdf</artifactId>\n' +
        '                        <version>1.5.0-alpha.11</version>\n' +
        '                    </dependency>\n' +
        '                    <dependency>\n' +
        '                        <groupId>org.asciidoctor</groupId>\n' +
        '                        <artifactId>asciidoctorj</artifactId>\n' +
        '                        <version>1.5.4</version>\n' +
        '                    </dependency>\n' +
        '                </dependencies>\n';

      // Start executions
      var executions = '                <executions>\n';

      if (this.apiDocResultType.indexOf('html5') !== -1) {
        executions += '                    <execution>\n' +
        '                        <id>output-html</id>\n' +
        '                        <phase>install</phase>\n' +
        '                        <goals>\n' +
        '                            <goal>process-asciidoc</goal>\n' +
        '                        </goals>\n' +
        '                        <configuration>\n' +
        '                            <backend>html5</backend>\n' +
        '                            <outputDirectory>${project.basedir}/target/asciidoc/html5</outputDirectory>\n' +
        '                        </configuration>\n' +
        '                    </execution>\n';
      }

      if (this.apiDocResultType.indexOf('pdf') !== -1) {
        executions += '                    <execution>\n' +
        '                        <id>output-pdf</id>\n' +
        '                        <phase>install</phase>\n' +
        '                        <goals>\n' +
        '                            <goal>process-asciidoc</goal>\n' +
        '                        </goals>\n' +
        '                        <configuration>\n' +
        '                            <backend>pdf</backend>\n' +
        '                            <outputDirectory>${project.basedir}/target/asciidoc/pdf</outputDirectory>\n' +
        '                        </configuration>\n' +
        '                    </execution>\n';
      }

      executions += '                </executions>\n';
      // End executions

      var asiidoctorjConfiguration = '                <configuration>\n' +
        '                    <sourceDirectory>${project.basedir}/src/docs/asciidoc</sourceDirectory>\n' +
        '                    <sourceDocumentName>index.adoc</sourceDocumentName>\n' +
        '                    <attributes>\n' +
        '                        <doctype>book</doctype>\n' +
        '                        <toc>left</toc>\n' +
        '                        <toclevels>3</toclevels>\n' +
        '                        <generated>${project.basedir}/target/docs/asciidoc</generated>\n' +
        '                    </attributes>\n' +
        '                </configuration>';

      jhipsterFunc.addMavenDependency('io.springfox', 'springfox-staticdocs', '2.4.0', '<scope>test</scope>');
      if (this.springRestDocSamples) {
          jhipsterFunc.addMavenDependency('org.springframework.restdocs', 'spring-restdocs-mockmvc', '1.1.0.RELEASE', '<scope>test</scope>');
      }
      jhipsterFunc.addMavenPlugin('io.github.robwin', 'swagger2markup-maven-plugin', '1.0.0', swagger2markupConfiguration);
      jhipsterFunc.addMavenPlugin('org.asciidoctor', 'asciidoctor-maven-plugin', '1.5.3', executions + pluginDependencies + asiidoctorjConfiguration);
    }

    done();
  },

  install: function () {
    // No op required here currently
  }
});
