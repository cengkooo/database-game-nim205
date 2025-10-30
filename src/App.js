import React, { useState, useEffect } from 'react';
import debounce from 'lodash/debounce';
import { searchGames } from './api/rawg';
import SearchForm from './components/SearchForm';
import PlatformFilter from './components/PlatformFilter';
import SortControl from './components/SortControl';
import GameGrid from './components/GameGrid';
import GameDetail from './components/GameDetail';
import './App.css';

function App() {
  // Core state
  const [query, setQuery] = useState('');
  const [platforms, setPlatforms] = useState([]);
  const [ordering, setOrdering] = useState('-rating');
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedGameId, setSelectedGameId] = useState(null);

  // Pagination state (optional)
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Create debounced search function
  const searchGamesDebounced = debounce(async (searchQuery, selectedPlatforms, sortOrder, pageNum) => {
    try {
      setLoading(true);
      setError(null);

      const response = await searchGames({
        query: searchQuery,
        platforms: selectedPlatforms,
        ordering: sortOrder,
        page: pageNum,
        page_size: 20
      });

      // For pagination: append results if loading more, otherwise replace
      setGames(currentGames => 
        pageNum > 1 ? [...currentGames, ...response.results] : response.results
      );
      
      setHasMore(!!response.next);
    } catch (err) {
      setError(err.message || 'Failed to fetch games');
      setGames([]);
    } finally {
      setLoading(false);
    }
  }, 300);

  // Cleanup search function on unmount
  useEffect(() => {
    return () => {
      searchGamesDebounced.cancel();
    };
  }, [searchGamesDebounced]);

  // Effect to fetch games when search params or page changes
  useEffect(() => {
    const fetchGames = async () => {
      await searchGamesDebounced(query, platforms, ordering, page);
    };

    // If search params change, reset to page 1
    if (query || platforms.length || ordering !== '-rating') {
      if (page !== 1) {
        setPage(1);
        return; // Let the effect run again with page 1
      }
    }

    fetchGames();

    // Cleanup function to cancel pending debounced calls
    return () => {
      searchGamesDebounced.cancel();
    };
  }, [query, platforms, ordering, page, searchGamesDebounced]);

  // Event handlers
  const handleSearch = (newQuery) => {
    setQuery(newQuery);
  };

  const handlePlatformChange = (selectedPlatforms) => {
    setPlatforms(selectedPlatforms);
  };

  const handleSortChange = (newOrdering) => {
    setOrdering(newOrdering);
  };

  const handleOpenDetail = (gameId) => {
    setSelectedGameId(gameId);
  };

  const handleCloseDetail = () => {
    setSelectedGameId(null);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPage(p => p + 1);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Game Database</h1>
      </header>

      <div className="filters-section">
        <SearchForm 
          onSearch={handleSearch}
          placeholder="Search games..."
        />
        
        <div className="filters-row">
          <PlatformFilter
            onChange={handlePlatformChange}
            defaultSelected={[]}
          />
          
          <SortControl
            onChange={handleSortChange}
            defaultValue={ordering}
          />
        </div>
      </div>

      <main className="main-content">
        <GameGrid
          games={games}
          loading={loading}
          error={error}
          onOpenDetail={handleOpenDetail}
        />

        {!loading && !error && hasMore && (
          <button 
            className="load-more-button"
            onClick={handleLoadMore}
          >
            Load More Games
          </button>
        )}
      </main>

      {selectedGameId && (
        <GameDetail
          gameId={selectedGameId}
          onClose={handleCloseDetail}
        />
      )}

      <style jsx>{`
        .app {
          min-height: 100vh;
          background: #f5f5f5;
        }

        .app-header {
          background: #333;
          color: white;
          padding: 1rem 2rem;
          margin-bottom: 2rem;
        }

        .app-header h1 {
          margin: 0;
          font-size: 1.5rem;
        }

        .filters-section {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .filters-row {
          display: flex;
          gap: 1rem;
          margin: 1rem 0;
          flex-wrap: wrap;
        }

        .main-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 1rem;
        }

        .load-more-button {
          display: block;
          margin: 2rem auto;
          padding: 0.75rem 2rem;
          font-size: 1rem;
          color: white;
          background: #0066cc;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .load-more-button:hover {
          background: #0052a3;
        }

        @media (max-width: 768px) {
          .filters-row {
            flex-direction: column;
          }

          .filters-section {
            padding: 0 0.5rem;
          }
        }
      `}</style>
    </div>
  );
}

export default App;
