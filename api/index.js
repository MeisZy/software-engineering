require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const Applicants = require('./models/Applicants');
const Jobs = require('./models/Jobs');
const JobApplicants = require('./models/JobApplicants');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200,
}));
app.use(express.json());

// MongoDB connection
const mongoURI = process.env.CONNECTION_STRING;

if (!mongoURI) {
  console.error('MongoDB connection string is undefined. Please check your .env file.');
  process.exit(1);
}

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((error) => console.error('Error connecting to MongoDB Atlas:', error));

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
    const { email, firstName, picture } = req.body;

    if (!email || !firstName) {
      return res.status(400).json({ message: 'Email and first name are required' });
    }

    // Check if user exists
    let applicant = await Applicants.findOne({ email });
    if (!applicant) {
      // Create new applicant with default values
      applicant = new Applicants({
        firstName,
        middleName: '',
        lastName: 'Google User',
        email,
        birthdate: new Date('1970-01-01'), // Default date
        gender: 'F', // Default
        streetAddress: 'Unknown',
        city: 'Unknown',
        stateProvince: 'Unknown',
        postalCode: '0000',
        mobileNumber: '0000000000', // Default 10-digit number
        password: await bcrypt.hash(Math.random().toString(36).slice(-8), 10), // Random password
      });
      await applicant.save();
    }

    res.status(200).json({
      message: 'Google login successful',
      applicant: {
        firstName: applicant.firstName,
        email: applicant.email,
        profilePic: picture || '',
      },
    });
  } catch (err) {
    console.error('Error during Google login:', err);
    res.status(500).json({ message: 'Server error during Google login' });
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
        firstName: applicant.firstName,
        middleName: applicant.middleName || '',
        lastName: applicant.lastName,
        email: applicant.email,
        mobileNumber: applicant.mobileNumber.replace(/[^\d]/g, '').slice(-10), // Normalize to 10 digits
        positionAppliedFor: [jobTitle],
        birthdate: applicant.birthdate,
        gender: applicant.gender,
        city: applicant.city,
        stateProvince: applicant.stateProvince,
        status: 'Ongoing',
        applicationStage: 'None',
        resume: ['Default Skill'], // Placeholder skills, as Applicants schema doesn't include resume
      });
      await jobApplicant.save();
    }

    res.status(201).json({ message: 'Application submitted successfully' });
  } catch (error) {
    console.error('Error applying for job:', error);
    if (error.code === 11000) { // Duplicate email
      return res.status(400).json({ message: 'Email already exists in job applicants' });
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

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});