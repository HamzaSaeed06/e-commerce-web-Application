import React from 'react';
import { ChevronDown, ChevronUp, Check, Star } from 'lucide-react';
import type { ReviewFiltersState } from '../../../types/review';

interface ReviewFiltersProps {
  filters: ReviewFiltersState;
  onFilterChange: (filters: ReviewFiltersState) => void;
  availableTopics: string[];
}

const ReviewFilters: React.FC<ReviewFiltersProps> = ({ filters, onFilterChange, availableTopics }) => {
  const [expanded, setExpanded] = React.useState({
    rating: true,
    topics: true,
    options: true
  });

  const toggleRating = (rating: number) => {
    const newRatings = filters.ratings.includes(rating)
      ? filters.ratings.filter((r) => r !== rating)
      : [...filters.ratings, rating];
    onFilterChange({ ...filters, ratings: newRatings });
  };

  const toggleTopic = (topic: string) => {
    const newTopics = filters.topics.includes(topic)
      ? filters.topics.filter((t) => t !== topic)
      : [...filters.topics, topic];
    onFilterChange({ ...filters, topics: newTopics });
  };

  return (
    <div className="border-2 border-dashed border-(--neutral-200) rounded-2xl p-6 bg-white/50 animate-fade-up">
      <div className="space-y-6">
        <h3 className="text-[20px] font-extrabold text-black tracking-tight mb-6">Reviews Filter</h3>
        
        <div className="border-t-2 border-dashed border-(--neutral-100) pt-6">
          {/* Rating Filter */}
          <div className="space-y-6">
            <button 
              onClick={() => setExpanded(prev => ({ ...prev, rating: !prev.rating }))}
              className="flex items-center justify-between w-full group"
            >
              <h4 className="text-[16px] font-extrabold text-black tracking-tight">Rating</h4>
              <ChevronUp className={`w-4 h-4 text-black transition-transform duration-300 ${!expanded.rating ? 'rotate-180' : ''}`} />
            </button>
            
            {expanded.rating && (
              <div className="space-y-4 animate-fade-up">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <label key={rating} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-5 h-5 rounded-none border-2 transition-all flex items-center justify-center ${
                      filters.ratings.includes(rating)
                        ? 'border-black bg-black'
                        : 'border-(--neutral-200) group-hover:border-black'
                    }`}>
                      {filters.ratings.includes(rating) && <Check className="w-3.5 h-3.5 text-white" strokeWidth={4} />}
                    </div>
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={filters.ratings.includes(rating)}
                      onChange={() => toggleRating(rating)}
                    />
                    <div className="flex items-center gap-1.5">
                      <Star className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
                      <span className={`text-[15px] font-bold transition-colors ${
                        filters.ratings.includes(rating) ? 'text-black' : 'text-(--neutral-500)'
                      }`}>
                        {rating}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="border-t-2 border-dashed border-(--neutral-100) pt-6">
          {/* Topics Filter */}
          <div className="space-y-6">
            <button 
              onClick={() => setExpanded(prev => ({ ...prev, topics: !prev.topics }))}
              className="flex items-center justify-between w-full group"
            >
              <h4 className="text-[16px] font-extrabold text-black tracking-tight">Review Topics</h4>
              <ChevronUp className={`w-4 h-4 text-black transition-transform duration-300 ${!expanded.topics ? 'rotate-180' : ''}`} />
            </button>
            
            {expanded.topics && (
              <div className="space-y-4 animate-fade-up">
                {availableTopics.map((topic) => (
                  <label key={topic} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-5 h-5 rounded-none border-2 transition-all flex items-center justify-center ${
                      filters.topics.includes(topic)
                        ? 'border-black bg-black'
                        : 'border-(--neutral-200) group-hover:border-black'
                    }`}>
                      {filters.topics.includes(topic) && <Check className="w-3.5 h-3.5 text-white" strokeWidth={4} />}
                    </div>
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={filters.topics.includes(topic)}
                      onChange={() => toggleTopic(topic)}
                    />
                    <span className={`text-[15px] font-bold transition-colors ${
                      filters.topics.includes(topic) ? 'text-black' : 'text-(--neutral-500)'
                    }`}>
                      {topic}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="border-t-2 border-dashed border-(--neutral-100) pt-6">
          {/* Extra Options */}
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className={`w-5 h-5 rounded-none border-2 transition-all flex items-center justify-center ${
              filters.hasDescription
                ? 'border-black bg-black'
                : 'border-(--neutral-200) group-hover:border-black'
            }`}>
              {filters.hasDescription && <Check className="w-3.5 h-3.5 text-white" strokeWidth={4} />}
            </div>
            <input
              type="checkbox"
              className="hidden"
              checked={filters.hasDescription}
              onChange={() => onFilterChange({ ...filters, hasDescription: !filters.hasDescription })}
            />
            <span className={`text-[15px] font-bold transition-colors ${
              filters.hasDescription ? 'text-black' : 'text-(--neutral-500)'
            }`}>
              With Description
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default ReviewFilters;
