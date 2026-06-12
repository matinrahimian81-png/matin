/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Slide } from '../types';

export default function Hero({ onProductClick }: { onProductClick?: (id: number) => void }) {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      const { supabaseService } = await import('../services/supabaseService');
      const data = await supabaseService.getSlides();
      if (data && data.length > 0) {
        // Decode metadata from button_link if present
        const processedSlides = data.map((slide: any) => {
          if (slide.button_link && slide.button_link.startsWith('__META:')) {
            try {
              const metaStr = slide.button_link.replace('__META:', '');
              const meta = JSON.parse(metaStr);
              return {
                ...slide,
                button_width: meta.w ?? slide.button_width,
                button_height: meta.h ?? slide.button_height,
                button_scale: meta.s ?? slide.button_scale,
                button_link: meta.l ?? ''
              };
            } catch (e) {
              return slide;
            }
          }
          return slide;
        });
        setSlides(processedSlides);
      }
    } catch (err) {
      console.error('Error fetching slides:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const next = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  if (loading) {
    return (
      <div className="w-full mt-0 pt-0 mb-4 md:mb-8">
        <div className="w-full aspect-[21/7] bg-gray-100 animate-pulse" />
      </div>
    );
  }

  if (slides.length === 0) {
    // Original fallback banners if database is empty
    return null; 
  }

  const currentSlide = slides[current];

  return (
    <div className="w-full mt-0 pt-0 mb-6 md:mb-10">
      <section className="relative w-full aspect-[21/7] h-auto overflow-hidden group border-b border-gray-100 shadow-md">
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
              src={currentSlide.image}
              alt={currentSlide.title}
              className="w-full h-full object-cover select-none"
              referrerPolicy="no-referrer"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-l from-black/70 to-transparent pointer-events-none" />
            
            {/* Text Overlay */}
            <div className="absolute inset-0 flex flex-col justify-center items-start px-6 md:px-20 text-white text-right pointer-events-none" dir="rtl">
              <motion.h2
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="text-lg sm:text-2xl md:text-5xl font-black mb-1 md:mb-4 drop-shadow-xl"
              >
                {currentSlide.title}
              </motion.h2>
              <motion.p
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-[9px] sm:text-sm md:text-xl font-bold opacity-90 drop-shadow-md"
              >
                {currentSlide.subtitle}
              </motion.p>
            </div>

            {/* Full-slider Clickable Area if product linked */}
            {currentSlide.product_id && (
              <div
                onClick={() => onProductClick?.(currentSlide.product_id)}
                className="absolute inset-0 cursor-pointer z-30"
              />
            )}
          </motion.div>
        </AnimatePresence>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            className="flex absolute left-4 md:left-8 top-1/2 -translate-y-1/2 bg-white/30 md:bg-white/20 backdrop-blur-md p-2.5 md:p-4 rounded-full text-white lg:opacity-0 lg:group-hover:opacity-100 transition-opacity hover:bg-white/40 z-20"
          >
            <ChevronLeft className="w-5 h-5 md:w-8 md:h-8" />
          </button>
          <button
            onClick={next}
            className="flex absolute right-4 md:right-8 top-1/2 -translate-y-1/2 bg-white/30 md:bg-white/20 backdrop-blur-md p-2.5 md:p-4 rounded-full text-white lg:opacity-0 lg:group-hover:opacity-100 transition-opacity hover:bg-white/40 z-20"
          >
            <ChevronRight className="w-5 h-5 md:w-8 md:h-8" />
          </button>
        </>
      )}

          {/* Dot Indicators */}
          <div className="absolute bottom-3 md:bottom-10 left-[34px] md:left-[90px] flex gap-1.5 md:gap-3">
            {slides.map((_, i) => (
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
      </div>
    );
}

// Fixed positions for arrows
// Need to add them back properly.
