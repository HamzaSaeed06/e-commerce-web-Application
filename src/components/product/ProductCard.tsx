import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Zap, Loader2, CheckCircle } from 'lucide-react';
import { Heart as PhosphorHeart, Eye, Star as PhosphorStar } from 'phosphor-react';
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
  const [isSuccess, setIsSuccess] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  const isNew = new Date(product.createdAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000;
  const isFlashSale = product.isFlashSale && product.flashSalePrice;
  const discount = isFlashSale 
    ? Math.round(((product.price - product.flashSalePrice!) / product.price) * 100)
    : product.comparePrice 
      ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
      : 0;

  const displayPrice = isFlashSale ? product.flashSalePrice! : product.price;
  const comparePrice = isFlashSale ? product.price : product.comparePrice;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (product.stock === 0) return;
    
    setIsLoading(true);
    await addToCart(product);
    setIsLoading(false);
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 800);
  };

  return (
    <motion.div 
      className="group relative bg-white rounded-xl border border-slate-100 overflow-hidden hover:shadow-[0_4px_8px_rgba(15,23,42,0.06),0_12px_32px_rgba(15,23,42,0.10)] transition-all duration-200"
      whileHover={{ y: -3 }}
    >
      {/* Image Container */}
      <Link to={`/products/${product.slug}`} className="block relative aspect-[4/3] overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[400ms] ease"
          loading="lazy"
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {isFlashSale && (
            <span className="px-1.5 py-0.5 bg-orange-500 text-white text-[10px] font-semibold rounded-md flex items-center gap-1">
              <Zap className="w-2.5 h-2.5" /> FLASH
            </span>
          )}
          {isNew && !isFlashSale && (
            <span className="px-1.5 py-0.5 bg-slate-900 text-white text-[10px] font-semibold rounded-md">
              NEW
            </span>
          )}
          {discount > 0 && !isFlashSale && (
            <span className="px-1.5 py-0.5 bg-red-500 text-white text-[10px] font-semibold rounded-md">
              -{discount}%
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <motion.button
          onClick={(e) => {
            e.preventDefault();
            setIsWishlisted(!isWishlisted);
          }}
          whileTap={{ scale: 0.85 }}
          animate={{ scale: isWishlisted ? [1, 1.3, 1] : 1 }}
          transition={{ duration: 0.25 }}
          className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <PhosphorHeart 
            weight={isWishlisted ? "fill" : "regular"} 
            size={16} 
            className={isWishlisted ? "text-red-500" : "text-slate-300"}
          />
        </motion.button>

        {/* Quick View */}
        <div className="absolute bottom-0 w-full opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-white/90 backdrop-blur-sm py-2 text-[13px] font-medium text-center text-slate-700 flex items-center justify-center gap-1">
            <Eye weight="regular" size={14} /> Quick View
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-3 space-y-1.5">
        <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">
          {product.category}
        </p>
        <Link to={`/products/${product.slug}`}>
          <h3 className="text-[14px] font-medium text-slate-800 line-clamp-2 leading-snug group-hover:text-orange-500 transition-colors">
            {product.name}
          </h3>
        </Link>
        
        {/* Rating */}
        <div className="flex items-center gap-0.5">
          {[...Array(5)].map((_, i) => (
            <PhosphorStar
              key={i}
              weight={i < Math.floor(product.rating) ? "fill" : "regular"}
              size={12}
              className={i < Math.floor(product.rating) ? "text-orange-400" : "text-slate-200"}
            />
          ))}
          <span className="text-[12px] text-slate-400 ml-1">({product.reviewCount})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-[17px] font-bold text-slate-900">
            {formatCurrency(displayPrice)}
          </span>
          {comparePrice && (
            <span className="text-[13px] text-slate-400 line-through">
              {formatCurrency(comparePrice)}
            </span>
          )}
          {discount > 0 && !isFlashSale && (
            <span className="text-[11px] text-green-600 font-semibold">
              {discount}% off
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <motion.button
          onClick={handleAddToCart}
          disabled={product.stock === 0 || isLoading}
          className="w-full h-8 rounded-lg text-[13px] font-medium bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center gap-1.5 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
          whileTap={{ scale: 0.98 }}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : isSuccess ? (
            <CheckCircle className="w-4 h-4 text-green-500" />
          ) : (
            <>
              <ShoppingBag size={14} /> Add to cart
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};
