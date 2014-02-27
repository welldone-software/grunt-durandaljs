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

module.exports = function(grunt) {

    var targetsToTest = {
        almond1 : {
            options: {
                baseDir: 'test/fixtures/HTML StarterKit/app',
                minify: false,
                almond: true
            }
        },
        almond2 : {
            options: {
                baseDir: 'test/fixtures/HTML StarterKit/app',
                minify: true,
                almond: true
                //todo: test with "almond: '/my/custom/almondpath'"
            }
        },
        require : {
            options: {
                baseDir: 'test/fixtures/HTML StarterKit/app',
                require: ['main']
            }
        }
    };

    _.each(targetsToTest, function(target, targetName){
        target.options.output = outputTpl({targetName: targetName});
    });

    var initObj = _.merge(
        {
            durandaljs: targetsToTest
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
                tests: ['tmp']
            },
            durandaljs : {
                options: {
                    extraModules: ['plugins/widget', 'plugins/dialog', 'plugins/router', 'transitions/entrance']
                }
            }
        }
    );

    grunt.initConfig(initObj);

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
