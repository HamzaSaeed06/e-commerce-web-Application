export const SkeletonCard = () => {
  return (
    <div className="bg-white rounded-xl border border-[var(--border-default)] overflow-hidden">
      {/* Image Skeleton */}
      <div className="aspect-square bg-[var(--neutral-200)] animate-skeleton" />
      
      {/* Content Skeleton */}
      <div className="p-4 space-y-3">
        {/* Category */}
        <div className="h-3 w-20 bg-[var(--neutral-200)] rounded animate-skeleton" />
        
        {/* Title */}
        <div className="h-5 w-full bg-[var(--neutral-200)] rounded animate-skeleton" />
        <div className="h-5 w-2/3 bg-[var(--neutral-200)] rounded animate-skeleton" />
        
        {/* Rating */}
        <div className="flex gap-1">
          <div className="h-4 w-4 bg-[var(--neutral-200)] rounded animate-skeleton" />
          <div className="h-4 w-4 bg-[var(--neutral-200)] rounded animate-skeleton" />
          <div className="h-4 w-4 bg-[var(--neutral-200)] rounded animate-skeleton" />
          <div className="h-4 w-4 bg-[var(--neutral-200)] rounded animate-skeleton" />
          <div className="h-4 w-4 bg-[var(--neutral-200)] rounded animate-skeleton" />
        </div>
        
        {/* Price */}
        <div className="flex gap-2 items-center">
          <div className="h-6 w-16 bg-[var(--neutral-200)] rounded animate-skeleton" />
          <div className="h-4 w-12 bg-[var(--neutral-200)] rounded animate-skeleton" />
        </div>
      </div>
    </div>
  );
};

export const SkeletonBanner = () => {
  return (
    <div className="h-[500px] md:h-[600px] bg-[var(--neutral-200)] animate-skeleton" />
  );
};

export const SkeletonText = ({ lines = 3 }: { lines?: number }) => {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-[var(--neutral-200)] rounded animate-skeleton"
          style={{ width: i === lines - 1 ? '60%' : '100%' }}
        />
      ))}
    </div>
  );
};
