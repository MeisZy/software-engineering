const mongoose = require('mongoose');

const adminNotificationSchema = new mongoose.Schema({
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  isRead: { type: Boolean, default: false },
  email: { type: String, required: true }, // Applicant's email
  jobTitle: { type: String, required: true }, // Specific job applied for
  time: { type: String, required: true }, // Time as a string, e.g. "14:23"
});

module.exports = mongoose.model('AdminNotifications', adminNotificationSchema);