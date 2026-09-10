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
  onProductClick
}: { 
  isOpen: boolean; 
  onClose: () => void;
  user: any;
  onUserClick: () => void;
  onProductClick?: (id: number) => void;
}) {
  const [menu, setMenu] = useState<MenuConfig>(DEFAULT_MENU_CONFIG);
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
            className="fixed top-0 right-0 h-full w-[85%] max-w-[320px] bg-white z-[210] shadow-2xl flex flex-col"
            dir="rtl"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div className="text-[#EF2020] text-xl font-black italic">MATINKALA</div>
              <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Profile Section */}
            <div 
              onClick={() => { onUserClick(); onClose(); }}
              className="p-6 border-b border-gray-100 flex items-center gap-4 cursor-pointer hover:bg-gray-50"
            >
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-gray-400" />
              </div>
              <div className="flex-grow">
                {user ? (
                  <>
                    <h3 className="text-sm font-black text-gray-800">{user.user_metadata?.full_name || user.email?.split('@')[0]}</h3>
                    <p className="text-[10px] text-gray-400 font-bold">مشاهده حساب کاربری</p>
                  </>
                ) : (
                  <>
                    <h3 className="text-sm font-black text-gray-800">ورود یا ثبت‌نام</h3>
                    <p className="text-[10px] text-gray-400 font-bold">برای تجربه بهتر وارد شوید</p>
                  </>
                )}
              </div>
              <ChevronLeft className="w-4 h-4 text-gray-300" />
            </div>

            {/* Dynamic Categories & Extra Links */}
            <div className="flex-grow overflow-y-auto px-4 py-4 space-y-6 no-scrollbar">
              {/* Category section */}
              <div>
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 pr-2">دسته‌بندی کالاها</h4>
                <div className="space-y-2">
                  {(menu.items?.[0]?.categories || []).map((cat) => {
                    const isExpanded = expandedCatId === cat.id;
                    
                    // Resolve Icon component
                    let IconComponent = LayoutGrid;
                    if (cat.useDefaultIcon && cat.icon) {
                      const resolved = (LucideIcons as any)[cat.icon];
                      if (resolved) IconComponent = resolved;
                    }

                    return (
                      <div key={cat.id} className="border border-gray-100 rounded-xl overflow-hidden bg-white shadow-sm">
                        <button
                          onClick={() => setExpandedCatId(isExpanded ? null : cat.id)}
                          className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors"
                        >
                          <div className="p-2 bg-gray-50 rounded-lg shrink-0">
                            {cat.useDefaultIcon ? (
                              <IconComponent className="w-5 h-5 text-gray-500" />
                            ) : cat.icon ? (
                              <img src={cat.icon} className="w-5 h-5 object-contain" referrerPolicy="no-referrer" />
                            ) : (
                              <LayoutGrid className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                          <span className="text-xs font-extrabold text-gray-700">{cat.title}</span>
                          <ChevronDown className={`w-4 h-4 text-gray-400 mr-auto transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence initial={false}>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden bg-gray-50/50 border-t border-gray-50 px-4 py-3 space-y-4"
                            >
                              {(cat.columns || []).map((col) => (
                                <div key={col.id} className="space-y-1">
                                  <div className="text-[11px] font-black text-[#EF2020] pr-1">{col.title}</div>
                                  <ul className="space-y-1 pr-3 border-r border-gray-200">
                                    {(col.items || []).map((item) => (
                                      <li 
                                        key={item.id}
                                        onClick={() => {
                                          if (item.productId && onProductClick) {
                                            onProductClick(item.productId);
                                          }
                                        }}
                                        className="text-xs font-bold text-gray-500 hover:text-gray-900 py-1.5 cursor-pointer transition-colors"
                                      >
                                        {item.title}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Dynamic Pages & Quick Links */}
              {menu.items && menu.items.length > 1 && (
                <div className="pt-4 border-t border-gray-100">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 pr-2">دسترسی سریع</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {menu.items.slice(1).map((link) => {
                      let IconComponent = Sparkles;
                      if (link.useDefaultIcon && link.icon) {
                        const resolved = (LucideIcons as any)[link.icon];
                        if (resolved) IconComponent = resolved;
                      }

                      return (
                        <a
                          key={link.id}
                          href={link.url || '#'}
                          onClick={() => onClose()}
                          className="flex items-center gap-2 p-2.5 rounded-lg border border-gray-100 bg-white hover:bg-gray-50 transition-colors"
                        >
                          {link.useDefaultIcon ? (
                            <IconComponent className="w-3.5 h-3.5 text-[#EF2020]" />
                          ) : link.icon ? (
                            <img src={link.icon} className="w-3.5 h-3.5 object-contain" referrerPolicy="no-referrer" />
                          ) : (
                            <Sparkles className="w-3.5 h-3.5 text-[#EF2020]" />
                          )}
                          <span className="text-[11px] font-black text-gray-700 truncate">{link.title}</span>
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Footer Links */}
            <div className="p-4 border-t border-gray-100 bg-gray-50/50 mt-auto">
              <div className="grid grid-cols-2 gap-2 text-center">
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
