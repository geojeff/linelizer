var vows = require('vows'),
    assert = require('assert'),
    linelizer = require('../linelizer');

vows.describe('newlines').addBatch({                                  // Batch
    'A changelog line': {                                             // Context
        'beginning with *, and broken with unwanted newlines': {      // Sub-Context
            topic: ["* one\n", "  two\n", "  three\n"],               // Topic
            'should be joined, to length 1': function (topic) {       // Vow
              var fixedLines = linelizer.fixNewlines(topic);
              assert.equal(fixedLines.length, 1);
            }
        },
        'beginning with -, and broken with unwanted newlines': {      // Sub-Context
            topic: ["- one\n", "  two\n", "  three\n"],               // Topic
            'should be joined, to length 1': function (topic) {       // Vow
              var fixedLines = linelizer.fixNewlines(topic);
              assert.equal(fixedLines.length, 1);
            }
        }
    }
}).export(module);


