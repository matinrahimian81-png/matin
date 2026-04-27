/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Heart, Star, Truck, Plus, Minus, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ProductCardProps {
  id: number;
  title: string;
  image: string;
  price: number;
  oldPrice?: number;
  discountPercentage?: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  hasFreeShipping?: boolean;
  onProductClick?: (id: number) => void;
  onAddToCart?: () => void;
  isWishlisted?: boolean;
  onToggleWishlist?: () => void;
}

export default function ProductCard({
  id,
  title,
  image,
  price,
  oldPrice,
  discountPercentage,
  rating,
  reviewCount,
  inStock,
  hasFreeShipping,
  onProductClick,
  onAddToCart,
  isWishlisted = false,
  onToggleWishlist
}: ProductCardProps) {
  const [quantity, setQuantity] = useState(0);
  const handleAddToCart = (e: any) => {
    e.stopPropagation();
    setQuantity(1);
    onAddToCart?.();
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02, boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}
      onClick={() => onProductClick?.(id)}
      className="w-[220px] bg-white rounded-lg p-2 transition-all duration-200 cursor-pointer flex flex-col relative group"
      style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}
    >
      {/* 1. Image Area */}
      <div className="relative w-full h-[200px] bg-[#F5F5F5] rounded-md overflow-hidden flex items-center justify-center p-4">
        {/* Wishlist Heart Icon */}
        <button 
          onClick={(e) => { e.stopPropagation(); onToggleWishlist?.(); }}
          className="absolute top-2 left-2 z-20 p-1.5 bg-white/50 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
        >
          <Heart 
            className={`w-4 h-4 transition-colors ${isWishlisted ? 'fill-red-500 text-red-500 border-none' : 'text-gray-400'}`} 
          />
        </button>

        {/* Discount Badge (Top Right) */}
        {!inStock && (
           <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] z-10 flex items-center justify-center">
              <span className="bg-gray-700/80 text-white px-4 py-2 rounded-full font-black text-sm shadow-lg">موجود نیست</span>
           </div>
        )}

        {discountPercentage && inStock && (
          <div className="absolute bottom-2 right-2 z-20 bg-[#EF2020] text-white text-[10px] font-black px-2 py-1 rounded-lg shadow-lg">
            {discountPercentage}٪
          </div>
        )}

        <img
          src={image}
          alt={title}
          className={`w-full h-full object-contain mix-blend-multiply transition-transform duration-500 ${inStock ? 'group-hover:scale-110' : 'grayscale opacity-50'}`}
          referrerPolicy="no-referrer"
        />
      </div>

      {/* 2. Product Info Section */}
      <div className="p-3 flex-grow flex flex-col gap-2">
        {/* Title */}
        <h3 className="text-[13px] font-bold text-[#333] line-clamp-2 leading-relaxed min-h-[40px] text-right">
          {title}
        </h3>

        {/* Rating & Seller */}
        <div className="flex flex-col gap-1 text-right">
          <div className="flex items-center justify-end gap-1.5">
            <span className="text-[10px] text-gray-400 font-medium">({reviewCount})</span>
            <span className="text-[11px] font-bold text-gray-600">{rating}</span>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-3 h-3 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} 
                />
              ))}
            </div>
          </div>
          <p className="text-[10px] text-gray-400 font-medium">فروشنده: دیجی‌کالا</p>
        </div>

        {/* 3. Price Section */}
        <div className="mt-auto flex flex-col items-end gap-1 min-h-[45px]">
          {inStock ? (
            <>
              {oldPrice && (
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-gray-400 line-through decoration-red-400">
                    {oldPrice.toLocaleString()}
                  </span>
                  <div className="bg-[#EF2020]/10 text-[#EF2020] text-[9px] font-black px-1.5 py-0.5 rounded-full">
                    {discountPercentage}٪
                  </div>
                </div>
              )}
              <div className="flex items-center gap-1">
                <span className="text-base font-black text-gray-900">{price.toLocaleString()}</span>
                <span className="text-[10px] font-bold text-gray-500">تومان</span>
              </div>
            </>
          ) : (
            <div className="h-[45px]" />
          )}
        </div>

        {/* 4. Action Area */}
        <div className="mt-3">
          {/* Free Shipping Badge */}
          {hasFreeShipping && inStock && (
            <div className="flex items-center justify-end gap-1 text-[10px] font-bold text-emerald-500 mb-2">
              <span>ارسال رایگان</span>
              <Truck className="w-3 h-3" />
            </div>
          )}

          {inStock ? (
            <div className="h-10 relative">
              <AnimatePresence mode="wait">
                {quantity === 0 ? (
                  <motion.button
                    key="add-btn"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleAddToCart}
                    className="w-full bg-[#EF2020] hover:bg-red-700 text-white rounded-md h-full flex items-center justify-center gap-2 text-xs font-black transition-colors shadow-lg shadow-red-100"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>افزودن به سبد خرید</span>
                  </motion.button>
                ) : (
                  <motion.div
                    key="qty-selector"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="w-full h-full flex items-center justify-between bg-white border border-gray-100 rounded-md px-3 shadow-md"
                  >
                    <button 
                      onClick={(e) => { e.stopPropagation(); setQuantity(prev => prev + 1); }}
                      className="text-[#EF2020] hover:bg-red-50 p-1 rounded-full transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                    <span className="font-black text-[#EF2020]">{quantity}</span>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setQuantity(prev => Math.max(0, prev - 1)); }}
                      className="text-[#EF2020] hover:bg-red-50 p-1 rounded-full transition-colors"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="h-10" />
          )}
        </div>
      </div>
    </motion.div>
  );
}
