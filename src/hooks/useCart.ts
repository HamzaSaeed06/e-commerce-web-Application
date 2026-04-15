import { useEffect, useCallback, useRef } from 'react';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { syncCartToFirestore, loadCartFromFirestore } from '../services/cartService';
import { trackCartAdd, trackCartRemove } from '../services/activityService';
import type { Product, CartItem } from '../types';
import toast from 'react-hot-toast';

const DEBOUNCE_DELAY = 1000;

export const useCart = () => {
  const { user } = useAuthStore();
  const { items, addItem, removeItem, updateQty, clearCart } = useCartStore();
  const syncTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced sync to Firestore
  useEffect(() => {
    if (!user) return;

    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }

    syncTimeoutRef.current = setTimeout(() => {
      syncCartToFirestore(user.uid, items);
    }, DEBOUNCE_DELAY);

    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, [items, user]);

  // Load cart from Firestore on login
  useEffect(() => {
    if (!user) return;

    const loadCart = async () => {
      const savedItems = await loadCartFromFirestore(user.uid);
      if (savedItems.length > 0 && items.length === 0) {
        savedItems.forEach(item => addItem(item));
      }
    };

    loadCart();
  }, [user?.uid]);

  const addToCart = useCallback(async (
    product: Product, 
    quantity = 1, 
    variantId?: string, 
    attributes?: Record<string, string>
  ) => {
    if (product.stock < quantity) {
      toast.error('Not enough stock available');
      return;
    }

    const cartItem: CartItem = {
      productId: product.id,
      variantId,
      name: product.name,
      price: product.price,
      image: product.images[0] || '',
      qty: quantity,
      stock: product.stock,
      variant: variantId ? Object.entries(attributes || {}).map(([k, v]) => `${k}: ${v}`).join(', ') : undefined,
      attributes,
    };

    addItem(cartItem);
    await trackCartAdd(user?.uid || null, product.id, quantity, cartItem.price);
    toast.success(`${product.name}${variantId ? ` (${cartItem.variant})` : ''} added to cart`);
  }, [addItem, user]);

  const removeFromCart = useCallback(async (productId: string, variantId?: string) => {
    removeItem(productId, variantId);
    await trackCartRemove(user?.uid || null, productId);
    toast.success('Item removed from cart');
  }, [removeItem, user]);

  const updateQuantity = useCallback((productId: string, quantity: number, variantId?: string) => {
    updateQty(productId, quantity, variantId);
  }, [updateQty]);

  const getCartTotal = useCallback(() => {
    return items.reduce((sum, item) => sum + item.price * item.qty, 0);
  }, [items]);

  const getItemCount = useCallback(() => {
    return items.reduce((sum, item) => sum + item.qty, 0);
  }, [items]);

  return {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getItemCount,
  };
};
