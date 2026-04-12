import { useState, useRef, useEffect } from 'react';
import { Search, X, TrendingUp, Clock } from 'lucide-react';
import { useSearchStore } from '../../store/searchStore';
import { useDebounce } from '../../hooks/useDebounce';
import { getTrendingSearches } from '../../services/searchService';

export const SearchBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const { recentSearches, setQuery, addRecentSearch } = useSearchStore();
  const [trending, setTrending] = useState<string[]>([]);
  useDebounce(inputValue, 300);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      getTrendingSearches().then(setTrending);
      inputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    addRecentSearch(searchQuery);
    setIsOpen(false);
    setInputValue('');
    // Navigate to search results
    window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Search Input */}
      <div className="relative hidden md:block">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search products..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && inputValue.trim()) {
              handleSearch(inputValue);
            }
          }}
          className="w-64 pl-10 pr-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-200)] focus:border-[var(--brand-500)] transition-all"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
        {inputValue && (
          <button
            onClick={() => setInputValue('')}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <X className="w-4 h-4 text-[var(--text-muted)] hover:text-[var(--text-secondary)]" />
          </button>
        )}
      </div>

      {/* Mobile Search Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden p-2 text-[var(--text-secondary)]"
      >
        <Search className="w-5 h-5" />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 md:w-96 mt-2 bg-white rounded-xl shadow-lg border border-[var(--border-default)] overflow-hidden z-50">
          {/* Mobile Input */}
          <div className="md:hidden p-4 border-b border-[var(--border-default)]">
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                placeholder="Search products..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && inputValue.trim()) {
                    handleSearch(inputValue);
                  }
                }}
                className="w-full pl-10 pr-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-200)]"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-4 h-4 text-[var(--text-muted)]" />
                  <span className="text-sm font-medium text-[var(--text-secondary)]">
                    Recent Searches
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.slice(0, 5).map((search) => (
                    <button
                      key={search}
                      onClick={() => handleSearch(search)}
                      className="px-3 py-1.5 bg-[var(--bg-secondary)] text-sm text-[var(--text-secondary)] rounded-full hover:bg-[var(--bg-tertiary)] transition-colors"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Trending Searches */}
            <div className="p-4 border-t border-[var(--border-default)]">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-[var(--brand-500)]" />
                <span className="text-sm font-medium text-[var(--text-secondary)]">
                  Trending Now
                </span>
              </div>
              <div className="space-y-1">
                {trending.slice(0, 6).map((search, index) => (
                  <button
                    key={search}
                    onClick={() => handleSearch(search)}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors text-left"
                  >
                    <span className="w-6 h-6 flex items-center justify-center bg-[var(--brand-50)] text-[var(--brand-600)] text-xs font-medium rounded">
                      {index + 1}
                    </span>
                    <span className="text-sm text-[var(--text-primary)]">{search}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
