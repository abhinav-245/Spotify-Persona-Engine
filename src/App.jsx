import React, { useEffect, useState } from 'react';
import PlaylistGallery from './PlaylistGallery';
import './index.css';

function App() {
  const [playlistData, setPlaylistData] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get('access_token');

    if (tokenFromUrl) {
      // Clear the token from the URL for security and aesthetics
      window.history.replaceState({}, document.title, "/");

      // Store token in state
      setAccessToken(tokenFromUrl);

      // Fetch playlists using the token
      fetch('/api/playlists', {
        headers: {
          'Authorization': `Bearer ${tokenFromUrl}`
        }
      })
        .then(res => res.json())
        .then(data => {
          if (data.playlists) {
            setPlaylistData({ playlists: data.playlists });
          }
        })
        .catch(err => console.error("Error fetching playlists:", err));
    }
  }, []);

  const handleLogin = () => {
    window.location.href = 'http://127.0.0.1:3000/login';
  };

  // Only render gallery if we have both data and a token
  if (playlistData && accessToken) {
    return <PlaylistGallery playlists={playlistData.playlists} accessToken={accessToken} />;
  }

  return (
    <div className="container">
      <h1 className="title">Spotify Persona Engine</h1>
      {!playlistData && (
        <div className="button-group">
          <button onClick={handleLogin} className="btn login-btn">
            Login with Spotify
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
