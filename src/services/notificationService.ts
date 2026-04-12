import { db } from './firebase';
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  updateDoc,
  doc,
  serverTimestamp,
  onSnapshot,
} from 'firebase/firestore';
import type { Notification } from '../types';

export const sendNotification = async (
  userId: string,
  notification: {
    type: Notification['type'];
    title: string;
    body: string;
    imageUrl?: string;
    actionUrl?: string;
  }
): Promise<void> => {
  try {
    await addDoc(collection(db, 'notifications'), {
      userId,
      ...notification,
      isRead: false,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};

export const getUserNotifications = async (userId: string): Promise<Notification[]> => {
  try {
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Notification));
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
};

export const markNotificationRead = async (notificationId: string): Promise<void> => {
  try {
    await updateDoc(doc(db, 'notifications', notificationId), {
      isRead: true,
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
  }
};

export const markAllNotificationsRead = async (userId: string): Promise<void> => {
  try {
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      where('isRead', '==', false)
    );
    const snap = await getDocs(q);
    
    const promises = snap.docs.map(d =>
      updateDoc(doc(db, 'notifications', d.id), { isRead: true })
    );
    await Promise.all(promises);
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
  }
};

export const subscribeToNotifications = (
  userId: string,
  callback: (notifications: Notification[]) => void
) => {
  const q = query(
    collection(db, 'notifications'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() } as Notification)));
  });
};

export const getUnreadCount = async (userId: string): Promise<number> => {
  try {
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      where('isRead', '==', false)
    );
    const snap = await getDocs(q);
    return snap.size;
  } catch (error) {
    console.error('Error getting unread count:', error);
    return 0;
  }
};
