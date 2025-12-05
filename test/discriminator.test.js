'use strict';

const assert = require('node:assert');
const mongoose = require('mongoose');
const mongooseLeanId = require('../');

describe('discriminator', function() {
  it('attaches .id to discriminator results when using .lean()', async function() {
    const baseSchema = new mongoose.Schema({
      name: String
    }, { timestamps: true });
    baseSchema.plugin(mongooseLeanId);

    const Base = mongoose.model('TestDiscBase', baseSchema);
    const Disc = Base.discriminator('TestDisc', new mongoose.Schema({
      description: String
    }));

    const doc = new Disc({ name: 'example', description: 'an example disc' });
    await doc.save();

    const foundLean = await Disc.findById(doc._id).lean();

    assert.equal(foundLean.id, foundLean._id.toString());
  });
});