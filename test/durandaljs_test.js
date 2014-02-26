'use strict';

var grunt = require('grunt'),
    _ = require('lodash');

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

var optionsToCheck = {
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

_.each(optionsToCheck, function(option, optionName){
    option.options.output = _.template('test/tmp/${name}/main.js', {name: optionName});
});

var initObj = _.clone(
    {
        durandaljs: optionsToCheck
    },
    {
        durandaljs : {
            options: {
                extraModules: ['plugins/widget', 'plugins/dialog', 'plugins/router', 'transitions/entrance']
            }
        }
    }
);

grunt.config.init(initObj);

exports.durandaljs = {
    setUp: function(done) {
        // setup here if necessary
        done();
    }
};

_.forEach(optionsToCheck, function(option, optionName){
    exports.durandaljs[optionName] = function(test) {
        var outputPath = option.options.output;
        var expectedPath = _.template('test/expected/${name}/main.js', {name: optionName});

        //todo: run task before the test as it only ques them and not immediately runns them.
        grunt.task.run('durandaljs:'+optionName);

        test.expect(1);

        var actual = grunt.file.read(outputPath);
        var expected = grunt.file.read(expectedPath);

        test.equal(actual, expected, 'should describe what the default behavior is.');

        test.done();
    };
});