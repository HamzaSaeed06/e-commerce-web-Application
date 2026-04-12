interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'white' | 'brand' | 'gray';
  text?: string;
}

const sizes = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-8 h-8',
};

const colors = {
  white: 'border-white/30 border-t-white',
  brand: 'border-[var(--brand-500)]/30 border-t-[var(--brand-500)]',
  gray: 'border-gray-400/30 border-t-gray-600',
};

export const LoadingSpinner = ({ size = 'md', color = 'brand', text }: LoadingSpinnerProps) => {
  return (
    <div className="flex items-center justify-center gap-3">
      <div className={`${sizes[size]} ${colors[color]} rounded-full animate-spin border-2`} />
      {text && <span className="text-sm font-medium">{text}</span>}
    </div>
  );
};

export const FullPageLoader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-secondary)]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-[var(--brand-200)] border-t-[var(--brand-500)] rounded-full animate-spin" />
        <p className="text-[var(--text-secondary)] font-medium">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
