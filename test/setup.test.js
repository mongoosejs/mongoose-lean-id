'use strict';

const mongoose = require('mongoose');

before(function() {
  mongoose.connect('mongodb://127.0.0.1:27017/test');
});
