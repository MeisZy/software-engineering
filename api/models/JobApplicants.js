const mongoose = require('mongoose');

const jobApplicantsSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
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
    enum: ['Rejected', 'To Next Interview'],
    default: 'To Next Interview',
  },
  applicationStage: {
    type: String,
    default: 'None',
  },
  resume: {
    type: [String],
    default: ['Default Skill'],
  },
});

module.exports = mongoose.model('JobApplicants', jobApplicantsSchema);