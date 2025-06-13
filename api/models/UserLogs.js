const mongoose = require('mongoose');

const userLogSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  firstName: {
    type: String,
    default: '',
  },
  middleName: {
    type: String,
    default: '',
  },
  fullName: {
    type: String,
    required: true,
  },
  activity: {
    type: String,
    enum: ['Logged in', 'Logged out'],
    required: true,
  },
}, { timestamps: false });

module.exports = mongoose.model('UserLogs', userLogSchema);