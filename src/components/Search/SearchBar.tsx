
import React from 'react';
import { FaSearch } from 'react-icons/fa';
import './searchBar.css';
import { SearchBarProps } from '../../types';

const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="search-bar">
      <FaSearch className="icon" />
      <input
        type="text"
        placeholder="Search invoices"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
