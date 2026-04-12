export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: 'user' | 'admin' | 'manager';
  phone: string;
  createdAt: Date;
  lastSeen: Date;
  isOnline: boolean;
  loyaltyPoints: number;
  totalOrders: number;
  totalSpent: number;
  preferredCategories: string[];
  addresses: Address[];
  fcmToken?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number;
  images: string[];
  videoUrl?: string;
  category: string;
  subcategory: string;
  tags: string[];
  stock: number;
  lowStockThreshold: number;
  sold: number;
  views: number;
  rating: number;
  reviewCount: number;
  isActive: boolean;
  isFeatured: boolean;
  isFlashSale: boolean;
  flashSalePrice?: number;
  flashSaleEndsAt?: Date;
  bundleIds: string[];
  weight?: number;
  dimensions?: { l: number; w: number; h: number };
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  icon: string;
  parentId: string | null;
  order: number;
  isActive: boolean;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  qty: number;
  stock: number;
}

export interface Order {
  id: string;
  userId: string;
  guestEmail: string | null;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  paymentMethod: 'cod' | 'card' | 'wallet';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  address: Address;
  timeline: StatusUpdate[];
  invoiceUrl?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  qty: number;
}

export interface Address {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userPhoto: string;
  rating: number;
  title: string;
  body: string;
  images: string[];
  isVerifiedPurchase: boolean;
  helpful: number;
  reported: boolean;
  createdAt: Date;
}

export interface StatusUpdate {
  status: string;
  timestamp: Date;
  message: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderValue: number;
  maxDiscount?: number;
  usageLimit: number;
  usedCount: number;
  usedBy: string[];
  expiresAt: Date;
  isActive: boolean;
  categories: string[];
}

export interface Notification {
  id: string;
  userId: string;
  type: 'order' | 'promo' | 'abandoned_cart' | 'restock' | 'flash_sale' | 'loyalty';
  title: string;
  body: string;
  imageUrl?: string;
  actionUrl?: string;
  isRead: boolean;
  createdAt: Date;
}

export interface Chat {
  id: string;
  userId: string | null;
  guestId: string;
  userName: string;
  status: 'open' | 'closed' | 'pending';
  lastMessage: string;
  lastMessageAt: Date;
  unreadAdmin: number;
  unreadUser: number;
  createdAt: Date;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderRole: 'user' | 'admin';
  text: string;
  imageUrl?: string;
  isRead: boolean;
  timestamp: Date;
}

export interface LoyaltyTransaction {
  id: string;
  userId: string;
  type: 'earn' | 'redeem';
  points: number;
  reason: string;
  orderId?: string;
  createdAt: Date;
}

export interface SearchLog {
  id: string;
  query: string;
  userId: string | null;
  guestId: string;
  resultsCount: number;
  clickedProductId?: string;
  timestamp: Date;
}

export interface UserActivity {
  id: string;
  userId: string | null;
  guestId: string;
  type: 'view' | 'click' | 'cart_add' | 'cart_remove' | 'purchase' | 'wishlist' | 'search' | 'review';
  productId?: string;
  categoryId?: string;
  metadata: Record<string, unknown>;
  sessionId: string;
  timestamp: Date;
}

export interface OnlineUser {
  userId: string | null;
  guestId: string;
  isGuest: boolean;
  lastSeen: Date;
  currentPage: string;
  device: string;
}

export interface ProductQA {
  id: string;
  productId: string;
  question: string;
  askedBy: string;
  askedByName: string;
  answer?: string;
  answeredBy?: string;
  isAdminAnswer: boolean;
  createdAt: Date;
}

export interface ReturnRequest {
  id: string;
  orderId: string;
  userId: string;
  items: ReturnItem[];
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'refunded';
  adminNote?: string;
  createdAt: Date;
}

export interface ReturnItem {
  productId: string;
  name: string;
  qty: number;
  reason: string;
}

export interface Bundle {
  id: string;
  name: string;
  productIds: string[];
  bundlePrice: number;
  discount: number;
  isActive: boolean;
}
