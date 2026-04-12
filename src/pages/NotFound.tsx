import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-secondary)]">
      <div className="text-center px-4">
        <div className="w-32 h-32 bg-[var(--brand-50)] rounded-full flex items-center justify-center mx-auto mb-8">
          <span className="text-6xl font-display font-bold text-[var(--brand-500)]">404</span>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-display font-bold text-[var(--text-primary)] mb-4">
          Page not found
        </h1>
        <p className="text-lg text-[var(--text-secondary)] mb-8 max-w-md mx-auto">
          Sorry, we could not find the page you are looking for. It might have been moved or deleted.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[var(--brand-500)] text-white font-medium rounded-lg hover:bg-[var(--brand-600)] transition-colors"
          >
            <Home className="w-5 h-5" />
            Go home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-[var(--border-default)] text-[var(--text-primary)] font-medium rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Go back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
