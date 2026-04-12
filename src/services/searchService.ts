import { db } from './firebase';
import {
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  getDocs,
  serverTimestamp,
  where,
} from 'firebase/firestore';
import Fuse from 'fuse.js';
import { expandQuery } from '../utils/synonymMap';
import type { Product } from '../types';

interface SearchLogData {
  query: string;
  userId: string | null;
  guestId: string;
  resultsCount: number;
  clickedProductId: string | null;
  timestamp: ReturnType<typeof serverTimestamp>;
}

export const logSearch = async (
  searchQuery: string,
  userId: string | null,
  guestId: string,
  resultsCount: number
): Promise<void> => {
  try {
    const data: SearchLogData = {
      query: searchQuery,
      userId,
      guestId,
      resultsCount,
      clickedProductId: null,
      timestamp: serverTimestamp(),
    };
    await addDoc(collection(db, 'searchLogs'), data);
  } catch (error) {
    console.error('Error logging search:', error);
  }
};

export const logSearchClick = async (
  searchQuery: string,
  productId: string,
  userId: string | null,
  guestId: string
): Promise<void> => {
  try {
    await addDoc(collection(db, 'searchLogs'), {
      query: searchQuery,
      userId,
      guestId,
      resultsCount: 1,
      clickedProductId: productId,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error logging search click:', error);
  }
};

export const getTrendingSearches = async (n = 8): Promise<string[]> => {
  try {
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const q = query(
      collection(db, 'searchLogs'),
      where('timestamp', '>', since),
      orderBy('timestamp', 'desc'),
      limit(100)
    );
    const snap = await getDocs(q);
    
    const freq: Record<string, number> = {};
    snap.docs.forEach(d => {
      const searchQuery = d.data().query as string;
      if (searchQuery.length > 2) {
        freq[searchQuery] = (freq[searchQuery] || 0) + 1;
      }
    });
    
    return Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, n)
      .map(([query]) => query);
  } catch (error) {
    console.error('Error fetching trending searches:', error);
    return [];
  }
};

export const searchProducts = (products: Product[], searchQuery: string): Product[] => {
  if (!searchQuery.trim()) return products;
  
  const expandedTerms = expandQuery(searchQuery);
  
  const fuse = new Fuse(products, {
    keys: ['name', 'description', 'tags', 'category', 'subcategory'],
    threshold: 0.4,
    includeScore: true,
  });
  
  const results = new Map<string, Product>();
  
  expandedTerms.forEach(term => {
    fuse.search(term).forEach(r => {
      if (!results.has(r.item.id)) {
        results.set(r.item.id, r.item);
      }
    });
  });
  
  return Array.from(results.values());
};

export const getSearchSuggestions = (
  products: Product[],
  searchQuery: string,
  limit = 5
): Product[] => {
  if (!searchQuery.trim()) return [];
  
  const results = searchProducts(products, searchQuery);
  return results.slice(0, limit);
};
