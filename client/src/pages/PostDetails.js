import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function PostDetails() {
  const { id } = useParams(); 
  const [post, setPost] = useState(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/post/${id}`) 
      .then((response) => response.json())
      .then((data) => setPost(data))
      .catch((error) => console.error('Error fetching post details:', error));
  }, [id]);

  if (!post) {
    return <p>Loading...</p>;
  }

  const getTrackId = (trackId) => {
    const trackIdWithoutPrefix = trackId.replace('spotify:track:', ''); 
    return trackIdWithoutPrefix;
  };

  const getSpotifyEmbedUrl = (trackId) => {
    const trackIdWithoutPrefix = getTrackId(trackId);
    return `https://open.spotify.com/embed/track/${trackIdWithoutPrefix}`;
  };

  // Determine the image source
  const getImageSrc = () => {
    if (post.imageUrl.startsWith('data:image')) {
      return post.imageUrl; 
    } else if (post.imageUrl) {
      return `${process.env.REACT_APP_API_URL}/${post.imageUrl}`;
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

        {post.trackId && (
          <div className="spotify-player">
            <iframe 
              src={getSpotifyEmbedUrl(post.trackId)} 
              width="300" 
              height="80" 
              frameBorder="0" 
              allowTransparency="true" 
              allow="encrypted-media"
              title="Spotify Track Player"
            ></iframe>
          </div>
        )}

        <div className='detail-end'>
          {post.author && <p><strong>from:</strong> {post.author}</p>}
          <p><strong>Created At:</strong> {new Date(post.createdAt).toLocaleString()}</p>
        </div>
      </div>
    </main>
  );
}

export default PostDetails;
