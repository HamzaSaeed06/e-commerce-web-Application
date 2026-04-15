import type { Review, ReviewSummaryData } from '../types/review';

export const MOCK_REVIEWS: Review[] = [
  {
    id: '1',
    productId: 'p1',
    userId: 'u1',
    userName: 'Darrell Steward',
    userImage: 'https://i.pravatar.cc/150?u=u1',
    rating: 5,
    title: 'This is amazing product I have',
    comment: 'I really like the fit and the material. It feels very premium and high quality. Would definitely recommend to others.',
    createdAt: 'June 20, 2023',
    helpfulCount: 52,
    unhelpfulCount: 2,
    topics: ['Product Quality', 'Product Price'],
    productSpecs: { color: 'Royal Brown', size: '10' }
  },
  {
    id: '2',
    productId: 'p1',
    userId: 'u2',
    userName: 'Kathryn Murphy',
    userImage: 'https://i.pravatar.cc/150?u=u2',
    rating: 5,
    title: 'Excellent quality and service',
    comment: 'The delivery was super fast and the packaging was very secure. The item itself exceeded my expectations.',
    createdAt: 'June 18, 2023',
    helpfulCount: 34,
    unhelpfulCount: 1,
    topics: ['Comfort'],
    productSpecs: { color: 'Khaki', size: '8' }
  },
  {
    id: '3',
    productId: 'p2',
    userId: 'u3',
    userName: 'Arlene McCoy',
    userImage: 'https://i.pravatar.cc/150?u=u3',
    rating: 4,
    title: 'Great value for money',
    comment: 'Very happy with this purchase. It looks great and feels durable. Only minor issue is the size runs a bit small.',
    createdAt: 'June 15, 2023',
    helpfulCount: 28,
    unhelpfulCount: 3,
    topics: ['Product Price'],
    productSpecs: { color: 'Black', size: '9' }
  },
  {
    id: '4',
    productId: 'p3',
    userId: 'u4',
    userName: 'Theresa Webb',
    userImage: 'https://i.pravatar.cc/150?u=u4',
    rating: 5,
    title: 'Perfect fit and style',
    comment: 'Exactly what I was looking for. The style is very modern and it fits perfectly.',
    createdAt: 'June 10, 2023',
    helpfulCount: 19,
    unhelpfulCount: 0,
    topics: ['Model with Description'],
    productSpecs: { color: 'Navy', size: '12' }
  }
];

export const MOCK_SUMMARY: ReviewSummaryData = {
  averageRating: 4.8,
  totalReviews: 1284,
  distribution: [
    { rating: 5, count: 884, percentage: 70 },
    { rating: 4, count: 250, percentage: 20 },
    { rating: 3, count: 100, percentage: 8 },
    { rating: 2, count: 30, percentage: 1.5 },
    { rating: 1, count: 20, percentage: 0.5 }
  ]
};

export const AVAILABLE_TOPICS = [
  'Product Quality',
  'Comfort',
  'Product Price',
  'Appearance',
  'Model with Description'
];
