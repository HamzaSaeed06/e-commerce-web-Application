import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { formatCurrency } from '../utils/formatters';
import toast from 'react-hot-toast';

const Cart = () => {
  const { items, removeItem, updateQty, total } = useCartStore();
  const { user } = useAuthStore();

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    if (!user) {
      toast.error('Please sign in to checkout');
      window.location.href = '/login';
      return;
    }
    window.location.href = '/checkout';
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-[var(--bg-secondary)] rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-12 h-12 text-[var(--text-muted)]" />
          </div>
          <h1 className="text-2xl font-display font-bold text-[var(--text-primary)] mb-2">
            Your cart is empty
          </h1>
          <p className="text-[var(--text-secondary)] mb-6">
            Looks like you have not added anything yet
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--brand-500)] text-white font-medium rounded-lg hover:bg-[var(--brand-600)] transition-colors"
          >
            Continue Shopping <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-display font-bold text-[var(--text-primary)] mb-8">
          Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.productId}
                className="flex gap-4 p-4 bg-white rounded-xl border border-[var(--border-default)]"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-[var(--text-primary)] truncate">
                    {item.name}
                  </h3>
                  <p className="text-[var(--brand-500)] font-medium mt-1">
                    {formatCurrency(item.price)}
                  </p>
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center border border-[var(--border-default)] rounded-lg">
                      <button
                        onClick={() => updateQty(item.productId, item.qty - 1)}
                        className="px-3 py-1 hover:bg-[var(--bg-secondary)] transition-colors"
                      >
                        -
                      </button>
                      <span className="w-10 text-center">{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.productId, item.qty + 1)}
                        disabled={item.qty >= item.stock}
                        className="px-3 py-1 hover:bg-[var(--bg-secondary)] transition-colors disabled:opacity-50"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="p-2 text-[var(--text-muted)] hover:text-[var(--danger)] transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-[var(--text-primary)]">
                    {formatCurrency(item.price * item.qty)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white p-6 rounded-xl border border-[var(--border-default)]">
              <h2 className="text-lg font-display font-semibold text-[var(--text-primary)] mb-4">
                Order Summary
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-[var(--text-secondary)]">
                  <span>Subtotal</span>
                  <span>{formatCurrency(total())}</span>
                </div>
                <div className="flex justify-between text-[var(--text-secondary)]">
                  <span>Shipping</span>
                  <span className="text-[var(--success)]">Free</span>
                </div>
                <div className="flex justify-between text-[var(--text-secondary)]">
                  <span>Tax</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>
              <div className="border-t border-[var(--border-default)] mt-4 pt-4">
                <div className="flex justify-between text-lg font-semibold text-[var(--text-primary)]">
                  <span>Total</span>
                  <span>{formatCurrency(total())}</span>
                </div>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full mt-6 py-3 bg-[var(--brand-500)] text-white font-medium rounded-lg hover:bg-[var(--brand-600)] active:scale-[0.98] transition-all"
              >
                Proceed to Checkout
              </button>
              <Link
                to="/products"
                className="block text-center mt-4 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
