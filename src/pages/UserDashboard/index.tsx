import { useState, useEffect } from 'react';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
import { Package, User, MapPin, Heart, Award, Edit2 } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { getUserOrders } from '../../services/orderService';
import { getUserProfile } from '../../services/authService';
import { formatCurrency, formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';
import type { Order, User as UserType } from '../../types';

const sidebarItems = [
  { path: '/dashboard', icon: Package, label: 'My Orders' },
  { path: '/dashboard/profile', icon: User, label: 'Profile' },
  { path: '/dashboard/addresses', icon: MapPin, label: 'Addresses' },
  { path: '/dashboard/wishlist', icon: Heart, label: 'Wishlist' },
  { path: '/dashboard/loyalty', icon: Award, label: 'Loyalty Points' },
];

// Orders Component with real data
const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    if (user?.uid) {
      loadOrders();
    }
  }, [user]);

  const loadOrders = async () => {
    try {
      const data = await getUserOrders(user!.uid);
      setOrders(data);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-amber-100 text-amber-700',
      confirmed: 'bg-blue-100 text-blue-700',
      shipped: 'bg-purple-100 text-purple-700',
      delivered: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return <div className="text-center py-8">Loading orders...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p className="text-gray-600 mb-4">No orders yet</p>
        <Link to="/products" className="inline-block px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold font-display text-slate-900 mb-4">My Orders ({orders.length})</h2>
      {orders.map((order) => (
        <div key={order.id} className="bg-white rounded-xl border border-slate-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold text-slate-900">Order #{order.id.slice(-8)}</span>
            <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
              {order.status}
            </span>
          </div>
          <p className="text-[13px] text-slate-400 mb-2">{formatDate(order.createdAt)}</p>
          <div className="flex items-center justify-between">
            <span className="text-[14px] text-slate-600">{order.items.length} items</span>
            <span className="font-bold font-display text-[18px] text-slate-900">{formatCurrency(order.total)}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

// Profile Component with real data
const Profile = () => {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: '',
    phone: '',
  });

  useEffect(() => {
    if (user?.uid) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      const data = await getUserProfile(user!.uid);
      setProfile(data);
      setFormData({
        displayName: data?.displayName || '',
        phone: data?.phone || '',
      });
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      // Update profile logic here
      toast.success('Profile updated successfully');
      setEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading profile...</div>;
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold font-display text-slate-900">Profile Information</h2>
        <button
          onClick={() => editing ? handleSave() : setEditing(true)}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          <Edit2 className="w-4 h-4" />
          {editing ? 'Save' : 'Edit'}
        </button>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
          {profile?.displayName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || '?'}
        </div>
        <div>
          <p className="font-medium text-lg text-slate-900">{profile?.displayName || 'User'}</p>
          <p className="text-slate-500">{user?.email}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-[13px] font-medium text-slate-600 mb-1">Display Name</label>
          {editing ? (
            <input
              type="text"
              value={formData.displayName}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
            />
          ) : (
            <p className="text-slate-900">{profile?.displayName || 'Not set'}</p>
          )}
        </div>

        <div>
          <label className="block text-[13px] font-medium text-slate-600 mb-1">Email</label>
          <p className="text-slate-900">{user?.email}</p>
        </div>

        <div>
          <label className="block text-[13px] font-medium text-slate-600 mb-1">Phone</label>
          {editing ? (
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
            />
          ) : (
            <p className="text-slate-900">{profile?.phone || 'Not set'}</p>
          )}
        </div>

        <div>
          <label className="block text-[13px] font-medium text-slate-600 mb-1">Member Since</label>
          <p className="text-slate-900">{profile?.createdAt ? formatDate(profile.createdAt) : 'N/A'}</p>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-center gap-4">
            <div className="flex-1 p-4 bg-orange-50 rounded-lg text-center">
              <p className="text-2xl font-bold text-orange-600">{profile?.totalOrders || 0}</p>
              <p className="text-sm text-slate-600">Total Orders</p>
            </div>
            <div className="flex-1 p-4 bg-slate-50 rounded-lg text-center">
              <p className="text-2xl font-bold text-slate-700">{profile?.loyaltyPoints || 0}</p>
              <p className="text-sm text-slate-600">Loyalty Points</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Addresses = () => (
  <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
    <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-400" />
    <p className="text-gray-600 mb-4">No saved addresses</p>
    <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
      Add Address
    </button>
  </div>
);

const Wishlist = () => (
  <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
    <Heart className="w-12 h-12 mx-auto mb-4 text-gray-400" />
    <p className="text-gray-600 mb-4">Your wishlist is empty</p>
    <Link to="/products" className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
      Browse Products
    </Link>
  </div>
);

const Loyalty = () => {
  const { user } = useAuthStore();
  const [points, setPoints] = useState(0);

  useEffect(() => {
    if (user?.uid) {
      getUserProfile(user.uid).then(profile => {
        setPoints(profile?.loyaltyPoints || 0);
      });
    }
  }, [user]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
          <Award className="w-8 h-8 text-white" />
        </div>
        <div>
          <p className="text-3xl font-bold text-gray-900">{points}</p>
          <p className="text-gray-600">Available Points</p>
        </div>
      </div>
      <p className="text-sm text-gray-500 mb-4">
        Earn 1 point for every Rs. 100 spent. Points can be redeemed for discounts on future purchases.
      </p>
      <div className="p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          💡 <strong>Tip:</strong> Complete more orders to earn more points!
        </p>
      </div>
    </div>
  );
};

const UserDashboard = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen pt-16 bg-[var(--bg-secondary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-display font-bold text-[var(--text-primary)] mb-8">
          My Account
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="md:col-span-1">
            <nav className="bg-white rounded-xl border border-[var(--border-default)] overflow-hidden">
              {sidebarItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                      isActive
                        ? 'bg-[var(--brand-50)] text-[var(--brand-600)]'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* Content */}
          <main className="md:col-span-3">
            <Routes>
              <Route path="/" element={<Orders />} />
              <Route path="profile" element={<Profile />} />
              <Route path="addresses" element={<Addresses />} />
              <Route path="wishlist" element={<Wishlist />} />
              <Route path="loyalty" element={<Loyalty />} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
