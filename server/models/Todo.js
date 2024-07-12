// todo.js

const mongoose = require('mongoose');

const instanceSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  position: String,
  skillset: String,
  languages: [String],
  score: Number,
  email: String,
});

const TodoSchema = new mongoose.Schema({
  instance: instanceSchema,
});

const TodoModel = mongoose.model('Todo', TodoSchema);

module.exports = TodoModel;
