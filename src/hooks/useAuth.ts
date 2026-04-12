import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { observeAuth, getUserProfile, signOut } from '../services/authService';
import toast from 'react-hot-toast';

// Auto-logout after 7 days (in milliseconds)
const SESSION_TIMEOUT = 7 * 24 * 60 * 60 * 1000;

export const useAuth = () => {
  const { user, role, isLoading, setUser, setRole, setLoading } = useAuthStore();

  useEffect(() => {
    // Check for session expiration
    const checkSession = () => {
      const loginTime = localStorage.getItem('loginTime');
      if (loginTime) {
        const timeElapsed = Date.now() - parseInt(loginTime);
        if (timeElapsed > SESSION_TIMEOUT) {
          // Auto-logout after 7 days
          signOut();
          setUser(null);
          setRole(null);
          localStorage.removeItem('loginTime');
          toast.success('Session expired. Please sign in again.');
        }
      }
    };

    // Check session on mount
    checkSession();

    // Set up interval to check every hour
    const interval = setInterval(checkSession, 60 * 60 * 1000);

    const unsub = observeAuth(async (firebaseUser) => {
      if (firebaseUser) {
        const profile = await getUserProfile(firebaseUser.uid);
        setUser({ ...firebaseUser, ...profile });
        setRole(profile?.role ?? 'user');
        // Store login time when user logs in
        if (!localStorage.getItem('loginTime')) {
          localStorage.setItem('loginTime', Date.now().toString());
        }
      } else {
        setUser(null);
        setRole(null);
        localStorage.removeItem('loginTime');
      }
      setLoading(false);
    });

    return () => {
      unsub();
      clearInterval(interval);
    };
  }, []);

  return {
    user,
    role,
    isLoading,
    isAdmin: role === 'admin',
    isManager: role === 'manager',
    isAuthenticated: !!user,
  };
};
