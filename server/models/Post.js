const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  recipient: { type: String, required: true },
  title: { type: String, required: true },
  body: { type: String, required: true },
  author: { type: String, required: false },
  imageUrl: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;