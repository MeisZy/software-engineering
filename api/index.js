require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const pdfParse = require('pdf-parse');
const Applicants = require('./models/Applicants');
const Jobs = require('./models/Jobs');
const JobApplicants = require('./models/JobApplicants');
const UserLogs = require('./models/UserLogs');
const Notifications = require('./models/Notifications');
const AdminNotifications = require('./models/AdminNotifications'); 
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = process.env.PORT || 5000;

// Validate environment variables
if (!process.env.NODEMAILER_ADMIN || !process.env.NODEMAILER_PASSWORD) {
  console.error('Missing NODEMAILER_ADMIN or NODEMAILER_PASSWORD environment variables');
  process.exit(1);
}
if (!process.env.CONNECTION_STRING) {
  console.error('MongoDB connection string is undefined. Please check your .env file.');
  process.exit(1);
}

const uploadsDir = path.join(__dirname, '../frontend/public/Uploads');
fs.mkdir(uploadsDir, { recursive: true }).catch(err => console.error('Error creating uploads directory:', err));

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
  limits: { fileSize: 5 * 1024 * 1024 }
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

// Test Nodemailer configuration
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

// Calculate applicant score (matches only keywords, sums their graded points)
const calculateScore = (extractedSkills, job) => {
  let totalPoints = 0;
  if (!extractedSkills || !job) return totalPoints;

  // For each keyword, check if applicant has it in their skills (partial match, case-insensitive)
  job.keywords.forEach(keyword => {
    const matched = extractedSkills.some(skill => skill.toLowerCase().includes(keyword.toLowerCase()));
    if (matched) {
      // Find the graded qualification for this keyword
      const qual = job.gradedQualifications.find(
        q => q.attribute.toLowerCase() === keyword.toLowerCase()
      );
      if (qual) {
        totalPoints += qual.points;
      }
    }
  });

  return totalPoints;
};

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

    // Password validation: at least 2 special characters and at least 1 number
    const specialCharCount = (password.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g) || []).length;
    const numberCount = (password.match(/[0-9]/g) || []).length;
    if (specialCharCount < 2 || numberCount < 1) {
      return res.status(400).json({ message: 'Password must contain at least 2 special characters and 1 number' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const applicant = new Applicants({
      applicantId: uuidv4(), // Generate unique applicantId
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
      fullName: applicant.fullName,
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

    const normalizedFullName = fullName ;

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
      fullName: fullName,
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

    // Password validation: at least 2 special characters and at least 1 number
    const specialCharCount = (password.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g) || []).length;
    const numberCount = (password.match(/[0-9]/g) || []).length;
    if (specialCharCount < 2 || numberCount < 1) {
      return res.status(400).json({ message: 'Password must contain at least 2 special characters and 1 number' });
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
    const { sender, recipient, subject, body } = req.body;

    if (!sender || !recipient || !subject || !body) {
      console.error('Missing required fields:', { sender, recipient, subject, body });
      return res.status(400).json({ message: 'Sender, recipient, subject, and body are required' });
    }

    if (!/\S+@\S+\.\S+/.test(recipient)) {
      console.error('Invalid recipient email:', recipient);
      return res.status(400).json({ message: 'Invalid recipient email format' });
    }

    if (!/\S+@\S+\.\S+/.test(sender)) {
      console.error('Invalid sender email:', sender);
      return res.status(400).json({ message: 'Invalid sender email format' });
    }

    const mailOptions = {
      from: `"Collectius Admin" <${process.env.NODEMAILER_ADMIN}>`,
      to: recipient,
      replyTo: sender,
      subject: subject,
      html: `
        <p><strong>From:</strong> ${sender}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${body.replace(/\n/g, '<br>')}</p>
        <hr />
        <p>Best regards,</p>
        <p>The Collectius Team</p>
      `,
    };

    await new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Nodemailer sendMail error:', {
            message: error.message,
            code: error.code,
            response: error.response,
            stack: error.stack,
          });
          reject(error);
        } else {
          console.log('Email sent:', info.response);
          resolve(info);
        }
      });
    });

    res.status(200).json({ message: 'Message sent successfully' });
  } catch (err) {
    console.error('Error in send-message endpoint:', {
      message: err.message,
      code: err.code,
      response: err.response,
      stack: err.stack,
    });
    res.status(500).json({ message: `Failed to send message: ${err.message}` });
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
    console.log(`Retrieved ${jobs.length} jobs`);
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
      threshold,
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

    if (threshold < 0 || threshold > 15) {
      return res.status(400).json({ message: 'Threshold must be between 0 and 15' });
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
      threshold: threshold || 10,
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

// Get job count endpoint
app.get('/jobs/count', async (req, res) => {
  try {
    const count = await Jobs.countDocuments();
    res.status(200).json({ count });
  } catch (err) {
    console.error('Error fetching job count:', err);
    res.status(500).json({ message: err.message });
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

    // Normalize jobTitle
    const normalizedJobTitle = jobTitle.trim().toLowerCase();

    // Fetch the applicant details
    const applicant = await Applicants.findOne({ email });
    if (!applicant) {
      return res.status(404).json({ message: 'Applicant not found' });
    }

    // Fetch the job details
    const job = await Jobs.findOne({ title: { $regex: `^${jobTitle}$`, $options: 'i' } });
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Calculate score based on extracted skills and job requirements
    const score = applicant.extractedSkills ? calculateScore(applicant.extractedSkills, job) : 0;
    const status = score >= job.threshold ? 'To Next Interview' : 'Rejected';

    // Check if the applicant has already applied for this job
    let jobApplicant = await JobApplicants.findOne({ email });
    if (
      jobApplicant &&
      jobApplicant.positionAppliedFor.some(pos => pos.jobTitle.toLowerCase() === normalizedJobTitle)
    ) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    // Update or create job application record
    if (jobApplicant) {
      jobApplicant.positionAppliedFor.push({ jobTitle, status });
      jobApplicant.scores = jobApplicant.scores || {};
      jobApplicant.scores[normalizedJobTitle] = score;
      await jobApplicant.save();
    } else {
      jobApplicant = new JobApplicants({
        fullName: applicant.fullName,
        email: applicant.email,
        mobileNumber: applicant.mobileNumber.replace(/[^\d]/g, '').slice(-10),
        positionAppliedFor: [{ jobTitle, status }],
        scores: { [normalizedJobTitle]: score },
        applicationStage: 'None'
      });
      await jobApplicant.save();
    }

    // Create admin notification (permanent in DB) with time field
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const adminMsg =
      status === 'To Next Interview'
        ? `${applicant.fullName || applicant.email} was Accepted after applying for "${jobTitle}".`
        : `${applicant.fullName || applicant.email} was Rejected after applying for "${jobTitle}".`;

    await AdminNotifications.create({
      message: adminMsg,
      email: applicant.email,
      jobTitle: jobTitle,
      isRead: false,
      time: timeString,
    });

    const userMsg =
      status === 'To Next Interview'
        ? `We're delighted to inform you that your application status for "${jobTitle}" has been set to ${status}.`
        : `We regret to inform you that your application status for "${jobTitle}" has been set to ${status}.`;

    await new Notifications({
      email,
      message: userMsg,
    }).save();

    await transporter.sendMail({
      from: `"Collectius Support" <${process.env.NODEMAILER_ADMIN}>`,
      to: email,
      subject: 'Application Status Update',
      html: `
        <h3>Application Status Update</h3>
        <p>Dear ${applicant.fullName || 'Applicant'},</p>
        <p>${userMsg}</p>
        <p>Please log in to your Collectius account to view more details.</p>
        <hr />
        <p>Best regards,</p>
        <p>The Collectius Team</p>
      `,
    });

    console.log(`[DEBUG] Application for "${jobTitle}" by ${applicant.fullName || applicant.email}:`);
    console.log(`        Computed Score: ${score}`);
    console.log(`        Threshold: ${job.threshold}`);
    console.log(`        Status: ${status}`);
    console.log(`        Scores Object: ${JSON.stringify(jobApplicant.scores)}`);

    res.status(201).json({ message: 'Application submitted successfully', score, status });
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

// Fix applicant scores endpoint
app.get('/fix-applicant-scores', async (req, res) => {
  try {
    const applicants = await JobApplicants.find();
    const updatedApplicants = [];
    let updatedCount = 0;

    console.log(`[DEBUG] Starting score fix for ${applicants.length} applicants`);

    for (const applicant of applicants) {
      let needsUpdate = false;
      const scores = applicant.scores || {};

      for (const pos of applicant.positionAppliedFor || []) {
        const normalizedJobTitle = pos.jobTitle.trim().toLowerCase();
        if (!(normalizedJobTitle in scores)) {
          const job = await Jobs.findOne({ title: { $regex: `^${pos.jobTitle}$`, $options: 'i' } });
          const originalApplicant = await Applicants.findOne({ email: applicant.email });
          let score = 0;

          if (job && originalApplicant && originalApplicant.extractedSkills?.length) {
            score = calculateScore(originalApplicant.extractedSkills, job);
            console.log(`[DEBUG] Calculated score for ${applicant.email} on job ${pos.jobTitle}: ${score}`);
          } else {
            console.log(`[DEBUG] No score for ${applicant.email} on ${pos.jobTitle}: Job=${!!job}, Skills=${originalApplicant?.extractedSkills?.length || 0}`);
          }

          scores[normalizedJobTitle] = score;
          needsUpdate = true;
        }
      }

      if (needsUpdate) {
        const updatedApplicant = await JobApplicants.findOneAndUpdate(
          { _id: applicant._id },
          { $set: { scores } },
          { new: true, runValidators: true }
        );
        updatedApplicants.push(updatedApplicant);
        updatedCount++;
        console.log(`[DEBUG] Updated ${applicant.email} scores: ${JSON.stringify(scores)}`);
      } else {
        updatedApplicants.push(applicant);
      }
    }

    console.log(`[DEBUG] Fixed scores for ${updatedCount} applicants`);
    res.json({ message: `Fixed scores for ${updatedCount} applicants`, applicants: updatedApplicants });
  } catch (err) {
    console.error('[ERROR] Fixing applicant scores:', err.message);
    res.status(500).json({ message: 'Failed to fix scores', error: err.message });
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
      resume: applicant.resume,
      extractedSkills: applicant.extractedSkills,
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
      if (req.file) await fs.unlink(req.file.path);
      return res.status(400).json({ message: 'Email and resume file are required' });
    }

    const applicant = await Applicants.findOne({ email });
    if (!applicant) {
      await fs.unlink(req.file.path);
      return res.status(404).json({ message: 'Applicant not found' });
    }

    if (applicant.resume.filePath) {
      const oldPath = path.join(__dirname, '../frontend/public', applicant.resume.filePath);
      if (await fs.access(oldPath).then(() => true).catch(() => false)) {
        await fs.unlink(oldPath);
      }
    }

    const filePath = `/Uploads/${req.file.filename}`;
    const fileType = path.extname(req.file.filename).toLowerCase() === '.pdf' ? 'pdf' : 'docx';
    let extractedSkills = [];

if (fileType === 'pdf') {
  const fullPath = path.join(__dirname, '../frontend/public', filePath);
  const pdfBuffer = await fs.readFile(fullPath);
  const pdfData = await pdfParse(pdfBuffer);
  const text = pdfData.text;
  const lines = text.split('\n').map(line => line.trim()).filter(line => line);

  let inSkillsSection = false;
  for (const line of lines) {
    const lowerLine = line.toLowerCase();
    if (lowerLine.includes('skills')) {
      inSkillsSection = true;
      const skillsInLine = line.replace(/skills/i, '').trim().split(/[,;]/).map(s => s.trim()).filter(s => s);
      if (skillsInLine.length) extractedSkills.push(...skillsInLine);
    } else if (inSkillsSection && !lowerLine.match(/^(education|experience|projects|certifications)/i)) {
      const skillsInLine = line.split(/[,;]/).map(s => s.trim()).filter(s => s);
      if (skillsInLine.length) extractedSkills.push(...skillsInLine);
    } else if (inSkillsSection && lowerLine.match(/^(education|experience|projects|certifications)/i)) {
      inSkillsSection = false;
    }
  }
}

    applicant.resume = {
      filePath,
      fileType,
      originalFileName: req.file.originalname,
    };
    applicant.extractedSkills = extractedSkills;
    await applicant.save();

    res.status(200).json({ message: 'Resume uploaded successfully', resume: applicant.resume });
  } catch (err) {
    console.error('Error uploading resume:', err);
    if (req.file && await fs.access(req.file.path).then(() => true).catch(() => false)) {
      await fs.unlink(req.file.path);
    }
    res.status(500).json({ message: err.message });
  }
});

// Update applicant status endpoint
app.put('/update-applicant-status', async (req, res) => {
  try {
    const { email, jobTitle, status } = req.body;

    if (!email || !status || !jobTitle) {
      return res.status(400).json({ message: 'Email, jobTitle, and status are required' });
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

    // Update status for the specific jobTitle in positionAppliedFor
    let found = false;
    jobApplicant.positionAppliedFor = jobApplicant.positionAppliedFor.map(pos => {
      if (pos.jobTitle === jobTitle) {
        found = true;
        return { ...pos, status };
      }
      return pos;
    });
    if (!found) {
      // If not found, add it
      jobApplicant.positionAppliedFor.push({ jobTitle, status });
    }
    await jobApplicant.save();

    // Improved user notification message
    const userMsg =
      status === 'To Next Interview'
        ? `We hope this email finds you well. We are delighted to inform you that your application status for "${jobTitle}" has been set to ${status}.`
        : `We hope this email finds you well. We regret to inform you that your application status for "${jobTitle}" has been set to ${status}.`;

    await new Notifications({
      email,
      message: userMsg,
    }).save();

    // Send email notification to the applicant
    await transporter.sendMail({
      from: `"Collectius Support" <${process.env.NODEMAILER_ADMIN}>`,
      to: email,
      subject: 'Application Status Update',
      html: `
        <h3>Application Status Update</h3>
        <p>Dear ${jobApplicant.fullName || 'Applicant'},</p>
        <p>${userMsg}</p>
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

// Fetch admin notifications endpoint
app.get('/adminnotifications', async (req, res) => {
  try {
    const notifications = await AdminNotifications.find().sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (err) {
    console.error('Error fetching admin notifications:', err);
    res.status(500).json({ message: err.message });
  }
});

// Mark admin notification as read endpoint
app.put('/adminnotifications/:id/read', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid notification ID' });
    }
    const notification = await AdminNotifications.findById(id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    notification.isRead = true;
    await notification.save();
    res.status(200).json({ message: 'Notification marked as read' });
  } catch (err) {
    console.error('Error marking admin notification as read:', err);
    res.status(500).json({ message: err.message });
  }
});

// Delete applicant endpoint
app.delete('/applicants/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid applicant ID' });
    }
    const applicant = await JobApplicants.findByIdAndDelete(id);
    if (!applicant) {
      return res.status(404).json({ message: 'Applicant not found' });
    }
    res.status(200).json({ message: 'Applicant deleted successfully' });
  } catch (error) {
    console.error('Error deleting applicant:', error);
    res.status(500).json({ message: 'Server error while deleting applicant' });
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

      if (jobApplicant.status !== 'To Next Interview' && jobApplicant.status !== 'Rejected') {
        jobApplicant.status = 'To Next Interview';
        needsUpdate = true;
      }

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

app.get('/fix-applicant-scores', async (req, res) => {
  try {
    const applicants = await JobApplicants.find();
    let updated = 0;
    for (const applicant of applicants) {
      let needsUpdate = false;
      if (!applicant.scores) applicant.scores = {};
      for (const pos of applicant.positionAppliedFor) {
        const normalizedJobTitle = pos.jobTitle.trim().toLowerCase();
        if (!(normalizedJobTitle in applicant.scores)) {
          // Try to recalculate the score if possible
          const job = await Jobs.findOne({ title: { $regex: `^${pos.jobTitle}$`, $options: 'i' } });
          let score = 0;
          if (job && applicant.extractedSkills) {
            score = calculateScore(applicant.extractedSkills, job);
          }
          applicant.scores[normalizedJobTitle] = score;
          needsUpdate = true;
          console.log(`Fixed score for ${applicant.email} on job ${pos.jobTitle}: ${score}`);
        }
      }
      if (needsUpdate) {
        await applicant.save();
        updated++;
      }
    }
    res.json({ message: `Fixed scores for ${updated} applicants.` });
  } catch (err) {
    console.error('Error fixing applicant scores:', err);
    res.status(500).json({ message: err.message });
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
      scores: jobApplicant.scores,
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