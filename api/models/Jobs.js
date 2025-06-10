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
    type: [String], // Array of strings
    required: true,
  },
  keyResponsibilities: {
    type: [String], // Array of strings
    required: true,
  },
  qualifications: {
    type: [String], // Array of strings
    required: true,
  },
  whatWeOffer: {
    type: [String], // Array of strings
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Jobs', jobSchema);