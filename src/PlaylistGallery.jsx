import React, { useState } from 'react';
import AIResultModal from './AIResultModal';
import './index.css';

const PlaylistGallery = ({ playlists, accessToken }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [aiResult, setAiResult] = useState('');
    const [loading, setLoading] = useState(false);

    const handleTopAnalysis = async () => {
        setModalTitle('Personality Analysis');
        setLoading(true);
        setIsModalOpen(true);
        setAiResult('');

        try {
            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({})
            });
            const data = await response.json();
            if (data.success) {
                setAiResult(data.message);
            } else {
                setAiResult('Failed to analyze. Please try again.');
            }
        } catch (error) {
            console.error('Analysis error:', error);
            setAiResult('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleTopRoast = async () => {
        setModalTitle('Fun Roast');
        setLoading(true);
        setIsModalOpen(true);
        setAiResult('');

        try {
            const response = await fetch('/api/roast', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({})
            });
            const data = await response.json();
            if (data.success) {
                setAiResult(data.message);
            } else {
                setAiResult('Failed to roast. Please try again.');
            }
        } catch (error) {
            console.error('Roast error:', error);
            setAiResult('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className="gallery-container">
            <div className="gallery-header">
                <h2 className="gallery-title">Your Playlists</h2>
                <div className="header-actions">
                    <button
                        className="btn analyze-btn"
                        aria-label="Analyze my listening personality"
                        data-testid="top-analyze-btn"
                        onClick={handleTopAnalysis}
                    >
                        Personality Analysis
                    </button>
                    <button
                        className="btn roast-btn"
                        aria-label="Get a fun roast"
                        data-testid="top-roast-btn"
                        onClick={handleTopRoast}
                    >
                        Fun Roast
                    </button>
                </div>
            </div>
            <div className="gallery-grid">
                {playlists.map((playlist) => (
                    <div key={playlist.id} className="playlist-card">
                        <div className="card-image-wrapper">
                            {playlist.images && playlist.images.length > 0 ? (
                                <img
                                    src={playlist.images[0].url}
                                    alt={playlist.name}
                                    className="playlist-image"
                                />
                            ) : (
                                <div className="placeholder-image">No Image</div>
                            )}
                        </div>
                        <div className="card-content">
                            <h3 className="playlist-name">{playlist.name}</h3>
                            <p className="playlist-description">
                                {playlist.description || 'No description available.'}
                            </p>
                            <div className="playlist-meta">
                                <span>{playlist.tracks.total} Tracks</span>
                                <span>By {playlist.owner.display_name}</span>
                            </div>
                            <div className="card-actions">
                                <a
                                    href={playlist.external_urls.spotify}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn open-btn"
                                >
                                    Open
                                </a>

                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <AIResultModal
                visible={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                loading={loading}
                title={modalTitle}
                content={aiResult}
            />
        </div>
    );
}

export default PlaylistGallery;
