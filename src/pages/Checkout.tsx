import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, CreditCard, Truck } from 'lucide-react';
import { Money, Lock } from 'phosphor-react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { createOrder } from '../services/orderService';
import { formatCurrency } from '../utils/formatters';
import toast from 'react-hot-toast';

const Checkout = () => {
  const { items, total, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: user?.displayName || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'cod',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.fullName.trim()) {
      toast.error('Please enter your full name');
      return;
    }
    if (!formData.phone.trim()) {
      toast.error('Please enter your phone number');
      return;
    }
    if (!formData.address.trim()) {
      toast.error('Please enter your address');
      return;
    }
    if (!formData.city.trim()) {
      toast.error('Please enter your city');
      return;
    }
    if (!formData.postalCode.trim()) {
      toast.error('Please enter your postal code');
      return;
    }
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    
    setLoading(true);
    
    try {
      const orderData = {
        userId: user?.uid || '',
        guestEmail: user ? null : formData.email,
        items: items.map(item => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          image: item.image,
          qty: item.qty,
        })),
        subtotal: total(),
        discount: 0,
        total: total(),
        status: 'pending' as const,
        paymentMethod: formData.paymentMethod as 'cod' | 'card' | 'wallet',
        paymentStatus: 'pending' as const,
        address: {
          id: Date.now().toString(),
          label: 'Home',
          fullName: formData.fullName,
          phone: formData.phone,
          line1: formData.address,
          city: formData.city,
          province: '',
          postalCode: formData.postalCode,
          country: 'US',
          isDefault: true,
        },
        timeline: [],
      };

      const orderId = await createOrder(orderData);
      clearCart();
      navigate(`/order-confirmation/${orderId}`);
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error(error.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Your cart is empty</h1>
          <Link to="/products" className="mt-4 text-[var(--brand-500)] hover:underline">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-slate-50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-slate-400 mb-6">
            <Link to="/cart" className="hover:text-slate-700">Cart</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-700">Checkout</span>
          </nav>

          <div className="grid grid-cols-12 gap-8">
            {/* Checkout Form */}
            <div className="col-span-7 space-y-4">
              {/* Shipping Section */}
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <h2 className="text-[16px] font-semibold text-slate-900 mb-4">
                  Shipping Information
                </h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full h-10 px-3 border border-slate-200 rounded-lg text-[14px] focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full h-10 px-3 border border-slate-200 rounded-lg text-[14px] focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full h-10 px-3 border border-slate-200 rounded-lg text-[14px] focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none transition-all"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                      Address *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full h-10 px-3 border border-slate-200 rounded-lg text-[14px] focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full h-10 px-3 border border-slate-200 rounded-lg text-[14px] focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                      Postal Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      className="w-full h-10 px-3 border border-slate-200 rounded-lg text-[14px] focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Section */}
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <h2 className="text-[16px] font-semibold text-slate-900 mb-4">
                  Payment Method
                </h2>
                
                <label className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:border-orange-200 hover:bg-orange-50/50 transition-all">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={formData.paymentMethod === 'cod'}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="w-4 h-4 text-orange-500"
                  />
                  <Money weight="duotone" size={24} className="text-orange-500" />
                  <span className="text-[14px] font-medium text-slate-700">Cash on Delivery</span>
                </label>
              </div>
            </div>

            {/* Order Summary */}
            <div className="col-span-5">
              <div className="sticky top-24 bg-white rounded-xl border border-slate-200 p-5">
                <h2 className="text-[16px] font-semibold text-slate-900 mb-4">
                  Order Summary
                </h2>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.productId} className="flex gap-3 items-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium text-slate-800 line-clamp-1">
                          {item.name}
                        </p>
                        <p className="text-[12px] text-slate-400">
                          Qty: {item.qty}
                        </p>
                      </div>
                      <p className="text-[14px] font-semibold text-slate-700">
                        {formatCurrency(item.price * item.qty)}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="h-px bg-slate-100 my-4" />
                <div className="space-y-2">
                  <div className="flex justify-between text-[14px]">
                    <span className="text-slate-500">Subtotal</span>
                    <span className="font-medium">{formatCurrency(total())}</span>
                  </div>
                  <div className="flex justify-between text-[14px]">
                    <span className="text-slate-500">Shipping</span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>
                </div>
                <div className="h-px bg-slate-100 my-4" />
                <div className="flex justify-between text-[18px] font-bold font-display text-slate-900">
                  <span>Total</span>
                  <span>{formatCurrency(total())}</span>
                </div>
                
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full h-11 mt-4 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? 'Processing...' : 'Place Order'}
                </button>
                
                <div className="flex items-center justify-center gap-1.5 mt-3 text-[12px] text-slate-400">
                  <Lock weight="regular" size={14} />
                  <span>Secure checkout</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Checkout;
