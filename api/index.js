require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const Applicants = require('./models/Applicants');
const Jobs = require('./models/Jobs');
const JobApplicants = require('./models/JobApplicants');
const UserLogs = require('./models/UserLogs');

const app = express();
const port = process.env.PORT || 5000;

// Validate environment variables
console.log('Environment variables:', {
  emailUser: process.env.NODEMAILER_ADMIN,
  emailPassLength: process.env.NODEMAILER_PASSWORD?.length,
  mongoUri: process.env.CONNECTION_STRING ? '[REDACTED]' : undefined,
});
if (!process.env.NODEMAILER_ADMIN || !process.env.NODEMAILER_PASSWORD) {
  console.error('Missing NODEMAILER_ADMIN or NODEMAILER_PASSWORD environment variables');
  process.exit(1);
}
if (!process.env.CONNECTION_STRING) {
  console.error('MongoDB connection string is undefined. Please check your .env file.');
  process.exit(1);
}

// In-memory store for OTPs and reset tokens (use database in production)
const otpStore = new Map();
const resetTokenStore = new Map();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200,
}));
app.use(express.json());

// MongoDB connection
const mongoURI = process.env.CONNECTION_STRING;

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((error) => console.error('Error connecting to MongoDB Atlas:', error));

// Nodemailer setup
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.NODEMAILER_ADMIN,
    pass: process.env.NODEMAILER_PASSWORD,
  },
  logger: true,
  debug: process.env.NODE_ENV !== 'production',
});

// Test Nodemailer configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Nodemailer configuration error:', error);
  } else {
    console.log('Nodemailer is ready to send emails');
  }
});

// Status endpoint
app.get('/status', (req, res) => {
  res.json({ status: 'ok' });
});

// Registration endpoint
app.post('/add', async (req, res) => {
  try {
    const {
      firstName,
      middleName,
      lastName,
      birthdate,
      gender,
      streetAddress,
      city,
      stateProvince,
      postalCode,
      email,
      mobileNumber,
      password,
      confirmPassword
    } = req.body;

    // Basic validation
    if (!firstName || !lastName || !birthdate || !gender || !streetAddress || !city || !stateProvince || !postalCode || !email || !mobileNumber || !password || !confirmPassword) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const applicant = new Applicants({
      fullName: `${firstName} ${middleName ? middleName + ' ' : ''}${lastName}`.trim(),
      firstName,
      middleName,
      lastName,
      birthdate,
      gender,
      streetAddress,
      city,
      stateProvince,
      postalCode,
      email,
      mobileNumber,
      password: hashedPassword
    });

    await applicant.save();
    res.status(201).json(applicant);
  } catch (err) {
    console.error('Error saving applicant:', err);
    res.status(500).json({ message: err.message });
  }
});

// Login endpoint
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const applicant = await Applicants.findOne({ email });

    if (!applicant) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check hashed password
    const isMatch = await bcrypt.compare(password, applicant.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Log login activity
    const userLog = new UserLogs({
      date: new Date(),
      firstName: applicant.firstName || '',
      middleName: applicant.middleName || '',
      fullName: applicant.fullName || 'Unknown User',
      activity: 'Logged in',
    });
    await userLog.save();

    // Successful login
    res.status(200).json({ message: 'Login successful', applicant });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ message: err.message });
  }
});

// Google login endpoint
app.post('/google-login', async (req, res) => {
  try {
    const { email, fullName, picture } = req.body;

    console.log('Google login request:', { email, fullName, picture });

    if (!email || !fullName) {
      return res.status(400).json({ message: 'Email and full name are required' });
    }

    // Normalize fullName
    const normalizedFullName = fullName.trim() || 'Unknown Google User';

    // Check if user exists
    let applicant = await Applicants.findOne({ email });
    if (!applicant) {
      // Create new applicant with default values
      applicant = new Applicants({
        fullName: normalizedFullName,
        firstName: '',
        middleName: '',
        lastName: '',
        email,
        birthdate: new Date('1970-01-01'),
        gender: 'F',
        streetAddress: 'Unknown',
        city: 'Unknown',
        stateProvince: 'Unknown',
        postalCode: '0000',
        mobileNumber: '0000000000',
        password: await bcrypt.hash(Math.random().toString(36).slice(-8), 10),
      });
      await applicant.save();
    }

    // Ensure applicant.fullName is set
    if (!applicant.fullName) {
      applicant.fullName = normalizedFullName;
      await applicant.save();
    }

    // Log login activity
    const userLog = new UserLogs({
      date: new Date(),
      firstName: applicant.firstName || '',
      middleName: applicant.middleName || '',
      fullName: applicant.fullName,
      activity: 'Logged in',
    });
    await userLog.save();

    res.status(200).json({
      message: 'Google login successful',
      applicant: {
        fullName: applicant.fullName,
        email: applicant.email,
        profilePic: picture || '',
      },
    });
  } catch (err) {
    console.error('Error during Google login:', err);
    res.status(500).json({ message: 'Server error during Google login' });
  }
});

