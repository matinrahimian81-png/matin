/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  ChevronRight, 
  ChevronLeft,
  Star, 
  Truck, 
  ShieldCheck, 
  Plus, 
  Minus, 
  Heart, 
  Rotate3d, 
  ChevronDown,
  Info,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { ProductData } from '../types';

const TABS = [
  { id: 'specs', label: 'مشخصات' },
  { id: 'review', label: 'نقد و بررسی' },
  { id: 'comments', label: 'نظرات کاربران' },
  { id: 'qa', label: 'پرسش و پاسخ' }
];

export default function ProductDetail({ 
  product, 
  onBack,
  onAddToCart,
  isWishlisted = false,
  onToggleWishlist
}: { 
  product: ProductData;
  onBack?: () => void;
  onAddToCart?: () => void;
  isWishlisted?: boolean;
  onToggleWishlist?: () => void;
}) {
  const [selectedImg, setSelectedImg] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [activeTab, setActiveTab] = useState('specs');
  const [quantity, setQuantity] = useState(1);

  // Use product images if available
  const displayImages = product.images && product.images.length > 0 ? product.images : [product.image];

  const handleBuy = () => {
    onAddToCart?.();
  };

  return (
    <div className="bg-[#F5F5F5] min-h-screen pb-32" dir="rtl">
      {/* 1. Breadcrumb Navigation & Back Button */}
      <div className="container mx-auto px-4 lg:px-12 py-4 md:py-6 flex items-center justify-between">
        <nav className="hidden md:flex items-center gap-2 text-[13px] text-gray-500 font-bold overflow-x-auto no-scrollbar whitespace-nowrap">
          <button className="hover:text-gray-900 transition-colors" onClick={onBack}>خانه</button>
          <ChevronRight className="w-3.5 h-3.5 opacity-30" />
          <span className="text-gray-900 font-black truncate max-w-[200px]">{product.title}</span>
        </nav>
        
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-black text-gray-500 hover:text-gray-900 transition-colors border border-gray-200 px-4 py-2 rounded-xl bg-white shadow-sm"
        >
          <span>بازگشت</span>
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      <main className="container mx-auto px-0 md:px-4 lg:px-12 flex flex-col lg:flex-row gap-8 items-start">
        
        {/* LEFT column (purchase box - Desktop only) */}
        <aside className="hidden lg:block w-[320px] sticky top-32 order-2 lg:order-1 shrink-0">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl p-6 shadow-xl shadow-black/5 border border-gray-100 flex flex-col gap-6"
          >
            {/* Price Box */}
            <div className="space-y-4">
              <div className="flex flex-col items-end gap-1">
                {(product.discountPercentage ?? 0) > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="bg-[#EF2020] text-white text-[10px] font-black px-2 py-0.5 rounded-full">{product.discountPercentage}٪ تخفیف</span>
                    {(product.oldPrice ?? 0) > 0 && <span className="text-sm text-gray-400 line-through">{product.oldPrice?.toLocaleString()}</span>}
                  </div>
                )}
                <div className="flex items-center gap-1 font-black text-[28px] text-gray-900 leading-none">
                  <span>{product.price.toLocaleString()}</span>
                  <span className="text-[14px] font-bold opacity-60">تومان</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-emerald-600 font-bold text-[13px] bg-emerald-50 p-3 rounded-xl">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span>{product.inStock ? 'موجود در انبار متین‌کالا' : 'ناموجود'}</span>
              </div>
            </div>

            <div className="h-px bg-gray-100" />

            {/* Quantity & Buy */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between bg-gray-50 rounded-xl p-1 h-12 border border-gray-100">
                <button 
                  onClick={() => setQuantity(q => q + 1)}
                  className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-sm font-black text-[#EF2020] hover:bg-red-50 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <span className="font-black text-lg text-gray-800">{quantity}</span>
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-sm font-black text-[#EF2020] hover:bg-red-50 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
              </div>

              <button 
                onClick={handleBuy}
                disabled={!product.inStock}
                className={`w-full h-12 rounded-xl font-black text-lg transition-all active:scale-95 shadow-xl ${product.inStock ? 'bg-[#EF2020] hover:bg-red-700 text-white shadow-red-500/20' : 'bg-gray-200 text-gray-500 cursor-not-allowed shadow-none'}`}
              >
                افزودن به سبد خرید
              </button>

              <button 
                onClick={onToggleWishlist}
                className="w-full flex items-center justify-center gap-2 text-xs font-black text-gray-500 border border-gray-200 rounded-xl h-10 hover:bg-gray-50 transition-colors"
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#EF2020] text-[#EF2020]' : ''}`} />
                <span>{isWishlisted ? 'در علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'}</span>
              </button>
            </div>
          </motion.div>
        </aside>

        {/* RIGHT column (product info) */}
        <div className="w-full flex-grow space-y-4 md:space-y-8 order-1">
          <div className="bg-white md:rounded-2xl p-4 md:p-8 shadow-xl shadow-black/5 border-b md:border border-gray-100 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10">
            
            {/* Product Image Gallery (md:col-span-5) */}
            <div className="md:col-span-5 space-y-4 md:space-y-6">
              <div className="relative group aspect-square bg-white md:bg-[#FBFBFB] rounded-2xl flex items-center justify-center p-4 md:p-10 overflow-hidden md:border border-gray-50">
                 <motion.img 
                   key={selectedImg}
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   src={displayImages[selectedImg % displayImages.length]} 
                   className="w-full h-full object-contain md:mix-blend-multiply group-hover:scale-110 transition-transform duration-700 cursor-zoom-in"
                   referrerPolicy="no-referrer"
                 />
                 
                 {/* Mobile Image Pagination dots */}
                 {displayImages.length > 1 && (
                   <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 md:hidden">
                      {displayImages.slice(0, 5).map((_, i) => (
                        <div key={i} className={`h-1.5 rounded-full transition-all ${selectedImg === i ? 'w-4 bg-[#EF2020]' : 'w-1.5 bg-gray-200'}`} />
                      ))}
                   </div>
                 )}
              </div>
              
              <div className="hidden md:flex gap-3 overflow-x-auto no-scrollbar pb-2">
                {displayImages.length > 1 && displayImages.slice(0, 5).map((img, i) => (
                  <button 
                    key={i}
                    onClick={() => setSelectedImg(i)}
                    className={`min-w-[84px] h-[84px] bg-white rounded-xl border-2 transition-all p-2 flex items-center justify-center shrink-0 ${selectedImg === i ? 'border-[#EF2020]' : 'border-gray-50 opacity-60 hover:opacity-100'}`}
                  >
                    <img src={img} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Meta Info (md:col-span-7) */}
            <div className="md:col-span-7 flex flex-col gap-4 md:gap-6">
              <div className="space-y-2 md:space-y-3">
                <h1 className="text-lg md:text-[22px] font-black text-gray-900 leading-[1.6]">
                  {product.title}
                </h1>
              </div>

              <div className="flex items-center gap-4 border-y border-gray-50 py-3 md:py-4">
                <div className="flex items-center gap-1.5 px-1 py-0.5 rounded-lg">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-black text-gray-800">{product.rating || 5}</span>
                  <span className="text-[10px] text-gray-400 font-bold">از ۵</span>
                </div>
                <div className="h-4 w-px bg-gray-100" />
                <span className="text-[12px] md:text-[13px] text-gray-400 font-bold group cursor-pointer hover:text-blue-500">({product.reviewCount || 0} نظر کاربران)</span>
              </div>

              {/* Color Selector (Only if relevant or keep as generic for now) */}
              <div className="space-y-3 md:space-y-4">
                <h4 className="text-xs md:text-sm font-black text-gray-800 flex items-center gap-2">
                  <span>انتخاب ویژگی:</span>
                  <span className="text-gray-400 text-[10px] md:text-xs font-black">استاندارد</span>
                </h4>
                <div className="flex gap-4">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-[#EF2020] p-0.5 bg-[#EF2020]/5 relative">
                    <div className="w-full h-full rounded-full bg-gray-200 border border-black/10" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Check className="w-4 h-4 text-[#EF2020] drop-shadow-md" />
                    </div>
                  </div>
                </div>
              </div>

              {product.details && (
                <div className="mt-4 bg-blue-50 p-3 md:p-4 rounded-xl flex items-start gap-3 md:gap-4">
                  <Info className="w-4 h-4 md:w-5 md:h-5 text-blue-500 shrink-0 mt-0.5" />
                  <p className="text-[10px] md:text-[11px] font-bold text-blue-800 leading-relaxed italic">
                    {product.details}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sticky Mobile Add to Cart Bar */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 z-[60] shadow-[0_-4px_20px_rgba(0,0,0,0.1)] flex items-center justify-between gap-4">
            <button 
              onClick={handleBuy}
              className="flex-grow bg-[#EF2020] text-white h-12 rounded-xl font-black text-sm active:scale-95 transition-transform"
            >
              افزودن به سبد خرید
            </button>
            <div className="flex flex-col items-end shrink-0">
               <div className="flex items-center gap-1 font-black text-lg text-gray-900">
                  <span>{product.price.toLocaleString()}</span>
                  <span className="text-[10px] font-bold opacity-50">تومان</span>
               </div>
               {(product.discountPercentage ?? 0) > 0 && (
                 <span className="text-[10px] text-gray-400 line-through">{(product.oldPrice || 0) > 0 ? product.oldPrice?.toLocaleString() : ''}</span>
               )}
            </div>
          </div>

          {/* Collapsible Technical Specs for Mobile, Tabs for Desktop */}
          <div className="bg-white md:rounded-2xl shadow-xl shadow-black/5 border-y md:border border-gray-100 overflow-hidden">
            <div className="hidden md:flex items-center gap-1 border-b border-gray-50 px-4">
               {TABS.map(tab => (
                 <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-8 py-5 text-sm font-black transition-all relative ${activeTab === tab.id ? 'text-[#EF2020]' : 'text-gray-400 hover:text-gray-600'}`}
                 >
                   {tab.label}
                   {activeTab === tab.id && (
                     <motion.div 
                       layoutId="activeTab"
                       className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#EF2020] rounded-full"
                     />
                   )}
                 </button>
               ))}
            </div>

            <div className="p-4 md:p-10 font-medium text-gray-600 leading-loose text-sm min-h-[200px]">
               {/* Mobile Collapsible sections */}
               <div className="md:hidden space-y-1">
                  {TABS.map(tab => (
                    <div key={tab.id} className="border-b border-gray-50 last:border-0">
                       <button 
                         onClick={() => setActiveTab(activeTab === tab.id ? '' : tab.id)}
                         className="w-full flex items-center justify-between py-4 text-sm font-black text-gray-800"
                       >
                          <span>{tab.label}</span>
                          <ChevronDown className={`w-4 h-4 transition-transform ${activeTab === tab.id ? 'rotate-180' : ''}`} />
                       </button>
                       <AnimatePresence>
                          {activeTab === tab.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                               <div className="pb-4 text-xs font-bold text-gray-500 leading-relaxed">
                                  {tab.id === 'specs' ? (
                                     <div className="whitespace-pre-wrap">{product.description || 'مشخصاتی ثبت نشده است.'}</div>
                                  ) : tab.id === 'review' ? (
                                    <div className="whitespace-pre-wrap">{product.details || 'نقد و بررسی ثبت نشده است.'}</div>
                                  ) : (
                                     <p>محتوای {tab.label} در این بخش نمایش داده می‌شود.</p>
                                  )}
                               </div>
                            </motion.div>
                          )}
                       </AnimatePresence>
                    </div>
                  ))}
               </div>

               {/* Desktop Tab contents */}
               <div className="hidden md:block">
                 <AnimatePresence mode="wait">
                   <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                   >
                     {activeTab === 'specs' && (
                       <div className="space-y-8">
                         <h3 className="text-lg font-black text-gray-800">مشخصات فنی</h3>
                         <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                           {product.description || 'مشخصاتی برای این محصول ثبت نشده است.'}
                         </div>
                       </div>
                     )}
                     {activeTab === 'review' && (
                       <div className="space-y-8">
                         <h3 className="text-lg font-black text-gray-800">نقد و بررسی</h3>
                         <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                           {product.details || 'نقد و بررسی برای این محصول ثبت نشده است.'}
                         </div>
                       </div>
                     )}
                     {(activeTab !== 'specs' && activeTab !== 'review') && (
                       <p className="text-center py-20 text-gray-400 font-bold">محتوای {TABS.find(t => t.id === activeTab)?.label} در حال بارگذاری است...</p>
                     )}
                   </motion.div>
                 </AnimatePresence>
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
