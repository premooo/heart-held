import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';
import axios from 'axios';

const PostForm = () => {
  const [title, setTitle] = useState('');
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');
  const [author, setAuthor] = useState('');
  const [image, setImage] = useState(null);
  const [trackUri, setTrackUri] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  const fetchSongs = async (query) => {
    if (!query) return;
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/search-songs?q=${query}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error fetching songs:', error);
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setSelectedTrack(null);
    fetchSongs(query);
  };

  const handleSongSelect = (track) => {
    setTrackUri(track.uri);
    setSelectedTrack(track);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!recipient || !message) {
      setStatus('Recipient and message are required!');
      return;
    }

    const sanitizedData = {
      title: DOMPurify.sanitize(title),
      recipient: DOMPurify.sanitize(recipient),
      body: DOMPurify.sanitize(message),
      author: DOMPurify.sanitize(author.trim()) || 'Anonymous',
      trackId: trackUri,
    };

    let base64Image = '';
    if (image) {
      base64Image = await convertToBase64(image);
    }

    const newPost = {
      ...sanitizedData,
      imageUrl: base64Image,
    };

    console.log(newPost); // Debugging: log data before sending

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/post`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost),
      });

      if (response.ok) {
        // Reset form
        setTitle('');
        setRecipient('');
        setMessage('');
        setAuthor('');
        setImage(null);
        setTrackUri('');
        navigate('/post');
      } else {
        setStatus('Failed to submit the post.');
      }
    } catch (error) {
      console.error('Error submitting post:', error);
      setStatus('Error submitting the post.');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImage(file);
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <div className="post-form-container">
      <form className="PostForm" onSubmit={handleSubmit}>
        <input
          type="text"
          className="post-recipient"
          placeholder="Recipient"
          value={recipient}
          required
          onChange={(e) => setRecipient(e.target.value)}
        />
        <input
          type="text"
          className="post-title"
          placeholder="Title"
          value={title}
          required
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          className="post-author"
          placeholder="Author (optional)"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <textarea
          className="post-message"
          placeholder="What’s in your heart?"
          value={message}
          required
          onChange={(e) => setMessage(e.target.value)}
        />
        <input
          type="file"
          className="post-image-input"
          accept="image/*"
          onChange={handleImageChange}
        />

        <div className="track-search">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search for a song..."
            className="track-search-input"
          />
          {searchQuery && searchResults.length > 0 && (
            <ul className="track-search-results">
              {searchResults.map((song) => (
                <li key={song.id} className="track-search-result-item">
                  <button
                    onClick={() => handleSongSelect(song)}
                    className="track-search-result-button"
                  >
                    <img src={song.album.images[0]?.url} alt={song.name} className="track-thumbnail" />
                    <span>{song.name} by {song.artists[0].name}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {selectedTrack && (
          <div className="selected-track">
            <img src={selectedTrack.album.images[0]?.url} alt={selectedTrack.name} className="selected-track-thumbnail" />
            <span>{selectedTrack.name} by {selectedTrack.artists[0].name}</span>
          </div>
        )}

        {status && <div className="error-box">{status}</div>}
        <button type="submit" className="submit-button">Submit</button>
      </form>
    </div>
  );
};

export default PostForm;
