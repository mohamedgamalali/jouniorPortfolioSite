const mongoose = require('mongoose');

const schema     = mongoose.Schema;

const trackSchema = new schema({
  trackName:{
    type:String,
    required:true
  }
});

module.exports = mongoose.model('track',trackSchema);
