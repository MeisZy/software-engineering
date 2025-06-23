const mongoose = require('mongoose');

const applicantSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  fullName: String,
  firstName: String,
  middleName: String,
  lastName: String,
  birthdate: Date,
  gender: String,
  streetAddress: String,
  city: String,
  stateProvince: String,
  postalCode: String,
  mobileNumber: String,
  password: String,
  resume: {
    filePath: String,
    fileType: String,
    originalFileName: String,
  },
  extractedSkills: [String], // Store parsed skills
});

module.exports = mongoose.model('Applicants', applicantSchema);