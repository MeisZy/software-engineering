const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Applicants = require('./models/Applicants');

const app = express();
const port = 5000;

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
  origin: ["software-engineering-kz8dbvqp7-meiszys-projects.vercel.app"],
  methods: ["POST","GET"],
  credentials: true,
  optionsSuccessStatus: 200
}));

app.post('/add', async (req, res) => {
  try {
    const { instance } = req.body;
    const todo = new Applicants({ instance });
    await todo.save();
    res.status(201).json(todo);
  } catch (err) {
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
    res.status(500).json({ message: err.message });
  }
});

app.get('/get', async (req, res) => {
  try {
    const todos = await Applicants.find({});
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/get/:position', async (req, res) => {
  try {
    const position = req.params.position;
    const todos = await Applicants.find({ 'instance.position': position });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete('/clear', async (req, res) => {
  try {
    await Applicants.deleteMany({});
    res.status(200).json({ message: 'All applicants deleted' });
  } catch (err) {
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
    res.status(500).json({ message: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});