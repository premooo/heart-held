import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DOMPurify from 'dompurify';

function Post() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/post`)
      .then((response) => response.json())
      .then((data) => {
        setPosts(data.items || []);
        setFilteredPosts(data.items || []);
      })
      .catch((error) => console.error('Error fetching posts:', error));
      
  }, []);

  const handleSearchChange = (e) => {
    const sanitizedQuery = DOMPurify.sanitize(e.target.value);
    setSearchQuery(sanitizedQuery);
    filterPosts(sanitizedQuery);
  };


  const filterPosts = (query) => {
    if (query === '') {
      setFilteredPosts(posts); 
    } else {
      const filtered = posts.filter((post) =>
        post.recipient.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredPosts(filtered); 
    }
  };

  return (
    <main className='postFeed'>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by recipient"
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-bar"
        />
      </div>

      <div className="container-grid">
        {filteredPosts.map((post) => (
          <Link to={`/post/${post._id}`} key={post._id} className="card">
            <p>to: <strong>{post.recipient}</strong></p>
            <p className='post-body'>{post.body.substring(0, 25)}...</p>
          </Link>
        ))}
      </div>
    </main>
  );
}

export default Post;
