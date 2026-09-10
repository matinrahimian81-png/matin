/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronDown, User, Sparkles, LayoutGrid } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { DEFAULT_MENU_CONFIG, normalizeMenuConfig } from './MenuManagement';
import { MenuConfig } from '../types';

export default function MobileDrawer({ 
  isOpen, 
  onClose,
  user,
  onUserClick,
  onProductClick,
  onSearch
}: { 
  isOpen: boolean; 
  onClose: () => void;
  user: any;
  onUserClick: () => void;
  onProductClick?: (id: number) => void;
  onSearch?: (term: string) => void;
}) {
  const [menu, setMenu] = useState<MenuConfig>(() => {
    const cached = typeof window !== 'undefined' ? localStorage.getItem('matinkala_menu_config') : null;
    if (cached) {
      try {
        return normalizeMenuConfig(JSON.parse(cached));
      } catch (e) {
        console.error("Error initializing menu config in MobileDrawer:", e);
      }
    }
    return normalizeMenuConfig(DEFAULT_MENU_CONFIG);
  });

  const [activeL1Id, setActiveL1Id] = useState<string | null>(null);
  const [expandedCatId, setExpandedCatId] = useState<string | null>(null);

  useEffect(() => {
    const loadMenuConfig = () => {
      const cached = localStorage.getItem('matinkala_menu_config');
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          const normalized = normalizeMenuConfig(parsed);
          setMenu(normalized);
        } catch (e) {
          console.error("Error loading menu config inside MobileDrawer:", e);
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

  // Ensure activeL1Id points to a valid Level 1 item
  useEffect(() => {
    if (menu.items && menu.items.length > 0) {
      if (!activeL1Id || !menu.items.some(it => String(it.id) === String(activeL1Id))) {
        setActiveL1Id(menu.items[0].id);
      }
    }
  }, [menu, activeL1Id]);

  const activeL1 = (menu.items || []).find(it => String(it.id) === String(activeL1Id)) || menu.items?.[0];
  const categories = activeL1?.categories || [];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-[200] backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-[88%] max-w-[340px] bg-white z-[210] shadow-2xl flex flex-col"
            dir="rtl"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
              <div className="text-[#EF2020] text-xl font-black italic tracking-tighter">MATINKALA</div>
              <button 
                onClick={onClose} 
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
                aria-label="بستن منو"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Section */}
            <div 
              onClick={() => { onUserClick(); onClose(); }}
              className="p-4 border-b border-gray-100 flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition-colors shrink-0 bg-white"
            >
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center shrink-0 border border-gray-200">
                <User className="w-5 h-5 text-gray-400" />
              </div>
              <div className="flex-grow min-w-0">
                {user ? (
                  <>
                    <h3 className="text-xs font-black text-gray-800 truncate">
                      {user.user_metadata?.full_name || user.email?.split('@')[0]}
                    </h3>
                    <p className="text-[10px] text-gray-400 font-bold">مشاهده حساب کاربری</p>
                  </>
                ) : (
                  <>
                    <h3 className="text-xs font-black text-gray-800">ورود یا ثبت‌نام</h3>
                    <p className="text-[10px] text-gray-400 font-bold">برای تجربه بهتر وارد شوید</p>
                  </>
                )}
              </div>
              <ChevronLeft className="w-4 h-4 text-gray-300 shrink-0" />
            </div>

            {/* Level 1 Horizontal Tabs (دسته‌بندی کالاها، شگفت‌انگیز، سوپرمارکت و...) */}
            {menu.items && menu.items.length > 0 && (
              <div className="border-b border-gray-100 bg-gray-50/60 px-3 py-2 shrink-0">
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                  {menu.items.map((l1) => {
                    const isSelected = String(activeL1Id) === String(l1.id);
                    const hasCategories = Array.isArray(l1.categories) && l1.categories.length > 0;

                    let IconComp = LayoutGrid;
                    if (l1.useDefaultIcon && l1.icon) {
                      const resolved = (LucideIcons as any)[l1.icon];
                      if (resolved) IconComp = resolved;
                    }

                    return (
                      <button
                        key={l1.id}
                        type="button"
                        onClick={() => {
                          if (hasCategories) {
                            setActiveL1Id(l1.id);
                            setExpandedCatId(null);
                          } else if (l1.url && l1.url !== '#') {
                            window.location.href = l1.url;
                            onClose();
                          } else {
                            setActiveL1Id(l1.id);
                            setExpandedCatId(null);
                          }
                        }}
                        className={`px-3 py-1.5 rounded-xl text-[11px] font-extrabold shrink-0 transition-all flex items-center gap-1.5 border ${
                          isSelected
                            ? 'bg-[#EF2020] text-white border-[#EF2020] shadow-sm'
                            : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        <IconComp className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-[#EF2020]'}`} />
                        <span>{l1.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Scrollable Categories & Sub-menus Area */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4 no-scrollbar">
              <div>
                <div className="flex items-center justify-between mb-3 px-1">
                  <h4 className="text-[11px] font-black text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#EF2020]" />
                    <span>{activeL1?.title || 'دسته‌بندی‌ها'}</span>
                  </h4>
                  {categories.length > 0 && (
                    <span className="text-[10px] text-gray-400 font-bold bg-gray-100 px-2 py-0.5 rounded-full">
                      {categories.length} دسته‌بندی
                    </span>
                  )}
                </div>

                {categories.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-2xl border border-gray-100 p-4">
                    <LayoutGrid className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-xs font-bold text-gray-500">زیردسته‌ای برای این بخش یافت نشد.</p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {categories.map((cat) => {
                      const isExpanded = expandedCatId === String(cat.id);
                      
                      // Resolve Icon component
                      let IconComponent = LayoutGrid;
                      if (cat.useDefaultIcon && cat.icon) {
                        const resolved = (LucideIcons as any)[cat.icon];
                        if (resolved) IconComponent = resolved;
                      }

                      const subCols = cat.columns || [];

                      return (
                        <div 
                          key={cat.id} 
                          className="border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-all"
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setExpandedCatId(isExpanded ? null : String(cat.id));
                            }}
                            className={`w-full flex items-center gap-3 p-3 text-right transition-colors ${
                              isExpanded ? 'bg-red-50/50' : 'hover:bg-gray-50'
                            }`}
                          >
                            <div className={`p-2 rounded-xl shrink-0 transition-colors ${
                              isExpanded ? 'bg-[#EF2020] text-white' : 'bg-gray-100 text-gray-600'
                            }`}>
                              {cat.useDefaultIcon ? (
                                <IconComponent className="w-4 h-4" />
                              ) : cat.icon ? (
                                <img src={cat.icon} className="w-4 h-4 object-contain" referrerPolicy="no-referrer" alt="" />
                              ) : (
                                <LayoutGrid className="w-4 h-4" />
                              )}
                            </div>
                            
                            <div className="flex-grow min-w-0">
                              <span className={`text-xs font-black block truncate ${
                                isExpanded ? 'text-[#EF2020]' : 'text-gray-800'
                              }`}>
                                {cat.title || 'دسته‌بندی'}
                              </span>
                              {subCols.length > 0 && (
                                <span className="text-[10px] text-gray-400 font-semibold block">
                                  {subCols.length} بخش
                                </span>
                              )}
                            </div>

                            <ChevronDown 
                              className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${
                                isExpanded ? 'rotate-180 text-[#EF2020]' : ''
                              }`} 
                            />
                          </button>

                          <AnimatePresence initial={false}>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.22, ease: "easeInOut" }}
                                className="overflow-hidden border-t border-gray-100 bg-gray-50/80"
                              >
                                <div className="p-3.5 space-y-3.5">
                                  {subCols.length === 0 ? (
                                    <p className="text-xs text-gray-400 py-1 text-center font-bold">
                                      زیرمجموعه‌ای تعریف نشده است
                                    </p>
                                  ) : (
                                    subCols.map((col) => (
                                      <div key={col.id} className="space-y-1.5">
                                        <div className="flex items-center gap-1.5 text-xs font-black text-[#EF2020] pr-1">
                                          <span className="w-1.5 h-1.5 rounded-full bg-[#EF2020] shrink-0" />
                                          <span>{col.title || 'بخش'}</span>
                                        </div>
                                        
                                        <ul className="space-y-1 pr-3 border-r-2 border-red-200 mr-1">
                                          {(col.items || []).map((item) => (
                                            <li 
                                              key={item.id}
                                              onClick={() => {
                                                if (item.productId && onProductClick) {
                                                  onProductClick(item.productId);
                                                } else if (onSearch) {
                                                  onSearch(item.title);
                                                }
                                                onClose();
                                              }}
                                              className="text-xs font-bold text-gray-600 hover:text-[#EF2020] hover:bg-white px-2.5 py-1.5 rounded-lg cursor-pointer transition-all flex items-center justify-between group active:scale-[0.98]"
                                            >
                                              <span className="truncate">{item.title}</span>
                                              <ChevronLeft className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#EF2020] transition-colors shrink-0" />
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    ))
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Extra Dynamic Pages & Quick Links */}
              {menu.items && menu.items.length > 1 && (
                <div className="pt-3 border-t border-gray-100">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2.5 pr-1">
                    دسترسی سریع به سایر صفحات
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {menu.items.map((link) => {
                      let IconComponent = Sparkles;
                      if (link.useDefaultIcon && link.icon) {
                        const resolved = (LucideIcons as any)[link.icon];
                        if (resolved) IconComponent = resolved;
                      }

                      return (
                        <button
                          key={link.id}
                          type="button"
                          onClick={() => {
                            if (link.categories && link.categories.length > 0) {
                              setActiveL1Id(link.id);
                              setExpandedCatId(null);
                            } else if (link.url && link.url !== '#') {
                              window.location.href = link.url;
                              onClose();
                            } else {
                              if (onSearch) onSearch(link.title);
                              onClose();
                            }
                          }}
                          className="flex items-center gap-2 p-2 rounded-xl border border-gray-100 bg-white hover:bg-gray-50 transition-colors text-right"
                        >
                          <IconComponent className="w-3.5 h-3.5 text-[#EF2020] shrink-0" />
                          <span className="text-[11px] font-black text-gray-700 truncate">{link.title}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Footer Links */}
            <div className="p-3 border-t border-gray-100 bg-gray-50 shrink-0">
              <div className="grid grid-cols-2 gap-1 text-center">
                <a href="#" className="text-[10px] font-bold text-gray-500 hover:text-gray-900 py-1">درباره ما</a>
                <a href="#" className="text-[10px] font-bold text-gray-500 hover:text-gray-900 py-1">تماس با ما</a>
                <a href="#" className="text-[10px] font-bold text-gray-500 hover:text-gray-900 py-1">قوانین و مقررات</a>
                <a href="#" className="text-[10px] font-bold text-gray-500 hover:text-gray-900 py-1">سوالات متداول</a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
