/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';

const EXTENDED_MAIN_CATEGORIES = [
  { id: 1, name: 'موبایل', img: 'https://picsum.photos/seed/mobile/150/150' },
  { id: 2, name: 'لپ‌تاپ', img: 'https://picsum.photos/seed/laptop/150/150' },
  { id: 3, name: 'هدفون', img: 'https://picsum.photos/seed/headphone/150/150' },
  { id: 4, name: 'ساعت هوشمند', img: 'https://picsum.photos/seed/watch/150/150' },
  { id: 5, name: 'پوشاک', img: 'https://picsum.photos/seed/fashion/150/150' },
  { id: 6, name: 'خانه', img: 'https://picsum.photos/seed/home/150/150' },
  { id: 7, name: 'آشپزخانه', img: 'https://picsum.photos/seed/kitchen/150/150' },
  { id: 8, name: 'زیبایی', img: 'https://picsum.photos/seed/beauty/150/150' },
  { id: 9, name: 'اسباب بازی', img: 'https://picsum.photos/seed/toy/150/150' },
  { id: 10, name: 'کتاب', img: 'https://picsum.photos/seed/book/150/150' },
  { id: 11, name: 'ورزش', img: 'https://picsum.photos/seed/sport/150/150' },
  { id: 12, name: 'ابزار', img: 'https://picsum.photos/seed/tool/150/150' },
  { id: 13, name: 'خودرو', img: 'https://picsum.photos/seed/car/150/150' },
  { id: 14, name: 'کالای دیجیتال', img: 'https://picsum.photos/seed/digital/150/150' },
  { id: 15, name: 'سلامت', img: 'https://picsum.photos/seed/health/150/150' },
  { id: 16, name: 'کالای اداری', img: 'https://picsum.photos/seed/office/150/150' },
];

export function CategoryIcons() {
  return (
    <section className="container mx-auto px-4 py-16">
      <h2 className="text-center text-3xl font-black mb-12 text-gray-800">خرید بر اساس دسته‌بندی</h2>
      <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-y-12 gap-x-6">
        {EXTENDED_MAIN_CATEGORIES.map((cat) => (
          <motion.div
            key={cat.id}
            whileHover={{ scale: 1.05 }}
            className="flex flex-col items-center gap-4 cursor-pointer group"
          >
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-gray-50 bg-white shadow-xl shadow-black/5 flex items-center justify-center p-4 transition-all group-hover:border-[#EF2020]/20 group-hover:shadow-2xl">
              <img 
                src={cat.img} 
                alt={cat.name} 
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="text-xs md:text-sm font-black text-gray-700 text-center leading-tight transition-colors group-hover:text-[#EF2020]">
              {cat.name}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function MainCategoryGrid() {
  return null;
}
