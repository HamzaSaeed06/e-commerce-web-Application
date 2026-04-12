import { HeroBanner } from '../components/home/HeroBanner';
import { ProductCard } from '../components/product/ProductCard';
import { SkeletonCard } from '../components/shared/SkeletonCard';
import { useTrendingProducts, useNewArrivals, useFeaturedProducts } from '../hooks/useProducts';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, TrendingUp, Clock } from 'lucide-react';

const SectionHeader = ({ title, subtitle, icon: Icon, link }: { title: string; subtitle?: string; icon?: React.ElementType; link?: string }) => (
  <div className="flex items-end justify-between mb-8">
    <div>
      <div className="flex items-center gap-2 mb-2">
        {Icon && <Icon className="w-5 h-5 text-[var(--brand-500)]" />}
        <h2 className="text-2xl md:text-3xl font-display font-bold text-[var(--text-primary)]">
          {title}
        </h2>
      </div>
      {subtitle && (
        <p className="text-[var(--text-secondary)]">{subtitle}</p>
      )}
    </div>
    {link && (
      <Link
        to={link}
        className="hidden sm:flex items-center gap-1 text-sm font-medium text-[var(--brand-500)] hover:text-[var(--brand-600)] transition-colors"
      >
        View All <ArrowRight className="w-4 h-4" />
      </Link>
    )}
  </div>
);

const ProductGrid = ({ products, loading }: { products: any[]; loading: boolean }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500 text-lg">No products found</p>
        <p className="text-slate-400 text-sm mt-2">Check back later for new arrivals!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

const Home = () => {
  const { products: trending, loading: trendingLoading } = useTrendingProducts(8);
  const { products: newArrivals, loading: newLoading } = useNewArrivals(4);
  const { products: featured, loading: featuredLoading } = useFeaturedProducts(4);

  const categories = [
    { name: 'Electronics', image: 'https://images.unsplash.com/photo-1498049860654-af1a5c5668ba?w=400', slug: 'electronics' },
    { name: 'Fashion', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400', slug: 'fashion' },
    { name: 'Home & Living', image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400', slug: 'home' },
    { name: 'Beauty', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400', slug: 'beauty' },
  ];

  return (
    <div className="min-h-screen">
      <HeroBanner />

      {/* Categories */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Shop by Category" link="/products" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                to={`/category/${cat.slug}`}
                className="group relative aspect-[4/3] rounded-xl overflow-hidden"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-white font-semibold text-lg">{cat.name}</h3>
                  <p className="text-white/80 text-sm group-hover:underline">Shop Now</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Flash Sale Banner */}
      <section className="py-12 bg-gradient-to-r from-[var(--brand-500)] to-[var(--brand-600)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <Sparkles className="w-6 h-6 text-white" />
                <span className="text-white/90 font-medium">Limited Time Offer</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white">
                Flash Sale: Up to 70% Off
              </h2>
              <p className="text-white/80 mt-2">Grab these deals before they are gone!</p>
            </div>
            <Link
              to="/products?flash=true"
              className="px-8 py-3 bg-white text-[var(--brand-600)] font-medium rounded-lg hover:bg-white/90 transition-colors"
            >
              Shop Flash Sale
            </Link>
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="py-12 bg-[var(--bg-secondary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Trending Now"
            subtitle="Most popular products this week"
            icon={TrendingUp}
            link="/products?sort=popular"
          />
          <ProductGrid products={trending} loading={trendingLoading} />
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Featured Products"
            subtitle="Handpicked just for you"
            icon={Sparkles}
            link="/products?featured=true"
          />
          <ProductGrid products={featured} loading={featuredLoading} />
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-12 bg-[var(--bg-secondary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="New Arrivals"
            subtitle="Fresh additions to our collection"
            icon={Clock}
            link="/products?sort=newest"
          />
          <ProductGrid products={newArrivals} loading={newLoading} />
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-[var(--neutral-900)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-display font-bold text-white mb-4">
            Join the LuxeMarket Family
          </h2>
          <p className="text-[var(--neutral-400)] mb-8 max-w-md mx-auto">
            Subscribe to our newsletter for exclusive deals, new arrivals, and insider-only discounts.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg bg-[var(--neutral-800)] border border-[var(--neutral-700)] text-white placeholder-[var(--neutral-500)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-[var(--brand-500)] text-white font-medium rounded-lg hover:bg-[var(--brand-600)] transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;
