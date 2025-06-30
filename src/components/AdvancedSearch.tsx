import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, X, Clock, MapPin, Tag, TrendingUp } from 'lucide-react';
import { searchService, SearchResult, SearchFilters } from '../services/search';
import { useApp } from '../context/AppContext';
import GlassmorphicCard from './GlassmorphicCard';
import NeuomorphicButton from './NeuomorphicButton';

interface AdvancedSearchProps {
  onResultSelect?: (result: SearchResult) => void;
  placeholder?: string;
  showFilters?: boolean;
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  onResultSelect,
  placeholder = "Search items, events, and members...",
  showFilters = true
}) => {
  const { currentLoop } = useApp();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showFilters, setShowFiltersPanel] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [isLoading, setIsLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (currentLoop) {
      searchService.updateData(currentLoop.items, currentLoop.events, currentLoop.members);
    }
    setSearchHistory(searchService.getSearchHistory());
  }, [currentLoop]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setShowFiltersPanel(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const searchResults = searchService.search(searchQuery, filters);
      setResults(searchResults);
      setShowSuggestions(false);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (value: string) => {
    setQuery(value);
    
    if (value.trim()) {
      const newSuggestions = searchService.getSearchSuggestions(value);
      setSuggestions(newSuggestions);
      setShowSuggestions(true);
      
      // Debounced search
      const timeoutId = setTimeout(() => {
        handleSearch(value);
      }, 300);
      
      return () => clearTimeout(timeoutId);
    } else {
      setResults([]);
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    handleSearch(suggestion);
    setShowSuggestions(false);
  };

  const handleResultClick = (result: SearchResult) => {
    if (onResultSelect) {
      onResultSelect(result);
    }
    setQuery('');
    setResults([]);
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'item': return '📦';
      case 'event': return '📅';
      case 'user': return '👤';
      default: return '🔍';
    }
  };

  const highlightMatch = (text: string, matches: any[]) => {
    if (!matches || matches.length === 0) return text;
    
    // Simple highlighting - in a real app, you'd use the match indices
    const match = matches[0];
    if (match && match.value) {
      const regex = new RegExp(`(${query})`, 'gi');
      return text.replace(regex, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>');
    }
    
    return text;
  };

  return (
    <div ref={searchRef} className="relative w-full">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => {
            if (suggestions.length > 0 || searchHistory.length > 0) {
              setShowSuggestions(true);
            }
          }}
          placeholder={placeholder}
          className="w-full pl-12 pr-20 py-4 bg-white/50 backdrop-blur-sm border border-white/20 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 text-lg"
        />
        
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
          {query && (
            <button
              onClick={clearSearch}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          
          {showFilters && (
            <button
              onClick={() => setShowFiltersPanel(!showFilters)}
              className={`p-2 rounded-lg transition-colors ${
                showFilters ? 'text-blue-600 bg-blue-100' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Filter className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Loading Indicator */}
      {isLoading && (
        <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-white/90 backdrop-blur-sm rounded-xl border border-white/20 text-center">
          <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Searching...</p>
        </div>
      )}

      {/* Suggestions Dropdown */}
      {showSuggestions && !isLoading && (suggestions.length > 0 || searchHistory.length > 0) && (
        <GlassmorphicCard className="absolute top-full left-0 right-0 mt-2 p-4 max-h-64 overflow-y-auto z-50">
          {suggestions.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center space-x-2">
                <TrendingUp className="w-4 h-4" />
                <span>Suggestions</span>
              </h4>
              <div className="space-y-1">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left px-3 py-2 text-gray-700 hover:bg-white/50 rounded-lg transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {searchHistory.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>Recent Searches</span>
              </h4>
              <div className="space-y-1">
                {searchHistory.slice(0, 3).map((term, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(term)}
                    className="w-full text-left px-3 py-2 text-gray-600 hover:bg-white/50 rounded-lg transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </GlassmorphicCard>
      )}

      {/* Search Results */}
      {results.length > 0 && !showSuggestions && (
        <GlassmorphicCard className="absolute top-full left-0 right-0 mt-2 p-4 max-h-96 overflow-y-auto z-50">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">
            {results.length} result{results.length !== 1 ? 's' : ''} found
          </h4>
          <div className="space-y-2">
            {results.map((result, index) => (
              <button
                key={index}
                onClick={() => handleResultClick(result)}
                className="w-full text-left p-3 bg-white/50 hover:bg-white/70 rounded-xl transition-all duration-200 group"
              >
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">{getResultIcon(result.type)}</div>
                  <div className="flex-1 min-w-0">
                    <h5 
                      className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors"
                      dangerouslySetInnerHTML={{
                        __html: highlightMatch((result.item as any).title || (result.item as any).name, result.matches)
                      }}
                    />
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {(result.item as any).description || `${result.type} result`}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full capitalize">
                        {result.type}
                      </span>
                      <span className="text-xs text-gray-500">
                        {Math.round((1 - result.score) * 100)}% match
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </GlassmorphicCard>
      )}

      {/* Filters Panel */}
      {showFilters && (
        <GlassmorphicCard className="absolute top-full left-0 right-0 mt-2 p-6 z-50">
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
              <Filter className="w-4 h-4" />
              <span>Search Filters</span>
            </h4>
            
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={filters.category || ''}
                onChange={(e) => setFilters({ ...filters, category: e.target.value || undefined })}
                className="w-full px-3 py-2 bg-white/50 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                <option value="Tools">Tools</option>
                <option value="Books">Books</option>
                <option value="Games">Games</option>
                <option value="Kitchen">Kitchen</option>
                <option value="Electronics">Electronics</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filters.status || ''}
                onChange={(e) => setFilters({ ...filters, status: e.target.value || undefined })}
                className="w-full px-3 py-2 bg-white/50 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Status</option>
                <option value="available">Available</option>
                <option value="borrowed">Borrowed</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
            
            <div className="flex space-x-3">
              <NeuomorphicButton
                onClick={() => {
                  setFilters({});
                  if (query) handleSearch(query);
                }}
                variant="secondary"
                size="sm"
                className="flex-1"
              >
                Clear Filters
              </NeuomorphicButton>
              
              <NeuomorphicButton
                onClick={() => {
                  if (query) handleSearch(query);
                  setShowFiltersPanel(false);
                }}
                variant="primary"
                size="sm"
                className="flex-1"
              >
                Apply Filters
              </NeuomorphicButton>
            </div>
          </div>
        </GlassmorphicCard>
      )}
    </div>
  );
};

export default AdvancedSearch;