/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Filter, ChevronDown, ListFilter, ArrowUpDown } from 'lucide-react';
import { motion } from 'motion/react';
import ProductCard from './ProductCard';

const PRODUCTS = [
  { id: 1, title: 'کتاب اثر مرکب نویسنده دارن هاردی', price: 120000, rating: 4.5, image: 'https://picsum.photos/seed/book1/200/200', reviewCount: 120, inStock: true },
  { id: 2, title: 'ماگ سفالی طرح سنتی کد ۰۱', price: 45000, rating: 4.8, image: 'https://picsum.photos/seed/mug1/200/200', reviewCount: 85, inStock: true },
  { id: 3, title: 'هدفون تسکو مدل TH 5091', price: 850000, rating: 4.2, image: 'https://picsum.photos/seed/hp1/200/200', reviewCount: 42, inStock: true },
  { id: 4, title: 'ساعت مچی عقربه ای مردانه کاسیو', price: 2400000, rating: 4.7, image: 'https://picsum.photos/seed/watch1/200/200', reviewCount: 310, inStock: true },
  { id: 5, title: 'کفش ورزشی نایکی مدل Air Max', price: 5600000, rating: 4.9, image: 'https://picsum.photos/seed/shoe1/200/200', reviewCount: 540, inStock: false },
  { id: 6, title: 'لامپ ال ای دی ۱۵ وات مهتابی', price: 35000, rating: 4.0, image: 'https://picsum.photos/seed/bulb1/200/200', reviewCount: 200, inStock: true },
  { id: 7, title: 'تبلت سامسونگ مدل Galaxy Tab A8', price: 12500000, rating: 4.6, image: 'https://picsum.photos/seed/tab1/200/200', reviewCount: 90, inStock: true },
  { id: 8, title: 'کیف لپ تاپ مدل چرمی قهوه ای', price: 450000, rating: 4.3, image: 'https://picsum.photos/seed/bag1/200/200', reviewCount: 65, inStock: true },
];

export default function ProductSection() {
  return (
    <section className="container mx-auto px-2 md:px-4 py-6 md:py-12 flex flex-col md:flex-row gap-8">
      {/* Filters Sidebar - Desktop Only */}
      <aside className="hidden md:block w-64 flex-shrink-0">
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

            <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
              <span className="text-sm font-bold text-gray-700">کالاهای موجود</span>
              <div className="w-10 h-5 bg-gray-200 rounded-full relative cursor-pointer shadow-inner">
                <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm"></div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Product Grid Area */}
      <div className="flex-grow">
        {/* Desktop Header */}
        <div className="hidden md:flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-4 text-xs font-medium text-gray-400">
            <span className="text-gray-900 font-bold shrink-0">مرتب‌سازی:</span>
            <button className="text-[#EF2020] border-b border-[#EF2020] pb-2">مرتبط‌ترین</button>
            <button className="hover:text-gray-700 pb-2">پرفروش‌ترین‌</button>
            <button className="hover:text-gray-700 pb-2">جدیدترین</button>
          </div>
          <span className="text-[10px] text-gray-400">۸ کالا</span>
        </div>

        {/* Mobile Sticky Action Bar */}
        <div className="md:hidden sticky top-[110px] z-30 bg-white border-b border-gray-100 mb-4 py-2 px-1 flex items-center justify-around">
          <button className="flex items-center gap-2 text-[11px] font-black text-gray-800 py-2">
            <ListFilter className="w-4 h-4 text-[#EF2020]" />
            <span>فیلتر</span>
          </button>
          <div className="w-px h-4 bg-gray-200"></div>
          <button className="flex items-center gap-2 text-[11px] font-black text-gray-800 py-2">
            <ArrowUpDown className="w-4 h-4 text-gray-400" />
            <span>مرتبط‌ترین</span>
          </button>
        </div>

        {/* Grid: 2 columns mobile, 3-4 columns desktop */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-4">
          {PRODUCTS.map((p) => (
            <ProductCard
              key={p.id}
              id={p.id}
              title={p.title}
              price={p.price}
              rating={p.rating}
              image={p.image}
              reviewCount={p.reviewCount}
              inStock={p.inStock}
              hasFreeShipping={true}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
