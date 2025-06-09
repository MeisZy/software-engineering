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

const applicantSchema = new mongoose.Schema({
  applicantId: {
    type: String,
    required: true,
    unique: true,
    default: () => new mongoose.Types.ObjectId().toString()
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  middleName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
  },
  mobileNumber: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  positionAppliedFor: {
    type: String,
    required: false,
    trim: true
  },
  birthdate: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    required: true,
    enum: ['M', 'F', 'Other'],
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  stateProvince: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    required: true,
    enum: ['Ongoing', 'Rejected'],
    default: 'Ongoing'
  },
  applicationStage: {
    type: String,
    default: 'None'
  },
  resume: {
    skills: [{
      type: String,
      trim: true
    }]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Applicant', applicantSchema);