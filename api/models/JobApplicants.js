const mongoose = require('mongoose');

const positionStatusSchema = new mongoose.Schema({
  jobTitle: { type: String, required: true },
  status: { type: String, required: true }
}, { _id: false });

const jobApplicantSchema = new mongoose.Schema({
  fullName: String,
  firstName: String,
  middleName: String,
  lastName: String,
  email: { type: String, required: true },
  mobileNumber: String,
  positionAppliedFor: [{ jobTitle: String, status: String }], // <-- FIXED: now array of objects
  birthdate: Date,
  gender: String,
  city: String,
  stateProvince: String,
  applicationStage: String,
  scores: { type: Object, default: {} },
  // ...other fields...
});

module.exports = mongoose.model('JobApplicants', jobApplicantSchema);