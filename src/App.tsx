/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { isSupabaseConfigured } from './lib/supabase';
import Header from './components/Header';
import BottomNavigation from './components/BottomNavigation';
import MobileDrawer from './components/MobileDrawer';
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
  const [activeTab, setActiveTab] = useState('home');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    // Check localStorage first for manual login (e.g. admin)
    const savedUser = localStorage.getItem('matinkala_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    if (!isSupabaseConfigured) return;

    const init = async () => {
      try {
        const { supabaseService } = await import('./services/supabaseService');
        
        // Fetch Auth
        const currentUser = await supabaseService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          localStorage.setItem('matinkala_user', JSON.stringify(currentUser));
        }
        
        supabaseService.onAuthStateChange((_event, session) => {
          const u = session?.user || null;
          if (u) {
            setUser(u);
            localStorage.setItem('matinkala_user', JSON.stringify(u));
          } else {
            const saved = localStorage.getItem('matinkala_user');
            if (saved) {
              const parsed = JSON.parse(saved);
              if (parsed.email === 'admin@matinkala.com') return;
            }
            setUser(null);
            localStorage.removeItem('matinkala_user');
          }
        });

        // Fetch Products
        try {
          const dbProducts = await supabaseService.getProducts();
          if (dbProducts) {
            setProducts(dbProducts);
            console.log(`Loaded ${dbProducts.length} products from database`);
          }
        } catch (dbErr) {
          console.error('Failed to load products from database:', dbErr);
          // If the table doesn't exist yet, we can keep the local ones
          // but if we are here and Supabase is configured, we probably want to know why it failed.
          // For now, let's keep it empty if it failed but was configured.
          setProducts([]);
        }
      } catch (err) {
        console.error('Init error:', err);
        setProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };

    init();
  }, []);

  const handleLogin = (u: any) => {
    setUser(u);
    localStorage.setItem('matinkala_user', JSON.stringify(u));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('matinkala_user');
  };
  
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

  const refreshProducts = async () => {
    try {
      const { supabaseService } = await import('./services/supabaseService');
      const dbProducts = await supabaseService.getProducts();
      if (dbProducts) {
        setProducts(dbProducts);
      }
    } catch (err) {
      console.error('Refresh products error:', err);
      // Don't fallback to sample data on refresh
    }
  };

  const activeProducts = isSupabaseConfigured ? products : ALL_PRODUCTS;

  const filteredProducts = activeProducts.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedProduct = activeProducts.find(p => p.id === selectedProductId) || activeProducts[0] || null;

  const wishlistItems = activeProducts.filter(p => wishlist.includes(p.id));

  return (
    <div className="min-h-screen bg-[#F5F5F5] selection:bg-red-100 selection:text-red-900" dir="rtl">
      <Header 
        user={user}
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
        onMenuClick={() => setIsDrawerOpen(true)}
      />

      <MobileDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        user={user}
        onUserClick={() => setIsDashboardOpen(true)}
      />

      {/* Drawers and Overlays */}
      <AnimatePresence>
        {isDashboardOpen && (
          <UserDashboard 
            onClose={() => setIsDashboardOpen(false)}
            wishlist={wishlist}
            onToggleWishlist={toggleWishlist}
            onAddToCart={addToCart}
            onLogin={handleLogin}
            onLogout={handleLogout}
            onProductChange={refreshProducts}
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
              className="fixed inset-0 bg-black/40 z-[100] backdrop-blur-sm"
            />
            {isCartOpen && (
              <motion.div 
                initial={{ x: -400 }}
                animate={{ x: 0 }}
                exit={{ x: -400 }}
                className="fixed left-0 top-0 h-full w-full max-w-md bg-white z-[110] shadow-2xl p-6 flex flex-col"
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
                className="fixed left-0 top-0 h-full w-full max-w-md bg-white z-[110] shadow-2xl p-6 flex flex-col"
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pb-12"
          >
            {searchTerm ? (
              <section className="w-full mx-auto py-12">
                <h2 className="text-xl font-black mb-8 px-4">نتایج جستجو برای "{searchTerm}"</h2>
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
                <Hero onProductClick={setSelectedProductId} />
                <CategoryIcons />
                <IncredibleOffers 
                  products={activeProducts}
                  onProductClick={setSelectedProductId} 
                  onAddToCart={addToCart}
                  wishlist={wishlist}
                  onToggleWishlist={toggleWishlist}
                />

                {/* Promo Banners Grid */}
                <section className="w-full mx-auto py-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-2 md:px-4">
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
                  products={activeProducts}
                  onProductClick={setSelectedProductId} 
                  onAddToCart={addToCart}
                  wishlist={wishlist}
                  onToggleWishlist={toggleWishlist}
                />

                {/* Feature Cards Status */}
                <section className="w-full mx-auto py-12 grid grid-cols-1 md:grid-cols-3 gap-6 px-2 md:px-4">
                  <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
                     <div className="text-5xl mb-6">🚀</div>
                     <h3 className="font-black text-lg mb-2">متین‌کالا پلاس</h3>
                     <p className="text-xs text-gray-500 font-medium leading-relaxed">ارسال رایگان، بازگشت وجه و پیشنهادهای اختصاصی برای اعضا</p>
                  </div>
                  <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
                     <div className="text-5xl mb-6">⚡</div>
                     <h3 className="font-black text-lg mb-2">متین‌کالا جت</h3>
                     <p className="text-xs text-gray-500 font-medium leading-relaxed">تحویل سوپرمارکتی در کمتر از ۴۵ دقیقه</p>
                  </div>
                  <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
                     <div className="text-5xl mb-6">🎁</div>
                     <h3 className="font-black text-lg mb-2">متین‌کلاب</h3>
                     <p className="text-xs text-gray-500 font-medium leading-relaxed">امتیاز بگیرید و با جایزه‌های میلیونی شانس خود را امتحان کنید</p>
                  </div>
                </section>
              </>
            )}
          </motion.main>
        ) : (selectedProduct ? (
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
        ) : (
          <div className="flex items-center justify-center min-h-[60vh]">
            <p className="text-gray-500 font-bold">محصول مورد نظر یافت نشد</p>
            <button onClick={() => setSelectedProductId(null)} className="mr-4 text-blue-500 font-black underline">بازگشت به خانه</button>
          </div>
        ))}
      </AnimatePresence>

      <Footer />

      <BottomNavigation 
        activeTab={activeTab} 
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (tab === 'home') {
            setSelectedProductId(null);
            setSearchTerm('');
            setIsDashboardOpen(false);
          } else if (tab === 'profile') {
            setIsDashboardOpen(true);
          } else if (tab === 'wishlist') {
            setIsWishlistOpen(true);
            setIsCartOpen(false);
            setIsDashboardOpen(false);
          } else if (tab === 'search') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            const searchInput = document.querySelector('input[placeholder="جستجو در متین‌کالا..."]') as HTMLInputElement;
            searchInput?.focus();
          }
        }} 
        orderCount={cartItems.length}
      />
    </div>
  );
}

