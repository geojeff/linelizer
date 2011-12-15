var vows = require('vows'),
    assert = require('assert'),
    linelizer = require('../linelizer');

vows.describe('unwanted lines').addBatch({                                         // Batch
  'A set of input lines': {                                                        // Context
    'containing * blah, - blah, -------, =======, 1.6.1, cat, and // dog': {       // Sub-Context
      topic: ['* blah', '- blah', '------', '======', '1.6.1', 'cat', '// dog'],   // Topic
        'should be reduced to three lines': function (topic) {                     // Vow
          var lines = linelizer.removeUnwantedLines(topic);
          assert.equal(lines.length, 3);
        },
        'should be reduced to * blah, -blah, and 1.6.1': function (topic) {        // Vow
          var lines = linelizer.removeUnwantedLines(topic);
          assert.include(lines, '* blah');
          assert.include(lines, '- blah');
          assert.include(lines, '1.6.1');
        }
      }
    }
}).export(module);


