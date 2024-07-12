const mongoose = require('mongoose');

const TodoCacheSchema = new mongoose.Schema({
  instance: {
    type: Object,
    required: true
  }
});

module.exports = mongoose.model('TodoCache', TodoCacheSchema);