// Logout endpoint
app.post('/logout', async (req, res) => {
  try {
    const { email, fullName, firstName, middleName } = req.body;

    if (!email || !fullName) {
      return res.status(400).json({ message: 'Email and full name are required' });
    }

    // Log logout activity
    const userLog = new UserLogs({
      date: new Date(),
      firstName: firstName || '',
      middleName: middleName || '',
      fullName: fullName || 'Unknown User',
      activity: 'Logged out',
    });
    await userLog.save();

    res.status(200).json({ message: 'Logout logged successfully' });
  } catch (err) {
    console.error('Error during logout logging:', err);
    res.status(500).json({ message: 'Server error during logout' });
  }
});

// Forgot password endpoint
// Forgot password endpoint
app.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ message: 'Valid email is required' });
    }

    const applicant = await Applicants.findOne({ email });
    if (!applicant) {
      return res.status(404).json({ message: 'Email not found' });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store the OTP with an expiration time (e.g., 10 minutes)
    otpStore.set(email, { otp, expires: Date.now() + 10 * 60 * 1000 });

    // Send OTP via email
    await transporter.sendMail({
      from: process.env.NODEMAILER_ADMIN,
      to: email,
      subject: 'Your Password Reset OTP',
      html: `
        <h3>Password Reset Request</h3>
        <p>You have requested to reset your password for your Collectius account.</p>
        <hr />
        <h4>Your Verification OTP</h4>
        <p><strong>Your 6-digit OTP: ${otp}</strong></p>
        <p>Please use this OTP to verify your identity. It is valid for 10 minutes.</p>
        <p>Best Regards,</p>
        <p>Collectius Team</p>
      `,
    });

    res.status(200).json({ message: 'OTP sent to your email' });
  } catch (err) {
    console.error('Error sending OTP:', err);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
});

// Verify OTP endpoint
// Verify OTP endpoint
app.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const stored = otpStore.get(email);
    if (!stored || stored.expires < Date.now()) {
      otpStore.delete(email); // Clear expired OTP
      return res.status(400).json({ message: 'OTP expired or invalid' });
    }

    if (stored.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Generate reset token
    const resetToken = Math.random().toString(36).slice(-8);
    resetTokenStore.set(email, { token: resetToken, expires: Date.now() + 10 * 60 * 1000 });

    otpStore.delete(email); // Clear OTP

    res.status(200).json({ message: 'OTP verified', resetToken });
  } catch (err) {
    console.error('Error verifying OTP:', err);
    res.status(500).json({ message: 'Failed to verify OTP' });
  }
});

