export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userImage?: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
  helpfulCount: number;
  unhelpfulCount: number;
  topics: string[];
  productSpecs?: {
    color?: string;
    size?: string;
    [key: string]: string | undefined;
  };
  hasImage?: boolean;
}

export interface RatingDistribution {
  rating: number; // 1-5
  count: number;
  percentage: number;
}

export interface ReviewSummaryData {
  averageRating: number;
  totalReviews: number;
  distribution: RatingDistribution[];
}

export interface ReviewFiltersState {
  ratings: number[];
  topics: string[];
  hasDescription: boolean;
  hasImage: boolean;
}

export type SortOption = 'newest' | 'helpful' | 'highest-rating' | 'lowest-rating';
