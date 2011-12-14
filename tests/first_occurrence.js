var vows = require('vows'),
    assert = require('assert'),
    linelizer = require('../linelizer');

vows.describe('first occurrence').addBatch({                          // Batch
  'A changelog line': {                                               // Context
    'containing statechart as the first word': {                      // Sub-Context
      topic: "* statechart view list substate route css zindex",      // Topic
        'should match blue': function (topic) {                       // Vow
          var winningThemeCategory = linelizer.searchByFirstOccurrence(topic);
          assert.equal(winningThemeCategory.color, 'blue');
        }
      },
    'containing test as the first word': {                            // Sub-Context
      topic: "* test qunit css array delegate",                       // Topic
        'should match red': function (topic) {                        // Vow
          var winningThemeCategory = linelizer.searchByFirstOccurrence(topic);
          assert.equal(winningThemeCategory.color, 'red');
        }
      }
    }
}).export(module);


