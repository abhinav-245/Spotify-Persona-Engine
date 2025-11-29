import React from 'react';

const AIResultModal = ({ visible, onClose, loading, title, content }) => {
    if (!visible) return null;

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
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
                            <p>Analyzing your music taste...</p>
                        </div>
                    ) : (
                        <div className="ai-output">
                            {content ? (
                                <p>{content}</p>
                            ) : (
                                <p className="error-text">Something went wrong. Please try again.</p>
                            )}
                        </div>
                    )}
                </div>

                {!loading && (
                    <div className="modal-footer">
                        <button onClick={onClose} className="btn close-modal-btn">
                            Close
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AIResultModal;
