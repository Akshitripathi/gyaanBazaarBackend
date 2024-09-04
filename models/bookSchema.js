
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  publicationYear: { type: Number, required: true },
  coverImage: { type: String, required: true },
  rating: { type: Number, required: true },
  subSubject: { type: String, required: true },
  filePath: { type: String, required: true }
});

module.exports = mongoose.model('Book', bookSchema);
