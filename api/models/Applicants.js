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
  fullName: { // Explicitly define fullName with a pre-save hook
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
    filePath: {
      type: String,
      trim: true,
      default: null
    },
    fileType: {
      type: String,
      enum: ['pdf', 'docx', null],
      default: null
    },
    originalFileName: { // Added to match JobApplicants resume structure
      type: String,
      trim: true,
      default: null
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Pre-save hook to ensure fullName is always updated
applicantSchema.pre('save', function(next) {
  this.fullName = `${this.firstName} ${this.middleName ? this.middleName + ' ' : ''}${this.lastName}`.trim();
  next();
});

module.exports = mongoose.model('Applicant', applicantSchema);