const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true,
    trim: true,
    match: [/\S+@\S+\.\S+/, 'Invalid email address'],
  },
  subject: {
    type: String,
    required: true,
    trim: true,
  },
  body: {
    type: String,
    required: true,
    trim: true,
  },
  time: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

module.exports = mongoose.model('Report', reportSchema);