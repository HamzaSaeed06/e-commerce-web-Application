import { useState, useEffect, useCallback } from 'react';
import { useDebounce } from './useDebounce';
import { searchProducts, logSearch, getTrendingSearches } from '../services/searchService';
import { useSearchStore } from '../store/searchStore';
import { useAuthStore } from '../store/authStore';
import type { Product } from '../types';

const getGuestId = (): string => {
  let id = localStorage.getItem('guestId');
  if (!id) {
    id = 'g_' + Math.random().toString(36).slice(2);
    localStorage.setItem('guestId', id);
  }
  return id;
};

export const useSearch = (products: Product[]) => {
  const { query, setQuery, addRecentSearch, trendingSearches, setTrendingSearches } = useSearchStore();
  const { user } = useAuthStore();
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    const searchResults = searchProducts(products, debouncedQuery);
    setResults(searchResults);
    setLoading(false);

    // Log search
    logSearch(debouncedQuery, user?.uid || null, getGuestId(), searchResults.length);
  }, [debouncedQuery, products, user]);

  useEffect(() => {
    getTrendingSearches().then(setTrendingSearches);
  }, []);

  const executeSearch = useCallback((searchQuery: string) => {
    setQuery(searchQuery);
    addRecentSearch(searchQuery);
  }, [setQuery, addRecentSearch]);

  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
  }, [setQuery]);

  return {
    query,
    results,
    loading,
    trendingSearches,
    setQuery,
    executeSearch,
    clearSearch,
  };
};
