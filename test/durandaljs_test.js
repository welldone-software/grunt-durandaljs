'use strict';

var grunt = require('grunt'),
    _ = require('lodash'),
    outputTpl = _.template('test/tmp/${targetName}/main.js'),
    expectedTpl = _.template('test/expected/${targetName}/main.js');

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

var targets = {
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

_.each(targets, function(target, targetName){
    target.options.output = outputTpl({targetName: targetName});
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

_.forEach(targets, function(option, targetName){
    exports.durandaljs[targetName] = function(test) {
        var outputPath = option.options.output;
        var expectedPath = expectedTpl({targetName: targetName});

        //todo: run task before the test as it only ques them and not immediately runns them.
        grunt.task.run('durandaljs:'+targetName);

        test.expect(1);

        var actual = grunt.file.read(outputPath);
        var expected = grunt.file.read(expectedPath);

        test.equal(actual, expected, 'should describe what the default behavior is.');

        test.done();
    };
});
