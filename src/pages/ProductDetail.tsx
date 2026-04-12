import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, Share2, Truck, Shield, RotateCcw, Minus, Plus, Star, ChevronRight } from 'lucide-react';
import { useProductBySlug } from '../hooks/useProducts';
import { useCart } from '../hooks/useCart';
import { useAuthStore } from '../store/authStore';
import { formatCurrency } from '../utils/formatters';

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { product, loading } = useProductBySlug(slug);
  const { addToCart } = useCart();
  useAuthStore();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  if (loading) {
    return (
      <div className="min-h-screen pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="aspect-square bg-[var(--neutral-200)] rounded-xl animate-skeleton" />
            <div className="space-y-4">
              <div className="h-8 w-3/4 bg-[var(--neutral-200)] rounded animate-skeleton" />
              <div className="h-6 w-1/2 bg-[var(--neutral-200)] rounded animate-skeleton" />
              <div className="h-4 w-full bg-[var(--neutral-200)] rounded animate-skeleton" />
              <div className="h-4 w-2/3 bg-[var(--neutral-200)] rounded animate-skeleton" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Product not found</h1>
          <Link to="/products" className="mt-4 text-[var(--brand-500)] hover:underline">
            Browse all products
          </Link>
        </div>
      </div>
    );
  }

  const isFlashSale = product.isFlashSale && product.flashSalePrice;
  const displayPrice = isFlashSale ? product.flashSalePrice! : product.price;
  const discount = isFlashSale 
    ? Math.round(((product.price - product.flashSalePrice!) / product.price) * 100)
    : 0;

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-6">
          <Link to="/" className="hover:text-[var(--text-primary)]">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/products" className="hover:text-[var(--text-primary)]">Products</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-[var(--text-primary)]">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-[var(--bg-secondary)] rounded-xl overflow-hidden">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === idx ? 'border-[var(--brand-500)]' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-[var(--brand-500)] font-medium uppercase tracking-wide">
                {product.category}
              </p>
              <h1 className="text-3xl font-display font-bold text-[var(--text-primary)] mt-2">
                {product.name}
              </h1>
              
              {/* Rating */}
              <div className="flex items-center gap-2 mt-3">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? 'fill-[var(--warning)] text-[var(--warning)]'
                          : 'text-[var(--neutral-300)]'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-[var(--text-secondary)]">
                  {product.rating.toFixed(1)} ({product.reviewCount} reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-[var(--text-primary)]">
                {formatCurrency(displayPrice)}
              </span>
              {isFlashSale && (
                <>
                  <span className="text-xl text-[var(--text-muted)] line-through">
                    {formatCurrency(product.price)}
                  </span>
                  <span className="px-2 py-1 bg-red-500 text-white text-sm font-medium rounded">
                    -{discount}%
                  </span>
                </>
              )}
            </div>

            <p className="text-[var(--text-secondary)] leading-relaxed">
              {product.description}
            </p>

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-[var(--text-primary)]">Quantity:</span>
              <div className="flex items-center border border-[var(--border-default)] rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-[var(--bg-secondary)] transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                  className="p-2 hover:bg-[var(--bg-secondary)] transition-colors disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {product.stock <= product.lowStockThreshold && product.stock > 0 && (
                <span className="text-sm text-[var(--warning)]">
                  Only {product.stock} left!
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => addToCart(product, quantity)}
                disabled={product.stock === 0}
                className="flex-1 py-3 bg-[var(--brand-500)] text-white font-medium rounded-lg hover:bg-[var(--brand-600)] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
              <button className="p-3 border border-[var(--border-default)] rounded-lg hover:bg-[var(--bg-secondary)] transition-colors">
                <Heart className="w-5 h-5" />
              </button>
              <button className="p-3 border border-[var(--border-default)] rounded-lg hover:bg-[var(--bg-secondary)] transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[var(--border-default)]">
              <div className="text-center">
                <Truck className="w-6 h-6 mx-auto mb-2 text-[var(--brand-500)]" />
                <p className="text-xs text-[var(--text-secondary)]">Free Shipping</p>
              </div>
              <div className="text-center">
                <Shield className="w-6 h-6 mx-auto mb-2 text-[var(--brand-500)]" />
                <p className="text-xs text-[var(--text-secondary)]">Secure Payment</p>
              </div>
              <div className="text-center">
                <RotateCcw className="w-6 h-6 mx-auto mb-2 text-[var(--brand-500)]" />
                <p className="text-xs text-[var(--text-secondary)]">30-Day Returns</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
