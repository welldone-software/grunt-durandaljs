/*
 * grunt-durandaljs
 * https://github.com/welldone-software/grunt-durandaljs
 *
 * Copyright (c) 2014 Welldone Software Solutions Ltd.
 * Licensed under the MIT license.
 */

'use strict';

var _ = require('lodash'),
    outputTpl = _.template('test/tmp/${targetName}/main.js');

var testOptions = {
    baseDir: ['test/fixtures/HTML StarterKit/app', 'test/fixtures/HTML Samples/app'],
    minify: [false, true],
    almond: [false, true],
    require: [true, 'main', 'main2'],
    extraModules: ['plugins/widget', 'plugins/dialog', 'plugins/router', 'transitions/entrance']
};

//bower

var generateTestTargets = function(){
    var targets = {};
    var testGenerators = [];

    var simpleOutput = function(){
        var testNum = 0;
        _.each(testOptions.baseDir, function(baseDir){
            testNum++;
            var targetName = 'simpleOutput' + testNum;

            targets[targetName] = {
                options: {
                    baseDir: baseDir,
                    output: outputTpl({targetName: targetName})
                }
            };
        });
    };

    var requireOutput = function(targets){
        var testNum = 0;
        _.each(testOptions.baseDir, function(baseDir){
            _.each(testOptions.require, function(require){
                testNum++;
                var targetName = 'requireOutput' + testNum;

                targets[targetName] = {
                    options: {
                        baseDir: baseDir,
                        output: outputTpl({targetName: targetName}),
                        require: require
                    }
                };
            });
        });
    };

    var almondOutput = function(targets){
        var testNum = 0;
        _.each(testOptions.baseDir, function(baseDir){
            _.each(testOptions.require, function(require){
                testNum++;
                var targetName = 'almondOutput' + testNum;
                targets[targetName] = {
                    options:{
                        baseDir: baseDir,
                        almond: true,
                        require: require,
                        output: outputTpl({targetName: targetName})
                    }
                };
            });
        });
    };

    var minifyTest = function(targets){
        var testNum = 0;
        _.each(testOptions.baseDir, function(baseDir){
            _.each(testOptions.almond, function(almond){
                testNum++;
                var targetName = 'minifyTest' + testNum;
                targets[targetName] = {
                    options:{
                        baseDir: baseDir,
                        output: outputTpl({targetName: targetName}),
                        almond: almond,
                        minify: true
                    }
                };
            });
        });
    };

    var pathTest = function(targets){
        var testNum = 0,
            targetName;

        _.each(testOptions.almond, function(almond){
            testNum++;

            targetName = 'pathTestSimple' + testNum;
            targets[targetName] = {
                options:{
                    baseDir: 'test/fixtures/Simple Bower Project/app',
                    output: outputTpl({targetName: targetName}),
                    almond: almond
                }
            };

            targetName = 'pathTestMain2' + testNum;
            targets[targetName] = {
                options:{
                    baseDir: 'test/fixtures/Bower Projects/app',
                    main: 'main2.js',
                    output: outputTpl({targetName: targetName}),
                    almond: almond,
                    require: 'app/main2'
                }
            };

            targetName = 'pathTestNested' + testNum;
            targets[targetName] = {
                options:{
                    baseDir: 'test/fixtures/Bower Projects/nested/app3',
                    main: 'main2.js',
                    output: outputTpl({targetName: targetName}),
                    almond: almond,
                    require: 'nested/app3/main2'
                }
            };

            targetName = 'pathTestExternal' + testNum;
            targets[targetName] = {
                options:{
                    baseDir: 'test/fixtures/Bower Projects/external/app',
                    output: outputTpl({targetName: targetName}),
                    almond: almond,
                    extraModules: ['../ext/external-shell-generator']
                }
            };
        });
    };

    //comment out not needed tests
    testGenerators.push(simpleOutput);
    testGenerators.push(requireOutput);
    testGenerators.push(almondOutput);
    testGenerators.push(minifyTest);
    testGenerators.push(pathTest);

    _.each(testGenerators, function(generator){
        generator(targets);
    });

    return targets;
};


module.exports = function(grunt) {

    grunt.initConfig(_.merge(
        {
            durandaljs: generateTestTargets()
        },
        {
            jshint: {
                all: [
                    'Gruntfile.js',
                    'tasks/*.js',
                    '<%= nodeunit.tests %>'
                ],
                options: {
                    jshintrc: '.jshintrc'
                }
            },
            nodeunit: {
                tests: ['test/*_test.js']
            },
            clean: {
                tests: ['test/tmp']
            },
            durandaljs : {
                options: {
                }
            }
        }
    ));

    grunt.loadTasks('tasks');

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');

    grunt.registerTask('test', ['clean', 'durandaljs', 'nodeunit']);

    grunt.registerTask('default', ['jshint', 'test']);

//  // Project configuration.
//  grunt.initConfig({
//    jshint: {
//      all: [
//        'Gruntfile.js',
//        'tasks/*.js',
//        '<%= nodeunit.tests %>',
//      ],
//      options: {
//        jshintrc: '.jshintrc',
//      },
//    },
//
//    // Before generating any new files, remove any previously-created files.
//    clean: {
//      tests: ['tmp'],
//    },
//
//    // Configuration to be run (and then tested).
//    durandaljs: {
//      default_options: {
//        options: {
//        },
//        files: {
//          'tmp/default_options': ['test/fixtures/testing', 'test/fixtures/123'],
//        },
//      },
//      custom_options: {
//        options: {
//          separator: ': ',
//          punctuation: ' !!!',
//        },
//        files: {
//          'tmp/custom_options': ['test/fixtures/testing', 'test/fixtures/123'],
//        },
//      },
//    },
//
//    // Unit tests.
//    nodeunit: {
//      tests: ['test/*_test.js'],
//    },
//
//  });
//
//  // Actually load this plugin's task(s).
//  grunt.loadTasks('tasks');
//
//  // These plugins provide necessary tasks.
//  grunt.loadNpmTasks('grunt-contrib-jshint');
//  grunt.loadNpmTasks('grunt-contrib-clean');
//  grunt.loadNpmTasks('grunt-contrib-nodeunit');
//
//  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
//  // plugin's task(s), then test the result.
//  grunt.registerTask('test', ['clean', 'durandaljs', 'nodeunit']);
//
//  // By default, lint and run all tests.
//  grunt.registerTask('default', ['jshint', 'test']);

};
