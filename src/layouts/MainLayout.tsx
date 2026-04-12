import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { CartDrawer } from '../components/cart/CartDrawer';
import { ChatWidget } from '../components/chat/ChatWidget';
import { useAuth } from '../hooks/useAuth';

export const MainLayout = () => {
  // Initialize auth listener to keep user logged in
  useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)]">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <ChatWidget />
    </div>
  );
};
