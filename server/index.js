const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const TodoModel = require('./models/Todo');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/cvs', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Error connecting to MongoDB:', error));

app.use(cors({
  origin: 'http://localhost:5173', // Replace with your frontend's URL if different
  optionsSuccessStatus: 200
}));

app.delete('/delete/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const deletedApplicant = await TodoModel.findByIdAndDelete(id);
    if (!deletedApplicant) {
      return res.status(404).json({ message: 'Applicant not found' });
    }
    res.status(200).json({ 
      message: `Applicant '${deletedApplicant.instance.name}' deleted.` 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/get', async (req, res) => {
  try {
    const todos = await TodoModel.find({});
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/get/:position', async (req, res) => {
  try {
    const position = req.params.position;
    const todos = await TodoModel.find({ 'instance.position': position });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/add', async (req, res) => {
  try {
    const { instance } = req.body;
    const todo = new TodoModel({ instance });
    await todo.save();
    res.status(201).json(todo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete('/delete/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await TodoModel.findByIdAndDelete(id);
    res.status(200).json({ message: 'Applicant deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete('/clear', async (req, res) => {
  try {
    await TodoModel.deleteMany({});
    res.status(200).json({ message: 'All applicants deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

app.get('/checkName/:name', async (req, res) => {
  const { name } = req.params;
  try {
    const existingApplicant = await TodoModel.findOne({ 'instance.name': name });
    if (existingApplicant) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
