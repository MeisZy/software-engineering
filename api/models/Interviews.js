const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  email: { type: String, required: true },
  date: { type: Date, required: true },
  type: { type: String, required: true },
  jobTitle: { type: String, required: true }, // <-- Add this line
  notified: { type: Boolean, default: false }
}, { collection: 'interviews' });


module.exports = mongoose.model('Interviews', interviewSchema);