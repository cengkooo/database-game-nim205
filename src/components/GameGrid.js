import React from 'react';
import PropTypes from 'prop-types';
import GameCard from './GameCard';

const LoadingSkeleton = () => (
  <div className="skeleton-card">
    <div className="skeleton-image"></div>
    <div className="skeleton-content">
      <div className="skeleton-title"></div>
      <div className="skeleton-meta">
        <div className="skeleton-rating"></div>
        <div className="skeleton-date"></div>
      </div>
    </div>
    <style jsx>{`
      .skeleton-card {
        background: white;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      .skeleton-image {
        width: 100%;
        padding-top: 56.25%; /* 16:9 */
        background: linear-gradient(
          110deg,
          #ececec 30%,
          #f5f5f5 50%,
          #ececec 70%
        );
        background-size: 200% 100%;
        animation: shimmer 1.5s infinite;
      }

      .skeleton-content {
        padding: 16px;
      }

      .skeleton-title {
        height: 20px;
        margin-bottom: 12px;
        background: #ececec;
        border-radius: 4px;
      }

      .skeleton-meta {
        display: flex;
        justify-content: space-between;
      }

      .skeleton-rating {
        width: 60px;
        height: 16px;
        background: #ececec;
        border-radius: 4px;
      }

      .skeleton-date {
        width: 100px;
        height: 16px;
        background: #ececec;
        border-radius: 4px;
      }

      @keyframes shimmer {
        0% {
          background-position: -200% 0;
        }
        100% {
          background-position: 200% 0;
        }
      }
    `}</style>
  </div>
);

const GameGrid = ({ games = [], loading = false, error = null, onOpenDetail }) => {
  // Show loading skeletons
  if (loading) {
    return (
      <div className="game-grid">
        {[...Array(12)].map((_, index) => (
          <LoadingSkeleton key={`skeleton-${index}`} />
        ))}
        <style jsx>{`
          .game-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 24px;
            padding: 24px;
          }
        `}</style>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="error-state">
        <div className="error-content">
          <span className="error-icon">⚠️</span>
          <h3>Oops! Something went wrong</h3>
          <p>{error}</p>
        </div>
        <style jsx>{`
          .error-state {
            padding: 48px 24px;
            text-align: center;
          }
          .error-content {
            max-width: 400px;
            margin: 0 auto;
          }
          .error-icon {
            font-size: 32px;
            margin-bottom: 16px;
            display: block;
          }
          h3 {
            margin: 0 0 8px 0;
            color: #333;
          }
          p {
            margin: 0;
            color: #666;
          }
        `}</style>
      </div>
    );
  }

  // Show empty state
  if (!games.length) {
    return (
      <div className="empty-state">
        <div className="empty-content">
          <span className="empty-icon">🎮</span>
          <h3>No games found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
        <style jsx>{`
          .empty-state {
            padding: 48px 24px;
            text-align: center;
          }
          .empty-content {
            max-width: 400px;
            margin: 0 auto;
          }
          .empty-icon {
            font-size: 32px;
            margin-bottom: 16px;
            display: block;
          }
          h3 {
            margin: 0 0 8px 0;
            color: #333;
          }
          p {
            margin: 0;
            color: #666;
          }
        `}</style>
      </div>
    );
  }

  // Show grid of games
  return (
    <div className="game-grid">
      {games.map(game => (
        <GameCard
          key={game.id}
          game={game}
          onOpenDetail={onOpenDetail}
        />
      ))}
      
      <style jsx>{`
        .game-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 24px;
          padding: 24px;
          animation: fadeIn 0.3s ease-in;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Responsive adjustments */
        @media (max-width: 600px) {
          .game-grid {
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 16px;
            padding: 16px;
          }
        }

        @media (min-width: 1200px) {
          .game-grid {
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          }
        }
      `}</style>
    </div>
  );
};

GameGrid.propTypes = {
  games: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    background_image: PropTypes.string,
    rating: PropTypes.number,
    released: PropTypes.string
  })),
  loading: PropTypes.bool,
  error: PropTypes.string,
  onOpenDetail: PropTypes.func.isRequired
};

export default GameGrid;
