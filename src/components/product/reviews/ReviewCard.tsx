import React, { useState } from 'react';
import { Star, ThumbsUp, ThumbsDown, MoreHorizontal } from 'lucide-react';
import type { Review } from '../../../types/review';

interface ReviewCardProps {
  review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  const [helpfulCount, setHelpfulCount] = useState(review.helpfulCount);
  const [voted, setVoted] = useState<'helpful' | 'unhelpful' | null>(null);

  const handleVote = (type: 'helpful' | 'unhelpful') => {
    if (voted === type) {
      setVoted(null);
      if (type === 'helpful') setHelpfulCount(prev => prev - 1);
    } else {
      if (voted === 'helpful') setHelpfulCount(prev => prev - 1);
      if (type === 'helpful') setHelpfulCount(prev => prev + 1);
      setVoted(type);
    }
  };

  return (
    <div className="py-8 border-b border-(--neutral-200) last:border-0">
      <div className="space-y-4">
        {/* Stars - Top Left */}
        <div className="flex items-center gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < review.rating
                  ? 'fill-[#F59E0B] text-[#F59E0B]'
                  : 'text-(--neutral-200)'
              }`}
            />
          ))}
        </div>

        {/* Title & Date */}
        <div className="space-y-1">
          <h5 className="text-[16px] font-bold text-black tracking-tight leading-5">
            {review.title}
          </h5>
          <p className="text-[13px] text-(--neutral-400) font-medium">
            {review.createdAt}
          </p>
        </div>

        {/* Comment Body */}
        <div className="py-2">
          <p className="text-[15px] text-black/80 leading-relaxed max-w-3xl">
            {review.comment}
          </p>
        </div>

        {/* Footer Row - User & Actions */}
        <div className="flex items-center justify-between pt-6">
          <div className="flex items-center gap-3">
            {review.userPhoto ? (
              <img 
                src={review.userPhoto} 
                alt={review.userName} 
                className="w-8 h-8 rounded-full object-cover border border-(--neutral-100)"
              />
            ) : (
              <div className="w-8 h-8 bg-black/5 flex items-center justify-center text-black font-bold text-[11px] rounded-full uppercase">
                {review.userName.charAt(0)}
              </div>
            )}
            <span className="text-[14px] font-bold text-black tracking-tight">
              {review.userName}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleVote('helpful')}
              className={`h-10 px-4 border flex items-center gap-2.5 transition-all text-[13px] font-medium ${
                voted === 'helpful' 
                  ? 'border-black bg-black text-white' 
                  : 'border-(--neutral-200) text-black hover:bg-(--neutral-50)'
              }`}
            >
              <ThumbsUp size={16} weight={voted === 'helpful' ? 'fill' : 'regular'} />
              <span>{helpfulCount}</span>
            </button>
            <button
              onClick={() => handleVote('unhelpful')}
              className={`h-10 w-12 border flex items-center justify-center transition-all ${
                voted === 'unhelpful' 
                  ? 'border-black bg-black text-white' 
                  : 'border-(--neutral-200) text-black hover:bg-(--neutral-50)'
              }`}
            >
              <ThumbsDown size={16} weight={voted === 'unhelpful' ? 'fill' : 'regular'} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
