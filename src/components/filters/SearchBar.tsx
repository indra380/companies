import React, { useState, useCallback } from 'react';
import { SearchIcon, XIcon } from 'lucide-react';
import { Input } from '../ui/Input';
import { useAppContext } from '../../context/AppContext';
import { debounce } from '../../utils';

interface SearchBarProps {
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ className }) => {
  const { state, actions } = useAppContext();
  const [localSearchTerm, setLocalSearchTerm] = useState(state.filters.searchTerm);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((term: string) => {
      actions.updateFilters({ searchTerm: term });
    }, 300),
    [actions]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearchTerm(value);
    debouncedSearch(value);
  };

  const handleClearSearch = () => {
    setLocalSearchTerm('');
    actions.updateFilters({ searchTerm: '' });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      actions.updateFilters({ searchTerm: localSearchTerm });
    }
  };

  return (
    <div className={className}>
      <Input
        type="text"
        placeholder="Search"
        value={localSearchTerm}
        onChange={handleSearchChange}
        onKeyPress={handleKeyPress}
        leftIcon={<SearchIcon className="w-5 h-5" />}
        rightIcon={
          localSearchTerm && (
            <button
              onClick={handleClearSearch}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              aria-label="Clear search"
            >
              <XIcon className="w-4 h-4" />
            </button>
          )
        }
        className="text-sm"
      />
    </div>
  );
};