import { useState, useEffect } from 'react';
import { Package, Search, Truck, CheckCircle, XCircle } from 'lucide-react';
import { getAllOrders, updateOrderStatus } from '../../services/orderService';
import { formatCurrency, formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';
import type { Order } from '../../types';

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await getAllOrders();
      setOrders(data);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: Order['status']) => {
    try {
      await updateOrderStatus(orderId, newStatus, 'admin');
      toast.success(`Order status updated to ${newStatus}`);
      loadOrders();
    } catch (error) {
      toast.error('Failed to update status');
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

  const filteredOrders = orders.filter(order => 
    order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.userId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-display font-semibold">Orders</h2>
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-[var(--border-default)] rounded-lg focus:ring-2 focus:ring-[var(--brand-200)] focus:border-[var(--brand-500)] outline-none"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[var(--border-default)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[var(--bg-secondary)]">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-[var(--text-secondary)]">Order ID</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-[var(--text-secondary)]">Date</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-[var(--text-secondary)]">Total</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-[var(--text-secondary)]">Status</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-[var(--text-secondary)]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-[var(--text-muted)]">Loading...</td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-[var(--text-muted)]">No orders found</td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="border-t border-[var(--border-default)]">
                    <td className="px-4 py-3 font-medium">#{order.id.slice(-8)}</td>
                    <td className="px-4 py-3 text-sm">{formatDate(order.createdAt)}</td>
                    <td className="px-4 py-3 text-sm font-medium">{formatCurrency(order.total)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        {order.status === 'pending' && (
                          <button
                            onClick={() => handleStatusUpdate(order.id, 'confirmed')}
                            className="p-2 text-[var(--brand-500)] hover:bg-[var(--brand-50)] rounded transition-colors"
                            title="Confirm Order"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        {order.status === 'confirmed' && (
                          <button
                            onClick={() => handleStatusUpdate(order.id, 'shipped')}
                            className="p-2 text-blue-500 hover:bg-blue-50 rounded transition-colors"
                            title="Mark Shipped"
                          >
                            <Truck className="w-4 h-4" />
                          </button>
                        )}
                        {order.status === 'shipped' && (
                          <button
                            onClick={() => handleStatusUpdate(order.id, 'delivered')}
                            className="p-2 text-green-500 hover:bg-green-50 rounded transition-colors"
                            title="Mark Delivered"
                          >
                            <Package className="w-4 h-4" />
                          </button>
                        )}
                        {(order.status === 'pending' || order.status === 'confirmed') && (
                          <button
                            onClick={() => handleStatusUpdate(order.id, 'cancelled')}
                            className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
                            title="Cancel Order"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
