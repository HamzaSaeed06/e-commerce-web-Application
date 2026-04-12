import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  ChartPieSlice,
  Package,
  ClipboardText,
  Users,
  ChartLineUp,
} from 'phosphor-react';

const adminNavItems = [
  { path: '/admin', icon: ChartPieSlice, label: 'Dashboard' },
  { path: '/admin/products', icon: Package, label: 'Products' },
  { path: '/admin/orders', icon: ClipboardText, label: 'Orders' },
  { path: '/admin/users', icon: Users, label: 'Users' },
  { path: '/admin/analytics', icon: ChartLineUp, label: 'Analytics' },
];

export const AdminLayout = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar */}
      <aside className="w-[220px] bg-slate-900 fixed left-0 top-0 h-full">
        <div className="px-5 py-4">
          <Link to="/" className="text-[18px] font-display font-semibold text-white">
            LuxeMarket Admin
          </Link>
        </div>
        <nav className="px-3 space-y-0.5 mt-4">
          {adminNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] transition-colors ${
                  isActive
                    ? 'text-white bg-slate-800 border-l-2 border-orange-500'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon weight="duotone" size={18} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-[220px] p-6 bg-slate-50 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};
