/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Filter, ChevronDown, Star } from 'lucide-react';
import { motion } from 'motion/react';

const PRODUCTS = [
  { id: 1, title: 'کتاب اثر مرکب نویسنده دارن هاردی', price: 120000, rating: 4.5, image: 'https://picsum.photos/seed/book1/200/200' },
  { id: 2, title: 'ماگ سفالی طرح سنتی کد ۰۱', price: 45000, rating: 4.8, image: 'https://picsum.photos/seed/mug1/200/200' },
  { id: 3, title: 'هدفون تسکو مدل TH 5091', price: 850000, rating: 4.2, image: 'https://picsum.photos/seed/hp1/200/200' },
  { id: 4, title: 'ساعت مچی عقربه ای مردانه کاسیو', price: 2400000, rating: 4.7, image: 'https://picsum.photos/seed/watch1/200/200' },
  { id: 5, title: 'کفش ورزشی نایکی مدل Air Max', price: 5600000, rating: 4.9, image: 'https://picsum.photos/seed/shoe1/200/200' },
  { id: 6, title: 'لامپ ال ای دی ۱۵ وات مهتابی', price: 35000, rating: 4.0, image: 'https://picsum.photos/seed/bulb1/200/200' },
  { id: 7, title: 'تبلت سامسونگ مدل Galaxy Tab A8', price: 12500000, rating: 4.6, image: 'https://picsum.photos/seed/tab1/200/200' },
  { id: 8, title: 'کیف لپ تاپ مدل چرمی قهوه ای', price: 450000, rating: 4.3, image: 'https://picsum.photos/seed/bag1/200/200' },
];

export default function ProductSection() {
  return (
    <section className="container mx-auto px-4 py-12 flex flex-col md:flex-row gap-8">
      {/* Right Sidebar (Filter) - In RTL, this is the first column */}
      <aside className="w-full md:w-64 flex-shrink-0">
        <div className="sticky top-40 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              فیلترها
            </h3>
            <button className="text-[10px] text-blue-500 font-bold">حذف همه</button>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-3 cursor-pointer group">
                <span className="text-sm font-bold text-gray-700">برند</span>
                <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
              </div>
              <div className="space-y-2">
                {['سامسونگ', 'اپل', 'ایسوس', 'شیائومی'].map(brand => (
                  <label key={brand} className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 accent-[#EF2020]" />
                    <span className="text-xs text-gray-600">{brand}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-gray-50">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-bold text-gray-700">محدوده قیمت</span>
              </div>
              <div className="space-y-4">
                <input type="range" className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#EF2020]" />
                <div className="flex justify-between text-[10px] text-gray-400">
                  <span>۰ تومان</span>
                  <span>۱۰۰ میلیون+</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
              <span className="text-sm font-bold text-gray-700">کالاهای موجود</span>
              <div className="w-10 h-5 bg-gray-200 rounded-full relative cursor-pointer shadow-inner">
                <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm"></div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Product Grid */}
      <div className="flex-grow">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-4 text-xs font-medium text-gray-400 overflow-x-auto no-scrollbar">
            <span className="text-gray-900 font-bold shrink-0">مرتب‌سازی:</span>
            <button className="text-[#EF2020] border-b border-[#EF2020] pb-2 shrink-0">مرتبط‌ترین</button>
            <button className="hover:text-gray-700 pb-2 shrink-0">پرفروش‌ترین‌</button>
            <button className="hover:text-gray-700 pb-2 shrink-0">ارزان‌ترین</button>
            <button className="hover:text-gray-700 pb-2 shrink-0">گران‌ترین</button>
            <button className="hover:text-gray-700 pb-2 shrink-0">جدیدترین</button>
          </div>
          <span className="text-[10px] text-gray-400 hidden sm:block">۸ کالا</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-gray-100 border border-gray-100 rounded-2xl overflow-hidden">
          {PRODUCTS.map((p) => (
            <motion.div
              key={p.id}
              whileHover={{ y: -4 }}
              className="bg-white p-6 flex flex-col gap-3 cursor-pointer hover:shadow-xl relative transition-all"
            >
              <div className="aspect-square relative mb-2">
                <img src={p.image} alt={p.title} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
              </div>
              <div className="h-10 text-xs font-bold text-gray-700 line-clamp-2 leading-relaxed">
                {p.title}
              </div>
              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-1 text-[10px] text-gray-400">
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  <span>{p.rating}</span>
                </div>
                <div className="flex items-center gap-1 font-black text-gray-900">
                  <span>{p.price.toLocaleString()}</span>
                  <span className="text-[10px] font-normal opacity-50">تومان</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
