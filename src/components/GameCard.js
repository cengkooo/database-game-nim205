import React from 'react';
import PropTypes from 'prop-types';

const FALLBACK_IMAGE = 'https://placehold.co/600x400?text=No+Image';

const GameCard = ({ game, onOpenDetail }) => {
  const {
    id,
    name,
    background_image,
    rating,
    released
  } = game;

  const handleClick = () => {
    onOpenDetail(id);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onOpenDetail(id);
    }
  };

  // Format date: "2023-10-31" -> "Oct 31, 2023"
  const formattedDate = released
    ? new Date(released).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    : 'Release date TBA';

  // Round rating to 1 decimal place
  const formattedRating = rating 
    ? Number(rating).toFixed(1) 
    : 'Not rated';

  return (
    <div
      className="game-card"
      onClick={handleClick}
      onKeyPress={handleKeyPress}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${name}`}
    >
      <div className="image-container">
        <img
          src={background_image || FALLBACK_IMAGE}
          alt={`Cover for ${name}`}
          className="cover-image"
          onError={(e) => {
            e.target.src = FALLBACK_IMAGE;
          }}
        />
      </div>
      
      <div className="content">
        <h3 className="title">{name}</h3>
        
        <div className="meta">
          <div className="rating">
            <span className="star">★</span>
            <span className="rating-value">{formattedRating}</span>
          </div>
          <div className="release-date">{formattedDate}</div>
        </div>
      </div>

      <style jsx>{`
        .game-card {
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s, box-shadow 0.2s;
          cursor: pointer;
          position: relative;
          width: 100%;
        }

        .game-card:hover,
        .game-card:focus {
          transform: translateY(-4px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .game-card:focus {
          outline: 2px solid #0066cc;
          outline-offset: 2px;
        }

        .image-container {
          position: relative;
          padding-top: 56.25%; /* 16:9 aspect ratio */
          background: #f0f0f0;
        }

        .cover-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .content {
          padding: 16px;
        }

        .title {
          margin: 0 0 12px 0;
          font-size: 16px;
          font-weight: 600;
          color: #333;
          /* Limit to 2 lines with ellipsis */
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 14px;
          color: #666;
        }

        .rating {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .star {
          color: #f5c518; /* IMDB yellow */
          font-size: 16px;
        }

        .rating-value {
          font-weight: 500;
        }

        .release-date {
          font-size: 13px;
        }
      `}</style>
    </div>
  );
};

GameCard.propTypes = {
  game: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    background_image: PropTypes.string,
    rating: PropTypes.number,
    released: PropTypes.string
  }).isRequired,
  onOpenDetail: PropTypes.func.isRequired
};

export default GameCard;
