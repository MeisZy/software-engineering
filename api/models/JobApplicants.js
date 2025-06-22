const mongoose = require('mongoose');

const jobApplicantsSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true, // Changed to required
    trim: true,
  },
  firstName: {
    type: String,
    trim: true,
  },
  middleName: {
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  mobileNumber: {
    type: String,
    required: true,
    trim: true,
  },
  positionAppliedFor: {
    type: [String],
    required: true,
  },
  birthdate: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    required: true,
    enum: ['M', 'F', 'Other'],
  },
  city: {
    type: String,
    required: true,
    trim: true,
  },
  stateProvince: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    required: true,
    default: 'To Next Interview',
    enum: ['Rejected', 'To Next Interview'],
  },
  applicationStage: {
    type: String,
    default: 'None',
    trim: true,
  }
});

module.exports = mongoose.model('JobApplicants', jobApplicantsSchema);