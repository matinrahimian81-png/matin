/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const BANNERS = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070&auto=format&fit=crop',
    title: 'جشنواره بزرگ بهاری',
    subtitle: 'تا ۷۰٪ تخفیف روی کالاهای منتخب',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop',
    title: 'تکنولوژی در دستان شما',
    subtitle: 'جدیدترین ساعت‌های هوشمند با قیمت استثنایی',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=2070&auto=format&fit=crop',
    title: 'آشپزخانه رویایی',
    subtitle: 'مجموعه کامل لوازم خانگی مدرن',
  },
];

export default function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % BANNERS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const next = () => setCurrent((prev) => (prev + 1) % BANNERS.length);
  const prev = () => setCurrent((prev) => (prev - 1 + BANNERS.length) % BANNERS.length);

  return (
    <section className="relative w-full h-[200px] md:h-[400px] overflow-hidden group">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={(_, info) => {
            if (info.offset.x > 100) prev();
            else if (info.offset.x < -100) next();
          }}
          className="absolute inset-0 cursor-grab active:cursor-grabbing"
        >
          <img
            src={BANNERS[current].image}
            alt={BANNERS[current].title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-l from-black/60 to-transparent" />
          
          {/* Text Overlay (Right side RTL) */}
          <div className="absolute inset-y-0 right-0 w-full md:w-1/2 flex flex-col justify-center items-start px-6 md:px-20 text-white text-right">
            <motion.h2
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="text-xl md:text-5xl font-black mb-1 md:mb-4 drop-shadow-lg"
            >
              {BANNERS[current].title}
            </motion.h2>
            <motion.p
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-[10px] md:text-xl font-bold opacity-90"
            >
              {BANNERS[current].subtitle}
            </motion.p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-3 md:mt-8 bg-[#EF2020] text-white px-4 md:px-8 py-1.5 md:py-3 rounded-lg md:rounded-xl font-black text-[10px] md:text-base shadow-lg shadow-red-500/30"
            >
              مشاهده محصولات
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows - Always visible on mobile/tablet, hover on laptop */}
      <button
        onClick={prev}
        className="flex absolute left-2 md:left-6 top-1/2 -translate-y-1/2 bg-white/30 md:bg-white/20 backdrop-blur-md p-2 md:p-3 rounded-full text-white lg:opacity-0 lg:group-hover:opacity-100 transition-opacity hover:bg-white/40 z-20"
      >
        <ChevronLeft className="w-5 h-5 md:w-8 md:h-8" />
      </button>
      <button
        onClick={next}
        className="flex absolute right-2 md:right-6 top-1/2 -translate-y-1/2 bg-white/30 md:bg-white/20 backdrop-blur-md p-2 md:p-3 rounded-full text-white lg:opacity-0 lg:group-hover:opacity-100 transition-opacity hover:bg-white/40 z-20"
      >
        <ChevronRight className="w-5 h-5 md:w-8 md:h-8" />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-3 md:bottom-10 left-[34px] md:left-[90px] flex gap-1.5 md:gap-3">
        {BANNERS.map((_, i) => (
          <motion.button
            key={i}
            onClick={() => setCurrent(i)}
            animate={{ 
              width: i === current ? (window.innerWidth < 768 ? 20 : 40) : (window.innerWidth < 768 ? 6 : 12),
              height: window.innerWidth < 768 ? 6 : 12,
              backgroundColor: i === current ? '#EF2020' : 'rgba(255,255,255,0.6)'
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="rounded-full"
          />
        ))}
      </div>
    </section>
  );
}
