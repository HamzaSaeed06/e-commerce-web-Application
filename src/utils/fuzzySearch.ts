import type { Product } from '../types';
import Fuse from 'fuse.js';
import { expandQuery } from './synonymMap';

const fuseOptions = {
  keys: [
    { name: 'name', weight: 0.4 },
    { name: 'description', weight: 0.2 },
    { name: 'tags', weight: 0.2 },
    { name: 'category', weight: 0.15 },
    { name: 'subcategory', weight: 0.05 },
  ],
  threshold: 0.4,
  includeScore: true,
  includeMatches: true,
  minMatchCharLength: 2,
  distance: 100,
  useExtendedSearch: true,
};

export const createSearchIndex = (products: Product[]): Fuse<Product> => {
  return new Fuse(products, fuseOptions);
};

export const searchProducts = (
  products: Product[],
  searchQuery: string
): Product[] => {
  if (!searchQuery.trim()) return products;
  
  const expandedTerms = expandQuery(searchQuery);
  const fuse = createSearchIndex(products);
  const results = new Map<string, Product>();
  
  // Search with each expanded term
  expandedTerms.forEach(term => {
    const searchResults = fuse.search(term);
    searchResults.forEach(result => {
      if (!results.has(result.item.id)) {
        results.set(result.item.id, result.item);
      }
    });
  });
  
  return Array.from(results.values());
};

export const searchProductsWithScore = (
  products: Product[],
  searchQuery: string
): { product: Product; score: number }[] => {
  if (!searchQuery.trim()) return products.map(p => ({ product: p, score: 1 }));
  
  const expandedTerms = expandQuery(searchQuery);
  const fuse = createSearchIndex(products);
  const results = new Map<string, { product: Product; score: number }>();
  
  expandedTerms.forEach(term => {
    const searchResults = fuse.search(term);
    searchResults.forEach(result => {
      const existing = results.get(result.item.id);
      if (!existing || result.score! < existing.score) {
        results.set(result.item.id, { product: result.item, score: result.score! });
      }
    });
  });
  
  return Array.from(results.values()).sort((a, b) => a.score - b.score);
};

export const highlightMatches = (
  text: string,
  query: string
): { text: string; matches: boolean[] } => {
  const expandedTerms = expandQuery(query);
  const matches = new Array(text.length).fill(false);
  
  expandedTerms.forEach(term => {
    const regex = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    let match;
    while ((match = regex.exec(text)) !== null) {
      for (let i = match.index; i < match.index + match[0].length; i++) {
        matches[i] = true;
      }
    }
  });
  
  return { text, matches };
};

export const filterProducts = (
  products: Product[],
  filters: {
    category?: string;
    priceMin?: number;
    priceMax?: number;
    rating?: number;
    inStock?: boolean;
    tags?: string[];
  }
): Product[] => {
  return products.filter(product => {
    if (filters.category && product.category !== filters.category) return false;
    if (filters.priceMin !== undefined && product.price < filters.priceMin) return false;
    if (filters.priceMax !== undefined && product.price > filters.priceMax) return false;
    if (filters.rating !== undefined && product.rating < filters.rating) return false;
    if (filters.inStock && product.stock <= 0) return false;
    if (filters.tags && filters.tags.length > 0) {
      const hasTag = filters.tags.some(tag => product.tags.includes(tag));
      if (!hasTag) return false;
    }
    return true;
  });
};

export const sortProducts = (
  products: Product[],
  sortBy: 'price_asc' | 'price_desc' | 'newest' | 'popular' | 'rating'
): Product[] => {
  const sorted = [...products];
  
  switch (sortBy) {
    case 'price_asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price_desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'newest':
      return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    case 'popular':
      return sorted.sort((a, b) => b.sold - a.sold);
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating);
    default:
      return sorted;
  }
};
