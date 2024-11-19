const express = require('express')
const connectDB = require('./db.js')
const itemModel = require('./models/Post.js')
const cors = require('cors')
const multer = require('multer');


const app = express()
app.use('/uploads', express.static('uploads'));
app.use(express.json({ limit: '50mb' }));
app.use(cors())
connectDB()

app.use(cors({
    origin: '*', 
}));

const upload = multer({ dest: 'uploads/' });

app.post('/post', upload.single('image'), async (req, res) => {
    const { title, recipient, body, author } = req.body;
    const imageUrl = req.file ? req.file.path : '';  // If you are storing an image file, use the file path
  
    // Or, if you're storing base64 images:
    const imageBase64 = req.body.imageUrl || '';
  
    const newPost = {
        title,
        recipient,
        body,
        author: author || 'Anonymous',
        imageUrl: imageUrl || imageBase64, // Use file path
        // imageUrl: imageBase64 || imageUrl, // Or use base64 string
    };

    try {
        // Save to your database (e.g., MongoDB)
        const post = await itemModel.create(newPost);
        res.status(201).json(post);  // Return the created post as response
    } catch (error) {
        res.status(500).json({ message: 'Error creating post', error });
    }
});

app.listen(5000, '0.0.0.0', () => {
    console.log("Server is running on http://0.0.0.0:5000");
});

app.listen(5000, () => {
    console.log("Server is running on http://localhost:5000");
});

app.get('/post', async (req, res) => {
    try {
        const response = await itemModel.find(); 
        return res.json({ items: response });  
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching posts' });
    }
});


app.post('/post', async (req, res) => {
    const { recipient, title, body, author, imageUrl } = req.body;
    try {
        const newPost = new itemModel({ recipient, title, body, author, imageUrl });
        await newPost.save();
        res.status(201).json({ message: 'Post created successfully', post: newPost });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating post' });
    }
});

// Add this to your server's route in `server/index.js`
app.get('/post/:id', async (req, res) => {
    try {
      const post = await itemModel.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      res.json(post);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error retrieving post' });
    }
  });
  

app.listen(3000, () =>{
    console.log("app is running");
})