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

  function replaceId(res) {
    if (Array.isArray(res)) {
      res.forEach(v => {
        if(v._id) {
          v.id = v._id.toString();
        }
        Object.keys(v).map(k => {
          if (Array.isArray(v[k])) {
            replaceId(v[k]);
          }
        });
      });
    } else {
      if (res._id) {
        res.id = res._id.toString();
      }
      Object.keys(res).map(k => {
        if (Array.isArray(res[k])) {
          replaceId(res[k]);
        }
      });
    }
  }

  if (this._mongooseOptions.lean) {
    replaceId(res);
  }
}
