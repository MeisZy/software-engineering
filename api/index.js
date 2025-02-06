const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Applicants = require('./models/Applicants');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const mongoURI = 'mongodb+srv://zyrusnw:Gr29Sfmw7WBh1lFy@maincluster.h3yc4.mongodb.net/applicant_manager?retryWrites=true&w=majority&appName=maincluster';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((error) => console.error('Error connecting to MongoDB Atlas:', error));

app.use(cors({
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200
}));

app.post('/add', async (req, res) => {
  try {
    const { instance } = req.body;

    // Validate if all required fields are present
    if (!instance.name || !instance.position || !instance.skillset || !instance.languages || !instance.email) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const applicant = new Applicants({ instance });
    await applicant.save();
    res.status(201).json(applicant);
  } catch (err) {
    console.error('Error saving applicant:', err);
    res.status(500).json({ message: err.message });
  }
});

app.delete('/delete/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const deletedApplicant = await Applicants.findByIdAndDelete(id);
    if (!deletedApplicant) {
      return res.status(404).json({ message: 'Applicant not found' });
    }
    res.status(200).json({ message: `Applicant '${deletedApplicant.instance.name}' deleted.` });
  } catch (err) {
    console.error('Error deleting applicant:', err);
    res.status(500).json({ message: err.message });
  }
});

app.get('/get', async (req, res) => {
  try {
    const applicants = await Applicants.find({});
    res.json(applicants);
  } catch (err) {
    console.error('Error fetching applicants:', err);
    res.status(500).json({ message: err.message });
  }
});

app.get('/get/:position', async (req, res) => {
  try {
    const position = req.params.position;
    const applicants = await Applicants.find({ 'instance.position': position });
    res.json(applicants);
  } catch (err) {
    console.error('Error fetching applicants by position:', err);
    res.status(500).json({ message: err.message });
  }
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