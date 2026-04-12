import { db } from './firebase';
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  increment,
  arrayUnion,
} from 'firebase/firestore';
import toast from 'react-hot-toast';
import type { Order, OrderItem } from '../types';
import { clearCartFirestore } from './cartService';
import { trackPurchase } from './activityService';

export const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const orderRef = await addDoc(collection(db, 'orders'), {
      ...orderData,
      status: 'pending',
      paymentStatus: 'pending',
      timeline: [{
        status: 'pending',
        timestamp: new Date(),
        message: 'Order placed successfully'
      }],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // Update product sold counts + deduct stock
    for (const item of orderData.items) {
      await updateDoc(doc(db, 'products', item.productId), {
        sold: increment(item.qty),
        stock: increment(-item.qty),
      });
    }

    // Add loyalty points (1 point per 100 currency)
    if (orderData.userId) {
      const points = Math.floor(orderData.total / 100);
      await updateDoc(doc(db, 'users', orderData.userId), {
        loyaltyPoints: increment(points),
        totalOrders: increment(1),
        totalSpent: increment(orderData.total),
      });
      await addDoc(collection(db, 'loyaltyTransactions'), {
        userId: orderData.userId,
        type: 'earn',
        points,
        reason: 'Order purchase',
        orderId: orderRef.id,
        createdAt: serverTimestamp(),
      });
    }

    // Track purchase activity
    for (const item of orderData.items) {
      await trackPurchase(orderData.userId, item.productId, orderRef.id);
    }

    // Clear cart
    if (orderData.userId) {
      await clearCartFirestore(orderData.userId);
    }

    toast.success('Order placed successfully!');
    return orderRef.id;
  } catch (error) {
    toast.error('Error placing order. Please try again.');
    throw error;
  }
};

export const updateOrderStatus = async (
  orderId: string,
  status: Order['status'],
  message: string
): Promise<void> => {
  try {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, {
      status,
      updatedAt: serverTimestamp(),
      timeline: arrayUnion({
        status,
        timestamp: new Date(),
        message,
      }),
    });
    toast.success(`Order status updated to ${status}`);
  } catch (error) {
    toast.error('Error updating order status');
    throw error;
  }
};

export const cancelOrder = async (orderId: string, userId: string): Promise<void> => {
  try {
    const orderRef = doc(db, 'orders', orderId);
    const orderSnap = await getDocs(query(collection(db, 'orders'), where('__name__', '==', orderId)));
    
    if (orderSnap.empty) {
      throw new Error('Order not found');
    }
    
    const order = orderSnap.docs[0].data() as Order;
    
    // Restore stock
    for (const item of order.items) {
      await updateDoc(doc(db, 'products', item.productId), {
        sold: increment(-item.qty),
        stock: increment(item.qty),
      });
    }
    
    // Deduct loyalty points if applicable
    const points = Math.floor(order.total / 100);
    if (userId) {
      await updateDoc(doc(db, 'users', userId), {
        loyaltyPoints: increment(-points),
        totalOrders: increment(-1),
        totalSpent: increment(-order.total),
      });
    }
    
    await updateDoc(orderRef, {
      status: 'cancelled',
      paymentStatus: 'refunded',
      updatedAt: serverTimestamp(),
      timeline: arrayUnion({
        status: 'cancelled',
        timestamp: new Date(),
        message: 'Order cancelled by user',
      }),
    });
    
    toast.success('Order cancelled successfully');
  } catch (error) {
    toast.error('Error cancelling order');
    throw error;
  }
};

export const getUserOrders = async (userId: string): Promise<Order[]> => {
  try {
    // Simple query without composite index - client-side sort
    const q = query(
      collection(db, 'orders'),
      where('userId', '==', userId)
    );
    const snap = await getDocs(q);
    const orders = snap.docs.map(d => ({ id: d.id, ...d.data() } as Order));
    // Client-side sorting
    return orders.sort((a, b) => {
      const dateA = a.createdAt?.toMillis?.() || new Date(a.createdAt).getTime();
      const dateB = b.createdAt?.toMillis?.() || new Date(b.createdAt).getTime();
      return dateB - dateA;
    });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return [];
  }
};

export const getOrderById = async (orderId: string): Promise<Order | null> => {
  try {
    const q = query(collection(db, 'orders'), where('__name__', '==', orderId));
    const snap = await getDocs(q);
    return snap.empty ? null : { id: snap.docs[0].id, ...snap.docs[0].data() } as Order;
  } catch (error) {
    console.error('Error fetching order:', error);
    return null;
  }
};

export const getAllOrders = async (status?: Order['status']): Promise<Order[]> => {
  try {
    // Simple query without composite index requirement
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    let orders = snap.docs.map(d => ({ id: d.id, ...d.data() } as Order));
    
    // Client-side filtering if status is specified
    if (status) {
      orders = orders.filter(o => o.status === status);
    }
    
    return orders;
  } catch (error) {
    console.error('Error fetching all orders:', error);
    return [];
  }
};

export const getPendingOrders = async (): Promise<Order[]> => {
  return getAllOrders('pending');
};

export const updatePaymentStatus = async (
  orderId: string,
  paymentStatus: Order['paymentStatus']
): Promise<void> => {
  try {
    await updateDoc(doc(db, 'orders', orderId), {
      paymentStatus,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating payment status:', error);
    throw error;
  }
};
