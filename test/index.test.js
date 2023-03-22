'use strict';

const assert = require('assert');
const mongoose = require('mongoose');
const mongooseLeanId = require('../');

describe('tests', function() {
  it('handles no results for findOne', async function() {
    const schema = new mongoose.Schema({
      name: String
    });
    schema.plugin(mongooseLeanId);
    
    const Model = mongoose.model('gh1', schema);
    
    const res = await Model.findOne({}).lean().exec();
    assert.ok(!res);
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

        const id = docs[0].ids[0].toHexString();
        assert.strictEqual(id, oid.toHexString());
      });
  });
  it('supports findOneAndReplace', async function() {
    const testSchema = new mongoose.Schema({
      name: String
    });
    testSchema.plugin(mongooseLeanId);
    const Test = mongoose.model('testreplace', testSchema);
    const entry = await Test.create({ name: 'Test Testerson'});
    const doc = await Test.findOneAndReplace({ _id: entry._id }, { name: 'Test' }, { returnDocument: 'after'}).lean();
    assert.equal(doc.name, 'Test');
    assert.equal(doc.id, doc._id.toString());

  });
  it('supports findOneAndDelete', async function() {
    const testSchema = new mongoose.Schema({
      name: String
    });
    testSchema.plugin(mongooseLeanId);
    const Test = mongoose.model('testdelete', testSchema);

    const entry = await Test.create({ name: 'Test Testerson' });
    const doc = await Test.findOneAndDelete({ _id: entry._id }).lean();
    assert.equal(doc.id, doc._id.toString())
  });
});
