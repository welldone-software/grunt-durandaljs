/*
 * grunt-durandaljs
 * https://github.com/welldone-software/grunt-durandaljs
 *
 * Copyright (c) 2014 Welldone Software Solutions Ltd.
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

    var path = require('path'),
        _ = require('lodash')._,
        requirejs = require('requirejs');

    grunt.registerMultiTask('durandaljs', 'A grunt plugin for building durandaljs projects.', function () {

        var done = this.async(),

            options = this.options({
                    baseDir: 'app',
                    main: 'main.js',
                    extraModules: [],
                    verbose : false,
                    output: undefined,
                    minify: false,
                    require : undefined,
                    almond: false,
                    moduleFilter: function(m){return true;},
                    textModuleExtensions : ['.json', '.html', '.txt']
                }
            ),

            baseDir =  options.baseDir,

            mainFile = path.join(baseDir, options.main),


            almondWrapper = (function(){
                var almond = options.almond,
                    almondPath = typeof(almond) === 'string' ? almond : path.join(__dirname, 'res/custom-almond.js');

                if(!almond){
                    return undefined;
                }

                return {
                    start: '(function() {\n' + grunt.file.read(almondPath),
                    end: '}());'
                };

            })(),

            allModules = (function(){
                var stripExtension = function(p){ return p.substr(0, p.length - path.extname(p).length);},
                    expand = function(p){return grunt.file.expand(path.normalize(path.join(baseDir, p))); },
                    relativeToBaseDir = path.relative.bind(path, baseDir),
                    jsFiles = _.unique( _.flatten([ mainFile, expand('/**/*.js') ])),
                    jsModules = jsFiles.map(relativeToBaseDir).map(stripExtension),
                    textFiles = _.flatten(_.map(options.textModuleExtensions, function(ext){return expand('/**/*'+ext);})),
                    textModules = textFiles.map(relativeToBaseDir).map(function(m){ return 'text!' + m; }),
                    scannedModules = {js: jsModules, text: textModules};

                    return _.flatten([scannedModules.js, options.extraModules || [], scannedModules.text]).filter(options.moduleFilter);
                })(),


            insertRequireModules = (function(){
                    if(typeof(options.require) === 'string' || _.isArray(options.require)){
                        return  _.flatten([options.require]);
                    }
                    else if(options.require === true || (options.almond && options.require !== false)){
                        return [allModules[0]];
                    }
                    return undefined;
                })();


           var rjsConfig = {
                logLevel: options.verbose ? 0 : 4,
                baseUrl : baseDir,
                mainConfigFile: mainFile,
                include : allModules,
                out: options.output || 'output.' + path.basename(mainFile),
                optimize: options.minify ? 'uglify2' : 'none',
                preserveLicenseComments: !options.minify,
                generateSourceMaps : true,
                insertRequire : insertRequireModules,
                wrap: almondWrapper
            };

        requirejs.optimize(
            rjsConfig,
            function (response) {
                done(true);
            },
            function (error) {
                grunt.log.error(error);
                done(false);
            }
        );
    });

};
