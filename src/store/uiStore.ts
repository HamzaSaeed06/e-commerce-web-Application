import { create } from 'zustand';

interface UIStore {
  sidebarOpen: boolean;
  mobileMenuOpen: boolean;
  searchOpen: boolean;
  currentModal: string | null;
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  setSidebarOpen: (open: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  openModal: (modal: string) => void;
  closeModal: () => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  hideToast: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: false,
  mobileMenuOpen: false,
  searchOpen: false,
  currentModal: null,
  toast: null,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
  setSearchOpen: (open) => set({ searchOpen: open }),
  openModal: (modal) => set({ currentModal: modal }),
  closeModal: () => set({ currentModal: null }),
  showToast: (message, type = 'info') => set({ toast: { message, type } }),
  hideToast: () => set({ toast: null }),
}));
