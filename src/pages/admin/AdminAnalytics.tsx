import { useState, useEffect } from 'react';
import { 
  TrendingUp, ShoppingCart, Users, DollarSign, Package, Eye, 
  BarChart3, PieChart, Activity, Clock, Calendar, RefreshCw,
  ChevronDown
} from 'lucide-react';
import { 
  getAdminStats, getSalesByDay, getMostSoldProducts, getMostViewedProducts,
  getOrdersByStatus, getSalesByCategory, getHourlyDistribution 
} from '../../services/analyticsService';
import { formatCurrency, formatNumber } from '../../utils/formatters';
import type { Product } from '../../types';

// Tabs Component
const ChartTabs = ({ activeTab, onChange, tabs }: { activeTab: string; onChange: (t: string) => void; tabs: {id: string; label: string; icon: any}[] }) => (
  <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
    {tabs.map(tab => {
      const Icon = tab.icon;
      return (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
            activeTab === tab.id 
              ? 'bg-[var(--brand-100)] text-[var(--brand-700)] border border-[var(--brand-200)]' 
              : 'bg-white text-[var(--text-secondary)] border border-[var(--border-default)] hover:bg-[var(--bg-secondary)]'
          }`}
        >
          <Icon className="w-4 h-4" />
          {tab.label}
        </button>
      );
    })}
  </div>
);

// Line Chart with dual axis - Revenue & Orders
const SalesLineChart = ({ data }: { data: any[] }) => {
  if (data.length === 0) return <p className="text-gray-500">No data available</p>;
  
  const maxRevenue = Math.max(...data.map(d => d.revenue)) || 1;
  const maxOrders = Math.max(...data.map(d => d.orders)) || 1;
  
  const revenuePoints = data.map((d, i) => ({
    x: (i / (data.length - 1)) * 100,
    y: 100 - ((d.revenue / maxRevenue) * 70 + 15),
  }));
  
  const ordersPoints = data.map((d, i) => ({
    x: (i / (data.length - 1)) * 100,
    y: 100 - ((d.orders / maxOrders) * 70 + 15),
  }));
  
  const revenuePath = revenuePoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const ordersPath = ordersPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  
  return (
    <div className="relative h-56 w-full">
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Grid */}
        {[20, 40, 60, 80].map(y => (
          <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="#E5E7EB" strokeWidth="0.3" strokeDasharray="2,2" />
        ))}
        {/* Revenue Area */}
        <path d={`${revenuePath} L 100 100 L 0 100 Z`} fill="url(#revenueGradient)" opacity="0.4" />
        {/* Orders Area */}
        <path d={`${ordersPath} L 100 100 L 0 100 Z`} fill="url(#ordersGradient)" opacity="0.3" />
        {/* Revenue Line */}
        <path d={revenuePath} fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" />
        {/* Orders Line */}
        <path d={ordersPath} fill="none" stroke="#3B82F6" strokeWidth="2" strokeDasharray="4,2" strokeLinecap="round" />
        <defs>
          <linearGradient id="revenueGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="ordersGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
      {/* Legend */}
      <div className="absolute top-2 right-2 flex gap-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-1.5 bg-emerald-500 rounded" />
          <span>Revenue</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-1.5 bg-blue-500 rounded" />
          <span>Orders</span>
        </div>
      </div>
      {/* X Axis Labels */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-400 px-2">
        {data.filter((_, i) => i % Math.ceil(data.length / 6) === 0).map((d, i) => (
          <span key={i}>{d.date.slice(5)}</span>
        ))}
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, trend, color }: any) => (
  <div className="bg-white p-5 rounded-xl border border-[var(--border-default)] hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-[var(--text-secondary)] mb-1">{title}</p>
        <p className="text-2xl font-bold text-[var(--text-primary)]">{value}</p>
        {trend && (
          <p className={`text-xs mt-1 flex items-center gap-1 ${trend > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            <TrendingUp className="w-3 h-3" />
            {trend > 0 ? '+' : ''}{trend}%
          </p>
        )}
      </div>
      <div className="p-2.5 rounded-lg" style={{ backgroundColor: `${color}15` }}>
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
    </div>
  </div>
);

// Horizontal Bar Chart
const HorizontalBarChart = ({ data, labelKey, valueKey, color = '#3B82F6', unit = '' }: any) => {
  const maxValue = Math.max(...data.map((d: any) => d[valueKey])) || 1;
  
  return (
    <div className="space-y-3">
      {data.map((item: any, index: number) => (
        <div key={index} className="group">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-[var(--text-secondary)] truncate max-w-[150px]">{item[labelKey]}</span>
            <span className="font-medium text-[var(--text-primary)]">
              {unit === '₹' ? formatCurrency(item[valueKey]) : formatNumber(item[valueKey])}
            </span>
          </div>
          <div className="h-2 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{ 
                width: `${(item[valueKey] / maxValue) * 100}%`,
                backgroundColor: color 
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

// Pie/Donut Chart
const DonutChart = ({ data, colors }: { data: { name: string; value: number }[]; colors: string[] }) => {
  const total = data.reduce((sum, d) => sum + d.value, 0) || 1;
  let currentAngle = 0;
  
  return (
    <div className="flex items-center gap-6">
      <div className="relative w-40 h-40">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          {data.map((item, i) => {
            const angle = (item.value / total) * 360;
            const x1 = 50 + 40 * Math.cos((currentAngle * Math.PI) / 180);
            const y1 = 50 + 40 * Math.sin((currentAngle * Math.PI) / 180);
            const x2 = 50 + 40 * Math.cos(((currentAngle + angle) * Math.PI) / 180);
            const y2 = 50 + 40 * Math.sin(((currentAngle + angle) * Math.PI) / 180);
            const largeArc = angle > 180 ? 1 : 0;
            
            const path = `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`;
            currentAngle += angle;
            
            return (
              <path
                key={i}
                d={path}
                fill={colors[i % colors.length]}
                className="hover:opacity-80 transition-opacity cursor-pointer"
              />
            );
          })}
          <circle cx="50" cy="50" r="25" fill="white" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-[var(--text-primary)]">{formatNumber(total)}</span>
          <span className="text-xs text-[var(--text-muted)]">Total</span>
        </div>
      </div>
      <div className="flex-1 space-y-2">
        {data.map((item, i) => (
          <div key={i} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: colors[i % colors.length] }}
              />
              <span className="text-[var(--text-secondary)]">{item.name}</span>
            </div>
            <span className="font-medium">{formatNumber(item.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Area Chart for hourly
const HourlyAreaChart = ({ data }: { data: { hour: number; orders: number }[] }) => {
  if (data.length === 0) return <p className="text-gray-500">No data</p>;
  
  const maxOrders = Math.max(...data.map(d => d.orders)) || 1;
  const points = data.map((d, i) => ({
    x: (i / (data.length - 1)) * 100,
    y: 100 - ((d.orders / maxOrders) * 80 + 10),
  }));
  
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  
  return (
    <div className="relative h-40 w-full">
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="hourlyGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={`${pathD} L 100 100 L 0 100 Z`} fill="url(#hourlyGradient)" opacity="0.5" />
        <path d={pathD} fill="none" stroke="#8B5CF6" strokeWidth="2" />
        {/* Bars for each hour */}
        {data.map((d, i) => (
          <rect
            key={i}
            x={(i / data.length) * 100 + 1}
            y={100 - ((d.orders / maxOrders) * 80 + 10)}
            width={(100 / data.length) - 2}
            height={((d.orders / maxOrders) * 80 + 10)}
            fill="#8B5CF6"
            opacity={0.3}
            rx={1}
          />
        ))}
      </svg>
      <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-400 px-1">
        <span>12AM</span>
        <span>6AM</span>
        <span>12PM</span>
        <span>6PM</span>
        <span>11PM</span>
      </div>
    </div>
  );
};

const AdminAnalytics = () => {
  const [activeTab, setActiveTab] = useState('sales');
  const [stats, setStats] = useState<any>(null);
  const [salesData, setSalesData] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<Product[]>([]);
  const [mostViewed, setMostViewed] = useState<Product[]>([]);
  const [ordersByStatus, setOrdersByStatus] = useState<any[]>([]);
  const [salesByCategory, setSalesByCategory] = useState<any[]>([]);
  const [hourlyData, setHourlyData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const [statsData, sales, topSold, viewed, statusData, categoryData, hourly] = await Promise.all([
        getAdminStats(),
        getSalesByDay(30),
        getMostSoldProducts(5),
        getMostViewedProducts(5),
        getOrdersByStatus(),
        getSalesByCategory(),
        getHourlyDistribution()
      ]);
      
      setStats(statsData);
      setSalesData(sales);
      setTopProducts(topSold);
      setMostViewed(viewed);
      setOrdersByStatus(statusData);
      setSalesByCategory(categoryData);
      setHourlyData(hourly);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-24 bg-gray-200 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const chartTabs = [
    { id: 'sales', label: 'Sales Trend', icon: TrendingUp },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'traffic', label: 'Traffic', icon: Activity },
  ];

  // Colors for charts
  const pieColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
  const categoryColors = ['#10B981', '#3B82F6', '#F59E0B', '#8B5CF6', '#EC4899'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">Analytics Dashboard</h2>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Real-time insights and performance metrics</p>
        </div>
        <button 
          onClick={loadAnalytics}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--brand-600)] text-white rounded-lg hover:bg-[var(--brand-700)] transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(stats?.totalRevenue || 0)}
          icon={DollarSign}
          trend={12}
          color="#10B981"
        />
        <StatCard
          title="Total Orders"
          value={formatNumber(stats?.totalOrders || 0)}
          icon={ShoppingCart}
          trend={8}
          color="#3B82F6"
        />
        <StatCard
          title="Total Users"
          value={formatNumber(stats?.totalUsers || 0)}
          icon={Users}
          trend={15}
          color="#8B5CF6"
        />
        <StatCard
          title="Active Products"
          value={formatNumber(stats?.totalProducts || 0)}
          icon={Package}
          trend={5}
          color="#F59E0B"
        />
      </div>

      {/* Chart Tabs */}
      <ChartTabs activeTab={activeTab} onChange={setActiveTab} tabs={chartTabs} />

      {/* Tab Content */}
      {activeTab === 'sales' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sales Trend - Line Chart */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-[var(--border-default)]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[var(--brand-500)]" />
                Revenue & Orders Trend
              </h3>
              <span className="text-sm text-[var(--text-muted)]">Last 30 Days</span>
            </div>
            <SalesLineChart data={salesData} />
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="p-3 bg-emerald-50 rounded-lg">
                <p className="text-sm text-emerald-600">Total Revenue</p>
                <p className="text-xl font-bold text-emerald-700">
                  {formatCurrency(salesData.reduce((sum, d) => sum + d.revenue, 0))}
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-600">Total Orders</p>
                <p className="text-xl font-bold text-blue-700">
                  {formatNumber(salesData.reduce((sum, d) => sum + d.orders, 0))}
                </p>
              </div>
            </div>
          </div>

          {/* Sales by Category - Donut Chart */}
          <div className="bg-white p-6 rounded-xl border border-[var(--border-default)]">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-[var(--brand-500)]" />
              Sales by Category
            </h3>
            <DonutChart 
              data={salesByCategory.slice(0, 5)} 
              colors={categoryColors}
            />
            <div className="mt-4 pt-4 border-t border-[var(--border-default)]">
              <p className="text-sm text-[var(--text-muted)]">
                Top category: <span className="font-medium text-[var(--text-primary)]">
                  {salesByCategory[0]?.name || 'N/A'}
                </span>
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'products' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Selling Products */}
          <div className="bg-white p-6 rounded-xl border border-[var(--border-default)]">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-500" />
              Top Selling Products
            </h3>
            <HorizontalBarChart 
              data={topProducts.map(p => ({ name: p.name.slice(0, 25), value: p.sold }))}
              labelKey="name"
              valueKey="value"
              color="#10B981"
            />
          </div>

          {/* Most Viewed Products */}
          <div className="bg-white p-6 rounded-xl border border-[var(--border-default)]">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5 text-violet-500" />
              Most Viewed Products
            </h3>
            <HorizontalBarChart 
              data={mostViewed.map(p => ({ name: p.name.slice(0, 25), value: p.views }))}
              labelKey="name"
              valueKey="value"
              color="#8B5CF6"
            />
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Order Status Distribution */}
          <div className="bg-white p-6 rounded-xl border border-[var(--border-default)]">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-blue-500" />
              Order Status Distribution
            </h3>
            <DonutChart 
              data={ordersByStatus} 
              colors={pieColors}
            />
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
              <div className="p-2 bg-blue-50 rounded">
                <span className="text-blue-600">Pending:</span>
                <span className="font-medium ml-1">{ordersByStatus.find(s => s.status === 'pending')?.value || 0}</span>
              </div>
              <div className="p-2 bg-emerald-50 rounded">
                <span className="text-emerald-600">Completed:</span>
                <span className="font-medium ml-1">{ordersByStatus.find(s => s.status === 'completed')?.value || 0}</span>
              </div>
            </div>
          </div>

          {/* Hourly Order Distribution */}
          <div className="bg-white p-6 rounded-xl border border-[var(--border-default)]">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-violet-500" />
              Peak Hours (24h)
            </h3>
            <HourlyAreaChart data={hourlyData} />
            <div className="mt-4 flex justify-between text-sm text-[var(--text-muted)]">
              <span>Peak: {hourlyData.length > 0 && formatNumber(Math.max(...hourlyData.map(h => h.orders)))} orders</span>
              <span>Avg: {hourlyData.length > 0 && formatNumber(Math.round(hourlyData.reduce((a, b) => a + b.orders, 0) / 24))}/hour</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'traffic' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Stats Cards */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-[var(--border-default)]">
            <h3 className="text-lg font-semibold mb-4">Traffic Overview</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-blue-600">Active Now</span>
                </div>
                <p className="text-3xl font-bold text-blue-700">{stats?.activeUsers || 0}</p>
                <p className="text-xs text-blue-500 mt-1">Users currently online</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <ShoppingCart className="w-5 h-5 text-amber-600" />
                  <span className="text-sm text-amber-600">Pending Orders</span>
                </div>
                <p className="text-3xl font-bold text-amber-700">{stats?.pendingOrders || 0}</p>
                <p className="text-xs text-amber-500 mt-1">Awaiting processing</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                  <span className="text-sm text-emerald-600">Conversion Rate</span>
                </div>
                <p className="text-3xl font-bold text-emerald-700">
                  {stats?.totalOrders && stats?.totalUsers 
                    ? ((stats.totalOrders / stats.totalUsers) * 100).toFixed(1) 
                    : 0}%
                </p>
                <p className="text-xs text-emerald-500 mt-1">Orders per user</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-violet-50 to-violet-100 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-5 h-5 text-violet-600" />
                  <span className="text-sm text-violet-600">Avg Order Value</span>
                </div>
                <p className="text-3xl font-bold text-violet-700">
                  {formatCurrency(stats?.totalOrders ? stats.totalRevenue / stats.totalOrders : 0)}
                </p>
                <p className="text-xs text-violet-500 mt-1">Per transaction</p>
              </div>
            </div>
          </div>

          {/* Category Performance */}
          <div className="bg-white p-6 rounded-xl border border-[var(--border-default)]">
            <h3 className="text-lg font-semibold mb-4">Category Revenue</h3>
            <div className="space-y-3">
              {salesByCategory.slice(0, 5).map((cat, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-[var(--bg-secondary)] rounded-lg">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: categoryColors[i % categoryColors.length] }}
                    />
                    <span className="text-sm font-medium">{cat.name}</span>
                  </div>
                  <span className="text-sm text-[var(--text-secondary)]">
                    {formatCurrency(cat.revenue)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAnalytics;
