import { db } from './firebase';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import type { Product } from '../types';

export interface AdminStats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  activeUsers: number;
  pendingOrders: number;
}

export const getAdminStats = async (): Promise<AdminStats> => {
  try {
    const [usersSnap, ordersSnap, productsSnap] = await Promise.all([
      getDocs(collection(db, 'users')),
      getDocs(collection(db, 'orders')),
      getDocs(query(collection(db, 'products'), where('isActive', '==', true))),
    ]);
    
    const orders = ordersSnap.docs.map(d => d.data());
    const totalRevenue = orders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.total, 0);
    
    const onlineSnap = await getDocs(collection(db, 'onlineUsers'));
    
    return {
      totalUsers: usersSnap.size,
      totalOrders: ordersSnap.size,
      totalRevenue,
      totalProducts: productsSnap.size,
      activeUsers: onlineSnap.size,
      pendingOrders: orders.filter(o => o.status === 'pending').length,
    };
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    throw error;
  }
};

export const getMostViewedProducts = async (n = 10): Promise<Product[]> => {
  try {
    const q = query(
      collection(db, 'products'),
      orderBy('views', 'desc'),
      limit(n)
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Product));
  } catch (error) {
    console.error('Error fetching most viewed products:', error);
    return [];
  }
};

export const getMostSoldProducts = async (n = 10): Promise<Product[]> => {
  try {
    const q = query(
      collection(db, 'products'),
      orderBy('sold', 'desc'),
      limit(n)
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Product));
  } catch (error) {
    console.error('Error fetching most sold products:', error);
    return [];
  }
};

export const getRecentOrders = async (n = 10) => {
  try {
    const q = query(
      collection(db, 'orders'),
      orderBy('createdAt', 'desc'),
      limit(n)
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error('Error fetching recent orders:', error);
    return [];
  }
};

export const getSalesByDay = async (days = 30) => {
  try {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    // Simple query without composite index - client-side filtering
    const q = query(
      collection(db, 'orders'),
      orderBy('createdAt', 'desc')
    );
    const snap = await getDocs(q);
    
    const salesByDay: Record<string, { date: string; revenue: number; orders: number }> = {};
    
    snap.docs.forEach(d => {
      const order = d.data();
      const orderDate = order.createdAt?.toDate ? order.createdAt.toDate() : new Date(order.createdAt);
      
      // Skip if older than 'days' or cancelled
      if (orderDate < since) return;
      if (order.status === 'cancelled') return;
      
      const date = orderDate.toISOString().split('T')[0];
      
      if (!salesByDay[date]) {
        salesByDay[date] = { date, revenue: 0, orders: 0 };
      }
      salesByDay[date].revenue += order.total || 0;
      salesByDay[date].orders += 1;
    });
    
    // Sort by date ascending
    return Object.values(salesByDay).sort((a, b) => a.date.localeCompare(b.date));
  } catch (error) {
    console.error('Error fetching sales by day:', error);
    return [];
  }
};

// Get orders by status for pie chart
export const getOrdersByStatus = async () => {
  try {
    const q = query(collection(db, 'orders'));
    const snap = await getDocs(q);
    
    const statusCount: Record<string, number> = {};
    snap.docs.forEach(d => {
      const status = d.data().status || 'unknown';
      statusCount[status] = (statusCount[status] || 0) + 1;
    });
    
    return Object.entries(statusCount).map(([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: count,
      status
    }));
  } catch (error) {
    console.error('Error fetching orders by status:', error);
    return [];
  }
};

// Get sales by category for pie chart
export const getSalesByCategory = async () => {
  try {
    const q = query(collection(db, 'orders'), where('status', '!=', 'cancelled'));
    const snap = await getDocs(q);
    
    const categorySales: Record<string, { revenue: number; orders: number }> = {};
    
    snap.docs.forEach(d => {
      const order = d.data();
      order.items?.forEach((item: any) => {
        const cat = item.category || 'Uncategorized';
        if (!categorySales[cat]) {
          categorySales[cat] = { revenue: 0, orders: 0 };
        }
        categorySales[cat].revenue += (item.price * item.quantity);
        categorySales[cat].orders += item.quantity;
      });
    });
    
    return Object.entries(categorySales)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.revenue - a.revenue);
  } catch (error) {
    console.error('Error fetching sales by category:', error);
    return [];
  }
};

// Get hourly order distribution
export const getHourlyDistribution = async () => {
  try {
    const q = query(collection(db, 'orders'));
    const snap = await getDocs(q);
    
    const hours = Array(24).fill(0).map((_, i) => ({ hour: i, orders: 0 }));
    
    snap.docs.forEach(d => {
      const order = d.data();
      const hour = order.createdAt?.toDate?.() 
        ? order.createdAt.toDate().getHours() 
        : new Date(order.createdAt).getHours();
      hours[hour].orders += 1;
    });
    
    return hours;
  } catch (error) {
    console.error('Error fetching hourly distribution:', error);
    return [];
  }
};
