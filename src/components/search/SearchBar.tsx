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
          className="w-72 pl-10 pr-4 py-2 bg-(--neutral-50) border border-(--neutral-200) rounded-[4px] text-[13px] font-medium placeholder:text-(--neutral-400) focus:outline-none focus:border-black transition-all"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black" />
        {inputValue && (
          <button
            onClick={() => setInputValue('')}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <X className="w-3.5 h-3.5 text-black hover:scale-110 transition-transform" />
          </button>
        )}
      </div>

      {/* Mobile Search Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden p-2 text-black hover:bg-(--neutral-50) rounded-[4px] transition-colors"
      >
        <Search className="w-5 h-5" />
      </button>

      {/* Dropdown - Sharp & Bold */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 md:w-96 mt-2 bg-white rounded-[4px] shadow-2xl border border-(--neutral-200) overflow-hidden z-50">
          {/* Mobile Input */}
          <div className="md:hidden p-4 border-b border-(--neutral-200)">
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
                className="w-full pl-10 pr-4 py-3 bg-(--neutral-50) border border-black rounded-[4px] text-[13px] focus:outline-none"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-black" />
            </div>
          </div>

          <div className="max-h-[70vh] md:max-h-96 overflow-y-auto">
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-3.5 h-3.5 text-(--neutral-500)" />
                  <span className="text-[11px] font-bold text-black uppercase tracking-widest">
                    Recent
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.slice(0, 5).map((search) => (
                    <button
                      key={search}
                      onClick={() => handleSearch(search)}
                      className="px-4 py-2 border border-(--neutral-200) text-[12px] font-medium text-black hover:border-black rounded-[4px] transition-colors"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Trending Searches */}
            <div className="p-5 border-t border-(--neutral-100)">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-3.5 h-3.5 text-black" />
                <span className="text-[11px] font-bold text-black uppercase tracking-widest">
                  Trending
                </span>
              </div>
              <div className="space-y-0.5">
                {trending.slice(0, 6).map((search, index) => (
                  <button
                    key={search}
                    onClick={() => handleSearch(search)}
                    className="w-full flex items-center gap-4 px-3 py-2.5 hover:bg-(--neutral-50) transition-colors text-left group"
                  >
                    <span className="text-[11px] font-bold text-(--neutral-300) group-hover:text-black">
                      0{index + 1}
                    </span>
                    <span className="text-[13px] font-bold text-black tracking-tight">{search}</span>
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
