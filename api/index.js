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

app.post('/api/login', async (req, res) => {
  try {
    const { email, name, given_name } = req.body;
    
    let existingUser = await Applicants.findOne({ 'instance.email': email });
    
    if (!existingUser) {

      existingUser = new Applicants({
        instance: {
          name: name || given_name,
          email: email,
          position: 'Not Specified',
          skillset: [],
          languages: []
        }
      });
      
      await existingUser.save();
    }
    
    res.status(200).json({
      message: 'Login successful',
      user: {
        name: existingUser.instance.name,
        email: existingUser.instance.email
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// ... (rest of the existing code remains the same)

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
