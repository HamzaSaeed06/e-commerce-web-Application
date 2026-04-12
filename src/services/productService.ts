import { db } from './firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  increment,
  serverTimestamp,
  onSnapshot,
  type QueryDocumentSnapshot,
} from 'firebase/firestore';
import { uploadMultipleImages } from './cloudinaryService';
import toast from 'react-hot-toast';
import type { Product } from '../types';

const PRODUCTS = 'products';

export interface GetProductsOptions {
  category?: string;
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'popular';
  priceMin?: number;
  priceMax?: number;
  lastDoc?: QueryDocumentSnapshot;
  pageSize?: number;
}

export const getProducts = async (options: GetProductsOptions = {}): Promise<{ products: Product[]; lastDoc: QueryDocumentSnapshot | null }> => {
  const { category, sort, priceMin, priceMax, lastDoc, pageSize = 12 } = options;
  
  // Simple query without composite index requirement
  let q = query(collection(db, PRODUCTS), where('isActive', '==', true), limit(pageSize * 2));
  
  if (category) {
    q = query(q, where('category', '==', category));
  }
  
  const snap = await getDocs(q);
  let products = snap.docs.map(d => ({ id: d.id, ...d.data() } as Product));
  
  // Client-side sorting to avoid Firestore index requirement
  if (sort === 'price_asc') {
    products = products.sort((a, b) => (a.price || 0) - (b.price || 0));
  } else if (sort === 'price_desc') {
    products = products.sort((a, b) => (b.price || 0) - (a.price || 0));
  } else if (sort === 'newest') {
    products = products.sort((a, b) => {
      const getTime = (item: Product) => {
        const date = item.createdAt;
        if (!date) return 0;
        // Handle Firestore Timestamp
        if (typeof date === 'object' && 'toMillis' in date) {
          return (date as any).toMillis();
        }
        // Handle Date or string
        return new Date(date as any).getTime();
      };
      return getTime(b) - getTime(a);
    });
  } else {
    // Default: popular (by sold)
    products = products.sort((a, b) => (b.sold || 0) - (a.sold || 0));
  }
  
  // Apply pagination client-side
  if (lastDoc) {
    const lastIndex = products.findIndex(p => p.id === lastDoc.id);
    if (lastIndex >= 0) {
      products = products.slice(lastIndex + 1, lastIndex + 1 + pageSize);
    } else {
      products = products.slice(0, pageSize);
    }
  } else {
    products = products.slice(0, pageSize);
  }
  
  return { 
    products, 
    lastDoc: products.length > 0 ? snap.docs[snap.docs.length - 1] : null 
  };
};

export const getProductById = async (id: string): Promise<Product | null> => {
  const snap = await getDoc(doc(db, PRODUCTS, id));
  return snap.exists() ? { id: snap.id, ...snap.data() } as Product : null;
};

export const getProductBySlug = async (slug: string): Promise<Product | null> => {
  const q = query(collection(db, PRODUCTS), where('slug', '==', slug), where('isActive', '==', true), limit(1));
  const snap = await getDocs(q);
  return snap.empty ? null : { id: snap.docs[0].id, ...snap.docs[0].data() } as Product;
};

export const incrementProductViews = async (id: string): Promise<void> => {
  try {
    await updateDoc(doc(db, PRODUCTS, id), { views: increment(1) });
  } catch (error) {
    console.error('Error incrementing product views:', error);
  }
};

export const getTrendingProducts = async (n = 8): Promise<Product[]> => {
  const q = query(
    collection(db, PRODUCTS),
    where('isActive', '==', true),
    orderBy('sold', 'desc'),
    limit(n)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Product));
};

export const getNewArrivals = async (n = 8): Promise<Product[]> => {
  const q = query(
    collection(db, PRODUCTS),
    where('isActive', '==', true),
    orderBy('createdAt', 'desc'),
    limit(n)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Product));
};

export const getFlashSaleProducts = async (): Promise<Product[]> => {
  const now = new Date();
  const q = query(
    collection(db, PRODUCTS),
    where('isFlashSale', '==', true),
    where('flashSaleEndsAt', '>', now),
    where('isActive', '==', true)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Product));
};

export const getFeaturedProducts = async (n = 8): Promise<Product[]> => {
  const q = query(
    collection(db, PRODUCTS),
    where('isFeatured', '==', true),
    where('isActive', '==', true),
    orderBy('views', 'desc'),
    limit(n)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Product));
};

export const getProductsByCategory = async (category: string, excludeId?: string, n = 6): Promise<Product[]> => {
  let q = query(
    collection(db, PRODUCTS),
    where('category', '==', category),
    where('isActive', '==', true),
    limit(n + (excludeId ? 1 : 0))
  );
  const snap = await getDocs(q);
  let products = snap.docs.map(d => ({ id: d.id, ...d.data() } as Product));
  if (excludeId) {
    products = products.filter(p => p.id !== excludeId).slice(0, n);
  }
  return products;
};

export const getRelatedProducts = async (product: Product, n = 6): Promise<Product[]> => {
  const categoryProducts = await getProductsByCategory(product.category, product.id, n);
  if (categoryProducts.length >= n) return categoryProducts;
  
  // If not enough category products, fill with featured products
  const featured = await getFeaturedProducts(n);
  const combined = [...categoryProducts];
  for (const p of featured) {
    if (combined.length >= n) break;
    if (!combined.find(cp => cp.id === p.id) && p.id !== product.id) {
      combined.push(p);
    }
  }
  return combined.slice(0, n);
};

export const createProduct = async (data: Partial<Product>, imageFiles: File[]): Promise<string> => {
  try {
    // Upload images to Cloudinary instead of Firebase Storage
    const imageUrls = await uploadMultipleImages(imageFiles);
    
    const docRef = await addDoc(collection(db, PRODUCTS), {
      ...data,
      images: imageUrls,
      views: 0,
      sold: 0,
      rating: 0,
      reviewCount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    
    toast.success('Product created successfully');
    return docRef.id;
  } catch (error) {
    toast.error('Error creating product');
    throw error;
  }
};

export const updateProduct = async (id: string, data: Partial<Product>): Promise<void> => {
  try {
    await updateDoc(doc(db, PRODUCTS, id), {
      ...data,
      updatedAt: serverTimestamp(),
    });
    toast.success('Product updated successfully');
  } catch (error) {
    toast.error('Error updating product');
    throw error;
  }
};

export const deleteProduct = async (id: string): Promise<void> => {
  try {
    await updateDoc(doc(db, PRODUCTS, id), {
      isActive: false,
      updatedAt: serverTimestamp(),
    });
    toast.success('Product deleted successfully');
  } catch (error) {
    toast.error('Error deleting product');
    throw error;
  }
};

export const subscribeToProduct = (id: string, callback: (product: Product | null) => void) => {
  return onSnapshot(doc(db, PRODUCTS, id), (snap) => {
    callback(snap.exists() ? { id: snap.id, ...snap.data() } as Product : null);
  });
};

export const checkStock = async (productId: string, quantity: number): Promise<boolean> => {
  const product = await getProductById(productId);
  return product ? product.stock >= quantity : false;
};
