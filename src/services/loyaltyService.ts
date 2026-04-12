import { db } from './firebase';
import { doc, updateDoc, increment, addDoc, collection, serverTimestamp, getDocs, query, where, orderBy } from 'firebase/firestore';
import toast from 'react-hot-toast';
import type { LoyaltyTransaction } from '../types';

export const LOYALTY_EVENTS = {
  SIGNUP: 50,
  REVIEW: 20,
  REFERRAL: 100,
  PURCHASE_PER_100: 1,
};

export const earnPoints = async (
  userId: string,
  points: number,
  reason: string,
  orderId?: string
): Promise<void> => {
  try {
    await updateDoc(doc(db, 'users', userId), {
      loyaltyPoints: increment(points),
    });
    
    await addDoc(collection(db, 'loyaltyTransactions'), {
      userId,
      type: 'earn',
      points,
      reason,
      orderId: orderId || null,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error earning points:', error);
    throw error;
  }
};

export const redeemPoints = async (
  userId: string,
  points: number,
  userCurrentPoints: number
): Promise<number> => {
  if (userCurrentPoints < points) {
    toast.error('Insufficient points');
    throw new Error('Insufficient points');
  }
  
  try {
    await updateDoc(doc(db, 'users', userId), {
      loyaltyPoints: increment(-points),
    });
    
    await addDoc(collection(db, 'loyaltyTransactions'), {
      userId,
      type: 'redeem',
      points,
      reason: 'Redeemed for discount',
      orderId: null,
      createdAt: serverTimestamp(),
    });
    
    toast.success(`${points} points redeemed!`);
    return points / 10;
  } catch (error) {
    toast.error('Error redeeming points');
    throw error;
  }
};

export const getUserLoyaltyTransactions = async (userId: string): Promise<LoyaltyTransaction[]> => {
  try {
    const q = query(
      collection(db, 'loyaltyTransactions'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as LoyaltyTransaction));
  } catch (error) {
    console.error('Error fetching loyalty transactions:', error);
    return [];
  }
};

export const getLoyaltyTier = (points: number): { name: string; min: number; max: number; multiplier: number } => {
  if (points >= 2000) {
    return { name: 'Gold', min: 2000, max: Infinity, multiplier: 1.5 };
  } else if (points >= 500) {
    return { name: 'Silver', min: 500, max: 2000, multiplier: 1.25 };
  }
  return { name: 'Bronze', min: 0, max: 500, multiplier: 1 };
};
