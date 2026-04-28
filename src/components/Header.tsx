/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Search, User, ShoppingCart, Menu, MapPin, Heart, ChevronDown, LayoutGrid, Smartphone, Laptop, Shirt, Home, Sparkles, Gamepad2, Book, Trophy } from 'lucide-react';

const CATEGORIES_NAV = [
  { id: 1, name: 'موبایل', icon: <Smartphone className="w-4 h-4" /> },
  { id: 2, name: 'لپ‌تاپ', icon: <Laptop className="w-4 h-4" /> },
  { id: 3, name: 'پوشاک', icon: <Shirt className="w-4 h-4" /> },
  { id: 4, name: 'خانه و آشپزخانه', icon: <Home className="w-4 h-4" /> },
  { id: 5, name: 'زیبایی و سلامت', icon: <Sparkles className="w-4 h-4" /> },
  { id: 6, name: 'اسباب‌بازی', icon: <Gamepad2 className="w-4 h-4" /> },
  { id: 7, name: 'کتاب و هنر', icon: <Book className="w-4 h-4" /> },
  { id: 8, name: 'ورزش و سفر', icon: <Trophy className="w-4 h-4" /> },
];

export default function Header({ 
  onLogoClick, 
  cartCount = 0, 
  onSearch,
  onCartClick,
  onWishlistClick,
  onUserClick,
  onMenuClick,
  wishlistCount = 0
}: { 
  onLogoClick?: () => void; 
  cartCount?: number;
  onSearch?: (term: string) => void;
  onCartClick?: () => void;
  onWishlistClick?: () => void;
  onUserClick?: () => void;
  onMenuClick?: () => void;
  wishlistCount?: number;
}) {
  return (
    <header className="sticky top-0 z-50 bg-white font-sans w-full">
      {/* Top bar - Hidden on mobile */}
      <div className="hidden md:block bg-[#F0F0F1] text-gray-500 text-[10px] md:text-xs py-2 px-4 border-b border-gray-100">
        <div className="container mx-auto flex justify-between items-center">
          <div className="font-semibold">به دیجی‌کالا خوش آمدید</div>
          <div className="flex items-center gap-6 font-semibold">
            <a href="#" className="hover:text-gray-900 transition-colors">فروش در دیجی‌کالا</a>
            <a href="#" className="hover:text-gray-900 transition-colors">دیجی‌کالا پرو</a>
            <a href="#" className="hover:text-gray-900 transition-colors">راهنمای خرید</a>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="bg-white py-2 md:py-4 px-4 shadow-sm border-b border-gray-100 relative z-10 w-full">
        <div className="container mx-auto">
          {/* Mobile Layout: Row 1 (Hamburger | Logo | Icons) */}
          <div className="flex items-center justify-between gap-4 md:hidden mb-2">
            <div className="flex items-center gap-2">
              <button 
                onClick={onMenuClick}
                className="p-2 text-gray-700 hover:bg-gray-100 rounded-xl"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="flex-shrink-0 cursor-pointer" onClick={onLogoClick}>
                <div className="text-[#EF2020] text-2xl font-black italic tracking-tighter">
                  DIGIKALA
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={onCartClick}
                className="relative text-gray-700 p-2"
              >
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 bg-[#EF2020] text-white text-[8px] w-4 h-4 flex items-center justify-center rounded-full border border-white font-bold">
                    {cartCount}
                  </span>
                )}
              </button>
              <button 
                onClick={onWishlistClick}
                className="relative text-gray-700 p-2"
              >
                <Heart className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Desktop Layout Layout */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex-shrink-0 cursor-pointer" onClick={onLogoClick}>
              <div className="text-[#EF2020] text-3xl font-black italic tracking-tighter flex items-center gap-2">
                <div className="bg-[#EF2020] w-10 h-10 rounded-lg flex items-center justify-center text-white text-xl shadow-lg shadow-red-200">D</div>
                <span>DIGIKALA</span>
              </div>
            </div>

            {/* Desktop Search */}
            <div className="flex-grow flex items-center bg-gray-100 rounded-xl overflow-hidden border border-gray-100 focus-within:bg-white focus-within:border-gray-200 focus-within:shadow-md transition-all max-w-3xl mx-auto group">
              <div className="flex-grow relative flex items-center">
                <Search className="absolute right-4 w-5 h-5 text-gray-400 pointer-events-none group-focus-within:text-[#EF2020]" />
                <input
                  type="text"
                  placeholder="جستجو در دیجی‌کالا..."
                  className="w-full bg-transparent py-3 pr-12 pl-6 text-sm outline-none font-medium text-gray-800"
                  onChange={(e) => onSearch?.(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={onUserClick}
                className="flex items-center gap-2 text-gray-700 hover:text-[#EF2020] transition-colors border border-gray-200 px-4 py-2 rounded-xl text-sm font-black bg-white hover:bg-gray-50"
              >
                <User className="w-5 h-5" />
                <span className="whitespace-nowrap">ورود | ثبت‌نام</span>
              </button>
              <div className="h-8 w-px bg-gray-200"></div>
              <div className="flex items-center gap-3">
                <button onClick={onWishlistClick} className="relative text-gray-700 hover:text-red-500 p-2 rounded-xl">
                  <Heart className="w-6 h-6" />
                  {wishlistCount > 0 && <span className="absolute -top-1 -right-1 bg-[#EF2020] text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white font-bold">{wishlistCount}</span>}
                </button>
                <div className="h-6 w-px bg-gray-200" />
                <button onClick={onCartClick} className="relative text-gray-700 hover:text-red-500 p-2 rounded-xl">
                  <ShoppingCart className="w-6 h-6" />
                  {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-[#EF2020] text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white font-bold">{cartCount}</span>}
                </button>
              </div>
            </div>
          </div>

          {/* Search bar for Mobile (Always visible below header) */}
          <div className="md:hidden mt-2">
            <div className="flex items-center bg-gray-100 rounded-xl overflow-hidden border border-gray-100 focus-within:bg-white focus-within:border-gray-200 transition-all group">
              <div className="flex-grow relative flex items-center">
                <Search className="absolute right-4 w-4 h-4 text-gray-400 pointer-events-none group-focus-within:text-[#EF2020]" />
                <input
                  type="text"
                  placeholder="جستجو در دیجی‌کالا..."
                  className="w-full bg-transparent py-2.5 pr-10 pl-4 text-xs outline-none font-medium text-gray-800"
                  onChange={(e) => onSearch?.(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category menu - Hidden on mobile */}
      <div className="hidden md:block bg-white border-b border-gray-100 px-4 shadow-sm">
        <div className="container mx-auto flex items-center">
          {/* "All Categories" button on RIGHT (Start of row in RTL) */}
          <div className="relative group shrink-0">
            <button className="flex items-center gap-3 py-4 pl-8 border-l border-gray-100 text-sm font-black text-gray-800 hover:text-[#EF2020] transition-colors">
              <LayoutGrid className="w-5 h-5" />
              <span>همه دسته‌بندی‌ها</span>
            </button>

            {/* Mock Mega-menu (Three levels placeholder) */}
            <div className="absolute top-full right-0 w-[900px] bg-white shadow-2xl rounded-b-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 flex h-[400px] overflow-hidden">
               {/* Level 1: Categories List */}
               <div className="w-1/4 border-l border-gray-50 bg-gray-50/50 py-4 overflow-y-auto">
                 {CATEGORIES_NAV.map(cat => (
                   <div key={cat.id} className="px-6 py-3 flex items-center gap-3 text-xs font-bold text-gray-600 hover:text-[#EF2020] hover:bg-white cursor-pointer transition-colors">
                      {cat.icon}
                      <span>{cat.name}</span>
                   </div>
                 ))}
               </div>
               {/* Level 2 & 3: Details */}
               <div className="flex-grow p-8 grid grid-cols-3 gap-8">
                  <div className="space-y-4">
                     <h4 className="text-sm font-black text-[#EF2020] pb-2 border-b border-gray-100">برندهای محبوب</h4>
                     <ul className="space-y-2 text-xs font-bold text-gray-500">
                        <li className="hover:text-gray-900 cursor-pointer">سامسونگ</li>
                        <li className="hover:text-gray-900 cursor-pointer">اپل</li>
                        <li className="hover:text-gray-900 cursor-pointer">شیائومی</li>
                        <li className="hover:text-gray-900 cursor-pointer">هواوی</li>
                     </ul>
                  </div>
                  <div className="space-y-4">
                     <h4 className="text-sm font-black text-gray-800 pb-2 border-b border-gray-100">گوشی موبایل</h4>
                     <ul className="space-y-2 text-xs font-bold text-gray-500">
                        <li className="hover:text-gray-900 cursor-pointer">گوشی سامسونگ</li>
                        <li className="hover:text-gray-900 cursor-pointer">گوشی شیائومی</li>
                        <li className="hover:text-gray-900 cursor-pointer">گوشی اپل (آیفون)</li>
                        <li className="hover:text-gray-900 cursor-pointer">گوشی نوکیا</li>
                     </ul>
                  </div>
                  <div className="space-y-4">
                     <h4 className="text-sm font-black text-gray-800 pb-2 border-b border-gray-100">لوازم جانبی</h4>
                     <ul className="space-y-2 text-xs font-bold text-gray-500">
                        <li className="hover:text-gray-900 cursor-pointer">کیف و کاور</li>
                        <li className="hover:text-gray-900 cursor-pointer">محافظ صفحه نمایش</li>
                        <li className="hover:text-gray-900 cursor-pointer">پاوربانک (شارژر همراه)</li>
                        <li className="hover:text-gray-900 cursor-pointer">هندزفری، هدفون، هدست</li>
                     </ul>
                  </div>
               </div>
            </div>
          </div>

          {/* Horizontal list next to the button */}
          <nav className="flex items-center gap-8 py-4 px-8 overflow-x-auto no-scrollbar">
            <a href="#" className="flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-[#EF2020] transition-colors relative group">
               <span>شگفت‌انگیزها</span>
               <span className="absolute bottom-[-16px] left-0 right-0 h-[3px] bg-[#EF2020] scale-x-0 group-hover:scale-x-100 transition-transform origin-right"></span>
            </a>
            <a href="#" className="flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-[#EF2020] transition-colors relative group">
               <span>سوپرمارکت</span>
               <span className="absolute bottom-[-16px] left-0 right-0 h-[3px] bg-[#EF2020] scale-x-0 group-hover:scale-x-100 transition-transform origin-right"></span>
            </a>
            <a href="#" className="flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-[#EF2020] transition-colors relative group">
               <span>پرفروش‌ترین‌ها</span>
               <span className="absolute bottom-[-16px] left-0 right-0 h-[3px] bg-[#EF2020] scale-x-0 group-hover:scale-x-100 transition-transform origin-right"></span>
            </a>
            <a href="#" className="flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-[#EF2020] transition-colors relative group">
               <span>تخفیف‌ها و پیشنهادها</span>
               <span className="absolute bottom-[-16px] left-0 right-0 h-[3px] bg-[#EF2020] scale-x-0 group-hover:scale-x-100 transition-transform origin-right"></span>
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
