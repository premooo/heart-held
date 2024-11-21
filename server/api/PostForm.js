import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PostForm = () => {
  const [title, setTitle] = useState('');
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');
  const [author, setAuthor] = useState('');
  const [image, setImage] = useState(null);
  const [status, setStatus] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!recipient || !message) {
      setStatus('Recipient and message are required!');
      return;
    }

    const postAuthor = author.trim() ? author : 'Anonymous';

    let base64Image = '';
    if (image) {
      base64Image = await convertToBase64(image);
    }

    const newPost = {
      title,
      recipient,
      body: message,
      author: postAuthor,
      imageUrl: base64Image,
    };

    try {
      const response = await fetch(`http://localhost:5000/post`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPost),
      });

      if (response.ok) {
        setTitle('');
        setRecipient('');
        setMessage('');
        setAuthor('');
        setImage(null);
        setStatus('');
        navigate('/post');
      } else {
        setStatus('Failed to submit the post. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting post:', error);
      setStatus('Error submitting the post.');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
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
    <div>
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
          name="post-message"
          id="post-message"
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
        <button type="submit">Submit</button>
      </form>

      {status && <p className="status-message">{status}</p>}
    </div>
  );
};

export default PostForm;
