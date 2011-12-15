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
    'containing the most keywords for the testing category': {
      topic: "* test qunit css array delegate",
        'should match color red and name testing': function (topic) {
          var winner = linelizer.searchExhaustivelyByKeywordCount(topic);
          assert.equal(winner.color, 'red');
          assert.equal(winner.name, 'testing');
        }
      },
    'containing no keywords for any category': {
      topic: "* my dog has fleas. mary has a little lamb.",
        'should return null': function (topic) {
          var winner = linelizer.searchExhaustivelyByKeywordCount(topic);
          assert.equal(winner, null);
        }
      },
    'containing two keywords each for testing and docs categories': {
      topic: "* test qunit doc typo",
        'should return testing, because it has lower array index': function (topic) {
          var winner = linelizer.searchExhaustivelyByKeywordCount(topic);
          assert.equal(winner.name, 'testing');
        }
      }
    }
}).export(module);


