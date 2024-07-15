const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Applicants = require('./models/Applicants');

const app = express();

app.use(cors());
app.use(express.json());

const mongoURI = 'mongodb+srv://zyrusnw:Gr29Sfmw7WBh1lFy@maincluster.tul9uzm.mongodb.net/'; 

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((error) => console.error('Error connecting to MongoDB Atlas:', error));

app.use(cors({
  origin: 'http://localhost:5173', // Replace with your frontend's URL if different
  optionsSuccessStatus: 200
}));

app.post('/api/add', async (req, res) => {
  try {
    const { instance } = req.body;
    const todo = new Applicants({ instance });
    await todo.save();
    res.status(201).json(todo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete('/api/delete/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const deletedApplicant = await Applicants.findByIdAndDelete(id);
    if (!deletedApplicant) {
      return res.status(404).json({ message: 'Applicant not found' });
    }
    res.status(200).json({ message: `Applicant '${deletedApplicant.instance.name}' deleted.` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/get', async (req, res) => {
  try {
    const todos = await Applicants.find({});
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/get/:position', async (req, res) => {
  try {
    const position = req.params.position;
    const todos = await Applicants.find({ 'instance.position': position });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete('/api/clear', async (req, res) => {
  try {
    await Applicants.deleteMany({});
    res.status(200).json({ message: 'All applicants deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/checkName/:name', async (req, res) => {
  const { name } = req.params;
  try {
    const existingApplicant = await Applicants.findOne({ 'instance.name': name });
    if (existingApplicant) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = app;
