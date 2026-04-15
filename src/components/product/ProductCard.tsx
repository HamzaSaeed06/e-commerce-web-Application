import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { Heart as PhosphorHeart, Star as PhosphorStar } from 'phosphor-react';
import { useCart } from '../../hooks/useCart';
import { formatCurrency } from '../../utils/formatters';
import type { Product } from '../../types';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const isFlashSale = product.isFlashSale && product.flashSalePrice;

  const displayPrice = isFlashSale ? product.flashSalePrice! : product.price;
  const comparePrice = isFlashSale ? product.price : product.comparePrice;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (product.stock === 0) return;
    
    setIsLoading(true);
    await addToCart(product);
    setIsLoading(false);
  };

  return (
    <motion.div 
      className="group relative bg-white transition-all duration-300"
    >
      {/* Image Container */}
      <Link 
        to={`/products/${product.slug}`} 
        className="block relative aspect-[4/5] overflow-hidden bg-(--neutral-50) rounded-[4px]"
      >
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Wishlist Button - Extra Minimal */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsWishlisted(!isWishlisted);
          }}
          className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-95"
        >
          <PhosphorHeart 
            weight={isWishlisted ? "fill" : "regular"} 
            size={18} 
            className={isWishlisted ? "text-red-500" : "text-black"}
          />
        </button>
      </Link>

      {/* Content - Editorial Hierarchy */}
      <div className="pt-5 pb-4 px-1 space-y-1.5 text-left">
        {/* Brand Name */}
        <p className="text-[14px] font-extrabold text-black uppercase tracking-tight leading-none">
          {product.brand || 'JOHN LEWIS ANYDAY'}
        </p>
        
        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-[18px] font-extrabold text-black">
            {formatCurrency(displayPrice)}
          </span>
          {comparePrice && (
            <span className="text-[14px] text-(--neutral-400) line-through font-medium">
              {formatCurrency(comparePrice)}
            </span>
          )}
        </div>

        {/* Product Name */}
        <Link to={`/products/${product.slug}`} className="block">
          <h3 className="text-[14px] text-(--neutral-500) font-normal line-clamp-1 leading-snug hover:text-black transition-colors">
            {product.name}
          </h3>
        </Link>
        
        {/* Rating & Sold Count */}
        <div className="flex items-center gap-2 pt-1">
          <div className="flex items-center gap-1.5">
            <PhosphorStar
              weight="fill"
              size={18}
              className="text-[#F59E0B]"
            />
            <span className="text-[14px] font-extrabold text-black">
              {product.rating.toFixed(1)}
            </span>
          </div>
          
          <span className="text-(--neutral-300)">•</span>
          
          <span className="text-[14px] text-(--neutral-500) font-medium">
            {product.soldCount || '620'} Sold
          </span>
        </div>

        {/* Quick Add - High Contrast */}
        <div className="pt-3 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || isLoading}
            className="w-full h-10 bg-black text-white text-[12px] font-extrabold transition-all hover:bg-black/90 active:scale-[0.98] rounded-[4px] flex items-center justify-center gap-2"
          >
            {isLoading ? <Loader2 size={14} className="animate-spin" /> : 'ADD TO BAG'}
          </button>
        </div>
      </div>
    </motion.div>
  );
};
