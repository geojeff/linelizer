var vows = require('vows'),
    assert = require('assert'),
    linelizer = require('../linelizer');

vows.describe('exhaustive').addBatch({                                // Batch
  'A changelog line': {                                               // Context
    'containing the most keywords for blue': {                        // Sub-Context
      topic: "* view list statechart substate route css zindex",      // Topic
        'should match blue': function (topic) {                       // Vow
          var winningThemeCategory = linelizer.searchExhaustivelyByKeywordCount(topic);
          assert.equal(winningThemeCategory.color, 'blue');
        }
      },
    'containing the most keywords for red': {                         // Sub-Context
      topic: "* test qunit css array delegate",                       // Topic
        'should match red': function (topic) {                        // Vow
          var winningThemeCategory = linelizer.searchExhaustivelyByKeywordCount(topic);
          assert.equal(winningThemeCategory.color, 'red');
        }
      }
    }
}).export(module);


