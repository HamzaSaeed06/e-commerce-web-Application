import { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Filter, Grid3X3, LayoutList } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { ProductCard } from '../components/product/ProductCard';
import { SkeletonCard } from '../components/shared/SkeletonCard';

const ProductListing = () => {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('popular');
  
  const category = searchParams.get('category') || slug;
  const { products, loading, loadMore, hasMore } = useProducts({
    category: category || undefined,
    sort: sortBy as never,
  });

  return (
    <div className="min-h-screen pt-16">
      {/* Header */}
      <div className="bg-white border-b border-[var(--border-default)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-display font-bold text-[var(--text-primary)]">
            {category ? category.charAt(0).toUpperCase() + category.slice(1) : 'All Products'}
          </h1>
          <p className="mt-2 text-[var(--text-secondary)]">
            {products.length} products available
          </p>
        </div>
      </div>

      {/* Filters & Sort */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between gap-4">
          <button className="flex items-center gap-2 px-4 py-2 border border-[var(--border-default)] rounded-lg hover:bg-[var(--bg-secondary)] transition-colors">
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Filters</span>
          </button>

          <div className="flex items-center gap-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-[var(--border-default)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-200)]"
            >
              <option value="popular">Most Popular</option>
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>

            <div className="flex border border-[var(--border-default)] rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-[var(--bg-secondary)]' : 'bg-white'} hover:bg-[var(--bg-secondary)] transition-colors`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-[var(--bg-secondary)]' : 'bg-white'} hover:bg-[var(--bg-secondary)] transition-colors`}
              >
                <LayoutList className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {loading && products.length === 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg text-[var(--text-secondary)]">No products found</p>
          </div>
        ) : (
          <>
            <div className={`grid gap-4 md:gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' 
                : 'grid-cols-1'
            }`}>
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {hasMore && (
              <div className="text-center mt-8">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="px-8 py-3 border border-[var(--border-default)] rounded-lg font-medium hover:bg-[var(--bg-secondary)] transition-colors disabled:opacity-50"
                >
                  {loading ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProductListing;
