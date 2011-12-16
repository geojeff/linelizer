var vows = require('vows'),
    assert = require('assert'),
    linelizer = require('../linelizer');

vows.describe('command line arguments').addBatch({                    // Batch
  'A linelizer call': {                                               // Context
    'containing only the simple input filename': {                    // Sub-Context
      topic: ['node', 'linelizer.js', 'CHANGELOG-SC.md'],             // Topic
        'should return the input parameter': function (topic) {       // Vow
          var result = linelizer.gatherCommandLineParameters(topic);
          assert.equal(result.input, 'CHANGELOG-SC.md');
        }
      },
    'containing the input parameter': {
      topic: ['node', 'linelizer.js', '--input=CHANGELOG-SC.md'],
        'should return one parameter': function (topic) {
          var result = linelizer.gatherCommandLineParameters(topic);
          assert.equal(result.input, 'CHANGELOG-SC.md');
        }
      },
    'containing parameters as --input=CHANGELOG-SC.md --colorize=no --targets=testing': {
      topic: ['node', 'linelizer.js', '--input=CHANGELOG-SC.md', '--colorize=no', '--targets=testing'], // Odd quoting needed.
        'should return three parameters': function (topic) {
          var result = linelizer.gatherCommandLineParameters(topic);
          assert.equal(result.input, 'CHANGELOG-SC.md');
          assert.equal(result.colorize, 'no');
          assert.equal(result.targets, 'testing');
        }
      },
    'containing the input parameter and the targets parameter as "statecharts and routes, testing"': {
      topic: ['node', 'linelizer.js', '--input=CHANGELOG-SC.md', '--targets=statecharts and routes, testing'], // Odd quoting needed.
        'should return two parameters': function (topic) {
          var result = linelizer.gatherCommandLineParameters(topic);
          assert.equal(result.input, 'CHANGELOG-SC.md');
          assert.equal(result.targets, 'statecharts and routes, testing');
        }
      },
    'containing the targets parameter as "statecharts and routes, testing"': {
      topic: ['node', 'linelizer.js', 'CHANGELOG-SC.md', '--targets=statecharts and routes, testing'], // Odd quoting needed.
        'should return two parameters': function (topic) {
          var result = linelizer.gatherCommandLineParameters(topic);
          assert.equal(result.input, 'CHANGELOG-SC.md');
          assert.equal(result.targets, 'statecharts and routes, testing');
        }
      }
  }
}).export(module);


