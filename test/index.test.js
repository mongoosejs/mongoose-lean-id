'use strict';

const assert = require('assert');
const mongoose = require('mongoose');
const mongooseLeanId = require('../');

describe('tests', function() {
  it('handles no results for findOne', function(done) {
    const schema = new mongoose.Schema({
      name: String
    });
    schema.plugin(mongooseLeanId);

    const Model = mongoose.model('gh1', schema);

    Model.findOne({}).lean().exec(function(error, res) {
      assert.ifError(error);
      assert.ok(!res);
      done();
    });
  });
});
