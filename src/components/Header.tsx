/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { Search, User, ShoppingCart, Menu, Heart, LayoutGrid, Smartphone, Laptop, Shirt, Home, Sparkles, Gamepad2, Book, Trophy } from 'lucide-react';

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
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const categoriesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (categoriesRef.current && !categoriesRef.current.contains(event.target as Node)) {
        setIsCategoriesOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 left-0 right-0 z-[40] bg-white font-sans w-full shadow-[0_1px_4px_rgba(0,0,0,0.12)] md:shadow-none">
      {/* Top bar - Hidden on mobile */}
      <div className="hidden md:block bg-[#F0F0F1] text-gray-500 text-[10px] md:text-xs py-2 px-4 border-b border-gray-100">
        <div className="container !max-w-none mx-auto flex justify-between items-center px-4 lg:px-12">
          <div className="font-semibold">به متین‌کالا خوش آمدید</div>
          <div className="flex items-center gap-6 font-semibold">
            <a href="#" className="hover:text-gray-900 transition-colors">فروش در متین‌کالا</a>
            <a href="#" className="hover:text-gray-900 transition-colors">متین‌کالا پرو</a>
            <a href="#" className="hover:text-gray-900 transition-colors">راهنمای خرید</a>
          </div>
        </div>
      </div>

      {/* Main header row */}
      <div className="bg-white h-[56px] px-3 md:px-0 md:h-[80px] border-b border-white md:border-gray-100 relative z-10 w-full flex items-center">
        <div className="container !max-w-none mx-auto flex items-center justify-between w-full px-4 lg:px-12">
          
          {/* MOBILE LAYOUT CONTENT */}
          <div className="flex items-center justify-between w-full md:hidden h-full">
            <button 
              onClick={onMenuClick}
              className="w-10 h-10 flex items-center justify-center text-gray-800"
              aria-label="Menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div 
              className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 cursor-pointer" 
              onClick={onLogoClick}
            >
              <div className="text-[#EF2020] text-[24px] font-black italic tracking-tighter">
                MATINKALA
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button 
                onClick={onWishlistClick}
                className="w-10 h-10 flex items-center justify-center relative text-gray-800"
                aria-label="Wishlist"
              >
                <Heart className="w-6 h-6" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 bg-[#EF2020] text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full border border-white font-bold">
                    {wishlistCount}
                  </span>
                )}
              </button>
              <button 
                onClick={onCartClick}
                className="w-10 h-10 flex items-center justify-center relative text-gray-800"
                aria-label="Shopping Cart"
              >
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 bg-[#EF2020] text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full border border-white font-bold">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* DESKTOP LAYOUT CONTENT */}
          <div className="hidden md:flex items-center h-full w-full justify-between">
            {/* Right Side: Logo and Search */}
            <div className="flex items-center gap-4 lg:gap-8 min-w-0 pr-2 lg:pr-4">
              <div className="flex-shrink-0 cursor-pointer" onClick={onLogoClick}>
                <div className="text-[#EF2020] text-3xl lg:text-4xl font-black italic tracking-tighter">
                  MATINKALA
                </div>
              </div>

              <div className="w-[300px] lg:w-[600px] flex items-center bg-[#F0F0F1] rounded-xl overflow-hidden border border-transparent focus-within:bg-white focus-within:border-gray-200 focus-within:shadow-md transition-all group">
                <div className="flex-grow relative flex items-center h-12">
                  <input
                    type="text"
                    placeholder="جستجو در متین‌کالا..."
                    className="w-full bg-transparent py-3 pr-12 pl-6 text-sm outline-none font-medium text-gray-800 text-right"
                    dir="rtl"
                    onChange={(e) => onSearch?.(e.target.value)}
                  />
                  <Search className="absolute right-4 w-6 h-6 text-gray-400 group-focus-within:text-[#EF2020]" />
                </div>
              </div>
            </div>

            {/* Left Side: Actions */}
            <div className="flex items-center gap-2 lg:gap-4 shrink-0 pr-4">
              <button 
                onClick={onUserClick}
                className="flex items-center gap-2 text-gray-700 hover:bg-gray-50 border border-gray-200 px-3 lg:px-4 py-2 rounded-xl text-sm font-black transition-all"
              >
                <User className="w-5 h-5" />
                <span className="whitespace-nowrap">ورود | ثبت‌نام</span>
              </button>

              <div className="w-px bg-gray-200 h-6 mx-1 lg:mx-2" />

              <button 
                onClick={onWishlistClick} 
                className="relative text-gray-700 hover:text-[#EF2020] p-2 transition-colors"
                aria-label="علاقه‌مندی‌ها"
              >
                <Heart className="w-6 h-6" />
                {wishlistCount > 0 && <span className="absolute -top-1 -right-1 bg-[#EF2020] text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white font-bold">{wishlistCount}</span>}
              </button>

              <div className="w-px bg-gray-200 h-6 mx-1 lg:mx-2" />

              <button 
                onClick={onCartClick} 
                className="relative text-gray-700 hover:text-[#EF2020] p-2 transition-colors"
                aria-label="سبد خرید"
              >
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-[#EF2020] text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white font-bold">{cartCount}</span>}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE SEARCH ROW */}
      <div className="md:hidden bg-white h-[60px] flex items-center px-[12px] border-b border-gray-100">
        <div className="flex items-center bg-[#F5F5F5] h-[44px] w-full rounded-[22px] px-[12px]">
          <Search className="w-[18px] h-[18px] text-[#999] shrink-0" />
          <input
            type="text"
            placeholder="جستجو در متین‌کالا..."
            className="flex-1 bg-transparent border-none outline-none px-2 text-sm text-gray-800 placeholder-[#999] font-medium text-right leading-none h-full"
            dir="rtl"
            onChange={(e) => onSearch?.(e.target.value)}
          />
        </div>
      </div>

      {/* Nav Row - Hidden on mobile */}
      <div className="hidden md:block bg-white px-4 border-b border-gray-100">
        <div className="container !max-w-none mx-auto flex items-center h-[40px] justify-start px-4 lg:px-12">
          <div 
            ref={categoriesRef}
            className="relative shrink-0 h-full"
            onMouseEnter={() => {
              // Only use hover for laptop screens (lg)
              if (window.innerWidth >= 1024) setIsCategoriesOpen(true);
            }}
            onMouseLeave={() => {
              if (window.innerWidth >= 1024) setIsCategoriesOpen(false);
            }}
          >
            <button 
              onClick={() => {
                // Toggle on click for tablet/all screens
                setIsCategoriesOpen(!isCategoriesOpen);
              }}
              className={`flex items-center gap-3 h-full pl-8 text-[11px] font-black transition-colors relative ${isCategoriesOpen ? 'text-[#EF2020]' : 'text-gray-800 hover:text-[#EF2020]'}`}
            >
              <LayoutGrid className="w-5 h-5" />
              <span>دسته‌بندی کالاها</span>
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-px h-5 bg-gray-100" />
            </button>
            {/* Mega menu placeholder */}
            <div className={`absolute top-full right-0 w-[900px] bg-white shadow-2xl rounded-b-2xl border border-gray-100 transition-all duration-200 flex h-[450px] overflow-hidden z-[1001] ${isCategoriesOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                <div className="w-1/4 border-l border-gray-50 bg-gray-50/50 py-4 overflow-y-auto">
                   {CATEGORIES_NAV.map(cat => (
                     <div key={cat.id} className="px-6 py-3 flex items-center gap-3 text-xs font-bold text-gray-600 hover:text-[#EF2020] hover:bg-white cursor-pointer transition-colors">
                        {cat.icon}
                        <span>{cat.name}</span>
                     </div>
                   ))}
                </div>
                <div className="flex-grow p-10 grid grid-cols-3 gap-10">
                   <div className="space-y-4">
                      <h4 className="text-sm font-black text-[#EF2020] pb-2 border-b border-gray-100">برندهای محبوب</h4>
                      <ul className="space-y-3 text-xs font-bold text-gray-500 uppercase">
                         <li className="hover:text-gray-900 cursor-pointer">Samsung</li>
                         <li className="hover:text-gray-900 cursor-pointer">Apple</li>
                         <li className="hover:text-gray-900 cursor-pointer">Xiaomi</li>
                         <li className="hover:text-gray-900 cursor-pointer">Sony</li>
                      </ul>
                   </div>
                   <div className="space-y-4">
                      <h4 className="text-sm font-black text-gray-800 pb-2 border-b border-gray-100">موبایل</h4>
                      <ul className="space-y-3 text-xs font-bold text-gray-500">
                         <li className="hover:text-gray-900 cursor-pointer">گوشی موبایل</li>
                         <li className="hover:text-gray-900 cursor-pointer">لوازم جانبی موبایل</li>
                      </ul>
                   </div>
                   <div className="space-y-4">
                      <h4 className="text-sm font-black text-gray-800 pb-2 border-b border-gray-100">کالای دیجیتال</h4>
                      <ul className="space-y-3 text-xs font-bold text-gray-500">
                         <li className="hover:text-gray-900 cursor-pointer">لپ تاپ</li>
                         <li className="hover:text-gray-900 cursor-pointer">ساعت هوشمند</li>
                      </ul>
                   </div>
                </div>
            </div>
          </div>
          <nav className="flex items-center gap-6 lg:gap-10 h-full px-6 lg:px-8">
            {['شگفت‌انگیزها', 'سوپرمارکت', 'کارت هدیه', 'پرفروش‌ترین‌ها', 'تخفیف‌ها'].map((link) => (
              <a key={link} href="#" className="text-[11px] font-bold text-gray-600 hover:text-[#EF2020] transition-colors relative group h-full flex items-center">
                 <span>{link}</span>
                 <span className="absolute bottom-[-1px] left-0 right-0 h-[3px] bg-[#EF2020] scale-x-0 group-hover:scale-x-100 transition-transform origin-right"></span>
              </a>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
