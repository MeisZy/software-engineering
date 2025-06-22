require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Applicants = require('./models/Applicants');
const Jobs = require('./models/Jobs');
const JobApplicants = require('./models/JobApplicants');
const UserLogs = require('./models/UserLogs');
const Notifications = require('./models/Notifications');

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

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'frontend', 'public', 'Uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(UploadsDir, { recursive: true });
}

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}_${file.originalname}`);
  }
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.pdf' && ext !== '.docx') {
      return cb(new Error('Only .pdf and .docx files are allowed'));
    }
    cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// In-memory store for OTPs and reset tokens
const otpStore = new Map();
const resetTokenStore = new Map();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200,
}));
app.use(express.json());
// Serve uploaded files
app.use('/Uploads', express.static(uploadsDir));

// MongoDB connection
const mongoURI = process.env.CONNECTION_STRING || 'mongodb://localhost:27017/collectius';
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
    if (error.name === 'MongoServerSelectionError') {
      console.error('Possible issues: Invalid connection string, network connectivity, or IP not in Atlas allowlist.');
    }
    process.exit(1);
  });

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

// Test Nodemailer
transporter.verify((error, success) => {
  if (error) {
    console.error('Nodemailer configuration error:', {
      message: error.message,
      code: error.code,
      response: error.response,
      stack: error.stack,
    });
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

    if (!firstName || !lastName || !birthdate || !gender || !streetAddress || !city || !stateProvince || !postalCode || !email || !mobileNumber || !password || !confirmPassword) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

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
      password: hashedPassword,
      resume: { filePath: null, fileType: null }
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

    const isMatch = await bcrypt.compare(password, applicant.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const userLog = new UserLogs({
      date: new Date(),
      firstName: applicant.firstName || '',
      middleName: applicant.middleName || '',
      fullName: applicant.fullName || 'Unknown User',
      activity: 'Logged in',
    });
    await userLog.save();

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

    const normalizedFullName = fullName.trim() || 'Unknown Google User';

    let applicant = await Applicants.findOne({ email });
    if (!applicant) {
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
        resume: { filePath: null, fileType: null }
      });
      await applicant.save();
    }

    if (!applicant.fullName) {
      applicant.fullName = normalizedFullName;
      await applicant.save();
    }

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

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(email, { otp, expires: Date.now() + 10 * 60 * 1000 });

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
      `,
    });

    res.status(200).json({ message: 'OTP sent to your email' });
  } catch (err) {
    console.error('Error sending OTP:', {
      message: err.message,
      code: err.code,
      response: err.response,
      stack: err.stack,
    });
    res.status(500).json({ message: 'Failed to send OTP' });
  }
});

// Verify OTP endpoint
app.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const stored = otpStore.get(email);
    if (!stored || stored.expires < Date.now()) {
      otpStore.delete(email);
      return res.status(400).json({ message: 'OTP expired or invalid' });
    }

    if (stored.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    const resetToken = Math.random().toString(36).slice(-8);
    resetTokenStore.set(email, { token: resetToken, expires: Date.now() + 10 * 60 * 1000 });

    otpStore.delete(email);

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

    applicant.password = await bcrypt.hash(password, 10);
    await applicant.save();

    resetTokenStore.delete(email);

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (err) {
    console.error('Error resetting password:', err);
    res.status(500).json({ message: 'Failed to reset password' });
  }
});

