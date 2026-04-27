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
    <section className="relative w-full h-[380px] overflow-hidden group">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <img
            src={BANNERS[current].image}
            alt={BANNERS[current].title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          {/* Gradient overlay from right */}
          <div className="absolute inset-0 bg-gradient-to-l from-black/60 to-transparent" />
          
          {/* Text Overlay (Right side RTL) */}
          <div className="absolute inset-y-0 right-0 w-full md:w-1/2 flex flex-col justify-center items-start px-8 md:px-24 text-white text-right">
            <motion.h2
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-6xl font-black mb-4 leading-tight drop-shadow-lg"
            >
              {BANNERS[current].title}
            </motion.h2>
            <motion.p
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl font-bold opacity-90 drop-shadow-md"
            >
              {BANNERS[current].subtitle}
            </motion.p>
            <motion.button
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.05 }}
              className="mt-10 bg-[#EF2020] text-white px-10 py-4 rounded-xl font-black text-lg shadow-xl shadow-red-500/30 transition-transform"
            >
              مشاهده محصولات
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button
        onClick={prev}
        className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md p-3 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/40"
      >
        <ChevronLeft className="w-8 h-8" />
      </button>
      <button
        onClick={next}
        className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md p-3 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/40"
      >
        <ChevronRight className="w-8 h-8" />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-10 left-12 flex gap-3">
        {BANNERS.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              i === current ? 'bg-[#EF2020] w-12' : 'bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
