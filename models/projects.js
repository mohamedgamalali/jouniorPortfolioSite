const mongoose = require('mongoose');

const schema     = mongoose.Schema;

const projectSchema = new schema({
  projName:{
    type:String,
    required:true
  },
  img:{
    type:String,
    required:true
  },projDes:{
    type:String,
    required:true
  },
  date:{
    type:Date,
    required:true
  },
  track:{
    type: schema.Types.ObjectId,
    ref: 'track',
    required: true
  }
});

module.exports = mongoose.model('project',projectSchema);
