const mongoose = require('mongoose');

const schema     = mongoose.Schema;

const visit = new schema({
  counter:{
    type:Number,
    required:true
  }
});

module.exports = mongoose.model('visit',visit);
