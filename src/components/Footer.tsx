/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Instagram, Twitter, Linkedin, ShoppingCart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white mt-12 py-8">
      <div className="container mx-auto px-4">
        {/* Top section: Logo and social */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-gray-100">
          <div>
            <span className="text-[#EF2020] text-3xl font-black italic tracking-tighter">DIGIKALA</span>
            <div className="text-gray-500 text-sm mt-2">
              تلفن پشتیبانی ۶۱۹۳۰۰۰۰ - ۰۲۱ | ۷ روز هفته، ۲۴ ساعته پاسخگوی شما هستیم
            </div>
          </div>
          <div className="flex gap-4">
            <div className="p-2 border rounded-lg text-gray-400 hover:text-gray-600 cursor-pointer transition-colors">
              <Instagram className="w-6 h-6" />
            </div>
            <div className="p-2 border rounded-lg text-gray-400 hover:text-gray-600 cursor-pointer transition-colors">
              <Twitter className="w-6 h-6" />
            </div>
            <div className="p-2 border rounded-lg text-gray-400 hover:text-gray-600 cursor-pointer transition-colors">
              <Linkedin className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10 text-sm">
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-gray-900">با دیجی‌کالا</h4>
            <a href="#" className="text-gray-500 hover:text-[#EF2020]">اتاق خبر دیجی‌کالا</a>
            <a href="#" className="text-gray-500 hover:text-[#EF2020]">فروش در دیجی‌کالا</a>
            <a href="#" className="text-gray-500 hover:text-[#EF2020]">فرصت‌های شغلی</a>
            <a href="#" className="text-gray-500 hover:text-[#EF2020]">گزارش تخلف در دیجی‌کالا</a>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-gray-900">خدمات مشتریان</h4>
            <a href="#" className="text-gray-500 hover:text-[#EF2020]">پاسخ به پرسش‌های متداول</a>
            <a href="#" className="text-gray-500 hover:text-[#EF2020]">رویه‌های بازگرداندن کالا</a>
            <a href="#" className="text-gray-500 hover:text-[#EF2020]">شرایط استفاده</a>
            <a href="#" className="text-gray-500 hover:text-[#EF2020]">حریم خصوصی</a>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-gray-900">راهنمای خرید</h4>
            <a href="#" className="text-gray-500 hover:text-[#EF2020]">نحوه ثبت سفارش</a>
            <a href="#" className="text-gray-500 hover:text-[#EF2020]">رویه ارسال سفارش</a>
            <a href="#" className="text-gray-500 hover:text-[#EF2020]">شیوه‌های پرداخت</a>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-gray-900">همراه ما باشید!</h4>
            <div className="text-gray-500">با ثبت‌نام، از آخرین تخفیف‌ها باخبر شوید</div>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="ایمیل شما"
                className="bg-gray-100 border-none rounded-lg px-4 py-2 flex-grow outline-none focus:bg-white focus:ring-1 focus:ring-gray-200 transition-all"
              />
              <button className="bg-gray-200 text-gray-600 px-4 py-2 rounded-lg font-bold hover:bg-gray-300 transition-colors">ثبت</button>
            </div>
          </div>
        </div>

        {/* Badges and logos */}
        <div className="bg-dk-dark rounded-xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 text-white mb-8">
          <div className="flex items-center gap-4">
            <span className="text-2xl font-bold flex items-center gap-2">
              <ShoppingCart className="w-8 h-8" />
              دانلود اپلیکیشن دیجی‌کالا
            </span>
          </div>
          <div className="flex flex-wrap gap-4 justify-center">
            <img src="https://picsum.photos/seed/b1/120/40" alt="Bazaar" className="h-10 opacity-80 hover:opacity-100 transition-opacity cursor-pointer" />
            <img src="https://picsum.photos/seed/b2/120/40" alt="Myket" className="h-10 opacity-80 hover:opacity-100 transition-opacity cursor-pointer" />
            <img src="https://picsum.photos/seed/b3/120/40" alt="Direct" className="h-10 opacity-80 hover:opacity-100 transition-opacity cursor-pointer" />
          </div>
        </div>

        <div className="text-center text-gray-400 text-xs py-8 border-t border-gray-100">
           استفاده از مطالب فروشگاه اینترنتی دیجی‌کالا فقط برای مقاصد غیرتجاری و با ذکر منبع بلامانع است. کلیه حقوق این سایت متعلق به شرکت نوآوران فن آوازه (فروشگاه اینترنتی دیجی‌کالا) می‌باشد.
        </div>
      </div>
    </footer>
  );
}
