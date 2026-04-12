import { auth, db } from './firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import type { User } from '../types';
import { LOYALTY_EVENTS } from '../utils/constants';

const getErrorMessage = (error: { code?: string; message: string }): string => {
  const errorMessages: Record<string, string> = {
    'auth/email-already-in-use': 'This email is already registered. Please sign in instead.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/weak-password': 'Password must be at least 6 characters long.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/invalid-credential': 'Invalid email or password.',
    'auth/popup-closed-by-user': 'Sign in was cancelled.',
    'auth/cancelled-popup-request': 'Sign in was cancelled.',
  };
  return errorMessages[error.code || ''] || error.message || 'An error occurred. Please try again.';
};

export const signUp = async (email: string, password: string, name: string): Promise<User> => {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });
    
    const userData = {
      uid: cred.user.uid,
      email,
      displayName: name,
      photoURL: '',
      role: 'user' as const,
      phone: '',
      createdAt: serverTimestamp(),
      lastSeen: serverTimestamp(),
      isOnline: true,
      loyaltyPoints: LOYALTY_EVENTS.SIGNUP,
      totalOrders: 0,
      totalSpent: 0,
      preferredCategories: [],
      addresses: [],
    };
    
    await setDoc(doc(db, 'users', cred.user.uid), userData);
    toast.success('Account created successfully!');
    return { ...userData, uid: cred.user.uid, email: cred.user.email || email } as unknown as User;
  } catch (error) {
    const message = getErrorMessage(error as { code?: string; message: string });
    toast.error(message);
    throw error;
  }
};

export const signIn = async (email: string, password: string): Promise<User> => {
  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    
    // Check if user document exists, if not create it
    const userRef = doc(db, 'users', cred.user.uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      // Update existing user
      await updateDoc(userRef, {
        lastSeen: serverTimestamp(),
        isOnline: true,
      });
    } else {
      // Create new user document if missing
      await setDoc(userRef, {
        uid: cred.user.uid,
        email: cred.user.email,
        displayName: cred.user.displayName || '',
        photoURL: cred.user.photoURL || '',
        role: 'user',
        phone: '',
        createdAt: serverTimestamp(),
        lastSeen: serverTimestamp(),
        isOnline: true,
        loyaltyPoints: 0,
        totalOrders: 0,
        totalSpent: 0,
        preferredCategories: [],
        addresses: [],
      });
    }
    
    toast.success('Welcome back!');
    const userData = userSnap.exists() ? userSnap.data() : {};
    return { ...cred.user, ...userData } as unknown as User;
  } catch (error) {
    const message = getErrorMessage(error as { code?: string; message: string });
    toast.error(message);
    throw error;
  }
};

export const signInWithGoogle = async (): Promise<User> => {
  try {
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(auth, provider);
    
    const userRef = doc(db, 'users', cred.user.uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      const userData = {
        uid: cred.user.uid,
        email: cred.user.email,
        displayName: cred.user.displayName || 'User',
        photoURL: cred.user.photoURL || '',
        role: 'user' as const,
        phone: cred.user.phoneNumber || '',
        createdAt: serverTimestamp(),
        lastSeen: serverTimestamp(),
        isOnline: true,
        loyaltyPoints: LOYALTY_EVENTS.SIGNUP,
        totalOrders: 0,
        totalSpent: 0,
        preferredCategories: [],
        addresses: [],
      };
      await setDoc(userRef, userData);
      toast.success(`Welcome to LuxeMarket! You earned ${LOYALTY_EVENTS.SIGNUP} points.`);
    } else {
      await updateDoc(userRef, {
        lastSeen: serverTimestamp(),
        isOnline: true,
      });
      toast.success('Welcome back!');
    }
    
    const userSnapData = userSnap.exists() ? userSnap.data() : {};
    return { ...cred.user, ...userSnapData } as unknown as User;
  } catch (error) {
    const message = getErrorMessage(error as { code?: string; message: string });
    toast.error(message);
    throw error;
  }
};

export const signOut = async (): Promise<void> => {
  try {
    const user = auth.currentUser;
    if (user) {
      await updateDoc(doc(db, 'users', user.uid), {
        isOnline: false,
        lastSeen: serverTimestamp(),
      });
    }
    await firebaseSignOut(auth);
    toast.success('Signed out successfully');
  } catch (error) {
    toast.error('Error signing out');
    throw error;
  }
};

// Alias for backward compatibility
export { signOut as logOut };

export const getUserProfile = async (uid: string): Promise<User | null> => {
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (!snap.exists()) return null;
    const data = snap.data();
    return { ...data, uid: snap.id } as User;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

export const updateUserProfile = async (uid: string, data: Partial<User>): Promise<void> => {
  try {
    await updateDoc(doc(db, 'users', uid), {
      ...data,
      updatedAt: serverTimestamp(),
    });
    toast.success('Profile updated successfully');
  } catch (error) {
    toast.error('Error updating profile');
    throw error;
  }
};

export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
    toast.success('Password reset email sent');
  } catch (error) {
    const message = getErrorMessage(error as { code?: string; message: string });
    toast.error(message);
    throw error;
  }
};

export const observeAuth = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      const profile = await getUserProfile(firebaseUser.uid);
      callback(profile ? { ...firebaseUser, ...profile } as User : null);
    } else {
      callback(null);
    }
  });
};
