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
      fetch('https://spotify-persona-backend.onrender.com/api/playlists', {
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
    window.location.href = 'https://spotify-persona-backend.onrender.com/login';
  };

  // Only render gallery if we have both data and a token
  if (playlistData && accessToken) {
    return <PlaylistGallery playlists={playlistData.playlists} accessToken={accessToken} />;
  }

  return (
    <div className="landing-container">
      <div className="landing-card">
        <h1 className="landing-title">Spotify Persona Engine</h1>
        <p className="landing-subtitle">AI-powered insights from your playlists</p>

        <button onClick={handleLogin} className="spotify-login-btn">
          <svg className="spotify-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
          </svg>
          Login with Spotify
        </button>
      </div>
      <div className="social-links">
        <a href="https://github.com/abhinav-245" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="GitHub">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
        </a>
        <a href="https://www.linkedin.com/in/abhinavreddyadla" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="LinkedIn">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
          </svg>
        </a>
      </div>
    </div>
  );
}

export default App;
