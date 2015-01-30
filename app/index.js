'use strict';
var yeoman   = require('yeoman-generator');
var chalk    = require('chalk');
//var yosay    = require('yosay');
var inquirer = require('inquirer');
var clone    = require('git-clone');

module.exports = yeoman.generators.Base.extend({
    initializing: function () {
        this.pkg = require('../package.json');
    },

    prompting: function () {
        var done = this.async();

        // Have Yeoman greet the user.
        var logo =
            +'\n '
            +'\n      _            _ _ _ _____  '
            +'\n  _ _|_|___ ___   | | | |  _  | '
            +'\n | | | |   |- _|  | | | |   __| '
            +'\n  \\_/|_|_|_|___|  \\_____|__|    '
            +'\n';
        this.log( logo );

        var prompts = [
            {
                name: 'NombreTema',
                message: 'Nombre del tema',
                default: 'temaWP'
            },
            {
                name: 'ThemeURI',
                message: 'URL del tema',
                default: 'http://www.' + this.NombreTema + '.com'
            },
            {
                name: 'Autor',
                message: 'Autor',
                default: 'Autor'
            },
            {
                name: 'AuthorURI',
                message: 'URL del Autor',
                default: 'http://www.' + this.Autor + '.com'
            },
            {
                name: 'Descripcion',
                message: 'Descripción',
                default: 'El mejor tema del mundo entero!'
            },
            {
                name: 'VersionTema',
                message: 'Versión',
                default: '1.0'
            },
            {
                name: 'TagsTema',
                message: 'Tags',
                default: ''
            },
            {
                type: 'list',
                name: 'jqueryVersion',
                message: 'Version de jQuery (Se carga desde el CDN de Google)',
                choices: [ 'jQuery 1.11.0', 'jQuery 2.1.0' ],
                filter: function( val ) {
                    if ( val.slice(8) === 1 ) {
                        return val = '1.11.0';
                    } else {
                        return val = '2.1.0';
                    }
                }
            },
            {
            type: 'checkbox',
                message: 'Archivos de la plantilla:',
                name: 'Template',
                choices: [
                    new inquirer.Separator('Basico:'),

                        { name: 'Index.php',   checked: true },
                        { name: 'Header.php',  checked: true },
                        { name: 'Footer.php',  checked: true },
                        { name: 'Sidebar.php', checked: true },
                        { name: 'Single.php',  checked: true },
                        { name: 'Page.php',    checked: true },

                    new inquirer.Separator('Ocional:'),

                        { name: '404.php' },
                        { name: 'Archive.php' },
                        { name: 'Author.php' },
                        { name: 'Category.php' },
                        { name: 'Comments.php' },
                        { name: 'Search.php' },
                        { name: 'Tag.php' },
                        { name: 'Taxonomy.php' },
                ],
                validate: function( answer ) {
                  if ( answer.length < 0) {
                    return 'You must choose at least one topping.';
                  }
                  return true;
                }
            },
            {
                type: 'confirm',
                name: 'CustomMetaboxes',
                message: '¿Usar Custom Metaboxes?',
                default: true
            },
            {
                type: 'confirm',
                name: 'ReduxFramework',
                message: '¿Usar Panel de control? (Redux Framework)',
                default: true
            },
            {
                type: 'checkbox',
                message: 'Incluir Plugins:',
                name: 'Plugins',
                choices: [
                    { name: 'Developer' },
                    { name: 'WP Sync DB' },
                    { name: 'WordPress SEO by Yoast' },
                    { name: 'Contact Form 7' },
                ],
                validate: function( answer ) {
                  if ( answer.length < 0) {
                    return 'Selecciona al menos un plugin.';
                  }
                  return true;
                }
            }
        ];

        this.prompt(prompts, function (props) {

            this.NombreTema      = props.NombreTema;
            this.ThemeURI        = props.ThemeURI;
            this.Autor           = props.Autor;
            this.AuthorURI       = props.AuthorURI;
            this.Descripcion     = props.Descripcion;
            this.VersionTema     = props.VersionTema;
            this.TagsTema        = props.TagsTema;
            this.jqueryVersion   = props.jqueryVersion;
            this.Template        = props.Template;
            this.CustomMetaboxes = props.CustomMetaboxes;
            this.ReduxFramework  = props.ReduxFramework;
            this.Plugins         = props.Plugins;

            done();
        }.bind(this));
    },

    writing: {

        app: function () {
            this.fs.copy(
                this.templatePath('_package.json'),
                this.destinationPath('package.json')
            );
            this.fs.copyTpl(
                this.templatePath('_bowerrc'),
                this.destinationPath('.bowerrc'),
                { NombreTema: this.NombreTema }
            );
            this.fs.copyTpl(
                this.templatePath('_bower.json'),
                this.destinationPath('bower.json'),
                { NombreTema: this.NombreTema,
                  VersionTema: this.VersionTema,
                  Autor: this.Autor,
                  ThemeURI: this.ThemeURI,
                  AuthorURI: this.AuthorURI }
            );
        },

        projectfiles: function () {
            this.fs.copy(
                this.templatePath('editorconfig'),
                this.destinationPath('.editorconfig')
            );
            this.fs.copy(
                this.templatePath('jshintrc'),
                this.destinationPath('.jshintrc')
            );

            // Archivo de traducción
            this.fs.copy(
                this.templatePath('languages/_lang.pot'),
                this.destinationPath(this.NombreTema+'/languages/'+this.NombreTema+'.pot')
            );

            // Miniatura del tema
            this.fs.copy(
                this.templatePath('screenshot.png'),
                this.destinationPath(this.NombreTema+'.png')
            );

            this.template('_functions.php', this.NombreTema+'/functions.php');
            this.template('_style.css', this.NombreTema+'/style.css');

            // Copiar plantillas php
            if ( this.Template.indexOf('Index.php') !== -1 ) {
                this.fs.copyTpl(
                    this.templatePath('Base-Hierarchy/_index.php'),
                    this.destinationPath(this.NombreTema+'/index.php'),
                    { NombreTema: this.NombreTema,
                      VersionTema: this.VersionTema }
                );
            }
            if ( this.Template.indexOf('Header.php') !== -1 ) {
                this.fs.copyTpl(
                    this.templatePath('Base-Hierarchy/_header.php'),
                    this.destinationPath(this.NombreTema+'/header.php'),
                    { NombreTema: this.NombreTema,
                      VersionTema: this.VersionTema }
                );
            }
            if ( this.Template.indexOf('Footer.php') !== -1 ) {
                this.fs.copyTpl(
                    this.templatePath('Base-Hierarchy/_footer.php'),
                    this.destinationPath(this.NombreTema+'/footer.php'),
                    { NombreTema: this.NombreTema,
                      VersionTema: this.VersionTema }
                );
            }
            if ( this.Template.indexOf('Sidebar.php') !== -1 ) {
                this.fs.copyTpl(
                    this.templatePath('Base-Hierarchy/_sidebar.php'),
                    this.destinationPath(this.NombreTema+'/sidebar.php'),
                    { NombreTema: this.NombreTema,
                      VersionTema: this.VersionTema }
                );
            }
            if ( this.Template.indexOf('Single.php') !== -1 ) {
                this.fs.copyTpl(
                    this.templatePath('Base-Hierarchy/_single.php'),
                    this.destinationPath(this.NombreTema+'/single.php'),
                    { NombreTema: this.NombreTema,
                      VersionTema: this.VersionTema }
                );
            }
            if ( this.Template.indexOf('Page.php') !== -1 ) {
                this.fs.copyTpl(
                    this.templatePath('Base-Hierarchy/_page.php'),
                    this.destinationPath(this.NombreTema+'/page.php'),
                    { NombreTema: this.NombreTema,
                      VersionTema: this.VersionTema }
                );
            }

            // plantillas opcionales
            if ( this.Template.indexOf('404.php') !== -1 ) {
                this.fs.copyTpl(
                    this.templatePath('Base-Hierarchy/_404.php'),
                    this.destinationPath(this.NombreTema+'/404.php'),
                    { NombreTema: this.NombreTema,
                      VersionTema: this.VersionTema }
                );
            }
            if ( this.Template.indexOf('Archive.php') !== -1 ) {
                this.fs.copyTpl(
                    this.templatePath('Base-Hierarchy/_archive.php'),
                    this.destinationPath(this.NombreTema+'/archive.php'),
                    { NombreTema: this.NombreTema,
                      VersionTema: this.VersionTema }
                );
            }
            if ( this.Template.indexOf('Author.php') !== -1 ) {
                this.fs.copyTpl(
                    this.templatePath('Base-Hierarchy/_author.php'),
                    this.destinationPath(this.NombreTema+'/author.php'),
                    { NombreTema: this.NombreTema,
                      VersionTema: this.VersionTema }
                );
            }
            if ( this.Template.indexOf('Category.php') !== -1 ) {
                this.fs.copyTpl(
                    this.templatePath('Base-Hierarchy/_category.php'),
                    this.destinationPath(this.NombreTema+'/category.php'),
                    { NombreTema: this.NombreTema,
                      VersionTema: this.VersionTema }
                );
            }
            if ( this.Template.indexOf('Comments.php') !== -1 ) {
                this.fs.copyTpl(
                    this.templatePath('Base-Hierarchy/_comments.php'),
                    this.destinationPath(this.NombreTema+'/comments.php'),
                    { NombreTema: this.NombreTema,
                      VersionTema: this.VersionTema }
                );
            }
            if ( this.Template.indexOf('Search.php') !== -1 ) {
                this.fs.copyTpl(
                    this.templatePath('Base-Hierarchy/_search.php'),
                    this.destinationPath(this.NombreTema+'/search.php'),
                    { NombreTema: this.NombreTema,
                      VersionTema: this.VersionTema }
                );
            }
            if ( this.Template.indexOf('Tag.php') !== -1 ) {
                this.fs.copyTpl(
                    this.templatePath('Base-Hierarchy/_tag.php'),
                    this.destinationPath(this.NombreTema+'/tag.php'),
                    { NombreTema: this.NombreTema,
                      VersionTema: this.VersionTema }
                );
            }
            if ( this.Template.indexOf('Taxonomy.php') !== -1 ) {
                this.fs.copyTpl(
                    this.templatePath('Base-Hierarchy/_taxonomy.php'),
                    this.destinationPath(this.NombreTema+'/taxonomy.php'),
                    { NombreTema: this.NombreTema,
                      VersionTema: this.VersionTema }
                );
            }

        },

        // Instalar Custom Metaboxes si se necesita
        instalarCustomMetaboxes: function() {

            if (this.CustomMetaboxes) {
                var cb = this.async();

                this.log.writeln(chalk.yellow('Descargando Custom Metaboxes and Fields for WordPress 2')),

                clone( 'https://github.com/WebDevStudios/CMB2.git', this.NombreTema+'/lib/cmb2', cb );
            }
        },

        // Instalar Custom Metaboxes si se necesita
        instalarReduxFramework: function() {

            if (this.ReduxFramework) {

                this.fs.copy(
                    this.templatePath('lib/admin'),
                    this.destinationPath(this.NombreTema+'/lib/admin')
                );

                var cb = this.async();

                this.log.writeln(chalk.yellow('Descargando Redux Framework')),

                clone( 'https://github.com/ReduxFramework/redux-framework.git', this.NombreTema+'/lib/admin/redux-framework', cb );
            }
        },

        // Instalar dependencias de plugins
        instalarTGMPlugins: function() {

            if ( this.Plugins.length > 0 ) {
                var cb = this.async();

                this.log.writeln(chalk.yellow('Descargando TGM Plugin Activation')),

                clone( 'https://github.com/thomasgriffin/TGM-Plugin-Activation.git', this.NombreTema+'/lib/tgm-plugin-activation', cb );

                this.template('functions/_plugin_dependencies.php', this.NombreTema+'/lib/tgm-plugin-activation/plugin_dependencies.php');
            }

        }

    },

    install: function () {
        this.installDependencies({
            skipInstall: this.options['skip-install']
         });
    }
});
