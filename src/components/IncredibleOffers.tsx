/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { ALL_PRODUCTS } from '../data';
import { Heart, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
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
  products = [],
  onProductClick,
  onAddToCart,
  wishlist = [],
  onToggleWishlist
}: { 
  products?: ProductData[];
  onProductClick?: (id: number) => void;
  onAddToCart?: (p: ProductData) => void;
  wishlist?: number[];
  onToggleWishlist?: (id: number) => void;
}) {
  const countdown = useCountdown(3600 * 4 + 25 * 60 + 12); // 4h 25m 12s
  const scrollRef1 = useRef<HTMLDivElement>(null);
  const scrollRef2 = useRef<HTMLDivElement>(null);

  // Filter products for different sections
  const incredibleOffers = products.filter(p => (p.discountPercentage ?? 0) > 0).slice(0, 10);
  const displayIncredible = incredibleOffers.length > 0 ? incredibleOffers : products.slice(0, 10);
  
  const specialOffersList = products.filter(p => p.promo_type === 'special').slice(0, 10);
  const displaySpecial = specialOffersList.length > 0 ? specialOffersList : [...products].reverse().slice(0, 10);

  const scroll = (ref: React.RefObject<HTMLDivElement>, direction: 'left' | 'right') => {
    if (ref.current) {
      const { scrollLeft, clientWidth } = ref.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      ref.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="container !max-w-none mx-auto px-2 md:px-4 lg:px-12 space-y-8 md:space-y-16 py-6 md:py-12">
      {/* 1. Flash Sale Banner ("شگفت انگیز") */}
      <section className="relative rounded-[20px] md:rounded-[40px] overflow-hidden p-1 shadow-2xl bg-[#EF2020]">
        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-6 lg:gap-12 p-4 md:p-8 lg:p-12">
           {/* Sidebar Section */}
           <div className="w-full lg:w-[300px] flex flex-col items-center lg:items-start text-center lg:text-right gap-4">
             <div className="relative">
                <h2 className="text-3xl md:text-[44px] font-black leading-none tracking-tight text-white drop-shadow-2xl text-right">شگفت<br className="hidden lg:block" /> انگیز</h2>
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
               onClick={() => onProductClick?.(displayIncredible[0]?.id)}
               className="hidden lg:flex mt-10 items-center gap-3 text-base font-black bg-white/10 hover:bg-white text-white hover:text-[#EF2020] px-8 py-3 rounded-2xl transition-all border border-white/20 shadow-lg group"
             >
                <span>مشاهده همه</span>
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
             </button>
          </div>

          {/* Products Row */}
          <div className="w-full relative overflow-hidden group/carousel">
             {/* Navigation Buttons - Positioned middle of the image area, ultra transparent on mobile */}
             <button 
               onClick={(e) => { e.stopPropagation(); scroll(scrollRef1, 'right'); }}
               className="absolute right-0 md:right-1 top-[30%] -translate-y-1/2 z-30 bg-white/5 backdrop-blur-md p-1.5 md:p-4 rounded-full shadow-sm text-gray-800 hover:bg-white transition-all lg:opacity-0 lg:group-hover/carousel:opacity-100 border border-white/10"
             >
               <ChevronRight className="w-3.5 h-3.5 md:w-6 md:h-6" />
             </button>
             <button 
               onClick={(e) => { e.stopPropagation(); scroll(scrollRef1, 'left'); }}
               className="absolute left-0 md:left-1 top-[30%] -translate-y-1/2 z-30 bg-white/5 backdrop-blur-md p-1.5 md:p-4 rounded-full shadow-sm text-gray-800 hover:bg-white transition-all lg:opacity-0 lg:group-hover/carousel:opacity-100 border border-white/10"
             >
               <ChevronLeft className="w-3.5 h-3.5 md:w-6 md:h-6" />
             </button>

             <div 
               ref={scrollRef1}
               className="flex gap-3 md:gap-4 overflow-x-auto no-scrollbar pb-4 md:pb-8 pt-4 px-1 md:px-2 scroll-smooth"
             >
                {displayIncredible.map((product) => (
                  <motion.div
                    key={product.id}
                    whileHover={{ y: -6, scale: 1.01 }}
                    onClick={() => onProductClick?.(product.id)}
                    className="min-w-[160px] md:min-w-[220px] bg-white rounded-2xl md:rounded-3xl p-3 md:p-5 flex flex-col gap-2 md:gap-3 cursor-pointer relative shadow-lg h-[320px] md:h-[400px] group/item"
                  >
                    {/* Heart Button */}
                    <button 
                      onClick={(e) => { e.stopPropagation(); onToggleWishlist?.(product.id); }}
                      className="absolute top-3 left-3 z-10 p-1.5 bg-gray-50/80 backdrop-blur-sm rounded-lg text-gray-400 hover:text-red-500 transition-colors shadow-sm"
                    >
                      <Heart className={`w-3.5 h-3.5 ${wishlist.includes(product.id) ? 'fill-red-500 text-red-500' : ''}`} />
                    </button>
                    
                    {/* Discount Badge */}
                    {(product.discountPercentage ?? 0) > 0 && (
                      <div className="absolute top-3 right-3 z-20 bg-[#EF2020] text-white text-[10px] md:text-sm font-black w-8 h-8 md:w-11 md:h-11 flex items-center justify-center rounded-xl shadow-lg shadow-red-200 rotate-12">
                        {product.discountPercentage}%
                      </div>
                    )}
                    
                    {/* Image Area */}
                    <div className="h-[140px] md:h-[200px] relative p-2 flex items-center justify-center">
                      <img 
                        src={product.image} 
                        alt={product.title} 
                        className="max-w-full max-h-full object-contain transition-transform duration-500 ease-out group-hover/item:scale-105 group-hover/item:-translate-y-0.5" 
                        referrerPolicy="no-referrer" 
                      />
                    </div>
                    
                    <div className="px-2 flex-grow">
                      <h4 className="text-[12px] md:text-sm font-black text-gray-700 line-clamp-2 leading-relaxed text-right">{product.title}</h4>
                    </div>

                    <div className="mt-auto px-1 flex flex-col items-end gap-1">
                      <div className="flex items-center gap-1 font-black text-base md:text-xl text-gray-900">
                        <span>{product.price.toLocaleString()}</span>
                        <span className="text-[10px] font-medium opacity-40">تومان</span>
                      </div>
                      {(product.oldPrice ?? 0) > 0 && (
                        <div className="text-[10px] md:text-[12px] text-gray-400 line-through opacity-50">
                          {product.oldPrice?.toLocaleString()}
                        </div>
                      )}
                    </div>
                    
                    <button 
                      onClick={(e) => { e.stopPropagation(); onAddToCart?.(product); }}
                      className="mt-2 w-full bg-[#EF2020] text-white text-[10px] md:text-xs font-black py-2 rounded-xl hover:bg-red-700 transition-colors"
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
               onClick={() => onProductClick?.(displaySpecial[0]?.id)}
               className="flex items-center gap-3 text-base font-black bg-white text-[#EF2020] px-8 py-3 rounded-2xl hover:bg-gray-50 transition-all shadow-xl shadow-black/10 group"
             >
                <span>مشاهده همه</span>
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
             </button>
          </div>
        </div>
        
        <div className="p-10 relative group/carousel2">
          {/* Navigation Arrows - Adjusted for better visibility and text clearance */}
          <button 
            onClick={(e) => { e.stopPropagation(); scroll(scrollRef2, 'right'); }}
            className="absolute right-1 md:right-2 top-[25%] bg-white/5 backdrop-blur-md shadow-sm p-1.5 md:p-4 rounded-full text-gray-800 lg:opacity-0 lg:group-hover/carousel2:opacity-100 transition-all hover:bg-white border border-white/10 z-20"
          >
             <ChevronRight className="w-3.5 h-3.5 md:w-6 md:h-6" />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); scroll(scrollRef2, 'left'); }}
            className="absolute left-1 md:left-2 top-[25%] bg-white/5 backdrop-blur-md shadow-sm p-1.5 md:p-4 rounded-full text-gray-800 lg:opacity-0 lg:group-hover/carousel2:opacity-100 transition-all hover:bg-white border border-white/10 z-20"
          >
             <ChevronLeft className="w-3.5 h-3.5 md:w-6 md:h-6" />
          </button>

          <div 
            ref={scrollRef2}
            className="flex gap-6 md:gap-10 overflow-x-auto no-scrollbar scroll-smooth"
          >
            {displaySpecial.map((product) => (
              <motion.div 
                key={product.id} 
                whileHover={{ y: -6, scale: 1.01 }}
                onClick={() => onProductClick?.(product.id)}
                className="min-w-[160px] md:min-w-[220px] flex flex-col gap-3 cursor-pointer group/itemSpecial"
              >
                <div className="h-[160px] md:h-[220px] bg-gray-50 rounded-[24px] md:rounded-[32px] p-4 md:p-6 relative border-2 border-transparent hover:border-[#EF2020]/20 transition-all shadow-sm flex items-center justify-center">
                   <img 
                    src={product.image} 
                    alt={product.title} 
                    className="max-w-full max-h-full object-contain transition-transform duration-500 ease-out group-hover/itemSpecial:scale-105 group-hover/itemSpecial:-translate-y-0.5" 
                    referrerPolicy="no-referrer" 
                   />
                   {/* Discount Badge */}
                   {(product.discountPercentage ?? 0) > 0 && (
                     <div className="absolute top-2 right-2 md:top-3 md:right-3 bg-[#EF2020] text-white text-[9px] md:text-[11px] font-black px-2 py-1 rounded-lg rotate-12 shadow-md">
                        {product.discountPercentage}%
                     </div>
                   )}
                </div>
                <div className="px-2 space-y-2 flex flex-col items-end">
                   <h4 className="text-[11px] md:text-[13px] font-black text-gray-700 line-clamp-2 leading-relaxed min-h-[35px] md:min-h-[40px] text-right">{product.title}</h4>
                   <div className="flex items-center gap-1.5 flex-row-reverse">
                      <span className="text-[#EF2020] text-sm md:text-lg font-black">{product.price.toLocaleString()}</span>
                      <span className="text-[9px] md:text-[10px] font-medium text-gray-400">تومان</span>
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
