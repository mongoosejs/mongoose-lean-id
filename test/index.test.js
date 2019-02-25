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

  it('handles arrays of objectids (gh-3)', function() {
    const schema = new mongoose.Schema({
      name: String,
      ids: [mongoose.Schema.Types.ObjectId]
    });
    schema.plugin(mongooseLeanId);

    const Model = mongoose.model('gh3', schema);

    const oid = new mongoose.Types.ObjectId();
    return Model.deleteMany({}).
      then(() => Model.create({ name: 'foo', ids: [oid] })).
      then(() => Model.find().lean()).
      then(docs => {
        assert.equal(docs.length, 1);
        assert.equal(docs[0].ids.length, 1);
        assert.equal(docs[0].ids[0], oid.toHexString());
      });
  });
});
