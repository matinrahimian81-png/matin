/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { Search, User, ShoppingCart, Menu, Heart, LayoutGrid, Smartphone, Laptop, Shirt, Home, Sparkles, Gamepad2, Book, Trophy } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DEFAULT_MENU_CONFIG, normalizeMenuConfig } from './MenuManagement';
import { MenuConfig } from '../types';

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
  wishlistCount = 0,
  user,
  onProductClick
}: { 
  onLogoClick?: () => void; 
  cartCount?: number;
  onSearch?: (term: string) => void;
  onCartClick?: () => void;
  onWishlistClick?: () => void;
  onUserClick?: () => void;
  onMenuClick?: () => void;
  wishlistCount?: number;
  user?: any;
  onProductClick?: (id: number) => void;
}) {
  const [menu, setMenu] = useState<MenuConfig>(DEFAULT_MENU_CONFIG);
  const [activeL1Id, setActiveL1Id] = useState<string | null>(null);
  const [activeL2Id, setActiveL2Id] = useState<string | null>(null);
  const navRowRef = useRef<HTMLDivElement>(null);

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0];

  useEffect(() => {
    const loadMenuConfig = () => {
      const cached = localStorage.getItem('matinkala_menu_config');
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          const normalized = normalizeMenuConfig(parsed);
          setMenu(normalized);
        } catch (e) {
          console.error("Error loading menu config inside Header:", e);
        }
      } else {
        const normalized = normalizeMenuConfig(DEFAULT_MENU_CONFIG);
        setMenu(normalized);
      }
    };
    
    loadMenuConfig();

    window.addEventListener('matinkala_menu_changed', loadMenuConfig);
    return () => {
      window.removeEventListener('matinkala_menu_changed', loadMenuConfig);
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRowRef.current && !navRowRef.current.contains(event.target as Node)) {
        setActiveL1Id(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 left-0 right-0 z-[40] bg-white font-sans w-full shadow-[0_1px_4px_rgba(0,0,0,0.12)] md:shadow-none">
      {/* Top bar - Hidden on mobile */}
      <div className="hidden md:block bg-[#F0F0F1] text-gray-500 text-[10px] md:text-xs py-2 px-4 border-b border-gray-100">
        <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8 flex justify-between items-center">
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
        <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8 flex items-center justify-between w-full">
          
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
            <div className="flex items-center gap-2 lg:gap-4 min-w-0 pr-0 lg:pr-2">
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
                className={`flex items-center gap-2 text-gray-700 hover:bg-gray-50 border border-gray-200 px-3 lg:px-4 py-2 rounded-xl text-sm font-black transition-all ${user ? 'pl-5' : ''}`}
              >
                {user ? (
                  <div className="flex items-center gap-2 lg:gap-3">
                    <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200 shrink-0">
                      <User className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400" />
                    </div>
                    <span className="max-w-[80px] lg:max-w-[150px] truncate text-[11px] lg:text-sm">{userName}</span>
                  </div>
                ) : (
                  <>
                    <User className="w-5 h-5" />
                    <span className="whitespace-nowrap">ورود | ثبت‌نام</span>
                  </>
                )}
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
        <div 
          ref={navRowRef}
          onMouseLeave={() => {
            if (window.innerWidth >= 1024) {
              setActiveL1Id(null);
            }
          }}
          className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8 flex items-center h-[40px] justify-start relative whitespace-nowrap"
        >
          {/* Main button (Item 0) */}
          {menu.items && menu.items.length > 0 && (
            <div 
              className="relative shrink-0 h-full flex items-center"
              onMouseEnter={() => {
                if (window.innerWidth >= 1024) {
                  const firstItem = menu.items![0];
                  setActiveL1Id(firstItem.id);
                  if (firstItem.categories && firstItem.categories.length > 0) {
                    setActiveL2Id(firstItem.categories[0].id);
                  } else {
                    setActiveL2Id(null);
                  }
                }
              }}
            >
              <button 
                id="nav-catalogue-btn"
                onClick={(e) => {
                  e.preventDefault();
                  const firstItem = menu.items![0];
                  if (activeL1Id === firstItem.id) {
                    setActiveL1Id(null);
                  } else {
                    setActiveL1Id(firstItem.id);
                    if (firstItem.categories && firstItem.categories.length > 0) {
                      setActiveL2Id(firstItem.categories[0].id);
                    } else {
                      setActiveL2Id(null);
                    }
                  }
                }}
                className={`flex items-center gap-3 h-full pl-8 text-[11px] font-black transition-colors relative ${activeL1Id === menu.items[0].id ? 'text-[#EF2020]' : 'text-gray-800 hover:text-[#EF2020]'}`}
              >
                {(menu.items[0].useDefaultIcon ?? true) ? (
                  <LayoutGrid className="w-5 h-5 animate-pulse" />
                ) : menu.items[0].icon ? (
                  <img src={menu.items[0].icon} className="w-5 h-5 object-contain" />
                ) : (
                  <LayoutGrid className="w-5 h-5" />
                )}
                <span>{menu.items[0].title || "دسته‌بندی کالاها"}</span>
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-px h-5 bg-gray-100" />
              </button>
            </div>
          )}

          <nav className="flex items-center gap-4 lg:gap-8 h-full px-4 lg:px-6">
            {(menu.items?.slice(1) || []).map((link) => {
              let IconComponent = null;
              if (link.useDefaultIcon && link.icon) {
                IconComponent = (LucideIcons as any)[link.icon];
              }

              const hasCategories = link.categories && link.categories.length > 0;

              return (
                <div 
                  key={link.id} 
                  className="relative h-full flex items-center group"
                  onMouseEnter={() => {
                    if (window.innerWidth >= 1024 && hasCategories) {
                      setActiveL1Id(link.id);
                      if (link.categories && link.categories.length > 0) {
                        setActiveL2Id(link.categories[0].id);
                      } else {
                        setActiveL2Id(null);
                      }
                    }
                  }}
                >
                  <a 
                    id={`nav-l1-${link.id}`}
                    href={link.url || '#'} 
                    onClick={(e) => {
                      if (hasCategories) {
                        e.preventDefault();
                        if (activeL1Id === link.id) {
                          setActiveL1Id(null);
                        } else {
                          setActiveL1Id(link.id);
                          if (link.categories && link.categories.length > 0) {
                            setActiveL2Id(link.categories[0].id);
                          } else {
                            setActiveL2Id(null);
                          }
                        }
                      }
                    }}
                    className={`text-[11px] font-bold transition-all relative h-full flex items-center gap-1.5 ${activeL1Id === link.id ? 'text-[#EF2020]' : 'text-gray-600 hover:text-[#EF2020]'}`}
                  >
                    {link.useDefaultIcon && IconComponent && (
                      <IconComponent className="w-3.5 h-3.5 text-[#EF2020]/80 group-hover:text-[#EF2020]" />
                    )}
                    {!link.useDefaultIcon && link.icon && (
                      <img src={link.icon} className="w-3.5 h-3.5 object-contain" referrerPolicy="no-referrer" />
                    )}
                    <span>{link.title}</span>
                    <span className={`absolute bottom-[-1px] left-0 right-0 h-[3px] bg-[#EF2020] transition-transform origin-right ${activeL1Id === link.id ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
                  </a>
                </div>
              );
            })}
          </nav>

          {/* UNIFIED MEGA MENU */}
          <AnimatePresence>
            {activeL1Id && (
              (() => {
                const activeL1 = menu.items?.find(it => it.id === activeL1Id);
                if (!activeL1 || !activeL1.categories || activeL1.categories.length === 0) return null;

                return (
                  <motion.div 
                    id="nav-mega-menu"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full right-4 lg:right-8 w-[950px] lg:w-[1000px] xl:w-[1100px] bg-white shadow-2xl rounded-b-2xl border border-gray-100 flex h-[450px] overflow-hidden z-[1001]"
                  >
                    {/* Category list (Right column of Mega Menu) */}
                    <div className="w-1/4 border-l border-gray-100 bg-gray-50/50 py-4 overflow-y-auto relative z-10 select-none">
                      {activeL1.categories.map((cat, index) => {
                        const isCurrentActive = activeL2Id === cat.id || (!activeL2Id && index === 0);
                        
                        let IconComponent = LayoutGrid;
                        if (cat.useDefaultIcon && cat.icon) {
                          const resolved = (LucideIcons as any)[cat.icon];
                          if (resolved) IconComponent = resolved;
                        }

                        return (
                          <div 
                            id={`nav-mega-cat-${cat.id}`}
                            key={cat.id} 
                            onMouseEnter={() => {
                              setActiveL2Id(cat.id);
                            }}
                            onClick={() => {
                              setActiveL2Id(cat.id);
                            }}
                            className="px-6 py-3.5 flex items-center gap-3 text-xs font-bold cursor-pointer transition-all relative"
                          >
                            {/* Sliding/State background red borderhighlight */}
                            {isCurrentActive && (
                              <motion.div 
                                layoutId="activeMegaCategoryBgUnified"
                                className="absolute inset-0 bg-white border-r-4 border-r-[#EF2020] z-0 shadow-sm"
                                transition={{ type: "spring", stiffness: 350, damping: 28 }}
                              />
                            )}
                            
                            <div className={`relative z-10 flex items-center gap-3 transition-colors duration-200 ${isCurrentActive ? 'text-[#EF2020]' : 'text-gray-600 hover:text-[#EF2020]'}`}>
                              {cat.useDefaultIcon ? (
                                <IconComponent className={`w-4 h-4 transition-colors ${isCurrentActive ? 'text-[#EF2020]' : 'text-gray-400'}`} />
                              ) : cat.icon ? (
                                <img src={cat.icon} className="w-4 h-4 object-contain" />
                              ) : (
                                <LayoutGrid className="w-4 h-4 text-gray-300" />
                              )}
                              <span className="font-extrabold">{cat.title || <span className="text-gray-300">بدون عنوان</span>}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Columns list (Left content of Mega Menu) */}
                    <AnimatePresence mode="wait">
                      <motion.div 
                        key={activeL2Id || 'default-category'}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        className="flex-grow p-10 grid grid-cols-3 gap-10 overflow-y-auto bg-white"
                      >
                        {((activeL1.categories.find(c => c.id === activeL2Id) || activeL1.categories[0])?.columns || []).map((col) => (
                          <div id={`nav-mega-col-${col.id}`} key={col.id} className="space-y-4">
                            <h4 className="text-sm font-black text-[#EF2020] pb-2 border-b border-gray-100">{col.title || "بخش بی‌نام"}</h4>
                            <ul className="space-y-3 text-xs font-bold text-gray-500">
                              {(col.items || []).map((item) => (
                                <li 
                                  key={item.id}
                                  onClick={() => {
                                    if (item.productId && onProductClick) {
                                      onProductClick(item.productId);
                                    }
                                    setActiveL1Id(null);
                                  }}
                                  className="hover:text-gray-900 hover:translate-x-[-4px] cursor-pointer transition-all duration-200 text-right leading-relaxed"
                                >
                                  {item.title}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </motion.div>
                    </AnimatePresence>
                  </motion.div>
                );
              })()
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