// Report problem endpoint
app.post('/report-problem', async (req, res) => {
  try {
    const { sender, subject, body } = req.body;

    if (!sender || !subject || !body) {
      return res.status(400).json({ message: 'Sender, subject, and body are required' });
    }

    if (!/\S+@\S+\.\S+/.test(sender)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    await transporter.sendMail({
      from: `"Collectius Support" <${process.env.NODEMAILER_ADMIN}>`,
      to: 'collectiushrad@gmail.com',
      replyTo: sender,
      subject: `Concern: ${subject}`,
      html: `
        <p><strong>From:</strong> ${sender}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${body.replace(/\n/g, '<br>')}</p>
        <hr />
      `,
    });

    res.status(200).json({ message: 'Report submitted successfully' });
  } catch (err) {
    console.error('Error sending report email:', {
      message: err.message,
      code: err.code,
      response: err.response,
      stack: err.stack,
    });
    res.status(500).json({ message: 'Failed to submit report' });
  }
});

// Send message endpoint
app.post('/send-message', async (req, res) => {
  try {
    const { recipient, subject, body } = req.body;

    if (!recipient || !subject || !body) {
      return res.status(400).json({ message: 'Recipient, subject, and body are required' });
    }

    if (!/\S+@\S+\.\S+/.test(recipient)) {
      return res.status(400).json({ message: 'Invalid recipient email format' });
    }

    await transporter.sendMail({
      from: `"Collectius Support" <${process.env.NODEMAILER_ADMIN}>`,
      to: recipient,
      subject: `Message: ${subject}`,
      html: `
        <h3>Your Message</h3>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${body.replace(/\n/g, '<br>')}</p>
        <hr />
        <p>Best Regards,</p>
        <p>Collectius Admin</p>
      `,
    });

    res.status(200).json({ message: 'Message sent successfully' });
  } catch (err) {
    console.error('Error sending message:', {
      message: err.message,
      code: err.code,
      response: err.response,
      stack: err.stack,
    });
    res.status(500).json({ message: 'Failed to send message' });
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
      keywords,
      gradedQualifications,
    } = req.body;

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

    const totalGradedScore = gradedQualifications.reduce((sum, qual) => sum + (qual.points || 0), 0);
    if (totalGradedScore > 20) {
      return res.status(400).json({ message: 'Total graded qualifications score cannot exceed 20 points' });
    }

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
      keywords: keywords || [],
      gradedQualifications: gradedQualifications || [],
    });

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

    if (!email || !jobTitle) {
      return res.status(400).json({ message: 'Email and job title are required' });
    }

    const applicant = await Applicants.findOne({ email });
    if (!applicant) {
      return res.status(404).json({ message: 'Applicant not found' });
    }

    if (!applicant.fullName) {
      return res.status(400).json({ message: 'Applicant fullName is missing' });
    }

    const job = await Jobs.findOne({ title: jobTitle });
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    let jobApplicant = await JobApplicants.findOne({ email });
    if (jobApplicant) {
      if (jobApplicant.positionAppliedFor.includes(jobTitle)) {
        return res.status(400).json({ message: 'You have already applied for this job' });
      }
      jobApplicant.positionAppliedFor.push(jobTitle);
      if (!jobApplicant.fullName) {
        jobApplicant.fullName = applicant.fullName;
      }
      await jobApplicant.save();
    } else {
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
        status: 'To Next Interview',
        applicationStage: 'None'
      });
      await jobApplicant.save();
    }

    res.status(201).json({ message: 'Application submitted successfully' });
  } catch (error) {
    console.error('Error applying for job:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already exists in job applicants' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: `Validation error: ${error.message}` });
    }
    res.status(500).json({ message: 'Server error while applying for job' });
  }
});

// Fetch applicants endpoint
app.get('/applicants', async (req, res) => {
  try {
    const applicants = await JobApplicants.find();
    res.status(200).json(applicants);
  } catch (err) {
    console.error('Error fetching applicants:', err);
    res.status(500).json({ message: err.message });
  }
});

// Fetch single applicant endpoint
app.get('/applicants/:email', async (req, res) => {
  try {
    const { email } = req.params;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    const applicant = await Applicants.findOne({ email });
    if (!applicant) {
      return res.status(200).json(null);
    }
    res.status(200).json({
      fullName: applicant.fullName,
      firstName: applicant.firstName,
      middleName: applicant.middleName,
      lastName: applicant.lastName,
      email: applicant.email,
      mobileNumber: applicant.mobileNumber,
      birthdate: applicant.birthdate,
      gender: applicant.gender,
      city: applicant.city,
      stateProvince: applicant.stateProvince,
      resume: applicant.resume
    });
  } catch (err) {
    console.error('Error fetching applicant:', err);
    res.status(500).json({ message: err.message });
  }
});

// Upload resume endpoint
app.post('/upload-resume', upload.single('resume'), async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !req.file) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: 'Email and resume file are required' });
    }

    const applicant = await Applicants.findOne({ email });
    if (!applicant) {
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ message: 'Applicant not found' });
    }

    // Delete previous resume file if exists
    if (applicant.resume.filePath) {
      const oldPath = path.join(__dirname, '..', 'frontend', 'public', applicant.resume.filePath);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    const fileType = path.extname(req.file.filename).toLowerCase() === '.pdf' ? 'pdf' : 'docx';
    applicant.resume = {
      filePath: `/Uploads/${req.file.filename}`,
      fileType
    };
    await applicant.save();

    res.status(200).json({ message: 'Resume uploaded successfully', resume: applicant.resume });
  } catch (err) {
    console.error('Error uploading resume:', err);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: err.message });
  }
});

