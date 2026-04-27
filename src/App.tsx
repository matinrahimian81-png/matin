/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import IncredibleOffers from './components/IncredibleOffers';
import UserDashboard from './components/UserDashboard';
import Footer from './components/Footer';
import { CategoryIcons, MainCategoryGrid } from './components/CategorySections';
import DetailedProductSection from './components/DetailedProductSection';
import ProductDetail from './components/ProductDetail';
import ProductCard from './components/ProductCard';
import { motion, AnimatePresence } from 'motion/react';
import { ALL_PRODUCTS } from './data';
import { CartItem, ProductData } from './types';
import { X } from 'lucide-react';

const PROMO_BANNERS = [
  'https://picsum.photos/seed/promo1/600/300',
  'https://picsum.photos/seed/promo2/600/300',
  'https://picsum.photos/seed/promo3/600/300',
  'https://picsum.photos/seed/promo4/600/300',
];

export default function App() {
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  
  // Scroll to top when view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedProductId]);

  const addToCart = (product: ProductData) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
    setIsWishlistOpen(false);
    setIsDashboardOpen(false);
  };

  const toggleWishlist = (id: number) => {
    setWishlist(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const filteredProducts = ALL_PRODUCTS.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedProduct = ALL_PRODUCTS.find(p => p.id === selectedProductId) || ALL_PRODUCTS[0];

  const wishlistItems = ALL_PRODUCTS.filter(p => wishlist.includes(p.id));

  return (
    <div className="min-h-screen bg-[#F5F5F5]" dir="rtl">
      <Header 
        onLogoClick={() => {
          setSelectedProductId(null);
          setSearchTerm('');
          setIsDashboardOpen(false);
        }} 
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        wishlistCount={wishlist.length}
        onSearch={(term) => {
          setSearchTerm(term);
          if (term) {
            setSelectedProductId(null);
            setIsDashboardOpen(false);
          }
        }}
        onCartClick={() => {
          setIsCartOpen(!isCartOpen);
          setIsWishlistOpen(false);
          setIsDashboardOpen(false);
        }}
        onWishlistClick={() => {
          setIsWishlistOpen(!isWishlistOpen);
          setIsCartOpen(false);
          setIsDashboardOpen(false);
        }}
        onUserClick={() => {
          setIsDashboardOpen(true);
          setIsCartOpen(false);
          setIsWishlistOpen(false);
        }}
      />

      {/* Drawers and Overlays */}
      <AnimatePresence>
        {isDashboardOpen && (
          <UserDashboard 
            onClose={() => setIsDashboardOpen(false)}
            wishlist={wishlist}
            onToggleWishlist={toggleWishlist}
            onAddToCart={addToCart}
            onProductClick={(id) => {
              setSelectedProductId(id);
              setIsDashboardOpen(false);
            }}
          />
        )}

        {(isCartOpen || isWishlistOpen) && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsCartOpen(false);
                setIsWishlistOpen(false);
              }}
              className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm"
            />
            {isCartOpen && (
              <motion.div 
                initial={{ x: -400 }}
                animate={{ x: 0 }}
                exit={{ x: -400 }}
                className="fixed left-0 top-0 h-full w-full max-w-md bg-white z-[70] shadow-2xl p-6 flex flex-col"
              >
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-black">سبد خرید شما</h2>
                  <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="flex-grow overflow-y-auto space-y-4 no-scrollbar">
                  {cartItems.length === 0 ? (
                    <div className="text-center py-20">
                      <div className="text-6xl mb-4">🛒</div>
                      <p className="text-gray-500 font-bold">سبد خرید شما فعلاً خالی است</p>
                    </div>
                  ) : (
                    cartItems.map(item => (
                      <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <img src={item.image} className="w-20 h-20 object-contain mix-blend-multiply" referrerPolicy="no-referrer" />
                        <div className="flex-grow">
                          <h4 className="text-xs font-black line-clamp-2 mb-2">{item.title}</h4>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-gray-500">{item.quantity} عدد</span>
                            <span className="text-sm font-black text-[#EF2020]">{item.price.toLocaleString()} تومان</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {cartItems.length > 0 && (
                  <div className="pt-6 border-t border-gray-100 mt-auto">
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-bold text-gray-500">جمع کل:</span>
                      <span className="text-xl font-black text-gray-900">
                        {cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString()} <span className="text-xs">تومان</span>
                      </span>
                    </div>
                    <button className="w-full bg-[#EF2020] text-white py-4 rounded-2xl font-black shadow-xl shadow-red-200 hover:bg-red-700 transition-all">
                      تکمیل سفارش و پرداخت
                    </button>
                  </div>
                )}
              </motion.div>
            )}
            
            {isWishlistOpen && (
              <motion.div 
                initial={{ x: -400 }}
                animate={{ x: 0 }}
                exit={{ x: -400 }}
                className="fixed left-0 top-0 h-full w-full max-w-md bg-white z-[70] shadow-2xl p-6 flex flex-col"
              >
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-black">علاقه‌مندی‌ها</h2>
                  <button onClick={() => setIsWishlistOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="flex-grow overflow-y-auto space-y-4 no-scrollbar">
                  {wishlistItems.length === 0 ? (
                    <div className="text-center py-20">
                      <div className="text-6xl mb-4">❤️</div>
                      <p className="text-gray-500 font-bold">لیست علاقه‌مندی‌های شما خالی است</p>
                    </div>
                  ) : (
                    wishlistItems.map(item => (
                      <div 
                        key={item.id} 
                        className="flex gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => {
                          setSelectedProductId(item.id);
                          setIsWishlistOpen(false);
                        }}
                      >
                        <img src={item.image} className="w-20 h-20 object-contain mix-blend-multiply" referrerPolicy="no-referrer" />
                        <div className="flex-grow">
                          <h4 className="text-xs font-black line-clamp-2 mb-2">{item.title}</h4>
                          <span className="text-sm font-black text-[#EF2020]">{item.price.toLocaleString()} تومان</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!selectedProductId ? (
          <motion.main 
            key="home"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="pb-12"
          >
            {searchTerm ? (
              <section className="container mx-auto px-4 py-12">
                <h2 className="text-xl font-black mb-8">نتایج جستجو برای "{searchTerm}"</h2>
                {filteredProducts.length > 0 ? (
                  <div className="flex flex-wrap gap-6 justify-center lg:justify-start">
                    {filteredProducts.map(product => (
                      <ProductCard 
                        key={product.id} 
                        {...product} 
                        onProductClick={setSelectedProductId} 
                        onAddToCart={() => addToCart(product)}
                        isWishlisted={wishlist.includes(product.id)}
                        onToggleWishlist={() => toggleWishlist(product.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-white rounded-3xl shadow-sm">
                    <div className="text-6xl mb-4">🔍</div>
                    <p className="text-gray-500 font-bold">محصولی با این مشخصات پیدا نکردیم</p>
                  </div>
                )}
              </section>
            ) : (
              <>
                <Hero />
                <CategoryIcons />
                <IncredibleOffers 
                  onProductClick={setSelectedProductId} 
                  onAddToCart={addToCart}
                  wishlist={wishlist}
                  onToggleWishlist={toggleWishlist}
                />

                {/* Promo Banners Grid */}
                <section className="container mx-auto px-4 py-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {PROMO_BANNERS.map((banner, i) => (
                      <motion.div
                        key={i}
                        whileHover={{ scale: 1.02 }}
                        className="rounded-2xl overflow-hidden shadow-md cursor-pointer border border-gray-100"
                      >
                        <img src={banner} alt={`Promo ${i}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </motion.div>
                    ))}
                  </div>
                </section>

                <MainCategoryGrid />
                <DetailedProductSection 
                  onProductClick={setSelectedProductId} 
                  onAddToCart={addToCart}
                  wishlist={wishlist}
                  onToggleWishlist={toggleWishlist}
                />

                {/* Feature Cards */}
                <section className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
                     <div className="text-5xl mb-6">🚀</div>
                     <h3 className="font-black text-lg mb-2">دیجی‌کالا پلاس</h3>
                     <p className="text-xs text-gray-500 font-medium leading-relaxed">ارسال رایگان، بازگشت وجه و پیشنهادهای اختصاصی برای اعضا</p>
                  </div>
                  <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
                     <div className="text-5xl mb-6">⚡</div>
                     <h3 className="font-black text-lg mb-2">دیجی‌کالا جت</h3>
                     <p className="text-xs text-gray-500 font-medium leading-relaxed">تحویل سوپرمارکتی در کمتر از ۴۵ دقیقه</p>
                  </div>
                  <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
                     <div className="text-5xl mb-6">🎁</div>
                     <h3 className="font-black text-lg mb-2">دیجی‌کلاب</h3>
                     <p className="text-xs text-gray-500 font-medium leading-relaxed">امتیاز بگیرید و با جایزه‌های میلیونی شانس خود را امتحان کنید</p>
                  </div>
                </section>
              </>
            )}
          </motion.main>
        ) : (
          <motion.div
            key="detail"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
          >
            <ProductDetail 
              product={selectedProduct} 
              onBack={() => setSelectedProductId(null)} 
              onAddToCart={() => addToCart(selectedProduct)}
              isWishlisted={wishlist.includes(selectedProduct.id)}
              onToggleWishlist={() => toggleWishlist(selectedProduct.id)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}

