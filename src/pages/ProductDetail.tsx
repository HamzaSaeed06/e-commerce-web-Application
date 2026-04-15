import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, Share2, Truck, Shield, RotateCcw, Minus, Plus, Star, ChevronLeft, ChevronRight, Package, Check, Clock, AlertCircle } from 'lucide-react';
import { useProductBySlug, useRelatedProducts, useTrendingProducts } from '../hooks/useProducts';
import { useCart } from '../hooks/useCart';
import { useAuthStore } from '../store/authStore';
import ReviewSection from '../components/product/reviews/ReviewSection';
import { ProductCard } from '../components/product/ProductCard';
import { formatCurrency } from '../utils/formatters';
import type { ProductVariant } from '../types';

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { product, loading } = useProductBySlug(slug);
  const { products: relatedProducts } = useRelatedProducts(product);
  const { products: trendingProducts } = useTrendingProducts(12);
  const { addToCart } = useCart();
  useAuthStore();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});

  // Get current display data based on variant selection
  const currentData = useMemo(() => {
    if (!product) return null;
    
    if (selectedVariant) {
      return {
        price: selectedVariant.price,
        comparePrice: selectedVariant.comparePrice,
        images: selectedVariant.images.length > 0 ? selectedVariant.images : product.images,
        stock: selectedVariant.stock,
        sku: selectedVariant.sku,
        attributes: selectedVariant.attributes
      };
    }
    
    return {
      price: product.price,
      comparePrice: product.comparePrice,
      images: product.images,
      stock: product.stock,
      sku: product.id,
      attributes: {}
    };
  }, [product, selectedVariant]);

  // Handle attribute selection and find matching variant
  const handleAttributeSelect = (attributeName: string, value: string) => {
    if (!product?.attributes || !product?.variants) return;
    
    const newAttributes = { ...selectedAttributes, [attributeName]: value };
    setSelectedAttributes(newAttributes);
    
    // Find matching variant
    const matchingVariant = product.variants.find(variant => {
      return Object.entries(newAttributes).every(([key, val]) => 
        variant.attributes[key] === val
      );
    });
    
    if (matchingVariant) {
      setSelectedVariant(matchingVariant);
      setSelectedImage(0);
    }
  };

  // Get available values for an attribute based on other selections
  const getAvailableValues = (attributeName: string) => {
    if (!product?.attributes || !product?.variants) return [];
    
    const otherAttributes = { ...selectedAttributes };
    delete otherAttributes[attributeName];
    
    const compatibleVariants = product.variants.filter(variant => {
      return Object.entries(otherAttributes).every(([key, val]) => 
        variant.attributes[key] === val
      );
    });
    
    const values = new Set(compatibleVariants.map(v => v.attributes[attributeName]));
    return Array.from(values);
  };

  // Get color value for swatch display
  const getColorValue = (variant: ProductVariant) => {
    const colorAttr = Object.entries(variant.attributes).find(([key]) => 
      key.toLowerCase() === 'color'
    );
    return colorAttr?.[1] || '';
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="aspect-square bg-(--neutral-50) rounded-[4px] border border-(--neutral-100) animate-pulse" />
            <div className="space-y-4">
              <div className="h-8 w-3/4 bg-(--neutral-50) rounded-[4px] animate-pulse" />
              <div className="h-6 w-1/2 bg-(--neutral-50) rounded-[4px] animate-pulse" />
              <div className="h-20 w-full bg-(--neutral-50) rounded-[4px] animate-pulse" />
              <div className="h-10 w-full bg-(--neutral-50) rounded-[4px] animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-[20px] font-extrabold text-black uppercase tracking-widest">Product not found</h1>
          <Link to="/products" className="mt-6 inline-block px-8 py-3 bg-black text-white text-[12px] font-bold uppercase tracking-widest rounded-[4px] hover:bg-black/90 transition-all">
            Browse all products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6">
        {/* Breadcrumb - Compact */}
        <nav className="flex items-center gap-2 text-[11px] text-(--neutral-400) mb-8 font-medium">
          <Link to="/" className="hover:text-black transition-colors">Home</Link>
          <span className="text-(--neutral-200)">/</span>
          <Link to="/products" className="hover:text-black transition-colors">Products</Link>
          <span className="text-(--neutral-200)">/</span>
          <span className="text-black font-bold uppercase tracking-tighter">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Images Section - 6 Columns */}
          <div className="lg:col-span-6 space-y-6">
            <div className="relative aspect-square max-h-[480px] bg-(--neutral-50) border border-(--neutral-200) rounded-[4px] group overflow-hidden mx-auto w-full">
              <img
                src={(currentData?.images || product.images)[selectedImage]}
                alt={product.name}
                className="w-full h-full object-contain mix-blend-multiply transition-transform duration-1000 group-hover:scale-105"
              />
              
              {/* Floating Action Icons */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-(--neutral-100) shadow-sm hover:shadow-md transition-all">
                  <Share2 className="w-4 h-4 text-black" />
                </button>
                <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-(--neutral-100) shadow-sm hover:shadow-md transition-all">
                  <Heart className="w-4 h-4 text-black" />
                </button>
              </div>

              {/* Navigation Arrows */}
              <button 
                onClick={() => setSelectedImage(prev => (prev - 1 + (currentData?.images || product.images).length) % (currentData?.images || product.images).length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm flex items-center justify-center border border-(--neutral-200) rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-white"
              >
                <ChevronLeft className="w-5 h-5 text-black" />
              </button>
              <button 
                onClick={() => setSelectedImage(prev => (prev + 1) % (currentData?.images || product.images).length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm flex items-center justify-center border border-(--neutral-200) rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-white"
              >
                <ChevronRight className="w-5 h-5 text-black" />
              </button>
            </div>

            {/* Thumbnails Row - Fixed Overflow with Wrap */}
            <div className="flex flex-wrap gap-3 justify-center max-w-[500px] mx-auto">
              {(currentData?.images || product.images).map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-16 h-16 border rounded-[4px] transition-all overflow-hidden bg-(--neutral-50) ${
                    selectedImage === idx ? 'border-black ring-1 ring-black/5' : 'border-(--neutral-200) hover:border-black'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                </button>
              ))}
            </div>
          </div>

          {/* Info Section - 6 Columns */}
          <div className="lg:col-span-6 space-y-8">
            {/* Brand & Title */}
            <div className="space-y-2">
              <p className="text-[12px] text-(--neutral-400) font-extrabold uppercase tracking-[0.2em]">
                {product.brand || 'John Lewis ANYDAY'}
              </p>
              <h1 className="text-[32px] font-extrabold text-black leading-[1.1] tracking-tighter">
                {product.name}
              </h1>
              
              {/* Price & Social Row */}
              <div className="flex items-center gap-4 pt-2 flex-wrap">
                <div className="flex items-center gap-3">
                  <span className="text-[28px] font-extrabold text-black tracking-tight">
                    {formatCurrency(currentData?.price || product.price)}
                  </span>
                  {(currentData?.comparePrice || product.comparePrice) && (
                    <span className="text-[16px] text-(--neutral-400) line-through font-medium">
                      {formatCurrency(currentData?.comparePrice || product.comparePrice!)}
                    </span>
                  )}
                </div>
                
                <div className="hidden sm:block h-4 w-px bg-(--neutral-200)" />
                
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 font-extrabold text-black text-[13px]">
                    <Star className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
                    {product.rating.toFixed(1)}
                  </div>
                  <span className="text-(--neutral-200)">•</span>
                  <span className="text-[13px] text-black font-extrabold">
                    1,238 Sold
                  </span>
                </div>
              </div>
            </div>

            <div className="h-px bg-(--neutral-100) w-full" />

            {/* Description */}
            <div className="space-y-3">
              <h4 className="text-[12px] font-extrabold text-black uppercase tracking-widest">Product Details</h4>
              <p className="text-[14px] text-black/70 leading-relaxed max-w-xl">
                {product.description}
              </p>
            </div>

            {/* Selectors */}
            <div className="space-y-8">
              {product.hasVariants && product.attributes && product.attributes.map((attr) => (
                <div key={attr.name} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-black uppercase font-bold tracking-tight">
                      {attr.name} <span className="text-(--neutral-400) ml-2 font-normal">/</span> <span className="text-black font-extrabold ml-1">{selectedAttributes[attr.name] || 'Select Option'}</span>
                    </span>
                    {attr.name.toLowerCase() === 'size' && (
                      <button className="text-[11px] font-bold text-black border-b border-black/20 hover:border-black transition-colors pb-0.5">
                        SIZE GUIDE
                      </button>
                    )}
                  </div>
                  
                  <div className="flex gap-2.5 flex-wrap">
                    {attr.values.map((value) => {
                      const isSelected = selectedAttributes[attr.name] === value;
                      const isAvailable = getAvailableValues(attr.name).includes(value);
                      
                      return (
                        <button
                          key={value}
                          onClick={() => handleAttributeSelect(attr.name, value)}
                          disabled={!isAvailable}
                          className={`min-w-[56px] h-14 flex items-center justify-center border rounded-[4px] text-[12px] font-extrabold transition-all px-4 ${
                            isSelected 
                              ? 'border-black bg-black text-white' 
                              : isAvailable
                                ? 'border-(--neutral-200) text-black hover:border-black'
                                : 'border-(--neutral-100) opacity-30 cursor-not-allowed'
                          }`}
                        >
                          {attr.name.toLowerCase() === 'color' ? (
                            <div 
                              className={`w-6 h-6 rounded-[2px] border ${isSelected ? 'border-white/40' : 'border-black/10'}`} 
                              style={{ backgroundColor: value.toLowerCase() }}
                              title={value}
                            />
                          ) : value}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Quantity Selector */}
              <div className="space-y-4">
                <span className="text-[13px] text-black uppercase font-bold">Quantity</span>
                <div className="flex items-center border border-(--neutral-200) rounded-[4px] w-fit overflow-hidden h-12">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-12 h-full hover:bg-(--neutral-50) flex items-center justify-center border-r border-(--neutral-200)">
                    <Minus size={14} />
                  </button>
                  <span className="w-14 text-center text-[14px] font-extrabold">{quantity}</span>
                  <button onClick={() => setQuantity(q => q + 1)} className="w-12 h-full hover:bg-(--neutral-50) flex items-center justify-center border-l border-(--neutral-200)">
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Main Action Buttons */}
            <div className="space-y-4 pt-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => {
                    if (product.hasVariants && !selectedVariant) return;
                    addToCart({
                      ...product,
                      price: currentData?.price || product.price,
                      images: currentData?.images || product.images,
                      stock: currentData?.stock || product.stock,
                    }, quantity, selectedVariant?.id, selectedVariant?.attributes);
                  }}
                  disabled={(currentData?.stock || product.stock) === 0 || (product.hasVariants && !selectedVariant)}
                  className="flex-1 h-14 bg-black text-white text-[13px] font-extrabold uppercase tracking-widest transition-all hover:bg-black/90 active:scale-[0.98] disabled:bg-(--neutral-200) rounded-[4px]"
                >
                  {(currentData?.stock || product.stock) === 0 ? 'NOT IN STOCK' : 'Add To Bag'}
                </button>
                <button className="flex-1 h-14 border-2 border-black text-black text-[13px] font-extrabold uppercase tracking-widest hover:bg-(--neutral-50) transition-all active:scale-[0.98] rounded-[4px]">
                  Checkout Now
                </button>
              </div>
              
              <div className="flex items-center gap-6 pt-2">
                <div className="flex items-center gap-2 text-[11px] font-extrabold text-black/60">
                  <Truck size={14} />
                  FREE SHIPPING OVER £50
                </div>
                <div className="flex items-center gap-2 text-[11px] font-extrabold text-black/60">
                  <RotateCcw size={14} />
                  30-DAY RETURNS
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Review Section Integration */}
        <div className="mt-32 border-t-2 border-dashed border-(--neutral-100) pt-24">
          <ReviewSection productId={product.id} />
        </div>

        {/* Related Products Section */}
        <section className="mt-32 pb-16">
          <div className="flex items-end justify-between mb-12 border-b-2 border-black pb-8">
            <div>
              <p className="text-[12px] font-extrabold text-(--neutral-400) uppercase tracking-[0.2em] mb-2">You Might Also Like</p>
              <h2 className="text-[32px] font-extrabold text-black tracking-tighter leading-none">Style Companions</h2>
            </div>
            <Link to="/products" className="text-[13px] font-extrabold text-black hover:underline underline-offset-8 transition-all px-4 py-2 border border-black rounded-[4px]">
              VIEW ALL
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
            {relatedProducts.slice(0, 4).map((related) => (
              <ProductCard key={related.id} product={related} />
            ))}
          </div>
        </section>

        {/* Popular This Week Section */}
        <section className="mt-16 pb-32">
          <div className="flex items-end justify-between mb-12 border-b-2 border-black pb-8">
            <div>
              <p className="text-[12px] font-extrabold text-(--neutral-400) uppercase tracking-[0.2em] mb-2">Customer Favorites</p>
              <h2 className="text-[32px] font-extrabold text-black tracking-tighter leading-none">Popular This Week</h2>
            </div>
            <Link to="/products" className="text-[13px] font-extrabold text-black hover:underline underline-offset-8 transition-all px-4 py-2 border border-black rounded-[4px]">
              VIEW ALL
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
            {trendingProducts.slice(0, 4).map((trending) => (
              <ProductCard key={trending.id} product={trending} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProductDetail;
