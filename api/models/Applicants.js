/*
Attributes of object applicants:

First Name:
Middle Name: 
Last Name:
Email:
Mobile Number:
Position Applied for:
Birthdate:
Gender: M/F
City:
State/Province:
Status: (Ongoing or Rejected)
Application Stage: (supposed to be kung pangilang interview na siya. value is None by default)
Resume: (skills)
*/

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
