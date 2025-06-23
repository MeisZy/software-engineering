const mongoose = require('mongoose');

const jobApplicantSchema = new mongoose.Schema({
  fullName: String,
  firstName: String,
  middleName: String,
  lastName: String,
  email: { type: String, required: true },
  mobileNumber: String,
  positionAppliedFor: [String],
  birthdate: Date,
  gender: String,
  city: String,
  stateProvince: String,
  status: String,
  applicationStage: String,
  scores: { type: Map, of: Number }, // Store scores for each job
});

module.exports = mongoose.model('JobApplicants', jobApplicantSchema);