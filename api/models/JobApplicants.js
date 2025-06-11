const mongoose = require('mongoose');

const jobApplicantSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  middleName: {
    type: String,
    required: false
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /.+\@.+\..+/ // Simple email validation
  },
  mobileNumber: {
    type: String,
    required: true,
    match: /^\d{10}$/ // Assuming a 10-digit mobile number
  },
  positionAppliedFor: {
    type: [String], // Changed to an array of strings
    required: true
  },
  birthdate: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    enum: ['M', 'F'],
    required: true
  },
  city: {
    type: String,
    required: true
  },
  stateProvince: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Ongoing', 'Rejected'],
    required: true
  },
  applicationStage: {
    type: String,
    default: 'None'
  },
  resume: {
    type: [String], // Assuming skills are stored as an array of strings
    required: true
  }
});

const JobApplicants = mongoose.model('JobApplicants', jobApplicantSchema);

module.exports = JobApplicants;