// Update applicant status endpoint
app.put('/update-applicant-status', async (req, res) => {
  try {
    const { email, status } = req.body;

    if (!email || !status) {
      return res.status(400).json({ message: 'Email and status are required' });
    }

    if (!['Rejected', 'To Next Interview'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const jobApplicant = await JobApplicants.findOne({ email });
    if (!jobApplicant) {
      return res.status(404).json({ message: 'Applicant not found' });
    }

    const applicant = await Applicants.findOne({ email });
    if (applicant && !jobApplicant.fullName) {
      jobApplicant.fullName = applicant.fullName || 'Unknown Applicant';
    }

    jobApplicant.status = status;
    await jobApplicant.save();

    // Create notification
    const notification = new Notifications({
      email,
      message: `Your application status has been updated to: ${status}`,
    });
    await notification.save();

    // Send email notification
    await transporter.sendMail({
      from: `"Collectius Support" <${process.env.NODEMAILER_ADMIN}>`,
      to: email,
      subject: 'Application Status Update',
      html: `
        <h3>Application Status Update</h3>
        <p>Dear ${jobApplicant.fullName || 'Applicant'},</p>
        <p>Your application status has been updated to: <strong>${status}</strong>.</p>
        <p>Please log in to your Collectius account to view more details.</p>
        <hr />
        <p>Best regards,</p>
        <p>The Collectius Team</p>
      `,
    });

    res.status(200).json({ message: 'Applicant status updated successfully', applicant: jobApplicant });
  } catch (error) {
    console.error('Error updating applicant status:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: `Validation error: ${error.message}` });
    }
    res.status(500).json({ message: 'Server error while updating applicant status' });
  }
});

// Delete applicant endpoint
app.delete('/delete-applicant', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const jobApplicant = await JobApplicants.findOneAndDelete({ email });
    if (!jobApplicant) {
      return res.status(404).json({ message: 'Applicant not found' });
    }

    res.status(200).json({ message: 'Applicant deleted successfully' });
  } catch (error) {
    console.error('Error deleting applicant:', error);
    res.status(500).json({ message: 'Server error while deleting applicant' });
  }
});

// Fetch notifications endpoint
app.get('/notifications/:email', async (req, res) => {
  try {
    const { email } = req.params;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    const notifications = await Notifications.find({ email }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (err) {
    console.error('Error fetching notifications:', err);
    res.status(500).json({ message: err.message });
  }
});

// Mark notification as read endpoint
app.put('/notifications/:id/read', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid notification ID' });
    }
    const notification = await Notifications.findById(id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    notification.isRead = true;
    await notification.save();
    res.status(200).json({ message: 'Notification marked as read' });
  } catch (err) {
    console.error('Error marking notification as read:', err);
    res.status(500).json({ message: err.message });
  }
});

// Fix applicant status and fullName endpoint
app.get('/fix-applicant-status', async (req, res) => {
  try {
    const applicants = await JobApplicants.find();
    let updatedCount = 0;

    for (const jobApplicant of applicants) {
      let needsUpdate = false;

      // Fix status
      if (jobApplicant.status !== 'To Next Interview' && jobApplicant.status !== 'Rejected') {
        jobApplicant.status = 'To Next Interview';
        needsUpdate = true;
      }

      // Fix fullName
      if (!jobApplicant.fullName) {
        const applicant = await Applicants.findOne({ email: jobApplicant.email });
        jobApplicant.fullName = applicant ? applicant.fullName : 'Unknown Applicant';
        needsUpdate = true;
      }

      if (needsUpdate) {
        await jobApplicant.save();
        updatedCount++;
      }
    }

    res.status(200).json({
      message: `Updated ${updatedCount} applicant documents`,
      totalProcessed: applicants.length,
    });
  } catch (error) {
    console.error('Error fixing applicant status:', error);
    res.status(500).json({ message: 'Failed to update status', error: error.message });
  }
});

// Fetch applied jobs endpoint
app.get('/applied-jobs/:email', async (req, res) => {
  try {
    const { email } = req.params;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    const jobApplicant = await JobApplicants.findOne({ email });
    if (!jobApplicant) {
      return res.status(200).json(null);
    }
    const appliedJobs = await Promise.all(
      jobApplicant.positionAppliedFor.map(async (jobTitle) => {
        const job = await Jobs.findOne({ title: jobTitle });
        return job || { title: jobTitle, department: 'Unknown', workSchedule: 'Unknown', workSetup: 'Unknown', employmentType: 'Unknown' };
      })
    );
    const response = {
      fullName: jobApplicant.fullName,
      firstName: jobApplicant.firstName,
      middleName: jobApplicant.middleName,
      lastName: jobApplicant.lastName,
      email: jobApplicant.email,
      mobileNumber: jobApplicant.mobileNumber,
      birthdate: jobApplicant.birthdate,
      gender: jobApplicant.gender,
      city: jobApplicant.city,
      stateProvince: jobApplicant.stateProvince,
      status: jobApplicant.status,
      positionAppliedFor: jobApplicant.positionAppliedFor,
      appliedJobs,
    };
    res.status(200).json(response);
  } catch (err) {
    console.error('Error fetching applied jobs:', err);
    res.status(500).json({ message: err.message });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});