const express = require('express');
const path = require('path');
const connectDB = require('./db.js');
const itemModel = require('./models/Post.js');
const cors = require('cors');
const multer = require('multer');
require('dotenv').config();
const axios = require('axios');
const allowedOrigins = [
  'https://heart-held.onrender.com',
  'https://heart-held-api.onrender.com'
];

const app = express();
app.use('/uploads', express.static('uploads'));
app.use(express.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'public'), { index: 'index.html' }));



app.use(cors({
  origin: function(origin, callback) {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));


connectDB();

const upload = multer({ dest: 'uploads/' });

app.get('/get-spotify-token', async (req, res) => {
  try {
    const response = await axios.post('https://accounts.spotify.com/api/token', null, {
      params: {
        grant_type: 'client_credentials',
      },
      headers: {
        'Authorization': `Basic ${Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const accessToken = response.data.access_token;
    res.json({ accessToken });
  } catch (error) {
    console.error('Error fetching Spotify token:', error);
    res.status(500).send('Error fetching access token');
  }
});

app.get('/search-songs', async (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  try {
    const tokenResponse = await axios.post('https://accounts.spotify.com/api/token', null, {
      params: {
        grant_type: 'client_credentials',
      },
      headers: {
        'Authorization': `Basic ${Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const accessToken = tokenResponse.data.access_token;

    const searchResponse = await axios.get('https://api.spotify.com/v1/search', {
      params: {
        q: query,
        type: 'track',
        limit: 10,
      },
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    res.json(searchResponse.data.tracks.items);
  } catch (error) {
    console.error('Error fetching song data:', error);
    res.status(500).json({ message: 'Error fetching song data' });
  }
});


app.post('/post', upload.single('image'), async (req, res) => {
  try {
      const { title, recipient, body, author, trackId } = req.body;
      const imageUrl = req.file ? req.file.path : req.body.imageUrl || '';

      const newPost = new itemModel({
          title,
          recipient,
          body,
          author: author || 'Anonymous',
          imageUrl,
          trackId, 
      });

      const post = await newPost.save();
      res.status(201).json(post);
  } catch (error) {
      console.error('Error creating post:', error);
      res.status(500).json({ message: 'Error creating post', error });
  }
});

app.get('/post', async (req, res) => {
    try {
        const response = await itemModel.find();
        res.json({ items: response });
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ message: 'Error fetching posts' });
    }
});

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
