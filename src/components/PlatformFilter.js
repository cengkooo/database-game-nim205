import React, { useState } from 'react';
import PropTypes from 'prop-types';

// Platform IDs from RAWG API
const PLATFORMS = [
  { id: 4, name: 'PC', label: 'PC (Windows)' },
  { id: 187, name: 'PlayStation', label: 'PlayStation' },
  { id: 1, name: 'Xbox', label: 'Xbox' }
];

const PlatformFilter = ({ onChange, defaultSelected = [] }) => {
  const [selectedPlatforms, setSelectedPlatforms] = useState(
    new Set(defaultSelected)
  );

  const handlePlatformChange = (platformId) => {
    const newSelected = new Set(selectedPlatforms);
    if (newSelected.has(platformId)) {
      newSelected.delete(platformId);
    } else {
      newSelected.add(platformId);
    }
    setSelectedPlatforms(newSelected);
    // Convert Set to Array before sending to parent
    onChange(Array.from(newSelected));
  };

  return (
    <div className="platform-filter">
      <h3 className="filter-title">Platforms</h3>
      <div className="checkbox-group">
        {PLATFORMS.map(({ id, name, label }) => (
          <label key={id} className="checkbox-label">
            <input
              type="checkbox"
              checked={selectedPlatforms.has(id)}
              onChange={() => handlePlatformChange(id)}
              className="checkbox-input"
            />
            <span className="checkbox-text">{label}</span>
          </label>
        ))}
      </div>

      <style jsx>{`
        .platform-filter {
          padding: 16px;
          background: #f5f5f5;
          border-radius: 8px;
        }

        .filter-title {
          margin: 0 0 12px 0;
          font-size: 16px;
          font-weight: 600;
          color: #333;
        }

        .checkbox-group {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          user-select: none;
        }

        .checkbox-input {
          width: 18px;
          height: 18px;
          cursor: pointer;
        }

        .checkbox-text {
          font-size: 14px;
          color: #444;
        }

        /* Hover effect for the whole label */
        .checkbox-label:hover .checkbox-text {
          color: #0066cc;
        }
      `}</style>
    </div>
  );
};

PlatformFilter.propTypes = {
  onChange: PropTypes.func.isRequired,
  defaultSelected: PropTypes.arrayOf(PropTypes.number)
};

export default PlatformFilter;
