import React, { useEffect, useState } from 'react';
import PlaylistGallery from './PlaylistGallery';
import './index.css';

function App() {
  const [playlistData, setPlaylistData] = useState(null);
  const [accessToken, setAccessToken] = useState(null);


  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('access_token');

    if (accessToken) {
      window.history.replaceState({}, document.title, "/");
      setAccessToken(accessToken);

      // Fetch playlists
      fetch('/api/playlists', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
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
    // Redirect to the backend login route
    window.location.href = 'http://127.0.0.1:3000/login';
  };

  const handleRoast = () => {
    // Placeholder for future logic
    console.log('Roast button clicked');
  };

  if (playlistData) {
    return <PlaylistGallery playlists={playlistData.playlists} accessToken={accessToken} />;
  }

  return (
    <div className="container">
      <h1 className="title">Spotify Playlist Analyzer</h1>
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
