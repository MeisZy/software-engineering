const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  department: { type: String, required: true },
  workSchedule: { type: String, required: true },
  workSetup: { type: String, required: true },
  employmentType: { type: String, required: true },
  description: { type: [String], required: true },
  keyResponsibilities: { type: [String], required: true },
  qualifications: { type: [String], required: true },
  whatWeOffer: { type: [String], required: true },
  keywords: [String],
  gradedQualifications: [{ attribute: String, points: Number }],
  threshold: { type: Number, default: 10 }, // Minimum score for passing
});

module.exports = mongoose.model('Jobs', jobSchema);