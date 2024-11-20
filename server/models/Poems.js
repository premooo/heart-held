const mongoose = require('mongoose');

const poemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  author: { type: String, required: false },
  imageUrl: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
});

const Poem = mongoose.model('Post', poemSchema);

module.exports = Poem;