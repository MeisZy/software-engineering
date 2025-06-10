require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const Applicants = require('./models/Applicants');
const Jobs = require('./models/Jobs'); // Import Job model

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
      password: hashedPassword // Store the hashed password
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

// Job creation endpoint
app.post('/add-job', async (req, res) => {
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
      whatWeOffer
    } = req.body;

    const job = new Job({
      title,
      department,
      workSchedule,
      workSetup,
      employmentType,
      description,
      keyResponsibilities,
      qualifications,
      whatWeOffer
    });

    await job.save();
    res.status(201).json(job);
  } catch (err) {
    console.error('Error saving job:', err);
    res.status(500).json({ message: err.message });
  }
});

// Fetch jobs endpoint
app.get('/jobs', async (req, res) => {
  try {
    const jobs = await Job.find();
    res.status(200).json(jobs);
  } catch (err) {
    console.error('Error fetching jobs:', err);
    res.status(500).json({ message: err.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});