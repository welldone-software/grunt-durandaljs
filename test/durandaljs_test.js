'use strict';

var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.durandaljs = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },
  default_options: function(test) {

    var config = {
        durandaljs : {
            almond1 : {
                options: {
                    baseDir: 'test/fixtures/HTML StarterKit/app',
                    minify: false,
                    output: 'test/tmp/almond1/almond.main.js',
                    almond: true,
                }
            },
            almond2 : {
                options: {
                    baseDir: 'test/fixtures/HTML StarterKit/app',
                    minify: true,
                    output: 'test/tmp/almond2/almond.main.js',
                    almond: true,
                }
            },
            almond3 : {
                options: {
                    baseDir: 'test/fixtures/HTML StarterKit/app',
                    minify: false,
                    output: 'test/tmp/almond3/almond.main.js',
                    almond: '/my/custom/almondpath',
                }
            },
            require : {
                options: {
                    baseDir: 'test/fixtures/HTML StarterKit/app',
                    require: ['main'],
                    output: 'test/tmp/require1/main.js'
                },
            },
            options: {
                extraModules: ['plugins/widget', 'plugins/dialog', 'plugins/router', 'transitions/entrance']
            }
        }
    };

      grunt.config.set(config);

    grunt.task.run('durandaljs');

    test.expect(1);

    var actual = grunt.file.read('tmp/default_options');
    var expected = grunt.file.read('test/expected/default_options');
    test.equal(actual, expected, 'should describe what the default behavior is.');

    test.done();

  },
};
