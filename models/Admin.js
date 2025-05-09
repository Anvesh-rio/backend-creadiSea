const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adminShema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  gmail: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
},
{
  timestamps: true
});

module.exports = mongoose.model('Admin', adminShema);
