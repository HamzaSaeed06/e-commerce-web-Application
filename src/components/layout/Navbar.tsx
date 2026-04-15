import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Heart, Menu, X, ChevronDown, LogOut, Settings, Package, LayoutDashboard } from 'lucide-react';
import { Bell } from 'phosphor-react';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { SearchBar } from '../search/SearchBar';
import { signOut } from '../../services/authService';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { items } = useCartStore();
  const { user, role, logout } = useAuthStore();
  const navigate = useNavigate();
  const itemCount = items.reduce((sum, item) => sum + item.qty, 0);
  const isAdmin = role === 'admin' || role === 'manager';

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 border-b ${
        isScrolled
          ? 'bg-white/90 backdrop-blur-md border-slate-200'
          : 'bg-white/90 backdrop-blur-md border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          {/* Logo - John Lewis Style */}
          <Link to="/" className="flex-shrink-0 group">
            <div className="flex flex-col items-start leading-none">
              <span className="text-lg font-bold text-black uppercase tracking-[0.2em]">
                ZEST
              </span>
              <span className="text-[10px] font-medium text-(--neutral-500) uppercase tracking-[0.3em] mt-0.5 group-hover:text-black transition-colors">
                & PARTNERS
              </span>
            </div>
          </Link>

          {/* Center Search - Minimalist */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <SearchBar />
          </div>

          {/* Right Actions - Monochrome */}
          <div className="flex items-center gap-1">
            <Link
              to="/wishlist"
              className="w-10 h-10 flex items-center justify-center text-black hover:bg-(--neutral-100) transition-colors hidden sm:flex"
            >
              <Heart size={20} strokeWidth={1} />
            </Link>

            <button className="w-10 h-10 flex items-center justify-center text-black hover:bg-(--neutral-100) transition-colors hidden sm:flex relative">
              <Bell weight="regular" size={20} />
              <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-black rounded-full" />
            </button>

            <motion.button
              onClick={() => useCartStore.getState().openCart()}
              className="w-10 h-10 flex items-center justify-center text-black hover:bg-(--neutral-100) transition-colors relative"
              whileTap={{ scale: 0.95 }}
            >
              <ShoppingBag size={20} strokeWidth={1} />
              <AnimatePresence>
                {itemCount > 0 && (
                  <motion.span
                    key={itemCount}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-1.5 right-1.5 min-w-[16px] h-[16px] bg-black text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1 tabular-nums"
                  >
                    {itemCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            <div className="hidden sm:block w-px h-5 bg-slate-200 mx-2" />

            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1 pr-3 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors rounded-full hover:bg-[var(--bg-secondary)]"
                >
                  <div className="w-8 h-8 bg-[var(--brand-500)] rounded-full flex items-center justify-center text-white font-medium text-sm">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.displayName} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      user.displayName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'
                    )}
                  </div>
                  <span className="hidden sm:block text-sm font-medium max-w-[100px] truncate">
                    {user.displayName || user.email?.split('@')[0]}
                  </span>
                  <ChevronDown className="w-4 h-4" />
                </button>
 
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-[4px] shadow-lg border border-(--neutral-200) py-2 z-50">
                    <div className="px-4 py-2 border-b border-(--neutral-100) md:hidden">
                      <p className="text-sm font-medium text-black truncate">{user.displayName || 'User'}</p>
                      <p className="text-xs text-(--neutral-400) truncate">{user.email}</p>
                    </div>
                    
                    {/* User Menu Items */}
                    {!isAdmin && (
                      <Link
                        to="/dashboard"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-(--neutral-600) hover:text-black hover:bg-(--neutral-50) transition-colors"
                      >
                        <Package className="w-4 h-4" />
                        My Orders
                      </Link>
                    )}
                    
                    {/* Admin Menu Items */}
                    {isAdmin && (
                      <>
                        <Link
                          to="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-black font-bold hover:bg-(--neutral-50) transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          Admin Dashboard
                        </Link>
                        <Link
                          to="/admin/orders"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-(--neutral-600) hover:text-black hover:bg-(--neutral-50) transition-colors"
                        >
                          <Package className="w-4 h-4" />
                          Manage Orders
                        </Link>
                      </>
                    )}
                    
                    <Link
                      to="/dashboard/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-(--neutral-600) hover:text-black hover:bg-(--neutral-50) transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </Link>
                    <button
                      onClick={async () => {
                        await signOut();
                        logout();
                        setUserMenuOpen(false);
                        navigate('/');
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden sm:flex items-center gap-2 px-5 py-2 bg-black text-white text-[13px] font-bold rounded-[4px] hover:bg-black/90 transition-all"
              >
                Sign In
              </Link>
            )}
 
            {/* Mobile Actions Overlay - Ensure no overflow */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-black md:hidden hover:bg-(--neutral-50) rounded-[4px] transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
    </header>
  );
};
