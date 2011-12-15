var vows = require('vows'),
    assert = require('assert'),
    linelizer = require('../linelizer');

vows.describe('unwanted lines').addBatch({
  'Calling removeUnwantedLines on: * blah, - blah, -------, =======, 1.6.1, cat, and // dog': {
    topic: linelizer.removeUnwantedLines(['* blah',
                                          '- blah',
                                          '------',
                                          '======',
                                          '1.6.1',
                                          'cat',
                                          '// dog']),
    'should return an array': function (topic) {
      assert.instanceOf(topic, Array);
    },
    'with three lines': function (topic) {
      assert.equal(topic.length, 3);
    },
    'containing * blah, -blah, and 1.6.1': function (topic) {
      assert.include(topic, '* blah');
      assert.include(topic, '- blah');
      assert.include(topic, '1.6.1');
    }
  }
}).export(module);


