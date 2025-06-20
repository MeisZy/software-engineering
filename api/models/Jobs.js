const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  department: {
    type: String,
    required: true,
    trim: true,
  },
  workSchedule: {
    type: String,
    required: true,
    trim: true,
  },
  workSetup: {
    type: String,
    required: true,
    trim: true,
  },
  employmentType: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: [String],
    required: true,
  },
  keyResponsibilities: {
    type: [String],
    required: true,
  },
  qualifications: {
    type: [String],
    required: true,
  },
  whatWeOffer: {
    type: [String],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  Status: {
    type: String,
    required: true,
    enum: ['Rejected', 'To Next Interview'],
    default: 'To Next Interview',
  },
});

module.exports = mongoose.model('Jobs', jobSchema);