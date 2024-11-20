const express = require('express');
const connectDB = require('./db');
const itemModel = require('./models/Post');
const cors = require('cors');
const multer = require('multer');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use('/uploads', express.static('uploads'));
app.use(express.json({ limit: '50mb' }));
app.use(cors());
connectDB();

const upload = multer({ dest: 'uploads/' });

app.post('/post', upload.single('image'), async (req, res) => {
    const { title, recipient, body, author } = req.body;
    const imageUrl = req.file ? req.file.path : '';

    const newPost = { title, recipient, body, author: author || 'Anonymous', imageUrl };
    try {
        const post = await itemModel.create(newPost);
        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Error creating post', error });
    }
});

app.get('/post', async (req, res) => {
    try {
        const posts = await itemModel.find();
        res.status(200).json({ items: posts });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching posts', error });
    }
});

app.get('/post/:id', async (req, res) => {
    try {
        const post = await itemModel.findById(req.params.id);
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching post', error });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
