/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { ALL_PRODUCTS } from '../data';
import { Heart, ChevronLeft, ChevronRight, Zap, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { useCountdown } from '../hooks/useCountdown';
import { ProductData } from '../types';

function CountdownBox({ label, dark = false }: { label: string; dark?: boolean }) {
  return (
    <div className={`rounded-md w-10 h-10 flex items-center justify-center font-black text-lg ${dark ? 'bg-white text-[#EF2020]' : 'bg-[#EF2020] text-white border border-white/20'}`}>
      {label}
    </div>
  );
}

export default function IncredibleOffers({ 
  onProductClick,
  onAddToCart,
  wishlist = [],
  onToggleWishlist
}: { 
  onProductClick?: (id: number) => void;
  onAddToCart?: (p: ProductData) => void;
  wishlist?: number[];
  onToggleWishlist?: (id: number) => void;
}) {
  const countdown = useCountdown(3600 * 4 + 25 * 60 + 12); // 4h 25m 12s
  const scrollRef1 = useRef<HTMLDivElement>(null);
  const scrollRef2 = useRef<HTMLDivElement>(null);

  const incredibleProducts = ALL_PRODUCTS.slice(0, 5);

  const scroll = (ref: React.RefObject<HTMLDivElement>, direction: 'left' | 'right') => {
    if (ref.current) {
      const { scrollLeft, clientWidth } = ref.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      ref.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="container mx-auto px-2 md:px-4 space-y-8 md:space-y-16 py-6 md:py-12">
      {/* 1. Flash Sale Banner ("شگفت‌آنگیز") */}
      <section className="relative rounded-[20px] md:rounded-[40px] overflow-hidden p-1 shadow-2xl bg-[#EF2020]">
        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-6 lg:gap-12 p-4 md:p-8 lg:p-12">
           {/* Sidebar Section */}
           <div className="w-full lg:w-[300px] flex flex-col items-center lg:items-start text-center lg:text-right gap-4">
             <div className="relative">
                <h2 className="text-3xl md:text-[44px] font-black leading-none tracking-tight text-white drop-shadow-2xl">شگفت<br className="hidden lg:block" /> انگیز</h2>
             </div>
             
             {/* Countdown with Timer Pill */}
             <div className="mt-2 md:mt-4 flex flex-col gap-3">
                <div className="flex flex-row items-center justify-center lg:justify-end gap-2 md:gap-3 bg-white/10 backdrop-blur-xl px-4 py-2 md:px-5 md:py-3 rounded-2xl border border-white/20" dir="ltr">
                  <Clock className="w-4 h-4 md:w-6 md:h-6 text-white" />
                  <div className="flex gap-2">
                    <div className="bg-white text-[#EF2020] rounded-lg w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-lg md:text-xl font-black">{countdown.h}</div>
                    <span className="text-white font-black">:</span>
                    <div className="bg-white text-[#EF2020] rounded-lg w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-lg md:text-xl font-black">{countdown.m}</div>
                    <span className="text-white font-black">:</span>
                    <div className="bg-white text-[#EF2020] rounded-lg w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-lg md:text-xl font-black">{countdown.s}</div>
                  </div>
                </div>
             </div>

             <button 
               onClick={() => onProductClick?.(incredibleProducts[0].id)}
               className="hidden lg:flex mt-10 items-center gap-3 text-base font-black bg-white/10 hover:bg-white text-white hover:text-[#EF2020] px-8 py-3 rounded-2xl transition-all border border-white/20 shadow-lg group"
             >
                <span>مشاهده همه</span>
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
             </button>
          </div>

          {/* Products Row */}
          <div className="w-full relative overflow-hidden group">
             {/* Navigation Buttons - Hidden on Mobile */}
             <button 
               onClick={(e) => { e.stopPropagation(); scroll(scrollRef1, 'right'); }}
               className="hidden md:block absolute right-2 top-1/2 -translate-y-1/2 z-30 bg-white/95 p-4 rounded-full shadow-2xl text-gray-800 hover:scale-110 active:scale-95 transition-all"
             >
               <ChevronRight className="w-6 h-6" />
             </button>
             <button 
               onClick={(e) => { e.stopPropagation(); scroll(scrollRef1, 'left'); }}
               className="hidden md:block absolute left-2 top-1/2 -translate-y-1/2 z-30 bg-white/95 p-4 rounded-full shadow-2xl text-gray-800 hover:scale-110 active:scale-95 transition-all"
             >
               <ChevronLeft className="w-6 h-6" />
             </button>

             <div 
               ref={scrollRef1}
               className="flex gap-3 md:gap-4 overflow-x-auto no-scrollbar pb-4 md:pb-8 pt-4 px-1 md:px-2 scroll-smooth"
             >
                {incredibleProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    whileHover={{ y: -8 }}
                    onClick={() => onProductClick?.(product.id)}
                    className="min-w-[180px] md:min-w-[260px] bg-white rounded-2xl md:rounded-3xl p-3 md:p-6 flex flex-col gap-2 md:gap-4 cursor-pointer relative shadow-lg"
                  >
                    {/* Heart Button */}
                    <button 
                      onClick={(e) => { e.stopPropagation(); onToggleWishlist?.(product.id); }}
                      className="absolute top-4 left-4 z-10 p-2 bg-gray-50 rounded-xl text-gray-400 hover:text-red-500 transition-colors shadow-sm"
                    >
                      <Heart className={`w-4 h-4 ${wishlist.includes(product.id) ? 'fill-red-500 text-red-500' : ''}`} />
                    </button>
                    
                    {/* Discount Badge */}
                    {product.discountPercentage && (
                      <div className="absolute top-4 right-4 z-20 bg-[#EF2020] text-white text-sm font-black w-12 h-12 flex items-center justify-center rounded-2xl shadow-xl shadow-red-200 rotate-12">
                        {product.discountPercentage}%
                      </div>
                    )}
                    
                    <div className="aspect-square relative p-4 group-hover:scale-105 transition-transform flex items-center justify-center">
                      <img src={product.image} alt={product.title} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                    </div>
                    
                    <div className="px-2">
                      <h4 className="text-sm font-black text-gray-700 line-clamp-2 leading-relaxed min-h-[44px]">{product.title}</h4>
                    </div>

                    <div className="mt-auto px-2">
                      <div className="flex items-center gap-1 font-black text-xl text-gray-900">
                        <span>{product.price.toLocaleString()}</span>
                        <span className="text-[12px] font-medium opacity-40">تومان</span>
                      </div>
                      {product.oldPrice && (
                        <div className="text-[12px] text-gray-400 line-through">
                          {product.oldPrice.toLocaleString()}
                        </div>
                      )}
                    </div>
                    
                    <button 
                      onClick={(e) => { e.stopPropagation(); onAddToCart?.(product); }}
                      className="mt-2 w-full bg-[#EF2020] text-white text-xs font-black py-2 rounded-xl"
                    >
                      افزودن به سبد
                    </button>
                  </motion.div>
                ))}
             </div>
          </div>
        </div>
      </section>

      {/* 2. Special Offers Section */}
      <section className="bg-white rounded-[40px] border border-gray-100 overflow-hidden shadow-2xl shadow-black/5">
        <div className="bg-[#EF2020] px-10 py-6 flex flex-col md:flex-row items-center justify-between text-white gap-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
               <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black">پیشنهادات ویژه</h3>
          </div>

          <div className="flex items-center gap-10">
             <div className="flex items-center gap-2" dir="ltr">
                <CountdownBox label={countdown.h} dark />
                <span className="font-bold">:</span>
                <CountdownBox label={countdown.m} dark />
                <span className="font-bold">:</span>
                <CountdownBox label={countdown.s} dark />
             </div>
             
             <button 
               onClick={() => onProductClick?.(incredibleProducts[1].id)}
               className="flex items-center gap-3 text-base font-black bg-white text-[#EF2020] px-8 py-3 rounded-2xl hover:bg-gray-50 transition-all shadow-xl shadow-black/10 group"
             >
                <span>مشاهده همه</span>
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
             </button>
          </div>
        </div>
        
        <div className="p-10 relative group">
          {/* Navigation Arrows */}
          <button 
            onClick={(e) => { e.stopPropagation(); scroll(scrollRef2, 'right'); }}
            className="absolute right-4 top-[40%] bg-white shadow-xl p-4 rounded-full text-gray-800 opacity-0 group-hover:opacity-100 transition-all hover:text-[#EF2020] border border-gray-100 z-20"
          >
             <ChevronRight className="w-6 h-6" />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); scroll(scrollRef2, 'left'); }}
            className="absolute left-4 top-[40%] bg-white shadow-xl p-4 rounded-full text-gray-800 opacity-0 group-hover:opacity-100 transition-all hover:text-[#EF2020] border border-gray-100 z-20"
          >
             <ChevronLeft className="w-6 h-6" />
          </button>

          <div 
            ref={scrollRef2}
            className="flex gap-10 overflow-x-auto no-scrollbar scroll-smooth"
          >
            {[...incredibleProducts].reverse().map((product) => (
              <motion.div 
                key={product.id} 
                whileHover={{ y: -8 }}
                onClick={() => onProductClick?.(product.id)}
                className="min-w-[200px] flex flex-col gap-4 cursor-pointer"
              >
                <div className="aspect-square bg-gray-50 rounded-[32px] p-8 relative overflow-hidden group/item border-2 border-transparent hover:border-[#EF2020]/20 transition-all shadow-sm flex items-center justify-center">
                   <img src={product.image} alt={product.title} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                   {/* Discount Badge */}
                   {product.discountPercentage && (
                     <div className="absolute top-4 right-4 bg-[#EF2020] text-white text-[10px] font-black px-2 py-1 rounded-lg rotate-12 shadow-md">
                        {product.discountPercentage}%
                     </div>
                   )}
                </div>
                <div className="px-2 space-y-3">
                   <h4 className="text-xs font-black text-gray-700 line-clamp-2 leading-relaxed min-h-[40px]">{product.title}</h4>
                   <div className="flex items-center justify-between">
                      <span className="text-[#EF2020] text-sm font-black">{product.price.toLocaleString()}</span>
                      <span className="text-[10px] font-medium text-gray-400">تومان</span>
                   </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
