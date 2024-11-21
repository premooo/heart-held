import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function PostDetails() {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/post/${id}`)
      .then((response) => response.json())
      .then((data) => setPost(data))
      .catch((error) => console.error('Error fetching post details:', error));
  }, [id]);

  if (!post) {
    return <p>Loading...</p>;
  }

  const getImageSrc = () => {
    if (post.imageUrl.startsWith('data:image')) {
      return post.imageUrl;
    } else if (post.imageUrl) {
      return `http://localhost:5000/${post.imageUrl}`;
    }
    return null;
  };

  return (
    <main className="postFeed">
      <div className="post-details">
        <div>
          <h1>{post.title}</h1>
          <p>to: <strong>{post.recipient}</strong></p>
        </div>

        {getImageSrc() && (
          <article>
            <img 
              src={getImageSrc()} 
              alt={post.title} 
              className="post-image" 
            />
          </article>
        )}

        <div className='post-body-actual'>
          <p>{post.body}</p>
        </div>

        <div className='detail-end'>
          {post.author && <p><strong>from:</strong> {post.author}</p>}
          <p><strong>Created At:</strong> {new Date(post.createdAt).toLocaleString()}</p>
        </div>
      </div>
    </main>
  );
}

export default PostDetails;
