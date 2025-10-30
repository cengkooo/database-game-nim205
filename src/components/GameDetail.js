import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getGameDetails, getScreenshots } from '../api/rawg';

const GameDetail = ({ gameId, onClose }) => {
  const [details, setDetails] = useState(null);
  const [screenshots, setScreenshots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch both details and screenshots in parallel
        const [gameDetails, gameScreenshots] = await Promise.all([
          getGameDetails(gameId),
          getScreenshots(gameId)
        ]);

        setDetails(gameDetails);
        setScreenshots(gameScreenshots);
      } catch (err) {
        setError(err.message || 'Failed to load game details');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [gameId]);

  // Close modal when clicking outside or pressing Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content" role="dialog" aria-modal="true">
        <button className="close-button" onClick={onClose} aria-label="Close details">
          ×
        </button>

        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading game details...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <p>{error}</p>
            <button onClick={onClose}>Close</button>
          </div>
        ) : details ? (
          <>
            <div className="game-media">
              {screenshots.length > 0 && (
                <>
                  <div className="main-image-container">
                    <img
                      src={screenshots[activeImage]}
                      alt={`Screenshot ${activeImage + 1} of ${details.name}`}
                      className="main-image"
                    />
                  </div>
                  
                  {screenshots.length > 1 && (
                    <div className="thumbnails">
                      {screenshots.map((screenshot, index) => (
                        <button
                          key={index}
                          className={`thumbnail ${index === activeImage ? 'active' : ''}`}
                          onClick={() => setActiveImage(index)}
                          aria-label={`View screenshot ${index + 1}`}
                        >
                          <img
                            src={screenshot}
                            alt={`Thumbnail ${index + 1}`}
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="game-info">
              <h2>{details.name}</h2>
              
              {details.rating && (
                <div className="rating">
                  <span className="star">★</span>
                  <span>{Number(details.rating).toFixed(1)}</span>
                </div>
              )}

              {details.released && (
                <div className="release-date">
                  Released: {new Date(details.released).toLocaleDateString()}
                </div>
              )}

              {details.genres && details.genres.length > 0 && (
                <div className="genres">
                  <h3>Genres</h3>
                  <div className="genre-tags">
                    {details.genres.map(genre => (
                      <span key={genre} className="genre-tag">
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {details.description && (
                <div className="description">
                  <h3>About</h3>
                  <div 
                    dangerouslySetInnerHTML={{ __html: details.description }}
                    className="description-content"
                  />
                </div>
              )}

              {details.website && (
                <div className="website">
                  <h3>Website</h3>
                  <a 
                    href={details.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {details.website}
                  </a>
                </div>
              )}
            </div>
          </>
        ) : null}

        <style jsx>{`
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.75);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            padding: 20px;
          }

          .modal-content {
            background: white;
            border-radius: 8px;
            max-width: 900px;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
            position: relative;
            animation: slideIn 0.3s ease-out;
          }

          @keyframes slideIn {
            from {
              transform: translateY(20px);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }

          .close-button {
            position: absolute;
            top: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.5);
            color: white;
            border: none;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            z-index: 1;
          }

          .close-button:hover {
            background: rgba(0, 0, 0, 0.7);
          }

          .game-media {
            position: relative;
          }

          .main-image-container {
            position: relative;
            padding-top: 56.25%; /* 16:9 aspect ratio */
            background: #f0f0f0;
          }

          .main-image {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .thumbnails {
            display: flex;
            gap: 8px;
            padding: 16px;
            overflow-x: auto;
            background: #f5f5f5;
          }

          .thumbnail {
            width: 100px;
            height: 56px;
            padding: 0;
            border: 2px solid transparent;
            border-radius: 4px;
            cursor: pointer;
            overflow: hidden;
            flex-shrink: 0;
            background: none;
          }

          .thumbnail.active {
            border-color: #0066cc;
          }

          .thumbnail img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .game-info {
            padding: 24px;
          }

          .game-info h2 {
            margin: 0 0 16px 0;
            font-size: 24px;
            color: #333;
          }

          .rating {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            padding: 4px 8px;
            background: #f8f8f8;
            border-radius: 4px;
            margin-bottom: 16px;
          }

          .star {
            color: #f5c518;
          }

          .release-date {
            color: #666;
            margin-bottom: 24px;
          }

          .genres {
            margin-bottom: 24px;
          }

          .genres h3 {
            margin: 0 0 8px 0;
            font-size: 16px;
            color: #333;
          }

          .genre-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
          }

          .genre-tag {
            padding: 4px 12px;
            background: #f0f0f0;
            border-radius: 16px;
            font-size: 14px;
            color: #666;
          }

          .description h3 {
            margin: 0 0 16px 0;
            font-size: 16px;
            color: #333;
          }

          .description-content {
            color: #444;
            line-height: 1.6;
          }

          .description-content p {
            margin: 0 0 16px 0;
          }

          .website {
            margin-top: 24px;
            padding-top: 24px;
            border-top: 1px solid #eee;
          }

          .website h3 {
            margin: 0 0 8px 0;
            font-size: 16px;
            color: #333;
          }

          .website a {
            color: #0066cc;
            text-decoration: none;
            word-break: break-all;
          }

          .website a:hover {
            text-decoration: underline;
          }

          .loading-state {
            padding: 48px;
            text-align: center;
          }

          .loading-spinner {
            width: 40px;
            height: 40px;
            margin: 0 auto 16px;
            border: 3px solid #f3f3f3;
            border-top: 3px solid #0066cc;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          .error-state {
            padding: 48px;
            text-align: center;
            color: #d32f2f;
          }

          .error-state button {
            margin-top: 16px;
            padding: 8px 16px;
            background: #d32f2f;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          }

          /* Mobile Responsive */
          @media (max-width: 768px) {
            .modal-content {
              margin: 0;
              max-height: 100vh;
              border-radius: 0;
            }

            .game-info {
              padding: 16px;
            }

            .game-info h2 {
              font-size: 20px;
            }

            .thumbnails {
              padding: 8px;
            }

            .thumbnail {
              width: 80px;
              height: 45px;
            }
          }
        `}</style>
      </div>
    </div>
  );
};

GameDetail.propTypes = {
  gameId: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired
};

export default GameDetail;