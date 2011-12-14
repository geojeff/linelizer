var vows = require('vows'),
    assert = require('assert'),
    linelizer = require('../linelizer');

vows.describe('searching').addBatch({                                                   // Batch
  'An input line': {                                                                    // Context
    'containing the most keywords for the "statecharts and routes" category': {         // Sub-Context
      topic: "* view list statechart substate route css zindex",                        // Topic
        'should match color blue, and name statecharts and routes': function (topic) {  // Vow
          var winner = linelizer.searchExhaustivelyByKeywordCount(topic);
          assert.equal(winner.color, 'blue');
          assert.equal(winner.name, 'statecharts and routes');
        }
      },
    'containing the most keywords for the testing category': {         // Sub-Context
      topic: "* test qunit css array delegate",                        // Topic
        'should match color red and name testing': function (topic) {  // Vow
          var winner = linelizer.searchExhaustivelyByKeywordCount(topic);
          assert.equal(winner.color, 'red');
          assert.equal(winner.name, 'testing');
        }
      }
    }
}).export(module);


