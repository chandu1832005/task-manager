import React from 'react';

const FilterBar = ({ filters, onFilterChange, onClearFilters }) => {
  return (
    <div className="filter-bar">
      <div className="filter-group">
        <label>Status:</label>
        <select
          name="status"
          value={filters.status}
          onChange={(e) => onFilterChange('status', e.target.value)}
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="in progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Priority:</label>
        <select
          name="priority"
          value={filters.priority}
          onChange={(e) => onFilterChange('priority', e.target.value)}
        >
          <option value="">All</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      {(filters.status || filters.priority) && (
        <button
          onClick={onClearFilters}
          className="btn btn-clear"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
};

export default FilterBar;
