import { useEffect, ReactNode } from 'react';
import { useAuthStore } from '../store/authStore';
import { observeAuth, getUserProfile } from '../services/authService';

// Auto-logout after 7 days (in milliseconds)
const SESSION_TIMEOUT = 7 * 24 * 60 * 60 * 1000;

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { setUser, setRole, setLoading } = useAuthStore();

  useEffect(() => {
    // Check for session expiration
    const checkSession = () => {
      const loginTime = localStorage.getItem('loginTime');
      if (loginTime) {
        const timeElapsed = Date.now() - parseInt(loginTime);
        if (timeElapsed > SESSION_TIMEOUT) {
          localStorage.removeItem('loginTime');
          localStorage.removeItem('auth-storage');
          window.location.href = '/login';
        }
      }
    };

    checkSession();
    const interval = setInterval(checkSession, 60 * 60 * 1000);

    const unsub = observeAuth(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const profile = await getUserProfile(firebaseUser.uid);
          setUser({ ...firebaseUser, ...profile } as any);
          setRole(profile?.role ?? 'user');
          if (!localStorage.getItem('loginTime')) {
            localStorage.setItem('loginTime', Date.now().toString());
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          setUser(null);
          setRole(null);
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
  }, [setUser, setRole, setLoading]);

  return <>{children}</>;
};
