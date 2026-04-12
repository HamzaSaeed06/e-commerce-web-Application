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
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h2 className="font-display font-semibold text-[20px]">Your cart</h2>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-5 py-3 max-h-[calc(100vh-280px)]">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <ShoppingCartSimple weight="duotone" size={64} className="text-slate-200 mb-4" />
              <p className="text-[16px] font-medium text-slate-500 mb-2">
                Your cart is empty
              </p>
              <Link
                to="/products"
                onClick={closeCart}
                className="mt-4 px-6 py-2 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
              >
                Explore products
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="flex gap-3 items-start pb-4 border-b border-slate-100 last:border-0 last:pb-0"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[13px] font-medium text-slate-800 line-clamp-1">
                      {item.name}
                    </h3>
                    <p className="text-[12px] text-slate-400 mt-0.5">
                      {item.variant || 'Standard'}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center border rounded-lg">
                        <button
                          onClick={() => updateQty(item.productId, item.qty - 1)}
                          className="w-7 h-7 flex items-center justify-center hover:bg-slate-50 rounded-l-lg transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-3 text-[13px] font-medium">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => updateQty(item.productId, item.qty + 1)}
                          disabled={item.qty >= item.stock}
                          className="w-7 h-7 flex items-center justify-center hover:bg-slate-50 rounded-r-lg transition-colors disabled:opacity-50"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <span className="text-[14px] font-semibold text-slate-700">
                        {formatCurrency(item.price * item.qty)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-slate-300 hover:text-red-400 transition-colors"
                  >
                    <Trash weight="regular" size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-slate-100 px-5 py-4 space-y-2">
            <div className="flex justify-between text-[14px]">
              <span className="text-slate-500">Subtotal</span>
              <span className="font-medium">{formatCurrency(total())}</span>
            </div>
            <div className="flex justify-between text-[14px]">
              <span className="text-slate-500">Shipping</span>
              <span className="text-green-600">
                {total() >= 50 ? 'Free' : 'Calculated'}
              </span>
            </div>
            <div className="h-px bg-slate-100 my-2" />
            <div className="flex justify-between text-[18px] font-bold font-display text-slate-900">
              <span>Total</span>
              <span>{formatCurrency(total())}</span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full h-11 bg-orange-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-orange-600 transition-colors"
            >
              <ShoppingCartSimple weight="regular" size={18} />
              Checkout
            </button>
            <p className="text-center text-[13px] text-slate-400 mt-2">
              Continue shopping
            </p>
          </div>
        )}
      </motion.div>
    </>
  );
};
