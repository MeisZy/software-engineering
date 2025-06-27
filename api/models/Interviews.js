const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  email: { type: String, required: true },
  date: { type: Date, required: true },
  type: { type: String, required: true },
  notified: { type: Boolean, default: false }
}, { collection: 'interviews' });

module.exports = mongoose.model('Interviews', interviewSchema);