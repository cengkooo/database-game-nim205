import React, { useState } from 'react';
import PropTypes from 'prop-types';

const SearchForm = ({ onSearch, placeholder = 'Search games...' }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedQuery = query.trim();
    onSearch(trimmedQuery);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        className="search-input"
        aria-label="Search games"
      />
      <button type="submit" className="search-button" aria-label="Search">
        Search
      </button>

      <style jsx>{`
        .search-form {
          display: flex;
          gap: 8px;
          max-width: 600px;
          margin: 0 auto;
        }

        .search-input {
          flex: 1;
          padding: 8px 16px;
          font-size: 16px;
          border: 2px solid #ddd;
          border-radius: 4px;
          outline: none;
          transition: border-color 0.2s;
        }

        .search-input:focus {
          border-color: #0066cc;
        }

        .search-button {
          padding: 8px 24px;
          font-size: 16px;
          color: white;
          background: #0066cc;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .search-button:hover {
          background: #0052a3;
        }

        .search-button:active {
          background: #004080;
        }
      `}</style>
    </form>
  );
};

SearchForm.propTypes = {
  onSearch: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

export default SearchForm;
