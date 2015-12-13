# generator-jhipster-swagger2markup [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]
> JHipster module to create static api docs with [swagger2markup](https://github.com/Swagger2Markup/swagger2markup)

## Usage

This is a [JHipster](http://jhipster.github.io/) module, that is meant to be use in a JHipster application.

### Gradle

This plugin adds new tasks to your gradle build system

* ``gradlew asciidoctor``

The generated static documentation can be found in ``build/asciidoc`` as html or pdf.

### Maven

The html or pdf generation is bound to the ``install`` lifecycle phase.

* ``mvnw install``

The generated static documentation can be found in ``target/asciidoc`` as html or pdf.

#### Limitation

As the latest ``swagger2markup-maven-plugin`` is not [properly deployed to maven central](https://github.com/Swagger2Markup/swagger2markup-maven-plugin/issues/9) grouping by tag doesn't work with maven yet.

### Result

![resulting html documentation][result-image]

## Installation

As this is a [JHipster](http://jhipster.github.io/) module, we expect you have JHipster and its related tools already installed.

```bash
npm install -g generator-jhipster-swagger2markup
```

Then run the module on a JHipster generated application:

```bash
yo jhipster-swagger2markup
```

## License

Apache-2.0 © [Frederik Hahne](http://atomfrede.github.io/shiny-adventure/)

[npm-image]: https://badge.fury.io/js/generator-jhipster-swagger2markup.svg
[npm-url]: https://npmjs.org/package/generator-jhipster-swagger2markup
[travis-image]: https://travis-ci.org/atomfrede/generator-jhipster-swagger2markup.svg?branch=master
[travis-url]: https://travis-ci.org/atomfrede/generator-jhipster-swagger2markup
[daviddm-image]: https://david-dm.org/atomfrede/generator-jhipster-swagger2markup.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/atomfrede/generator-jhipster-swagger2markup
[result-image]: https://raw.githubusercontent.com/atomfrede/generator-jhipster-swagger2markup/master/screen-api.png
