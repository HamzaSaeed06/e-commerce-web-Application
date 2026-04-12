import { db } from './firebase';
import { collection, query, where, getDocs, updateDoc, doc, arrayUnion, increment } from 'firebase/firestore';
import type { Coupon } from '../types';

interface ValidationResult {
  valid: boolean;
  error?: string;
  discount?: number;
  coupon?: Coupon;
}

export const validateCoupon = async (
  code: string,
  userId: string,
  orderTotal: number
): Promise<ValidationResult> => {
  try {
    const q = query(
      collection(db, 'coupons'),
      where('code', '==', code.toUpperCase()),
      where('isActive', '==', true)
    );
    const snap = await getDocs(q);
    
    if (snap.empty) {
      return { valid: false, error: 'Invalid coupon code' };
    }
    
    const coupon = { id: snap.docs[0].id, ...snap.docs[0].data() } as Coupon;
    
    if (coupon.expiresAt && 'toDate' in (coupon.expiresAt as unknown as object) && (coupon.expiresAt as unknown as { toDate: () => Date }).toDate() < new Date()) {
      return { valid: false, error: 'Coupon expired' };
    }
    
    if (coupon.usedCount >= coupon.usageLimit) {
      return { valid: false, error: 'Coupon usage limit reached' };
    }
    
    if (coupon.usedBy?.includes(userId)) {
      return { valid: false, error: 'You have already used this coupon' };
    }
    
    if (orderTotal < coupon.minOrderValue) {
      return { valid: false, error: `Minimum order value is ${coupon.minOrderValue}` };
    }
    
    const discount = coupon.type === 'percentage'
      ? Math.min(orderTotal * coupon.value / 100, coupon.maxDiscount || Infinity)
      : coupon.value;
    
    return { valid: true, discount, coupon };
  } catch (error) {
    console.error('Error validating coupon:', error);
    return { valid: false, error: 'Error validating coupon' };
  }
};

export const applyCoupon = async (couponId: string, userId: string): Promise<void> => {
  try {
    await updateDoc(doc(db, 'coupons', couponId), {
      usedCount: increment(1),
      usedBy: arrayUnion(userId),
    });
  } catch (error) {
    console.error('Error applying coupon:', error);
    throw error;
  }
};
