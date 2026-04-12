import { db } from './firebase';
import { doc, setDoc, getDoc, serverTimestamp, type DocumentData } from 'firebase/firestore';
import type { CartItem } from '../types';

interface CartData extends DocumentData {
  items: CartItem[];
  updatedAt: ReturnType<typeof serverTimestamp>;
  abandonedAt: ReturnType<typeof serverTimestamp> | null;
  reminderSent: boolean;
}

export const syncCartToFirestore = async (userId: string, items: CartItem[]): Promise<void> => {
  try {
    const cartData: CartData = {
      items,
      updatedAt: serverTimestamp(),
      abandonedAt: items.length > 0 ? serverTimestamp() : null,
      reminderSent: false,
    };
    await setDoc(doc(db, 'carts', userId), cartData);
  } catch (error) {
    console.error('Error syncing cart:', error);
  }
};

export const loadCartFromFirestore = async (userId: string): Promise<CartItem[]> => {
  try {
    const snap = await getDoc(doc(db, 'carts', userId));
    if (!snap.exists()) return [];
    const data = snap.data() as CartData;
    return data.items || [];
  } catch (error) {
    console.error('Error loading cart:', error);
    return [];
  }
};

export const markCartReminderSent = async (userId: string): Promise<void> => {
  try {
    await setDoc(doc(db, 'carts', userId), {
      reminderSent: true,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  } catch (error) {
    console.error('Error marking cart reminder:', error);
  }
};

export const clearCartFirestore = async (userId: string): Promise<void> => {
  try {
    await setDoc(doc(db, 'carts', userId), {
      items: [],
      updatedAt: serverTimestamp(),
      abandonedAt: null,
      reminderSent: false,
    });
  } catch (error) {
    console.error('Error clearing cart:', error);
  }
};
