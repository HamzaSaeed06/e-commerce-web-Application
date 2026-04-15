import React from 'react';
import { Star } from 'lucide-react';
import type { RatingDistribution } from '../../../types/review';

interface ReviewSummaryProps {
  averageRating: number;
  totalReviews: number;
  distribution: RatingDistribution[];
}

const ReviewSummary: React.FC<ReviewSummaryProps> = ({ averageRating, totalReviews, distribution }) => {
  return (
    <div className="border-2 border-dashed border-(--neutral-200) rounded-2xl p-8 md:p-10 mb-12 flex flex-col md:flex-row items-center gap-12 bg-white/50 animate-fade-up">
      {/* Left Column: Average Rating Circle */}
      <div className="flex items-center gap-6 shrink-0">
        <div className="relative w-28 h-28 flex items-center justify-center">
          {/* Circular Progress SVG */}
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              cx="56"
              cy="56"
              r="52"
              fill="none"
              stroke="#F3F4F6"
              strokeWidth="6"
            />
            <circle
              cx="56"
              cy="56"
              r="52"
              fill="none"
              stroke="#F59E0B"
              strokeWidth="6"
              strokeDasharray={326.7}
              strokeDashoffset={326.7 * (1 - averageRating / 5)}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <span className="text-3xl font-extrabold text-black tabular-nums">
            {averageRating.toFixed(1)}
          </span>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < Math.floor(averageRating)
                    ? 'fill-[#F59E0B] text-[#F59E0B]'
                    : 'text-(--neutral-200)'
                }`}
              />
            ))}
          </div>
          <p className="text-[14px] text-(--neutral-400) font-medium">
            from {totalReviews.toLocaleString()} reviews
          </p>
        </div>
      </div>

      {/* Right Column: Distribution Bars */}
      <div className="flex-1 w-full space-y-3">
        {distribution.map((item) => (
          <div key={item.rating} className="flex items-center gap-5 group">
            <div className="flex items-center gap-1.5 w-12 shrink-0">
              <span className="text-[14px] font-bold text-black">{item.rating.toFixed(1)}</span>
              <Star className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
            </div>
            <div className="flex-1 h-3 bg-(--neutral-100) rounded-full overflow-hidden">
              <div 
                className="h-full bg-black transition-all duration-1000 ease-out"
                style={{ width: `${item.percentage}%` }}
              />
            </div>
            <span className="text-[14px] font-bold text-black w-14 text-right tabular-nums">
              {item.count.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewSummary;
