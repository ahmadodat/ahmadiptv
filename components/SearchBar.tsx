import React from 'react';
import Icon from './Icon';
import { IconName } from '../types';

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sortOrder: 'default' | 'name-asc' | 'name-desc';
  setSortOrder: (order: 'default' | 'name-asc' | 'name-desc') => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, setSearchTerm, sortOrder, setSortOrder }) => {
  const handleSortClick = () => {
    if (sortOrder === 'default') {
      setSortOrder('name-asc');
    } else if (sortOrder === 'name-asc') {
      setSortOrder('name-desc');
    } else {
      setSortOrder('default');
    }
  };

  const sortIconName: IconName =
    sortOrder === 'name-asc'
      ? 'sort-ascending'
      : sortOrder === 'name-desc'
      ? 'sort-descending'
      : 'sort-default';

  const sortLabel =
    sortOrder === 'name-asc'
      ? 'Sorted A-Z'
      : sortOrder === 'name-desc'
      ? 'Sorted Z-A'
      : 'Default order';

  return (
    <div className="p-4 bg-[#121212] border-b border-gray-800/50 sticky top-0 z-10">
      <div className="flex items-center gap-2">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search channels..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#1E1E1E] border border-gray-700/60 rounded-lg py-3 pl-12 pr-4 text-white text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8A1538] focus:bg-gray-800/20"
          />
        </div>
        <button
          onClick={handleSortClick}
          className="flex-shrink-0 p-2 bg-[#1E1E1E] border border-gray-700/60 hover:bg-gray-800/40 rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#121212] focus:ring-[#8A1538]"
          aria-label={`Change sort order. Current: ${sortLabel}`}
          title={`Sort order: ${sortLabel}`}
        >
          <Icon name={sortIconName} className="w-6 h-6 text-gray-300" />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;