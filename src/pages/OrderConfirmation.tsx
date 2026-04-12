import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import { getOrderById } from '../services/orderService';
import { formatCurrency, formatDate } from '../utils/formatters';
import type { Order } from '../types';

const OrderConfirmation = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      getOrderById(orderId).then((data) => {
        setOrder(data);
        setLoading(false);
      });
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--brand-500)]" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Order not found</h1>
          <Link to="/" className="mt-4 text-[var(--brand-500)] hover:underline">
            Return to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-[var(--bg-secondary)]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl border border-[var(--border-default)] p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-display font-bold text-[var(--text-primary)] mb-2">
            Order Confirmed!
          </h1>
          <p className="text-[var(--text-secondary)] mb-6">
            Thank you for your purchase. We have sent a confirmation email to you.
          </p>

          <div className="bg-[var(--bg-secondary)] rounded-xl p-6 text-left mb-6">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-[var(--text-muted)]">Order Number</p>
                <p className="font-medium text-[var(--text-primary)]">#{order.id.slice(-8)}</p>
              </div>
              <div>
                <p className="text-sm text-[var(--text-muted)]">Order Date</p>
                <p className="font-medium text-[var(--text-primary)]">
                  {formatDate(order.createdAt)}
                </p>
              </div>
              <div>
                <p className="text-sm text-[var(--text-muted)]">Payment Method</p>
                <p className="font-medium text-[var(--text-primary)] uppercase">
                  {order.paymentMethod}
                </p>
              </div>
              <div>
                <p className="text-sm text-[var(--text-muted)]">Order Total</p>
                <p className="font-medium text-[var(--brand-500)]">
                  {formatCurrency(order.total)}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/dashboard/orders"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[var(--brand-500)] text-white font-medium rounded-lg hover:bg-[var(--brand-600)] transition-colors"
            >
              <Package className="w-5 h-5" />
              Track Order
            </Link>
            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-[var(--border-default)] text-[var(--text-primary)] font-medium rounded-lg hover:bg-[var(--bg-secondary)] transition-colors"
            >
              Continue Shopping <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
