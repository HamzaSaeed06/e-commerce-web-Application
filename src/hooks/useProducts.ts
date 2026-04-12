import { useState, useEffect, useCallback } from 'react';
import {
  getProducts,
  getTrendingProducts,
  getNewArrivals,
  getFlashSaleProducts,
  getFeaturedProducts,
  getProductById,
  getProductBySlug,
  getRelatedProducts,
  type GetProductsOptions,
} from '../services/productService';
import type { Product } from '../types';

interface UseProductsResult {
  products: Product[];
  loading: boolean;
  error: Error | null;
  loadMore: () => void;
  hasMore: boolean;
}

export const useProducts = (options: GetProductsOptions = {}): UseProductsResult => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastDoc, setLastDoc] = useState<unknown>(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getProducts({ ...options, lastDoc: lastDoc as never });
      setProducts(prev => (lastDoc ? [...prev, ...result.products] : result.products));
      setLastDoc(result.lastDoc);
      setHasMore(result.products.length === (options.pageSize || 12));
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [options, lastDoc]);

  // Initial fetch on mount
  useEffect(() => {
    const fetchInitial = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await getProducts({ ...options });
        setProducts(result.products);
        setLastDoc(result.lastDoc);
        setHasMore(result.products.length === (options.pageSize || 12));
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchInitial();
  }, []); // Empty deps = run once on mount

  // Refetch when filters change
  useEffect(() => {
    setProducts([]);
    setLastDoc(null);
    setHasMore(true);
    const fetchFresh = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await getProducts({ ...options });
        setProducts(result.products);
        setLastDoc(result.lastDoc);
        setHasMore(result.products.length === (options.pageSize || 12));
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFresh();
  }, [options.category, options.sort, options.priceMin, options.priceMax]);

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchProducts();
    }
  };

  return { products, loading, error, loadMore, hasMore };
};

export const useTrendingProducts = (n = 8) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    getTrendingProducts(n)
      .then(setProducts)
      .catch((err) => {
        setError(err);
        console.error('Error fetching trending products:', err);
      })
      .finally(() => setLoading(false));
  }, [n]);

  return { products, loading, error };
};

export const useNewArrivals = (n = 8) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNewArrivals(n)
      .then(setProducts)
      .finally(() => setLoading(false));
  }, [n]);

  return { products, loading };
};

export const useFlashSaleProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFlashSaleProducts()
      .then(setProducts)
      .finally(() => setLoading(false));
  }, []);

  return { products, loading };
};

export const useFeaturedProducts = (n = 8) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    getFeaturedProducts(n)
      .then(setProducts)
      .catch((err) => {
        setError(err);
        console.error('Error fetching featured products:', err);
      })
      .finally(() => setLoading(false));
  }, [n]);

  return { products, loading, error };
};

export const useProduct = (id: string | undefined) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    getProductById(id)
      .then(setProduct)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [id]);

  return { product, loading, error };
};

export const useProductBySlug = (slug: string | undefined) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    getProductBySlug(slug)
      .then(setProduct)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [slug]);

  return { product, loading, error };
};

export const useRelatedProducts = (product: Product | null, n = 6) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!product) {
      setLoading(false);
      return;
    }

    getRelatedProducts(product, n)
      .then(setProducts)
      .finally(() => setLoading(false));
  }, [product, n]);

  return { products, loading };
};
