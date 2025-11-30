import React from 'react';
import './index.css';

const AIResultModal = ({ visible, onClose, loading, title, content }) => {
    if (!visible) return null;

    // Simple Markdown Parser
    const renderMarkdown = (text) => {
        if (!text) return null;

        const lines = text.split('\n');
        return lines.map((line, index) => {
            // Headers
            if (line.startsWith('### ')) {
                return <h3 key={index}>{line.replace('### ', '')}</h3>;
            }
            if (line.startsWith('## ')) {
                return <h2 key={index}>{line.replace('## ', '')}</h2>;
            }
            if (line.startsWith('# ')) {
                return <h1 key={index}>{line.replace('# ', '')}</h1>;
            }

            // List items
            if (line.trim().startsWith('- ')) {
                return (
                    <ul key={index}>
                        <li>{parseBold(line.replace('- ', ''))}</li>
                    </ul>
                );
            }

            // Numbered lists
            if (/^\d+\.\s/.test(line.trim())) {
                return (
                    <ol key={index}>
                        <li>{parseBold(line.replace(/^\d+\.\s/, ''))}</li>
                    </ol>
                );
            }

            // Empty lines
            if (line.trim() === '') {
                return <br key={index} />;
            }

            // Paragraphs
            return <p key={index}>{parseBold(line)}</p>;
        });
    };

    // Helper to parse **bold** text
    const parseBold = (text) => {
        const parts = text.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i}>{part.slice(2, -2)}</strong>;
            }
            return part;
        });
    };

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-glass" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{title}</h2>
                    {!loading && (
                        <button onClick={onClose} className="close-btn" aria-label="Close modal">
                            &times;
                        </button>
                    )}
                </div>

                <div className="modal-body">
                    {loading ? (
                        <div className="spinner-container">
                            <div className="spinner"></div>
                            <p className="loading-text">Analyzing your music taste...</p>
                        </div>
                    ) : (
                        <div className="ai-output-container">
                            {content ? (
                                <div className="ai-markdown">
                                    {renderMarkdown(content)}
                                </div>
                            ) : (
                                <p className="error-text">Something went wrong. Please try again.</p>
                            )}
                        </div>
                    )}
                </div>

                {!loading && (
                    <div className="modal-footer">
                        <button onClick={onClose} className="glass-btn close-modal-btn" style={{ padding: '0.5rem 1.5rem', fontSize: '0.9rem' }}>
                            Close
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AIResultModal;
