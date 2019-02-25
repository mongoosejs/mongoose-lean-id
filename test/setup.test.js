'use strict';

const mongoose = require('mongoose');

before(function() {
  mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true });

  mongoose.set('useFindAndModify', false);
});
