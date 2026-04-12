import { db } from './firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import type { User } from '../types';

const USERS = 'users';

export const getAllUsers = async (): Promise<User[]> => {
  const q = query(collection(db, USERS), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ uid: d.id, ...d.data() } as User));
};

export const getUserById = async (uid: string): Promise<User | null> => {
  const snap = await getDoc(doc(db, USERS, uid));
  return snap.exists() ? { uid: snap.id, ...snap.data() } as User : null;
};

export const updateUserRole = async (uid: string, role: 'user' | 'admin' | 'manager'): Promise<void> => {
  await updateDoc(doc(db, USERS, uid), {
    role,
    updatedAt: serverTimestamp(),
  });
};

export const deleteUser = async (uid: string): Promise<void> => {
  await deleteDoc(doc(db, USERS, uid));
};

export const getActiveUsersCount = async (): Promise<number> => {
  const q = query(collection(db, USERS), where('isOnline', '==', true));
  const snap = await getDocs(q);
  return snap.size;
};

export const getTotalUsersCount = async (): Promise<number> => {
  const snap = await getDocs(collection(db, USERS));
  return snap.size;
};
