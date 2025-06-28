const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); 

const applicantSchema = new mongoose.Schema({
  applicantId: { type: String, default: uuidv4, unique: true }, 
  email: { type: String, required: true, unique: true },  
  fullName: { type: String },   
  firstName: { type: String, required: true },  
  middleName: { type: String },   
  lastName: { type: String, required: true },  
  birthdate: { type: Date, required: true },  
  gender: { type: String, required: true },  
  streetAddress: { type: String },   
  city: { type: String },   
  stateProvince: { type: String },   
  postalCode: { type: String },   
  mobileNumber: { type: String },   
  password: { type: String, required: true },  
  resume: {
    filePath: { type: String },
    fileType: { type: String },
    originalFileName: { type: String },
  },
  extractedSkills: { type: [String] },   
});

module.exports = mongoose.model('Applicants', applicantSchema);