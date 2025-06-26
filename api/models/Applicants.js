const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); // Add uuid for unique IDs

const applicantSchema = new mongoose.Schema({
  applicantId: { type: String, default: uuidv4, unique: true }, // Add unique applicantId
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
  extractedSkills: [String],
});

module.exports = mongoose.model('Applicants', applicantSchema);