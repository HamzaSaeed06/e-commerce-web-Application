import { db } from './firebase';
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  setDoc,
  getDoc,
} from 'firebase/firestore';
import type { Chat, ChatMessage } from '../types';

export const getOrCreateChat = async (
  userId: string | null,
  guestId: string,
  userName: string
): Promise<string> => {
  const chatId = userId || guestId;
  const chatRef = doc(db, 'chats', chatId);
  const snap = await getDoc(chatRef);
  
  if (!snap.exists()) {
    await setDoc(chatRef, {
      userId,
      guestId,
      userName,
      status: 'open',
      lastMessage: '',
      lastMessageAt: serverTimestamp(),
      unreadAdmin: 0,
      unreadUser: 0,
      createdAt: serverTimestamp(),
    });
  }
  
  return chatId;
};

export const sendMessage = async (
  chatId: string,
  senderId: string,
  senderRole: 'user' | 'admin',
  text: string
): Promise<void> => {
  await addDoc(collection(db, 'chats', chatId, 'messages'), {
    senderId,
    senderRole,
    text,
    imageUrl: null,
    isRead: false,
    timestamp: serverTimestamp(),
  });
  
  await updateDoc(doc(db, 'chats', chatId), {
    lastMessage: text,
    lastMessageAt: serverTimestamp(),
    ...(senderRole === 'user' ? { unreadAdmin: 1 } : { unreadUser: 1 }),
  });
};

export const sendImageMessage = async (
  chatId: string,
  senderId: string,
  senderRole: 'user' | 'admin',
  imageUrl: string
): Promise<void> => {
  await addDoc(collection(db, 'chats', chatId, 'messages'), {
    senderId,
    senderRole,
    text: '',
    imageUrl,
    isRead: false,
    timestamp: serverTimestamp(),
  });
  
  await updateDoc(doc(db, 'chats', chatId), {
    lastMessage: '📷 Image',
    lastMessageAt: serverTimestamp(),
    ...(senderRole === 'user' ? { unreadAdmin: 1 } : { unreadUser: 1 }),
  });
};

export const subscribeToMessages = (
  chatId: string,
  callback: (msgs: ChatMessage[]) => void
) => {
  const q = query(
    collection(db, 'chats', chatId, 'messages'),
    orderBy('timestamp', 'asc')
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() } as ChatMessage)));
  });
};

export const subscribeToAllChats = (callback: (chats: Chat[]) => void) => {
  return onSnapshot(collection(db, 'chats'), (snap) => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() } as Chat)));
  });
};

export const markMessagesAsRead = async (chatId: string, role: 'user' | 'admin'): Promise<void> => {
  await updateDoc(doc(db, 'chats', chatId), {
    ...(role === 'admin' ? { unreadAdmin: 0 } : { unreadUser: 0 }),
  });
};

export const closeChat = async (chatId: string): Promise<void> => {
  await updateDoc(doc(db, 'chats', chatId), {
    status: 'closed',
    updatedAt: serverTimestamp(),
  });
};
