'use strict';

module.exports = function mongooseLeanId(schema) {
  schema.post('find', attachId);
  schema.post('findOne', attachId);
  schema.post('findOneAndUpdate', attachId);
};

function attachId(res) {
  if (res == null) {
    return
  }

  if (this._mongooseOptions.lean) {
    if (Array.isArray(res)) {
      res.forEach(function(v) { v.id = v._id.toString() });
    } else {
      res.id = res._id.toString();
    }
  }
}
