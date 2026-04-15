import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { X, Plus, Minus } from 'lucide-react';
import { Trash, ShoppingCartSimple } from 'phosphor-react';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { formatCurrency } from '../../utils/formatters';
import toast from 'react-hot-toast';

export const CartDrawer = () => {
  const { items, isOpen, closeCart, removeItem, updateQty, total } = useCartStore();
  const { user } = useAuthStore();

  const handleCheckout = () => {
    if (!user) {
      toast.error('Please sign in to checkout');
      closeCart();
      window.location.href = '/login';
      return;
    }
    closeCart();
    window.location.href = '/checkout';
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50"
        onClick={closeCart}
      />

      {/* Drawer */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-xl z-50 flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-(--neutral-200)">
          <h2 className="text-[14px] font-bold uppercase tracking-widest text-black">Your Basket</h2>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-(--neutral-100) transition-colors"
          >
            <X size={20} className="text-black" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <ShoppingCartSimple weight="regular" size={48} className="text-(--neutral-200) mb-6" />
              <p className="text-[14px] font-bold text-black uppercase tracking-widest mb-4">
                Your basket is empty
              </p>
              <Link
                to="/products"
                onClick={closeCart}
                className="px-8 py-3 border border-black text-[12px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all rounded-[4px]"
              >
                Go Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="flex gap-4 items-start pb-6 border-b border-(--neutral-100) last:border-0 last:pb-0"
                >
                  <div className="w-20 h-20 bg-(--neutral-50) border border-(--neutral-100) shrink-0 overflow-hidden rounded-[4px]">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain mix-blend-multiply"
                    />
                  </div>
                  <div className="flex-1 min-w-0 py-0.5">
                    <h3 className="text-[13px] font-bold text-black uppercase tracking-tight line-clamp-1">
                      {item.name}
                    </h3>
                    <p className="text-[11px] text-(--neutral-500) font-medium mt-1">
                      {item.variant || 'Standard'}
                    </p>
                    <div className="flex justify-between items-center mt-3">
                      <div className="flex items-center border border-black rounded-[4px] overflow-hidden">
                        <button
                          onClick={() => updateQty(item.productId, item.qty - 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-(--neutral-100) transition-colors border-r border-black"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="px-4 text-[13px] font-bold">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => updateQty(item.productId, item.qty + 1)}
                          disabled={item.qty >= item.stock}
                          className="w-8 h-8 flex items-center justify-center hover:bg-(--neutral-100) transition-colors disabled:opacity-50 border-l border-black"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <span className="text-[14px] font-bold text-black tabular-nums">
                        {formatCurrency(item.price * item.qty)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-(--neutral-300) hover:text-black transition-colors"
                  >
                    <Trash weight="bold" size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-(--neutral-200) px-6 py-8 space-y-6 bg-white">
            <div className="space-y-2">
              <div className="flex justify-between text-[13px] uppercase tracking-widest font-bold">
                <span className="text-(--neutral-500)">Subtotal</span>
                <span className="text-black">{formatCurrency(total())}</span>
              </div>
              <div className="flex justify-between text-[13px] uppercase tracking-widest font-bold">
                <span className="text-(--neutral-500)">Delivery</span>
                <span className={total() >= 50 ? 'text-black' : 'text-(--neutral-400)'}>
                  {total() >= 50 ? 'FREE' : 'STANDARD'}
                </span>
              </div>
              <div className="h-px bg-(--neutral-100) my-4" />
              <div className="flex justify-between text-[18px] font-bold text-black tracking-tighter">
                <span>Total</span>
                <span className="tabular-nums">{formatCurrency(total())}</span>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full h-14 bg-black text-white text-[13px] font-bold uppercase tracking-widest hover:bg-black/90 transition-all active:scale-[0.99] rounded-[4px]"
            >
              Checkout Now
            </button>
            <p className="text-center text-[11px] font-bold text-(--neutral-400) uppercase tracking-widest cursor-pointer hover:text-black transition-colors" onClick={closeCart}>
              Back to Store
            </p>
          </div>
        )}
      </motion.div>
    </>
  );
};
