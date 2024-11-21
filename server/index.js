const express = require('express');
const connectDB = require('./db.js');
const itemModel = require('./models/Post.js');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
app.use('/uploads', express.static('uploads'));
app.use(express.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'client/build')));

app.use(cors({
    origin: '*',
}));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html')); // Serve the index.html for all routes
});

connectDB();

const upload = multer({ dest: 'uploads/' });

// Create Post
app.post('/post', upload.single('image'), async (req, res) => {
    try {
        const { title, recipient, body, author } = req.body;
        const imageUrl = req.file ? req.file.path : req.body.imageUrl || '';

        const newPost = new itemModel({
            title,
            recipient,
            body,
            author: author || 'Anonymous',
            imageUrl,
        });

        const post = await newPost.save();
        res.status(201).json(post);
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ message: 'Error creating post', error });
    }
});

// Fetch All Posts
app.get('/post', async (req, res) => {
    try {
        const response = await itemModel.find();
        res.json({ items: response });
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ message: 'Error fetching posts' });
    }
});

// Fetch Single Post by ID
app.get('/post/:id', async (req, res) => {
    try {
        const post = await itemModel.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.json(post);
    } catch (error) {
        console.error('Error retrieving post:', error);
        res.status(500).json({ message: 'Error retrieving post' });
    }
});

const PORT = 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
