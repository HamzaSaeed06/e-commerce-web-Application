import { db } from './firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

const getGuestId = (): string => {
  let id = localStorage.getItem('guestId');
  if (!id) {
    id = 'g_' + Math.random().toString(36).slice(2);
    localStorage.setItem('guestId', id);
  }
  return id;
};

const getSessionId = (): string => {
  let id = sessionStorage.getItem('sessionId');
  if (!id) {
    id = 's_' + Math.random().toString(36).slice(2);
    sessionStorage.setItem('sessionId', id);
  }
  return id;
};

interface ActivityData {
  userId: string | null;
  guestId: string;
  type: string;
  productId?: string;
  categoryId?: string;
  metadata: Record<string, unknown>;
  sessionId: string;
  timestamp: ReturnType<typeof serverTimestamp>;
}

export const trackActivity = async (
  type: string,
  userId: string | null,
  data: Partial<ActivityData> = {}
): Promise<void> => {
  try {
    const activityData: ActivityData = {
      userId,
      guestId: getGuestId(),
      type,
      metadata: {},
      sessionId: getSessionId(),
      timestamp: serverTimestamp(),
      ...data,
    };
    await addDoc(collection(db, 'userActivity'), activityData);
  } catch (error) {
    // Silently fail - tracking shouldn't break user experience
    console.error('Error tracking activity:', error);
  }
};

export const trackView = (
  userId: string | null,
  productId: string,
  category: string
): Promise<void> => {
  return trackActivity('view', userId, { productId, categoryId: category });
};

export const trackClick = (
  userId: string | null,
  productId: string,
  element: string
): Promise<void> => {
  return trackActivity('click', userId, { productId, metadata: { element } });
};

export const trackCartAdd = (
  userId: string | null,
  productId: string,
  quantity: number,
  price: number
): Promise<void> => {
  return trackActivity('cart_add', userId, {
    productId,
    metadata: { quantity, price },
  });
};

export const trackCartRemove = (
  userId: string | null,
  productId: string
): Promise<void> => {
  return trackActivity('cart_remove', userId, { productId });
};

export const trackPurchase = (
  userId: string | null,
  productId: string,
  orderId: string
): Promise<void> => {
  return trackActivity('purchase', userId, {
    productId,
    metadata: { orderId },
  });
};

export const trackWishlist = (
  userId: string | null,
  productId: string,
  action: 'add' | 'remove'
): Promise<void> => {
  return trackActivity('wishlist', userId, {
    productId,
    metadata: { action },
  });
};

export const trackSearch = (
  userId: string | null,
  query: string,
  resultsCount: number
): Promise<void> => {
  return trackActivity('search', userId, {
    metadata: { query, resultsCount },
  });
};

export const trackReview = (
  userId: string | null,
  productId: string,
  rating: number
): Promise<void> => {
  return trackActivity('review', userId, {
    productId,
    metadata: { rating },
  });
};
