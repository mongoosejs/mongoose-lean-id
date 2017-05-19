'use strict';

const assert = require('assert');
const mongoose = require('mongoose');
const mongooseLeanId = require('../');

describe('examples', function() {
  it('attaches `.id` to result of find, findOne, and findOneAndUpdate if lean', function() {
    const schema = new mongoose.Schema({
      name: String
    });

    schema.plugin(mongooseLeanId);

    const Model = mongoose.model('Test', schema);

    return Model.create({ name: 'test' }).
      then(() => Promise.all([
        Model.find().lean(),
        Model.findOne().lean(),
        Model.findOneAndUpdate({}, { name: 'test' }).lean()
      ])).
      then(results => {
        const [findRes, findOneRes, findOneAndUpdateRes] = results;
        assert.equal(findRes[0].id, findRes[0]._id.toHexString());
        assert.equal(findOneRes.id, findOneRes._id.toHexString());
        assert.equal(findOneAndUpdateRes.id,
          findOneAndUpdateRes._id.toHexString());
      });
  });
});
