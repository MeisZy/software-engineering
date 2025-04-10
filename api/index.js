const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = 5000;

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
  optionsSuccessStatus: 200
}));


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});