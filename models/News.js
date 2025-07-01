const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  fullText: String,
  imageUrls: [String],
  author: String,
  time: String
});

module.exports = mongoose.model('News', newsSchema);
