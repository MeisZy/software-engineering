const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Applicants = require('./models/Applicants');

const app = express();
const port = 5173;

app.use(cors());
app.use(express.json());

const mongoURI = process.env.CONNECTION_STRING;

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((error) => console.error('Error connecting to MongoDB Atlas:', error));

app.use(cors({
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin'); // Enforcing same-origin for window communication
  res.setHeader('Cross-Origin-Resource-Policy', 'same-origin'); // Ensure resources are loaded from same origin
  next();
});



app.delete('/clear', async (req, res) => {
  try {
    await Applicants.deleteMany({});
    res.status(200).json({ message: 'All applicants deleted' });
  } catch (err) {
    console.error('Error clearing applicants:', err);
    res.status(500).json({ message: err.message });
  }
});

app.get('/checkName/:name', async (req, res) => {
  const { name } = req.params;
  try {
    const existingApplicant = await Applicants.findOne({ 'instance.name': name });
    if (existingApplicant) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (err) {
    console.error('Error checking applicant name:', err);
    res.status(500).json({ message: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});