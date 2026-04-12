import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--brand-500)]"></div>
  </div>
);

export const ProtectedRoute = () => {
  const { user, isLoading } = useAuthStore();
  
  if (isLoading) return <LoadingSpinner />;
  
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export const AdminRoute = () => {
  const { user, role, isLoading } = useAuthStore();
  
  if (isLoading) return <LoadingSpinner />;
  
  if (!user) return <Navigate to="/login" replace />;
  if (role !== 'admin' && role !== 'manager') return <Navigate to="/" replace />;
  
  return <Outlet />;
};
