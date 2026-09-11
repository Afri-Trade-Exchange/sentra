import React from 'react';
import { FaSearch } from 'react-icons/fa';

const SearchInput: React.FC<{
  searchTerm: string;
  onSearchChange: (value: string) => void;
}> = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <FaSearch className="text-gray-400 h-4 w-4" />
      </div>
      <input
        type="text"
        placeholder="Search consignments..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="
          w-full pl-11 pr-4 py-2.5
          bg-white border border-gray-200
          rounded-lg shadow-sm text-sm
          focus:outline-none focus:ring-2
          focus:ring-teal-500 focus:border-teal-400
          transition-all duration-200
        "
      />
      {searchTerm && (
        <button
          type="button"
          onClick={() => onSearchChange('')}
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
          aria-label="Clear search"
        >
          <span className="text-gray-400 hover:text-gray-600 cursor-pointer">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
};

export default SearchInput;