// Reset password endpoint
app.post('/reset-password', async (req, res) => {
  try {
    const { email, password, resetToken } = req.body;

    if (!email || !password || !resetToken) {
      return res.status(400).json({ message: 'Email, password, and reset token are required' });
    }

    const stored = resetTokenStore.get(email);
    if (!stored || stored.expires < Date.now() || stored.token !== resetToken) {
      resetTokenStore.delete(email);
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    const applicant = await Applicants.findOne({ email });
    if (!applicant) {
      return res.status(404).json({ message: 'Email not found' });
    }

    // Hash new password
    applicant.password = await bcrypt.hash(password, 10);
    await applicant.save();

    resetTokenStore.delete(email); // Clear token

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (err) {
    console.error('Error resetting password:', err);
    res.status(500).json({ message: 'Failed to reset password' });
  }
});

// Fetch user logs endpoint
app.get('/userlogs', async (req, res) => {
  try {
    const logs = await UserLogs.find().sort({ date: -1 });
    res.status(200).json(logs);
  } catch (err) {
    console.error('Error fetching user logs:', err);
    res.status(500).json({ message: err.message });
  }
});

// Fetch jobs endpoint
app.get('/jobs', async (req, res) => {
  try {
    const jobs = await Jobs.find();
    res.status(200).json(jobs);
  } catch (err) {
    console.error('Error fetching jobs:', err);
    res.status(500).json({ message: err.message });
  }
});

// Create job endpoint
app.post('/jobs', async (req, res) => {
  try {
    const {
      title,
      department,
      workSchedule,
      workSetup,
      employmentType,
      description,
      keyResponsibilities,
      qualifications,
      whatWeOffer,
    } = req.body;

    // Validate required fields
    if (
      !title ||
      !department ||
      !workSchedule ||
      !workSetup ||
      !employmentType ||
      !description ||
      !Array.isArray(description) ||
      description.length === 0 ||
      !keyResponsibilities ||
      !Array.isArray(keyResponsibilities) ||
      keyResponsibilities.length === 0 ||
      !qualifications ||
      !Array.isArray(qualifications) ||
      qualifications.length === 0 ||
      !whatWeOffer ||
      !Array.isArray(whatWeOffer) ||
      whatWeOffer.length === 0
    ) {
      return res.status(400).json({ message: 'All fields are required and must be valid arrays where applicable' });
    }

    // Create new job
    const newJob = new Jobs({
      title,
      department,
      workSchedule,
      workSetup,
      employmentType,
      description,
      keyResponsibilities,
      qualifications,
      whatWeOffer,
    });

    // Save to MongoDB
    await newJob.save();
    res.status(201).json({ message: 'Job created successfully', job: newJob });
  } catch (error) {
    console.error('Error creating job:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error: ' + error.message });
    }
    res.status(500).json({ message: 'Server error while creating job' });
  }
});

// Delete job endpoint
app.delete('/jobs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid job ID' });
    }
    const job = await Jobs.findByIdAndDelete(id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({ message: 'Server error while deleting job' });
  }
});

// Apply for job endpoint
app.post('/apply', async (req, res) => {
  try {
    const { email, jobTitle } = req.body;

    // Validate input
    if (!email || !jobTitle) {
      return res.status(400).json({ message: 'Email and job title are required' });
    }

    // Find applicant in Applicants collection
    const applicant = await Applicants.findOne({ email });
    if (!applicant) {
      return res.status(404).json({ message: 'Applicant not found' });
    }

    // Find job in Jobs collection
    const job = await Jobs.findOne({ title: jobTitle });
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if applicant already applied for this job
    let jobApplicant = await JobApplicants.findOne({ email });
    if (jobApplicant) {
      if (jobApplicant.positionAppliedFor.includes(jobTitle)) {
        return res.status(400).json({ message: 'You have already applied for this job' });
      }
      // Append job title to existing applicant
      jobApplicant.positionAppliedFor.push(jobTitle);
      await jobApplicant.save();
    } else {
      // Create new job applicant entry
      jobApplicant = new JobApplicants({
        fullName: applicant.fullName,
        firstName: applicant.firstName || '',
        middleName: applicant.middleName || '',
        lastName: applicant.lastName || '',
        email: applicant.email,
        mobileNumber: applicant.mobileNumber.replace(/[^\d]/g, '').slice(-10),
        positionAppliedFor: [jobTitle],
        birthdate: applicant.birthdate,
        gender: applicant.gender,
        city: applicant.city,
        stateProvince: applicant.stateProvince,
        status: 'Ongoing',
        applicationStage: 'None',
        resume: ['Default Skill'],
      });
      await jobApplicant.save();
    }

    res.status(201).json({ message: 'Application submitted successfully' });
  } catch (error) {
    console.error('Error applying for job:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already exists in job applicants' });
    }
    res.status(500).json({ message: 'Server error while applying for job' });
  }
});

// Fetch applicants endpoint
app.get('/applicants', async (req, res) => {
  try {
    const applicants = await JobApplicants.find();
    res.status(200).json(applicants);W
  } catch (err) {
    console.error('Error fetching applicants:', err);
    res.status(500).json({ message: err.message });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});