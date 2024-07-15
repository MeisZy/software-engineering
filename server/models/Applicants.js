const mongoose = require('mongoose');

const instanceSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  position: String,
  skillset: String,
  languages: [String],
  score: Number,
  email: String,
});

const ApplicantsSchema = new mongoose.Schema({
  instance: instanceSchema,
});

const Applicants = mongoose.model('Applicant', ApplicantsSchema, 'applicants');

module.exports = Applicants;
