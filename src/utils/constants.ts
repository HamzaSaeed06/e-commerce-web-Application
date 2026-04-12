export const APP_NAME = 'LuxeMarket';
export const APP_TAGLINE = 'Premium E-Commerce Experience';

export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  RETURNED: 'returned',
} as const;

export const PAYMENT_METHODS = {
  COD: 'cod',
  CARD: 'card',
  WALLET: 'wallet',
} as const;

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  REFUNDED: 'refunded',
} as const;

export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  MANAGER: 'manager',
} as const;

export const NOTIFICATION_TYPES = {
  ORDER: 'order',
  PROMO: 'promo',
  ABANDONED_CART: 'abandoned_cart',
  RESTOCK: 'restock',
  FLASH_SALE: 'flash_sale',
  LOYALTY: 'loyalty',
} as const;

export const CHAT_STATUS = {
  OPEN: 'open',
  CLOSED: 'closed',
  PENDING: 'pending',
} as const;

export const LOYALTY_TIERS = {
  BRONZE: { min: 0, max: 500, name: 'Bronze', multiplier: 1 },
  SILVER: { min: 500, max: 2000, name: 'Silver', multiplier: 1.25 },
  GOLD: { min: 2000, max: Infinity, name: 'Gold', multiplier: 1.5 },
} as const;

export const LOYALTY_EVENTS = {
  SIGNUP: 50,
  REVIEW: 20,
  REFERRAL: 100,
  PURCHASE_PER_100: 1,
} as const;

export const CURRENCY = {
  USD: { code: 'USD', symbol: '$', rate: 1 },
  EUR: { code: 'EUR', symbol: '€', rate: 0.85 },
  GBP: { code: 'GBP', symbol: '£', rate: 0.73 },
} as const;

export const SHIPPING_RATES = {
  STANDARD: { name: 'Standard Shipping', price: 5.99, days: '5-7' },
  EXPRESS: { name: 'Express Shipping', price: 14.99, days: '2-3' },
  FREE_THRESHOLD: 50,
} as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 48,
} as const;

export const IMAGE_SIZES = {
  THUMBNAIL: { width: 300, height: 300 },
  MEDIUM: { width: 600, height: 600 },
  LARGE: { width: 1200, height: 1200 },
} as const;

export const FILE_LIMITS = {
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_IMAGES_PER_PRODUCT: 8,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
} as const;

export const CACHE_KEYS = {
  CART: 'cart-storage',
  AUTH: 'auth-storage',
  GUEST_ID: 'guestId',
  SESSION_ID: 'sessionId',
  RECENTLY_VIEWED: 'recently-viewed',
} as const;

export const DEBOUNCE_DELAYS = {
  SEARCH: 300,
  CART_SYNC: 1000,
  SCROLL: 100,
} as const;

export const TOAST_DURATION = {
  SHORT: 2000,
  DEFAULT: 3000,
  LONG: 5000,
} as const;

export const SOCIAL_LINKS = {
  FACEBOOK: 'https://facebook.com/luxemarket',
  INSTAGRAM: 'https://instagram.com/luxemarket',
  TWITTER: 'https://twitter.com/luxemarket',
  LINKEDIN: 'https://linkedin.com/company/luxemarket',
} as const;
