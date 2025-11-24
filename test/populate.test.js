'use strict';

const assert = require('node:assert');
const mongoose = require('mongoose');
const mongooseLeanId = require('../');

describe('populate', function() {
  it('attaches .id to populated and lean populated results', async function() {
    const parentSchema = new mongoose.Schema({
      name: String
    }, { timestamps: true });
    parentSchema.plugin(mongooseLeanId);

    parentSchema.virtual('child', {
      ref: 'TestPopChild',
      localField: '_id',
      foreignField: 'parentId'
    });

    const Parent = mongoose.model('TestPopParent', parentSchema);

    const childSchema = new mongoose.Schema({
      parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TestPopParent',
        required: true
      },
      description: String
    });
    childSchema.plugin(mongooseLeanId);

    const Child = mongoose.model('TestPopChild', childSchema);

    const parentDoc = new Parent({ name: 'example' });
    await parentDoc.save();

    const childDoc = new Child({ parentId: parentDoc._id, description: 'a child of parent' });
    await childDoc.save();

    const leanPopulated = await Parent.findById(parentDoc._id).populate('child').lean();

    assert.equal(leanPopulated.id, leanPopulated._id.toString());
    assert.equal(leanPopulated.child[0].id, leanPopulated.child[0]._id.toString());
  });
});