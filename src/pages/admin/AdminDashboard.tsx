import { useEffect, useState } from 'react';
import { 
  ShoppingBag,
  CurrencyDollar,
  Package,
  Users,
  TrendUp,
  WarningCircle
} from 'phosphor-react';
import { getAdminStats, type AdminStats } from '../../services/analyticsService';
import { getPendingOrders } from '../../services/orderService';
import { formatCurrency, formatNumber } from '../../utils/formatters';

const StatCard = ({ title, value, icon: Icon, trend }: { 
  title: string; 
  value: string | number; 
  icon: React.ElementType;
  trend?: string;
}) => (
  <div className="bg-white rounded-xl border border-slate-100 p-4">
    <div className="w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center">
      <Icon weight="duotone" size={20} className="text-orange-500" />
    </div>
    <p className="text-[12px] text-slate-400 font-medium uppercase tracking-wide mt-3">
      {title}
    </p>
    <p className="text-[28px] font-bold font-display text-slate-900 leading-tight mt-1">
      {value}
    </p>
    {trend && (
      <p className="text-[12px] text-green-600 font-medium mt-1 flex items-center gap-1">
        <TrendUp weight="bold" size={12} /> {trend}
      </p>
    )}
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [adminStats, orders] = await Promise.all([
          getAdminStats(),
          getPendingOrders(),
        ]);
        setStats(adminStats);
        setPendingOrders(orders.length);
      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 bg-slate-200 rounded-xl animate-skeleton" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Alert */}
      {pendingOrders > 0 && (
        <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <WarningCircle weight="fill" size={20} className="text-amber-600 flex-shrink-0" />
          <p className="text-sm text-amber-800">
            You have <strong>{pendingOrders}</strong> pending orders requiring attention.
          </p>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(stats?.totalRevenue || 0)}
          icon={CurrencyDollar}
        />
        <StatCard
          title="Total Orders"
          value={formatNumber(stats?.totalOrders || 0)}
          icon={ShoppingBag}
        />
        <StatCard
          title="Active Users"
          value={formatNumber(stats?.activeUsers || 0)}
          icon={Users}
        />
        <StatCard
          title="Active Products"
          value={formatNumber(stats?.totalProducts || 0)}
          icon={Package}
        />
      </div>

      {/* Additional Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-[var(--border-default)] shadow-sm">
          <h3 className="font-display font-semibold text-lg mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <a href="/admin/products/new" className="p-4 bg-[var(--bg-secondary)] rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors text-center">
              <Package className="w-6 h-6 mx-auto mb-2 text-[var(--brand-500)]" />
              <span className="text-sm font-medium">Add Product</span>
            </a>
            <a href="/admin/orders" className="p-4 bg-[var(--bg-secondary)] rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors text-center">
              <ShoppingBag className="w-6 h-6 mx-auto mb-2 text-[var(--brand-500)]" />
              <span className="text-sm font-medium">View Orders</span>
            </a>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-[var(--border-default)] shadow-sm">
          <h3 className="font-display font-semibold text-lg mb-4">Active Users</h3>
          <div className="flex items-center gap-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <Users className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-[var(--text-primary)]">
                {stats?.activeUsers || 0}
              </p>
              <p className="text-sm text-[var(--text-muted)]">Currently online</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
