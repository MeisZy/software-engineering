const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); // For unique IDs

const applicantSchema = new mongoose.Schema({
  applicantId: { type: String, default: uuidv4, unique: true }, // Unique applicantId
  email: { type: String, required: true, unique: true }, // Required field
  fullName: { type: String }, // Optional field
  firstName: { type: String, required: true }, // Required field
  middleName: { type: String }, // Optional field
  lastName: { type: String, required: true }, // Required field
  birthdate: { type: Date, required: true }, // Required field
  gender: { type: String, required: true }, // Required field
  streetAddress: { type: String }, // Optional field
  city: { type: String }, // Optional field
  stateProvince: { type: String }, // Optional field
  postalCode: { type: String }, // Optional field
  mobileNumber: { type: String }, // Optional field
  password: { type: String, required: true }, // Required field
  resume: {
    filePath: { type: String },
    fileType: { type: String },
    originalFileName: { type: String },
  },
  extractedSkills: { type: [String] }, // Optional field
});

module.exports = mongoose.model('Applicants', applicantSchema);