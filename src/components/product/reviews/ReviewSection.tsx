import React, { useState, useMemo } from 'react';
import { Filter, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import ReviewSummary from './ReviewSummary';
import ReviewFilters from './ReviewFilters';
import ReviewCard from './ReviewCard';
import { MOCK_REVIEWS, AVAILABLE_TOPICS } from '../../../utils/mockReviews';
import type { ReviewFiltersState, SortOption, RatingDistribution, ReviewSummaryData } from '../../../types/review';

interface ReviewSectionProps {
  productId: string;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ productId }) => {
  const [filters, setFilters] = useState<ReviewFiltersState>({
    ratings: [],
    topics: [],
    hasDescription: false,
    hasImage: false,
  });
  const [sort, setSort] = useState<SortOption>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const productReviews = useMemo(() => {
    // For prototype, if no reviews found for specific ID, show all reviews to ensure UI isn't empty
    const specific = MOCK_REVIEWS.filter(r => r.productId === productId);
    return specific.length > 0 ? specific : MOCK_REVIEWS;
  }, [productId]);

  const summary = useMemo<ReviewSummaryData>(() => {
    if (productReviews.length === 0) return { averageRating: 0, totalReviews: 0, distribution: [] };
    
    const total = productReviews.length;
    const sum = productReviews.reduce((acc, r) => acc + r.rating, 0);
    const avg = sum / total;
    
    const dist: RatingDistribution[] = [5, 4, 3, 2, 1].map(r => {
      const count = productReviews.filter(rev => rev.rating === r).length;
      return {
        rating: r,
        count,
        percentage: (count / total) * 100
      };
    });

    return { averageRating: avg, totalReviews: total, distribution: dist };
  }, [productReviews]);

  const filteredReviews = useMemo(() => {
    return productReviews.filter((review) => {
      if (filters.ratings.length > 0 && !filters.ratings.includes(review.rating)) return false;
      if (filters.topics.length > 0 && !review.topics.some(t => filters.topics.includes(t))) return false;
      if (filters.hasDescription && !review.comment) return false;
      if (filters.hasImage && !review.hasImage) return false;
      return true;
    }).sort((a, b) => {
      if (sort === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sort === 'helpful') return b.helpfulCount - a.helpfulCount;
      if (sort === 'highest-rating') return b.rating - a.rating;
      if (sort === 'lowest-rating') return a.rating - b.rating;
      return 0;
    });
  }, [productReviews, filters, sort]);

  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);
  const paginatedReviews = filteredReviews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <section className="mt-20">
      <div className="mb-10">
        <h2 className="text-[32px] font-extrabold text-black tracking-tight">Product Reviews</h2>
      </div>

      <ReviewSummary 
        averageRating={summary.averageRating}
        totalReviews={summary.totalReviews}
        distribution={summary.distribution}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1 space-y-8 sticky top-24">
          <div className="flex items-center gap-2 text-[var(--text-primary)]">
            <Filter className="w-5 h-5" />
            <h3 className="font-bold uppercase tracking-widest text-sm">Filters</h3>
          </div>
          <ReviewFilters 
            filters={filters} 
            onFilterChange={(newFilters) => {
              setFilters(newFilters);
              setCurrentPage(1);
            }} 
            availableTopics={AVAILABLE_TOPICS}
          />
        </div>

        {/* Reviews Main Area */}
        <div className="lg:col-span-3 space-y-8">
          <div className="flex items-center justify-between pb-4 border-b">
            <div className="flex gap-4">
              {['All Reviews', 'With Images & Videos', 'With Descriptions'].map((tab) => {
                const isActive = 
                  (tab === 'All Reviews' && !filters.hasDescription && !filters.hasImage) || 
                  (tab === 'With Descriptions' && filters.hasDescription) ||
                  (tab === 'With Images & Videos' && filters.hasImage);

                return (
                  <button 
                    key={tab}
                    className={`px-5 py-2 rounded-[4px] text-[12px] font-extrabold transition-all border ${
                      isActive
                        ? 'bg-black text-white border-black shadow-sm'
                        : 'text-(--neutral-500) border-(--neutral-200) hover:border-black hover:text-black'
                    }`}
                    onClick={() => {
                      if (tab === 'With Descriptions') setFilters({ ...filters, hasDescription: true, hasImage: false });
                      if (tab === 'With Images & Videos') setFilters({ ...filters, hasDescription: false, hasImage: true });
                      if (tab === 'All Reviews') setFilters({ ...filters, hasDescription: false, hasImage: false });
                      setCurrentPage(1);
                    }}
                  >
                    {tab.toUpperCase()}
                  </button>
                );
              })}
            </div>

            <div className="relative group">
              <button className="flex items-center gap-2 text-[13px] font-extrabold text-black hover:text-(--neutral-600) transition-colors">
                SORT BY: <span className="text-black uppercase">{sort.replace('-', ' ')}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-[4px] shadow-2xl border border-(--neutral-200) p-1 hidden group-hover:block z-20">
                {(['newest', 'helpful', 'highest-rating', 'lowest-rating'] as SortOption[]).map((option) => (
                  <button
                    key={option}
                    onClick={() => setSort(option)}
                    className="w-full text-left px-4 py-2.5 text-[12px] font-bold text-(--neutral-600) hover:text-black hover:bg-(--neutral-50) rounded-[2px] capitalize transition-colors"
                  >
                    {option.replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="min-h-[400px]">
            {paginatedReviews.length > 0 ? (
              <div className="space-y-6">
                {paginatedReviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-(--neutral-400) space-y-4">
                <Filter className="w-12 h-12 opacity-20" />
                <p className="font-extrabold text-[16px] uppercase tracking-tight">No reviews match your filters</p>
                <button 
                  onClick={() => setFilters({ ratings: [], topics: [], hasDescription: false, hasImage: false })}
                  className="text-black hover:underline font-extrabold text-[13px] uppercase tracking-widest"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-12">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="w-11 h-11 rounded-[4px] border border-(--neutral-200) hover:border-black flex items-center justify-center disabled:opacity-30 transition-all"
              >
                <ChevronLeft className="w-5 h-5 text-black" />
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-11 h-11 rounded-[4px] text-[13px] font-extrabold transition-all ${
                    currentPage === i + 1
                      ? 'bg-black text-white shadow-md'
                      : 'border border-(--neutral-200) hover:border-black text-black'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="w-11 h-11 rounded-[4px] border border-(--neutral-200) hover:border-black flex items-center justify-center disabled:opacity-30 transition-all"
              >
                <ChevronRight className="w-5 h-5 text-black" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ReviewSection;
