import React from 'react';
import PropTypes from 'prop-types';

const SORT_OPTIONS = [
  { value: 'rating', label: 'Rating' },
  { value: 'released', label: 'Release Date' }
];

const SortControl = ({ onChange, defaultValue = '-rating' }) => {
  // Parse initial value to get field and direction
  const initialField = defaultValue.startsWith('-') 
    ? defaultValue.slice(1) 
    : defaultValue;
  const initialDesc = defaultValue.startsWith('-');

  const [field, setField] = React.useState(initialField);
  const [isDescending, setIsDescending] = React.useState(initialDesc);

  const handleFieldChange = (e) => {
    const newField = e.target.value;
    setField(newField);
    onChange(isDescending ? `-${newField}` : newField);
  };

  const handleDirectionToggle = () => {
    const newIsDescending = !isDescending;
    setIsDescending(newIsDescending);
    onChange(newIsDescending ? `-${field}` : field);
  };

  return (
    <div className="sort-control">
      <label className="sort-label">
        Sort by:
        <select 
          value={field}
          onChange={handleFieldChange}
          className="sort-select"
          aria-label="Sort field"
        >
          {SORT_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <button
        type="button"
        onClick={handleDirectionToggle}
        className="direction-toggle"
        aria-label={isDescending ? "Sort ascending" : "Sort descending"}
      >
        {isDescending ? '↓ Desc' : '↑ Asc'}
      </button>

      <style jsx>{`
        .sort-control {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px;
        }

        .sort-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #444;
        }

        .sort-select {
          padding: 6px 24px 6px 12px;
          font-size: 14px;
          border: 1px solid #ddd;
          border-radius: 4px;
          background-color: white;
          cursor: pointer;
          outline: none;
          appearance: none;
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right 8px center;
          background-size: 12px;
        }

        .sort-select:hover {
          border-color: #0066cc;
        }

        .sort-select:focus {
          border-color: #0066cc;
          box-shadow: 0 0 0 2px rgba(0, 102, 204, 0.2);
        }

        .direction-toggle {
          padding: 6px 12px;
          font-size: 14px;
          color: #444;
          background: white;
          border: 1px solid #ddd;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
          transition: all 0.2s;
        }

        .direction-toggle:hover {
          border-color: #0066cc;
          color: #0066cc;
        }

        .direction-toggle:focus {
          outline: none;
          border-color: #0066cc;
          box-shadow: 0 0 0 2px rgba(0, 102, 204, 0.2);
        }
      `}</style>
    </div>
  );
};

SortControl.propTypes = {
  onChange: PropTypes.func.isRequired,
  defaultValue: PropTypes.oneOf([
    'rating', '-rating',
    'released', '-released'
  ])
};

export default SortControl;
