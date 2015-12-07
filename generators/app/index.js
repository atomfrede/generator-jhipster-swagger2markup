'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var jhipster = require('generator-jhipster');

// Stores JHipster variables
var jhipsterVar = {moduleName: 'fortune'};

// Stores JHipster functions
var jhipsterFunc = {};

module.exports = yeoman.generators.Base.extend({

  templates: function() {
    this.composeWith('jhipster:modules', { options: {
        jhipsterVar: jhipsterVar, jhipsterFunc: jhipsterFunc }});
  },

  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log( yosay(
      'Welcome to the ' + chalk.red('JHipster swagger2markup') + ' generator!'
    ));

    var prompts = [{
      type: 'list',
      name: 'resultType',
      message: 'Which file types you would like to generate?',
      choices: [
                  {
                      value: 'html5',
                      name: 'HTML5 '
                  },
                  {
                      value: 'pdf',
                      name: 'PDF'
                  },
                  {
                      value: 'both',
                      name: 'Generate HTML5 and PDF'
                  }
              ],
              default: 0
    }];

    this.prompt(prompts, function (props) {
      this.props = props;
      // To access props later use this.props.someOption;

      done();
    }.bind(this));
  },

  writing: function () {
    var done = this.async();

    this.baseName = jhipsterVar.baseName;
    this.packageName = jhipsterVar.packageName;
    this.angularAppName = jhipsterVar.angularAppName;
    var javaDir = jhipsterVar.javaDir;
    var resourceDir = jhipsterVar.resourceDir;
    var webappDir = jhipsterVar.webappDir;

    this.resultType = this.props.resultType;

    this.template('src/main/java/package/domain/_Fortune.java', javaDir + 'domain/Fortune.java');
    this.template('src/main/java/package/repository/_FortuneRepository.java', javaDir + 'repository/FortuneRepository.java');
    this.template('src/main/java/package/web/rest/_FortuneResource.java', javaDir + 'web/rest/FortuneResource.java');
    this.template('src/main/resources/config/liquibase/_fortunes.csv', resourceDir + 'config/liquibase/fortunes.csv');

    this.changelogDate = jhipsterFunc.dateFormatForLiquibase();
    this.template('src/main/resources/config/liquibase/changelog/_added_entity_Fortune.xml', resourceDir + 'config/liquibase/changelog/' + this.changelogDate + '_added_entity_Fortune.xml');
    jhipsterFunc.addChangelogToLiquibase(this.changelogDate + '_added_entity_Fortune');

    this.template('src/main/webapp/scripts/app/fortune/_fortune.controller.js', webappDir + 'scripts/app/fortune/fortune.controller.js');
    jhipsterFunc.addJavaScriptToIndex('app/fortune/fortune.controller.js');
    this.template('src/main/webapp/scripts/app/fortune/_fortune.html', webappDir + 'scripts/app/fortune/fortune.html');
    this.template('src/main/webapp/scripts/app/fortune/_fortune.js', webappDir + 'scripts/app/fortune/fortune.js');
    jhipsterFunc.addJavaScriptToIndex('app/fortune/fortune.js');
    this.template('src/main/webapp/scripts/components/fortune/_fortune.service.js', webappDir + 'scripts/components/fortune/fortune.service.js');
    jhipsterFunc.addJavaScriptToIndex('components/fortune/fortune.service.js');
    jhipsterFunc.addElementToMenu('fortune', 'sunglasses', true);
    jhipsterFunc.addElementTranslationKey('fortune', 'Fortune', 'en');
    jhipsterFunc.addElementTranslationKey('fortune', 'Fortune', 'fr');

    jhipsterFunc.copyI18nFilesByName(this, webappDir, 'fortune.json', 'en');
    jhipsterFunc.copyI18nFilesByName(this, webappDir, 'fortune.json', 'fr');
    done();
  },

  install: function () {
    this.installDependencies();
  }
});
