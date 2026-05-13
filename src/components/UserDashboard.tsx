/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Package, Heart, Wallet, MapPin, MessageSquare, 
  Bell, User, LogOut, Camera, ChevronLeft, 
  Plus, ArrowUpRight, ArrowDownLeft, X, ShoppingCart,
  ShieldCheck, ShieldAlert, Mail, Lock, Eye, EyeOff,
  Image as ImageIcon, Move, Settings, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../lib/cropUtils';
import { ALL_PRODUCTS } from '../data';
import { ProductData } from '../types';
import { isSupabaseConfigured } from '../lib/supabase';

type DashboardSection = 'orders' | 'wishlist' | 'wallet' | 'addresses' | 'comments' | 'notifications' | 'account' | 'admin';

export default function UserDashboard({ 
  onClose,
  wishlist = [],
  onToggleWishlist,
  onAddToCart,
  onProductClick,
  onLogin,
  onLogout,
  onProductChange
}: { 
  onClose: () => void;
  wishlist: number[];
  onToggleWishlist: (id: number) => void;
  onAddToCart: (p: ProductData) => void;
  onProductClick: (id: number) => void;
  onLogin?: (u: any) => void;
  onLogout?: () => void;
  onProductChange?: () => void;
}) {
  const [activeSection, setActiveSection] = useState<DashboardSection>('orders');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    checkUser();
    
    let subscription: any = null;
    
    const setupListener = async () => {
      try {
        const { supabaseService } = await import('../services/supabaseService');
        subscription = supabaseService.onAuthStateChange((event, session) => {
          if (session) {
            setUser(session.user);
            setErrorMessage('');
            setSuccessMessage('');
          }
          if (event === 'SIGNED_OUT') {
            setUser(null);
          }
        });
      } catch (err) {
        console.error('Error setting up auth listener:', err);
      }
    };

    setupListener();

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  const checkUser = async () => {
    // Check local admin first
    const savedUser = localStorage.getItem('matinkala_user');
    if (savedUser) {
      const u = JSON.parse(savedUser);
      setUser(u);
      onLogin?.(u); // Sync with App
      if (u.email === 'admin@matinkala.com') {
        setIsAdmin(true);
      }
    }

    try {
      const { supabaseService } = await import('../services/supabaseService');
      const currentUser = await supabaseService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        onLogin?.(currentUser);
      }
    } catch (err) {
      console.error('Error checking user:', err);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setErrorMessage('');
      const { supabaseService } = await import('../services/supabaseService');
      await supabaseService.signInWithGoogle();
    } catch (err: any) {
      console.error('Login error:', err);
      setErrorMessage(err.message || 'خطا در ورود با گوگل');
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConfigured) {
      setErrorMessage('ابتدا باید کلیدهای Supabase را در تنظیمات وارد کنید.');
      return;
    }

    if (!email || !password) {
      setErrorMessage('لطفاً ایمیل و رمز عبور را وارد کنید');
      return;
    }

    try {
      setLoading(true);
      setErrorMessage('');
      setSuccessMessage('');

      // Special Admin Check
      if (email === 'MZM' && password === '1326') {
        const adminUser = {
          email: 'admin@matinkala.com',
          user_metadata: { full_name: 'مدیر' }
        };
        setUser(adminUser);
        setIsAdmin(true);
        onLogin?.(adminUser);
        setActiveSection('admin');
        setLoading(false);
        return;
      }

      const { supabaseService } = await import('../services/supabaseService');
      
      if (authMode === 'signup') {
        const data = await supabaseService.signUpWithEmail(email, password);
        if (data?.user) {
          if (!data.session) {
            setSuccessMessage('ثبت‌نام با موفقیت انجام شد. اگر تایید ایمیل در پنل شما فعال است، ایمیل خود را تایید کنید، در غیر این صورت می‌توانید وارد شوید.');
            setAuthMode('login');
          } else {
            setUser(data.user);
          }
        }
      } else {
        const data = await supabaseService.signInWithEmail(email, password);
        if (data?.user) {
          setUser(data.user);
          onLogin?.(data.user);
        }
      }
    } catch (err: any) {
      let msg = err.message || 'خطا در عملیات ورود/ثبت‌نام';
      console.error('Auth error:', msg);
      
      if (msg.includes('rate limit')) {
        msg = '⚠️ محدودیت زمانی: لطفاً چند دقیقه صبر کنید.';
      } else if (msg.includes('Invalid login credentials')) {
        msg = 'ایمیل یا رمز عبور اشتباه است.';
      } else if (msg.includes('User already registered')) {
        msg = 'این ایمیل قبلاً ثبت‌نام کرده است. وارد شوید.';
        setAuthMode('login');
      } else if (msg.includes('Email not confirmed')) {
        msg = 'ایمیل شما هنوز تایید نشده است. (در پنل Supabase تایید اجباری را غیرفعال کنید)';
      }
      
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      const { supabaseService } = await import('../services/supabaseService');
      await supabaseService.signOut();
      onLogout?.();
      setUser(null);
      setIsAdmin(false);
      onClose();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { id: 'orders', label: 'سفارش‌های من', icon: Package },
    { id: 'wishlist', label: 'علاقه‌مندی‌ها', icon: Heart },
    { id: 'wallet', label: 'کیف پول متین‌پی', icon: Wallet },
    ...(isAdmin ? [{ id: 'admin', label: 'پنل مدیریت', icon: ShieldCheck }] : []),
    { id: 'addresses', label: 'آدرس‌های من', icon: MapPin },
    { id: 'comments', label: 'نظرات من', icon: MessageSquare },
    { id: 'notifications', label: 'اعلان‌ها', icon: Bell },
    { id: 'account', label: 'اطلاعات حساب', icon: User },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-white lg:bg-gray-50 z-[300] flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden"
      dir="rtl"
    >
      {/* Sidebar */}
      <aside className="w-full lg:w-[280px] bg-white border-l border-gray-100 flex flex-col h-auto lg:h-full shadow-md z-20 lg:overflow-y-auto no-scrollbar">
        {/* User Info */}
        <div className="p-8 flex flex-col items-center gap-4 border-b border-gray-50">
          <div className="relative shrink-0">
            <div className="w-20 h-20 rounded-full bg-gray-100 border-4 border-white shadow-lg overflow-hidden flex items-center justify-center">
               <img 
                 src={user?.user_metadata?.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150"} 
                 alt="User" 
                 className="w-full h-full object-cover"
               />
            </div>
            <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md text-gray-400 group">
              <Camera className="w-4 h-4 group-hover:text-[#EF2020]" />
            </button>
          </div>
          
          <div className="text-center flex-grow">
            <h3 className="font-black text-gray-900 text-lg">{user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'کاربر مهمان'}</h3>
            <p className="text-[12px] text-gray-400 font-bold">{user?.email || 'برای دسترسی کامل وارد شوید'}</p>
          </div>
 
          <button onClick={onClose} className="lg:hidden p-2 text-gray-400">
            <X className="w-6 h-6" />
          </button>
        </div>
 
        {/* Auth / Action Section */}
        <div className="p-4 lg:p-6 border-b border-gray-50">
          {user ? (
            <button 
              onClick={handleLogout}
              className="w-full text-red-500 py-3 text-[11px] lg:text-sm font-black hover:bg-red-50 rounded-2xl border border-red-100 transition-all flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>خروج از حساب</span>
            </button>
          ) : (
            <div className="w-full space-y-4">
               {/* Login forms go here */}
               <div className="flex bg-gray-100 p-1 rounded-xl">
                <button 
                  onClick={() => { setAuthMode('login'); setErrorMessage(''); setSuccessMessage(''); }}
                  className={`flex-1 py-1.5 text-[10px] font-black rounded-lg transition-all ${authMode === 'login' ? 'bg-white text-[#EF2020] shadow-sm' : 'text-gray-400'}`}
                >
                  ورود
                </button>
                <button 
                  onClick={() => { setAuthMode('signup'); setErrorMessage(''); setSuccessMessage(''); }}
                  className={`flex-1 py-1.5 text-[10px] font-black rounded-lg transition-all ${authMode === 'signup' ? 'bg-white text-[#EF2020] shadow-sm' : 'text-gray-400'}`}
                >
                  ثبت‌نام
                </button>
              </div>

              {successMessage && (
                <p className="text-[10px] text-green-600 font-bold text-center bg-green-50 py-2 rounded-lg">{successMessage}</p>
              )}

              <form onSubmit={handleAuth} className="space-y-3">
                <div className="relative">
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="text"
                    placeholder="ایمیل"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2.5 pr-10 pl-4 text-xs font-bold focus:outline-none focus:border-red-200"
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type={showPassword ? "text" : "password"}
                    placeholder="رمز عبور"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2.5 pr-10 pl-10 text-xs font-bold focus:outline-none focus:border-red-200"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {errorMessage && (
                  <p className="text-[10px] text-red-500 font-bold text-center bg-red-50 py-2 rounded-lg">{errorMessage}</p>
                )}

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#EF2020] text-white py-3 rounded-xl text-xs font-black shadow-lg shadow-red-100 hover:bg-red-700 transition-all disabled:opacity-50"
                >
                  {loading ? 'در حال پردازش...' : (authMode === 'login' ? 'ورود به حساب' : 'ایجاد حساب کاربری')}
                </button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-100"></div>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase">
                  <span className="bg-white px-2 text-gray-400 font-bold">یا ورود با</span>
                </div>
              </div>

              <button 
                onClick={handleGoogleLogin}
                type="button"
                className="w-full flex items-center justify-center gap-2 border border-gray-200 px-6 py-2.5 rounded-xl text-xs font-black hover:bg-gray-50 transition-all"
              >
                <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
                <span>گوگل</span>
              </button>
            </div>
          )}
          
          {/* Progress Bar */}
          <div className="w-full mt-6 space-y-2">
            <div className="flex justify-between text-[10px] font-bold text-gray-400">
              <span>تکمیل پروفایل</span>
              <span>۶۰٪</span>
            </div>
            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#EF2020] w-[60%] rounded-full shadow-[0_0_8px_rgba(239,32,32,0.3)]"></div>
            </div>
          </div>
        </div>

        {/* Menu */}
        <nav className="p-4 space-y-1 flex flex-col">
          <div className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id as DashboardSection)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-bold text-sm ${
                  activeSection === item.id 
                  ? 'bg-[#EF2020] text-white shadow-lg shadow-red-200' 
                  : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span>{item.label}</span>
                {activeSection === item.id && <div className="mr-auto w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>}
              </button>
            ))}
          </div>
          
          <div className="mt-auto space-y-4 pt-8 border-t border-gray-50">
            <button 
              onClick={handleLogout}
              disabled={loading}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all font-bold text-sm"
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              <span>{loading ? 'در حال خروج...' : 'خروج از حساب'}</span>
            </button>
  
            {/* Connection Status Indicator */}
            <div className="px-4 py-3 rounded-2xl bg-gray-50 flex flex-col gap-3">
               <div className="flex items-center gap-3">
                 {isSupabaseConfigured ? (
                   <>
                     <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                     <div className="flex flex-col">
                        <span className="text-[10px] font-black text-gray-900">اتصال به دیتابیس برقرار شد</span>
                        <span className="text-[8px] font-bold text-gray-400">Supabase is ready</span>
                     </div>
                     <ShieldCheck className="w-4 h-4 text-green-500 mr-auto" />
                   </>
                 ) : (
                   <>
                     <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div>
                     <div className="flex flex-col">
                        <span className="text-[10px] font-black text-amber-600">عدم شناسایی کلیدها</span>
                        <span className="text-[8px] font-bold text-gray-400">Missing env variables</span>
                     </div>
                     <ShieldAlert className="w-4 h-4 text-amber-500 mr-auto" />
                   </>
                 )}
               </div>
               
               {!isSupabaseConfigured && (
                  <div className="mt-2 p-3 bg-white rounded-xl border border-dashed border-gray-200">
                    <p className="text-[9px] text-gray-400 font-medium leading-relaxed">
                      لطفاً اطلاعات اتصال را در بخش تنظیمات وارد کنید.
                    </p>
                  </div>
                )}
            </div>
          </div>
        </nav>
      </aside>
 
      {/* Main Content */}
      <main className="flex-grow lg:overflow-y-auto p-4 lg:p-10 lg:no-scrollbar relative">
        {/* Header (Mobile Close) */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-gray-900">
              {menuItems.find(i => i.id === activeSection)?.label}
            </h1>
            <p className="text-sm text-gray-400 mt-1">خوش آمدید، از مدیریت حساب کاربری خود لذت ببرید.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-3 bg-white border border-gray-100 rounded-2xl shadow-sm hover:bg-gray-50 transition-colors"
          >
            <X className="w-6 h-6 text-gray-900" />
          </button>
        </div>

        <div className="max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            {activeSection === 'orders' && (
              <motion.div key="orders" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <OrdersSection />
              </motion.div>
            )}
            {activeSection === 'wishlist' && (
              <motion.div key="wishlist" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <WishlistSection 
                  wishlist={wishlist} 
                  onToggleWishlist={onToggleWishlist} 
                  onAddToCart={onAddToCart}
                  onProductClick={onProductClick}
                />
              </motion.div>
            )}
            {activeSection === 'wallet' && (
              <motion.div key="wallet" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <WalletSection />
              </motion.div>
            )}
            {activeSection === 'admin' && (
              <motion.div key="admin" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <AdminSection onProductChange={onProductChange} />
              </motion.div>
            )}
            {(activeSection !== 'orders' && activeSection !== 'wishlist' && activeSection !== 'wallet' && activeSection !== 'admin') && (
              <motion.div 
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-32 text-center"
              >
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                   <Package className="w-10 h-10 text-gray-300" />
                </div>
                <h4 className="text-lg font-black text-gray-900">این بخش به زودی فعال می‌شود</h4>
                <p className="text-gray-400 mt-2">ما در حال کار بر روی این بخش از پنل کاربری هستیم.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </motion.div>
  );
}

function AdminSection({ onProductChange }: { onProductChange?: () => void }) {
  const [activeTab, setActiveTab] = useState<'products' | 'slider'>('products');

  return (
    <div className="space-y-8">
      {/* Admin Tabs */}
      <div className="flex items-center gap-8 border-b border-gray-100 pb-0">
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-4 text-sm font-black transition-all relative ${
            activeTab === 'products' ? 'text-[#EF2020]' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          مدیریت محصولات
          {activeTab === 'products' && (
            <motion.div
              layoutId="adminTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#EF2020]"
            />
          )}
        </button>
        <button
          onClick={() => setActiveTab('slider')}
          className={`pb-4 text-sm font-black transition-all relative ${
            activeTab === 'slider' ? 'text-[#EF2020]' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          مدیریت اسلایدر
          {activeTab === 'slider' && (
            <motion.div
              layoutId="adminTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#EF2020]"
            />
          )}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'products' ? (
          <motion.div key="products" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <ProductManagement onProductChange={onProductChange} />
          </motion.div>
        ) : (
          <motion.div key="slider" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <SliderManagement />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProductManagement({ onProductChange }: { onProductChange?: () => void }) {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // New Product State
  const [newProduct, setNewProduct] = useState<Partial<ProductData>>({
    title: '',
    price: 0,
    oldPrice: 0,
    discountPercentage: 0,
    quantity: 0,
    description: '',
    details: '',
    category: 'موبایل',
    promo_type: 'normal',
    inStock: true,
    rating: 5,
    reviewCount: 0,
    image: '',
    images: []
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { supabaseService } = await import('../services/supabaseService');
      const data = await supabaseService.getProducts();
      setProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: ProductData) => {
    setEditingId(product.id);
    setNewProduct({
      title: product.title,
      price: product.price,
      oldPrice: product.oldPrice || 0,
      discountPercentage: product.discountPercentage || 0,
      quantity: product.quantity || 0,
      description: product.description || '',
      category: product.category || 'موبایل',
      promo_type: product.promo_type || 'normal',
      image: product.image,
      images: product.images || []
    });
    setShowAddForm(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const { supabaseService } = await import('../services/supabaseService');
      const uploadedUrls: string[] = [];
      
      for (const file of Array.from(files) as File[]) {
        const url = await supabaseService.uploadProductImage(file);
        uploadedUrls.push(url);
      }

      setNewProduct(prev => {
        const updatedImages = [...(prev.images || []), ...uploadedUrls];
        return {
          ...prev,
          image: updatedImages[0] || '',
          images: updatedImages
        };
      });
    } catch (err) {
      console.error('Upload error:', err);
      alert('خطا در آپلود تصویر');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.title || !newProduct.price || !newProduct.image) {
      alert('لطفا موارد ستاره‌دار را پر کنید');
      return;
    }

    setLoading(true);
    try {
      const { supabaseService } = await import('../services/supabaseService');
      
      // Data for Supabase
      const productData = {
        title: newProduct.title,
        price: newProduct.price,
        image: newProduct.image,
        description: newProduct.description || '',
        quantity: newProduct.quantity || 0,
        category: newProduct.category,
        promo_type: newProduct.promo_type,
        discountPercentage: newProduct.promo_type === 'recommended' ? newProduct.discountPercentage : 0,
        oldPrice: (newProduct.promo_type === 'recommended' && newProduct.discountPercentage)
          ? Math.round(newProduct.price / (1 - newProduct.discountPercentage / 100))
          : 0,
        inStock: true,
        rating: 5,
        reviewCount: 0,
        images: newProduct.images || []
      };

      if (editingId) {
        try {
          await supabaseService.updateProduct(editingId, productData as any);
          alert('محصول با موفقیت ویرایش شد');
        } catch (updateErr: any) {
          if (updateErr.code === 'PGRST204' || (updateErr.message && updateErr.message.includes('column'))) {
            const minimalProduct = {
              title: newProduct.title,
              price: newProduct.price,
              image: newProduct.image,
              description: newProduct.description || '',
              quantity: newProduct.quantity || 0
            };
            await supabaseService.updateProduct(editingId, minimalProduct as any);
            alert('محصول با موفقیت ویرایش شد، اما بعضی ستون‌ها در دیتابیس شما وجود ندارد.');
          } else {
            throw updateErr;
          }
        }
      } else {
        try {
          await supabaseService.addProduct(productData as any);
        } catch (insertErr: any) {
          if (insertErr.code === 'PGRST204' || (insertErr.message && insertErr.message.includes('column'))) {
            const minimalProduct = {
              title: newProduct.title,
              price: newProduct.price,
              image: newProduct.image,
              description: newProduct.description || '',
              quantity: newProduct.quantity || 0
            };
            await supabaseService.addProduct(minimalProduct as any);
            alert('محصول با موفقیت اضافه شد، اما بعضی ستون‌ها در دیتابیس شما وجود ندارد.');
          } else {
            throw insertErr;
          }
        }
        alert('محصول با موفقیت اضافه شد');
      }
      
      setShowAddForm(false);
      setEditingId(null);
      setNewProduct({
        title: '',
        price: 0,
        oldPrice: 0,
        discountPercentage: 0,
        quantity: 0,
        description: '',
        details: '',
        category: 'موبایل',
        promo_type: 'normal',
        inStock: true,
        rating: 5,
        reviewCount: 0,
        image: '',
        images: []
      });
      fetchProducts();
      onProductChange?.();
    } catch (err: any) {
      console.error('Submit error:', err);
      alert(`خطا: ${err.message || 'مشکل در ارتباط با دیتابیس'}`);
    } finally {
      setLoading(false);
    }
  };

  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    // Immediate feedback
    console.log('handleDelete requested for ID:', id);
    
    // Safety check - we avoid window.confirm as it crashes/blocks some environments
    setDeletingId(id);
  };

  const confirmDelete = async (id: number) => {
    setLoading(true);
    setDeletingId(null);
    try {
      const { supabaseService } = await import('../services/supabaseService');
      
      console.log('Executing Supabase delete for ID:', id);
      await supabaseService.deleteProduct(id);
      
      // Update local state immediately for better UX
      setProducts(prev => prev.filter(p => p.id !== id));
      
      alert('محصول با موفقیت حذف شد');
      
      // Full refresh
      await fetchProducts();
      if (onProductChange) {
        onProductChange();
      }
    } catch (err: any) {
      console.error('Delete failed:', err);
      // Detailed error message for the user to debug Supabase RLS/settings
      alert(`خطا در حذف: ${err.message || 'مشکل در ارتباط با دیتابیس'}. ${err.code === '42501' ? 'احتمالا دسترسی حذف در Supabase تنظیم نشده است (RLS).' : ''}`);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { label: 'کل فروش امروز', value: '۱۲,۴۰۰,۰۰۰ تومان', icon: ArrowUpRight, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'سفارش‌های جدید', value: '۲۴ عدد', icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'محصولات فعال', value: `${products.length} عدد`, icon: ShoppingCart, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'امنیت سیستم', value: 'برقرار', icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div className="text-gray-400 text-xs font-bold">{stat.label}</div>
            <div className="text-lg font-black text-gray-900 mt-1">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Admin Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Management */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h4 className="font-black text-lg text-gray-900">مدیریت محصولات</h4>
            <button 
              onClick={() => {
                if (showAddForm) {
                  setShowAddForm(false);
                  setEditingId(null);
                } else {
                  setNewProduct({
                    title: '',
                    price: 0,
                    oldPrice: 0,
                    discountPercentage: 0,
                    quantity: 0,
                    description: '',
                    details: '',
                    category: 'موبایل',
                    promo_type: 'normal',
                    image: '',
                    images: []
                  });
                  setShowAddForm(true);
                }
              }}
              className="flex items-center gap-2 bg-[#EF2020] text-white px-4 py-2 rounded-xl text-xs font-black"
            >
              <Plus className="w-4 h-4" />
              {showAddForm ? 'بستن فرم' : 'افزودن محصول'}
            </button>
          </div>

          <AnimatePresence mode="wait">
            {showAddForm ? (
              <motion.form 
                key="form"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleSubmit}
                className="space-y-6 overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 mr-2">نام محصول *</label>
                    <input 
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-gray-200"
                      value={newProduct.title}
                      onChange={e => setNewProduct({...newProduct, title: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 mr-2">قیمت (تومان) *</label>
                    <input 
                      type="number"
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-gray-200"
                      value={newProduct.price}
                      onChange={e => setNewProduct({...newProduct, price: Number(e.target.value)})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 mr-2">موجودی انبار *</label>
                    <input 
                      type="number"
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-gray-200"
                      value={newProduct.quantity}
                      onChange={e => setNewProduct({...newProduct, quantity: Number(e.target.value)})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 mr-2">دسته‌بندی</label>
                    <select 
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-gray-200"
                      value={newProduct.category}
                      onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                    >
                      <option value="موبایل">موبایل</option>
                      <option value="لپ‌تاپ">لپ‌تاپ</option>
                      <option value="هدفون">هدفون</option>
                      <option value="ساعت هوشمند">ساعت هوشمند</option>
                      <option value="تبلت">تبلت</option>
                      <option value="کنسول بازی">کنسول بازی</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 mr-2">نوع نمایش محصول</label>
                    <select 
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-gray-200"
                      value={newProduct.promo_type}
                      onChange={e => setNewProduct({...newProduct, promo_type: e.target.value as any})}
                    >
                      <option value="normal">عادی (نمایش در لیست اصلی)</option>
                      <option value="recommended">پیشنهادی (نمایش در شگفت‌انگیز)</option>
                      <option value="special">ویژه (نمایش در پیشنهاد ویژه)</option>
                    </select>
                  </div>
                  {newProduct.promo_type === 'recommended' && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 mr-2">تخفیف (درصد)</label>
                      <input 
                        type="number"
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-gray-200"
                        value={newProduct.discountPercentage}
                        onChange={e => setNewProduct({...newProduct, discountPercentage: Number(e.target.value)})}
                        min="0"
                        max="100"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 mr-2">توضیحات کوتاه (جزئیات)</label>
                  <textarea 
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-gray-200 min-h-[80px]"
                    value={newProduct.details}
                    onChange={e => setNewProduct({...newProduct, details: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 mr-2">توضیحات کامل</label>
                  <textarea 
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-gray-200 min-h-[120px]"
                    value={newProduct.description}
                    onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 mr-2">تصاویر (اولین تصویر به عنوان تصویر اصلی ذخیره می‌شود)</label>
                  <div className="flex flex-wrap gap-3">
                    {newProduct.images?.map((url, idx) => (
                      <div key={idx} className={`w-20 h-20 rounded-xl border-2 overflow-hidden relative group ${newProduct.image === url ? 'border-[#EF2020]' : 'border-gray-100'}`}>
                        <img src={url} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1 transition-opacity">
                          <button 
                            type="button"
                            onClick={() => setNewProduct(prev => ({...prev, image: url}))}
                            className="p-1 px-2 bg-white text-[8px] font-black rounded-lg hover:bg-[#EF2020] hover:text-white transition-colors"
                          >
                            اصلی
                          </button>
                          <button 
                            type="button"
                            onClick={() => setNewProduct(prev => {
                              const filtered = prev.images?.filter((_, i) => i !== idx) || [];
                              return {
                                ...prev,
                                images: filtered,
                                image: prev.image === url ? (filtered[0] || '') : prev.image
                              };
                            })}
                            className="p-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                    <label className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-gray-50 transition-colors">
                      {isUploading ? (
                        <div className="w-4 h-4 border-2 border-[#EF2020] border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Plus className="w-5 h-5 text-gray-400" />
                          <span className="text-[8px] font-black text-gray-400">آپلود</span>
                        </>
                      )}
                      <input type="file" multiple className="hidden" onChange={handleImageUpload} disabled={isUploading} accept="image/*" />
                    </label>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={loading || isUploading}
                  className="w-full py-4 bg-[#EF2020] text-white rounded-2xl text-sm font-black hover:bg-red-600 transition-all disabled:opacity-50"
                >
                  {loading ? 'در حال ثبت...' : (editingId ? 'بروزرسانی محصول' : 'ثبت نهایی محصول')}
                </button>
              </motion.form>
            ) : (
              <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                {products.length === 0 ? (
                  <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <div className="text-sm font-black text-gray-400">هنوز هیچ محصولی ثبت نشده است</div>
                  </div>
                ) : (
                  products.map(p => (
                    <div key={p.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-3xl group">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                          <img src={p.image} className="w-full h-full object-contain" />
                        </div>
                        <div>
                          <div className="text-xs lg:text-sm font-black text-gray-800 line-clamp-1">{p.title}</div>
                          <div className="flex items-center gap-4 mt-1">
                            <div className="text-[10px] text-gray-400 font-bold">موجودی: {p.quantity || 0} عدد</div>
                            <div className="text-[10px] text-blue-600 font-black">{p.price.toLocaleString()} تومان</div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button 
                          type="button"
                          onClick={() => handleEdit(p)}
                          className="px-4 py-2 text-xs font-black text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all border border-blue-100 shadow-sm"
                        >
                          ویرایش
                        </button>
                        <button 
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (p.id) {
                              handleDelete(p.id);
                            } else {
                              alert('شناسه محصول وجود ندارد');
                            }
                          }}
                          className="w-10 h-10 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all flex items-center justify-center border border-red-100 shadow-sm cursor-pointer"
                          title="حذف محصول"
                        >
                          <X className="w-5 h-5 pointer-events-none" strokeWidth={3} />
                        </button>
                        
                        {/* Confirmation Overlay for individual product */}
                        {deletingId === p.id && (
                          <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-[100] flex flex-col items-center justify-center gap-2 p-2 rounded-2xl border-2 border-red-100">
                            <span className="text-[10px] font-black text-gray-900 text-center">مطمئنید؟</span>
                            <div className="flex gap-2">
                              <button 
                                onClick={() => confirmDelete(p.id)}
                                className="px-3 py-1 bg-red-600 text-white text-[9px] font-black rounded-lg hover:bg-red-700 shadow-sm"
                              >
                                بله، حذف شود
                              </button>
                              <button 
                                onClick={() => setDeletingId(null)}
                                className="px-3 py-1 bg-gray-100 text-gray-600 text-[9px] font-black rounded-lg hover:bg-gray-200"
                              >
                                انصراف
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sys Info */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
            <h4 className="font-black text-lg text-gray-900 mb-6">وضعیت سیستم</h4>
            <div className="space-y-4">
               <div className="p-6 border border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center text-center">
                 <ShieldCheck className="w-10 h-10 text-emerald-500 mb-4" />
                 <div className="text-sm font-black text-gray-800">امنیت سیستم برقرار است</div>
                 <p className="text-[10px] text-gray-400 font-bold mt-2 leading-relaxed">
                   آخرین بررسی امنیتی: ۱۰ دقیقه پیش
                   <br />
                   دیتابیس سوپابیس متصل و پایدار است.
                 </p>
               </div>
               <div className="space-y-2">
                 <div className="flex justify-between items-center text-[10px] font-black">
                   <span className="text-gray-400">استفاده از فضا</span>
                   <span className="text-gray-900">۱۲٪</span>
                 </div>
                 <div className="h-2 bg-gray-50 rounded-full overflow-hidden">
                   <div className="w-[12%] h-full bg-blue-500 rounded-full" />
                 </div>
               </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-[40px] text-white shadow-xl shadow-gray-200">
            <h4 className="font-black text-lg mb-4">نیاز به راهنمایی؟</h4>
            <p className="text-xs text-gray-400 leading-loose mb-6 font-bold">
              برای مدیریت دیتابیس و تنظیمات پیشرفته، می‌توانید از پنل اصلی سوپابیس استفاده کنید.
            </p>
            <button className="w-full py-3 bg-white text-black rounded-2xl text-xs font-black hover:bg-gray-100 transition-all">
              ورود به پنل سوپابیس
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function SliderManagement() {
  const [loading, setLoading] = useState(true);
  const [slides, setSlides] = useState<any[]>([]);
  const [products, setProducts] = useState<ProductData[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [editingSlideId, setEditingSlideId] = useState<number | null>(null);
  const [deletingSlideId, setDeletingSlideId] = useState<number | null>(null);

  // Cropper state
  const [image, setImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const [newSlide, setNewSlide] = useState({
    title: '',
    subtitle: '',
    button_text: 'مشاهده محصول',
    button_pos_x: 20,
    button_pos_y: 70,
    button_width: 15, // Default width %
    button_height: 10, // Default height %
    button_scale: 1.0,
    product_id: null as number | null,
    image: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { supabaseService } = await import('../services/supabaseService');
      const [slidesData, productsData] = await Promise.all([
        supabaseService.getSlides(),
        supabaseService.getProducts()
      ]);
      
      // Decode metadata from button_link if present
      const processedSlides = slidesData.map((slide: any) => {
        if (slide.button_link && slide.button_link.startsWith('__META:')) {
          try {
            const metaStr = slide.button_link.replace('__META:', '');
            const meta = JSON.parse(metaStr);
            return {
              ...slide,
              button_width: meta.w ?? slide.button_width,
              button_height: meta.h ?? slide.button_height,
              button_scale: meta.s ?? slide.button_scale,
              button_link: meta.l ?? ''
            };
          } catch (e) {
            return slide;
          }
        }
        return slide;
      });

      setSlides(processedSlides);
      setProducts(productsData);
    } catch (err) {
      console.error('Error fetching slider data:', err);
    } finally {
      setLoading(false);
    }
  };

  const onCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => setImage(reader.result?.toString() || null));
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleCreateSlide = async () => {
    if (!image && !editingSlideId) return;

    setIsUploading(true);
    try {
      const { supabaseService } = await import('../services/supabaseService');
      let imageUrl = newSlide.image;

      if (image && croppedAreaPixels) {
        const croppedImage = await getCroppedImg(image, croppedAreaPixels);
        if (!croppedImage) throw new Error('فیل در کراپ تصویر');
        imageUrl = await supabaseService.uploadSliderImage(croppedImage);
      }

      if (editingSlideId) {
        // Encode metadata into button_link to avoid schema errors
        const { button_width, button_height, button_scale, button_link, ...rest } = newSlide;
        const meta = { w: button_width, h: button_height, s: button_scale, l: button_link };
        const payload = {
          ...rest,
          button_link: `__META:${JSON.stringify(meta)}`,
          image: imageUrl
        };

        await supabaseService.updateSlide(editingSlideId, payload);
        alert('اسلاید با موفقیت ویرایش شد');
      } else {
        // Encode metadata into button_link to avoid schema errors
        const { button_width, button_height, button_scale, button_link, ...rest } = newSlide;
        const meta = { w: button_width, h: button_height, s: button_scale, l: button_link };
        const payload = {
          ...rest,
          button_link: `__META:${JSON.stringify(meta)}`,
          image: imageUrl,
          order_index: slides.length
        };

        await supabaseService.addSlide(payload);
        alert('اسلاید جدید با موفقیت اضافه شد');
      }

      setShowAddForm(false);
      setEditingSlideId(null);
      setImage(null);
      setNewSlide({
        title: '',
        subtitle: '',
        button_text: 'مشاهده محصول',
        button_pos_x: 20,
        button_pos_y: 70,
        button_width: 15,
        button_height: 10,
        button_scale: 1.0,
        product_id: null,
        image: ''
      });
      fetchData();
    } catch (err: any) {
      console.error('Error saving slide:', err);
      if (err.code === 'PGRST205') {
        alert('خطا: جدول اسلایدر هنوز توسط سیستم شناسایی نشده است. لطفا یک دقیقه صبر کنید و دوباره تلاش کنید، یا در پنل Supabase خود گزینه Reload Schema را بزنید.');
      } else {
        alert(`خطا در ذخیره اسلاید: ${err.message || 'خطای نامشخص'}`);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleEditSlide = (slide: any) => {
    setEditingSlideId(slide.id);
    setNewSlide({
      title: slide.title || '',
      subtitle: slide.subtitle || '',
      button_text: slide.button_text || 'مشاهده محصول',
      button_pos_x: slide.button_pos_x || 20,
      button_pos_y: slide.button_pos_y || 70,
      button_width: slide.button_width || 15,
      button_height: slide.button_height || 10,
      button_scale: slide.button_scale || 1.0,
      product_id: slide.product_id,
      image: slide.image
    });
    setImage(slide.image); // Set current image as preview
    setShowAddForm(true);
  };

  const handleDeleteSlide = async (id: number) => {
    setDeletingSlideId(id);
  };

  const confirmDeleteSlide = async (id: number) => {
    try {
      const { supabaseService } = await import('../services/supabaseService');
      await supabaseService.deleteSlide(id);
      setSlides(prev => prev.filter(s => s.id !== id));
      setDeletingSlideId(null);
      alert('اسلاید با موفقیت حذف شد');
    } catch (err) {
      console.error('Error deleting slide:', err);
      alert('خطا در حذف اسلاید. احتمالا جدول slides هنوز در دیتابیس ساخته نشده است.');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="flex items-center justify-between">
        <h4 className="font-black text-lg text-gray-900">مدیریت اسلایدر اصلی</h4>
        <button
          onClick={() => {
            if (showAddForm) {
              setShowAddForm(false);
              setEditingSlideId(null);
            } else {
              setNewSlide({
                title: '',
                subtitle: '',
                button_text: 'مشاهده محصول',
                button_pos_x: 20,
                button_pos_y: 70,
                product_id: null,
                image: ''
              });
              setImage(null);
              setShowAddForm(true);
            }
          }}
          className="flex items-center gap-2 bg-[#EF2020] text-white px-4 py-2 rounded-xl text-xs font-black shadow-lg shadow-red-100"
        >
          {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showAddForm ? 'بستن فرم' : 'افزودن اسلاید جدید'}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {showAddForm ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white p-6 md:p-10 rounded-[40px] border border-gray-100 shadow-xl space-y-8 overflow-hidden"
          >
            <div className="flex items-center gap-4 border-b border-gray-50 pb-6">
               <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-[#EF2020]">
                  <ImageIcon className="w-6 h-6" />
               </div>
               <div>
                  <h5 className="font-black text-gray-900 text-lg">{editingSlideId ? 'ویرایش اسلاید' : 'افزودن اسلاید جدید'}</h5>
                  <p className="text-xs text-gray-400 font-bold">تصویر خود را کراپ کنید و موقعیت دکمه را تنظیم نمایید.</p>
               </div>
            </div>

            <div className="space-y-12">
               {/* STEP 1: IMAGE CROP SECTION */}
               <div className="space-y-6">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center font-black">۱</div>
                    <h5 className="font-black text-gray-900">برش و انتخاب تصویر پس‌زمینه</h5>
                 </div>

                 {!image ? (
                   <div className="w-full aspect-[21/9] border-4 border-dashed border-gray-100 rounded-[40px] flex flex-col items-center justify-center relative hover:bg-gray-50 transition-all cursor-pointer group">
                     <input type="file" onChange={handleImageSelect} className="absolute inset-0 opacity-0 cursor-pointer z-10" accept="image/*" />
                     <div className="w-20 h-20 bg-white rounded-[30px] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-xl">
                       <Plus className="w-10 h-10 text-[#EF2020]" />
                     </div>
                     <span className="text-base font-black text-gray-900">انتخاب تصویر برای اسلایدر</span>
                     <p className="text-xs text-gray-400 font-bold mt-2">فرمت‌های رایج تصویر (JPG, PNG)</p>
                   </div>
                 ) : (
                   <div className="space-y-6">
                     <div className="relative aspect-[21/9] w-full bg-gray-100 rounded-[40px] overflow-hidden shadow-2xl border-4 border-white">
                       <Cropper
                         image={image}
                         crop={crop}
                         zoom={zoom}
                         aspect={21 / 9}
                         onCropChange={setCrop}
                         onCropComplete={onCropComplete}
                         onZoomChange={setZoom}
                       />
                     </div>
                     <div className="flex items-center gap-6 bg-white p-6 rounded-[30px] shadow-sm border border-gray-100">
                        <div className="flex items-center gap-4 flex-grow">
                           <span className="text-xs font-black text-gray-400 shrink-0">بزرگنمایی:</span>
                           <input
                              type="range"
                              value={zoom}
                              min={1}
                              max={3}
                              step={0.1}
                              onChange={(e) => setZoom(Number(e.target.value))}
                              className="flex-grow accent-[#EF2020] h-1.5 rounded-full"
                           />
                        </div>
                        <button onClick={() => setImage(null)} className="text-xs font-black text-red-500 bg-red-50 px-4 py-2 rounded-xl hover:bg-red-100 transition-all">تغییر تصویر</button>
                     </div>
                   </div>
                 )}
               </div>

               {/* STEP 2: ACTION ZONE POSITIONING (Below image crop as requested) */}
               <div className="space-y-6 pt-4 border-t border-gray-50">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#EF2020] text-white rounded-lg flex items-center justify-center font-black">۲</div>
                    <h5 className="font-black text-gray-900">تعیین محل کلیک و متن دکمه</h5>
                 </div>

                 <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Position Editor */}
                    <div className="lg:col-span-12 space-y-4">
                       <div className="flex items-center justify-between text-[11px] font-black text-gray-400 uppercase tracking-widest px-2">
                           <span>محل قرارگیری باکس (باکس را در تصویر جابجا کنید)</span>
                           <div className="flex gap-4">
                              <span className="text-gray-400">X: {newSlide.button_pos_x}%</span>
                              <span className="text-gray-400">Y: {newSlide.button_pos_y}%</span>
                           </div>
                       </div>
                       
                        <div className="relative w-full aspect-[21/9] bg-gray-50 rounded-[40px] shadow-2xl overflow-hidden group/hotspot border-4 border-white">
                          <div 
                            className="absolute inset-0 z-0 cursor-crosshair"
                            onClick={(e) => {
                               const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                               const x = ((rect.right - e.clientX) / rect.width) * 100;
                               const y = ((e.clientY - rect.top) / rect.height) * 100;
                               setNewSlide(prev => ({
                                 ...prev,
                                 button_pos_x: Number(Math.max(0, Math.min(100 - (prev.button_width || 15), x - (prev.button_width || 15) / 2)).toFixed(1)),
                                 button_pos_y: Number(Math.max(0, Math.min(100 - (prev.button_height || 10), y - (prev.button_height || 10) / 2)).toFixed(1))
                               }));
                            }}
                          >
                             {image ? (
                                <img src={image} className="w-full h-full object-cover opacity-50 contrast-125 pointer-events-none" alt="Positioning Preview" />
                             ) : (
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-950 text-gray-700 text-sm font-black">ابتدا از مرحله ۱ تصویر را انتخاب کنید</div>
                             )}
                             <div className="absolute inset-0 bg-black/5 pointer-events-none" />
                          </div>

                          {/* HOTSPOT / BUTTON BOX - DRAGGABLE & CROP-STYLE */}
                           <motion.div
                             drag
                             dragMomentum={false}
                             dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
                             onDrag={(e, info) => {
                                const parent = (e.currentTarget as HTMLElement).parentElement;
                                if (!parent) return;
                                const rect = parent.getBoundingClientRect();
                                const x = ((rect.right - info.point.x) / rect.width) * 100;
                                const y = ((info.point.y - rect.top) / rect.height) * 100;
                                setNewSlide(prev => ({
                                  ...prev,
                                  button_pos_x: Number(Math.max(0, Math.min(100 - (prev.button_width || 15), x)).toFixed(1)),
                                  button_pos_y: Number(Math.max(0, Math.min(100 - (prev.button_height || 10), y)).toFixed(1))
                                }));
                             }}
                             className="absolute border border-white/90 shadow-[0_0_0_1000px_rgba(0,0,0,0.5)] cursor-move z-10"
                             style={{ 
                                 right: `${newSlide.button_pos_x}%`, 
                                 top: `${newSlide.button_pos_y}%`,
                                 width: `${newSlide.button_width}%`,
                                 height: `${newSlide.button_height}%`,
                                 backgroundColor: 'rgba(255, 255, 255, 0.05)',
                             }}
                           >
                              <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
                                <div className="border-r border-b border-white/40" />
                                <div className="border-r border-b border-white/40" />
                                <div className="border-b border-white/40" />
                                <div className="border-r border-b border-white/40" />
                                <div className="border-r border-b border-white/40" />
                                <div className="border-b border-white/40" />
                                <div className="border-r border-white/40" />
                                <div className="border-r border-white/40" />
                                <div />
                              </div>
                              
                              <div className="absolute inset-0 pointer-events-none">
                                <div className="absolute -top-[1px] -right-[1px] w-5 h-5 border-t-[3px] border-r-[3px] border-white shadow-sm" />
                                <div className="absolute -top-[1px] -left-[1px] w-5 h-5 border-t-[3px] border-l-[3px] border-white shadow-sm" />
                                <div className="absolute -bottom-[1px] -right-[1px] w-5 h-5 border-b-[3px] border-r-[3px] border-white shadow-sm" />
                                <div className="absolute -bottom-[1px] -left-[1px] w-5 h-5 border-b-[3px] border-l-[3px] border-white shadow-sm" />

                                <div 
                                  className="absolute bottom-[-10px] left-[-10px] w-10 h-10 cursor-nesw-resize pointer-events-auto z-20"
                                  onPointerDown={(e) => {
                                    e.stopPropagation();
                                    const startX = e.clientX;
                                    const startY = e.clientY;
                                    const startW = newSlide.button_width || 15;
                                    const startH = newSlide.button_height || 10;
                                    const container = e.currentTarget.parentElement?.parentElement;
                                    
                                    const onMove = (moveEvent: PointerEvent) => {
                                      if (!container) return;
                                      const rect = container.parentElement?.getBoundingClientRect();
                                      if (!rect) return;
                                      
                                      const deltaPxX = startX - moveEvent.clientX;
                                      const deltaPxY = moveEvent.clientY - startY;
                                      
                                      const deltaW = (deltaPxX / rect.width) * 100;
                                      const deltaH = (deltaPxY / rect.height) * 100;
                                      
                                      setNewSlide(prev => ({
                                        ...prev,
                                        button_width: Number(Math.max(5, Math.min(100 - (prev.button_pos_x || 0), startW + deltaW)).toFixed(1)),
                                        button_height: Number(Math.max(5, Math.min(100 - (prev.button_pos_y || 0), startH + deltaH)).toFixed(1))
                                      }));
                                    };
                                    
                                    const onUp = () => {
                                      window.removeEventListener('pointermove', onMove);
                                      window.removeEventListener('pointerup', onUp);
                                    };
                                    
                                    window.addEventListener('pointermove', onMove);
                                    window.addEventListener('pointerup', onUp);
                                  }}
                                />
                              </div>

                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                <Move className="w-5 h-5 text-white drop-shadow-md opacity-60" />
                              </div>

                              {/* Selection Handles (Crop Style) - Comprehensive Set */}
                              <div className="absolute inset-0 pointer-events-none">
                                {/* Corners */}
                                <div className="absolute -top-[2px] -right-[2px] w-6 h-6 border-t-[4px] border-r-[4px] border-white shadow-sm z-30" />
                                <div className="absolute -top-[2px] -left-[2px] w-6 h-6 border-t-[4px] border-l-[4px] border-white shadow-sm z-30" />
                                <div className="absolute -bottom-[2px] -right-[2px] w-6 h-6 border-b-[4px] border-r-[4px] border-white shadow-sm z-30" />
                                <div className="absolute -bottom-[2px] -left-[2px] w-6 h-6 border-b-[4px] border-l-[4px] border-white shadow-sm z-30" />

                                {/* Resize Hitspots */}
                                {/* Top Right */}
                                <div 
                                  className="absolute -top-3 -right-3 w-8 h-8 cursor-nesw-resize pointer-events-auto z-40"
                                  onPointerDown={(e) => {
                                    e.stopPropagation();
                                    const startX = e.clientX;
                                    const startY = e.clientY;
                                    const startW = newSlide.button_width;
                                    const startH = newSlide.button_height;
                                    const startXPos = newSlide.button_pos_x;
                                    const startYPos = newSlide.button_pos_y;
                                    const parentW = e.currentTarget.parentElement?.parentElement?.parentElement?.clientWidth || 1;
                                    const parentH = e.currentTarget.parentElement?.parentElement?.parentElement?.clientHeight || 1;
                                    
                                    const onMove = (mE: PointerEvent) => {
                                      const dX = (startX - mE.clientX) / parentW * 100;
                                      const dY = (startY - mE.clientY) / parentH * 100;
                                      setNewSlide(prev => ({
                                        ...prev,
                                        button_pos_x: Number(Math.max(0, Math.min(startXPos + startW - 5, startXPos + dX)).toFixed(1)),
                                        button_width: Number(Math.max(5, startW - dX)).toFixed(1),
                                        button_pos_y: Number(Math.max(0, Math.min(startYPos + startH - 5, startYPos - dY)).toFixed(1)),
                                        button_height: Number(Math.max(5, startH + dY)).toFixed(1)
                                      }));
                                    };
                                    const onUp = () => { window.removeEventListener('pointermove', onMove); window.removeEventListener('pointerup', onUp); };
                                    window.addEventListener('pointermove', onMove); window.addEventListener('pointerup', onUp);
                                  }}
                                />

                                {/* Top Left */}
                                <div 
                                  className="absolute -top-3 -left-3 w-8 h-8 cursor-nwse-resize pointer-events-auto z-40"
                                  onPointerDown={(e) => {
                                    e.stopPropagation();
                                    const startX = e.clientX;
                                    const startY = e.clientY;
                                    const startW = newSlide.button_width;
                                    const startH = newSlide.button_height;
                                    const startYPos = newSlide.button_pos_y;
                                    const parentW = e.currentTarget.parentElement?.parentElement?.parentElement?.clientWidth || 1;
                                    const parentH = e.currentTarget.parentElement?.parentElement?.parentElement?.clientHeight || 1;
                                    
                                    const onMove = (mE: PointerEvent) => {
                                      const dX = (mE.clientX - startX) / parentW * 100;
                                      const dY = (startY - mE.clientY) / parentH * 100;
                                      setNewSlide(prev => ({
                                        ...prev,
                                        button_width: Number(Math.max(5, Math.min(100 - (prev.button_pos_x || 0), startW + dX)).toFixed(1)),
                                        button_pos_y: Number(Math.max(0, Math.min(startYPos + startH - 5, startYPos - dY)).toFixed(1)),
                                        button_height: Number(Math.max(5, startH + dY)).toFixed(1)
                                      }));
                                    };
                                    const onUp = () => { window.removeEventListener('pointermove', onMove); window.removeEventListener('pointerup', onUp); };
                                    window.addEventListener('pointermove', onMove); window.addEventListener('pointerup', onUp);
                                  }}
                                />

                                {/* Bottom Right */}
                                <div 
                                  className="absolute -bottom-3 -right-3 w-8 h-8 cursor-nwse-resize pointer-events-auto z-40"
                                  onPointerDown={(e) => {
                                    e.stopPropagation();
                                    const startX = e.clientX;
                                    const startY = e.clientY;
                                    const startW = newSlide.button_width;
                                    const startH = newSlide.button_height;
                                    const startXPos = newSlide.button_pos_x;
                                    const parentW = e.currentTarget.parentElement?.parentElement?.parentElement?.clientWidth || 1;
                                    const parentH = e.currentTarget.parentElement?.parentElement?.parentElement?.clientHeight || 1;
                                    
                                    const onMove = (mE: PointerEvent) => {
                                      const dX = (startX - mE.clientX) / parentW * 100;
                                      const dY = (mE.clientY - startY) / parentH * 100;
                                      setNewSlide(prev => ({
                                        ...prev,
                                        button_pos_x: Number(Math.max(0, Math.min(startXPos + startW - 5, startXPos + dX)).toFixed(1)),
                                        button_width: Number(Math.max(5, startW - dX)).toFixed(1),
                                        button_height: Number(Math.max(5, Math.min(100 - (prev.button_pos_y || 0), startH + dY)).toFixed(1))
                                      }));
                                    };
                                    const onUp = () => { window.removeEventListener('pointermove', onMove); window.removeEventListener('pointerup', onUp); };
                                    window.addEventListener('pointermove', onMove); window.addEventListener('pointerup', onUp);
                                  }}
                                />

                                {/* Bottom Left (The primary one we already had) */}
                                <div 
                                  className="absolute -bottom-3 -left-3 w-8 h-8 cursor-nesw-resize pointer-events-auto z-40"
                                  onPointerDown={(e) => {
                                    e.stopPropagation();
                                    const startX = e.clientX;
                                    const startY = e.clientY;
                                    const startW = newSlide.button_width;
                                    const startH = newSlide.button_height;
                                    const parentW = e.currentTarget.parentElement?.parentElement?.parentElement?.clientWidth || 1;
                                    const parentH = e.currentTarget.parentElement?.parentElement?.parentElement?.clientHeight || 1;
                                    
                                    const onMove = (mE: PointerEvent) => {
                                      const dX = (mE.clientX - startX) / parentW * 100;
                                      const dY = (mE.clientY - startY) / parentH * 100;
                                      setNewSlide(prev => ({
                                        ...prev,
                                        button_width: Number(Math.max(5, Math.min(100 - (prev.button_pos_x || 0), startW + dX)).toFixed(1)),
                                        button_height: Number(Math.max(5, Math.min(100 - (prev.button_pos_y || 0), startH + dY)).toFixed(1))
                                      }));
                                    };
                                    const onUp = () => { window.removeEventListener('pointermove', onMove); window.removeEventListener('pointerup', onUp); };
                                    window.addEventListener('pointermove', onMove); window.addEventListener('pointerup', onUp);
                                  }}
                                />

                                {/* Middle Handles */}
                                {/* Top */}
                                <div 
                                  className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-6 cursor-ns-resize pointer-events-auto z-40"
                                  onPointerDown={(e) => {
                                    e.stopPropagation();
                                    const startY = e.clientY;
                                    const startH = newSlide.button_height;
                                    const startYPos = newSlide.button_pos_y;
                                    const parentH = e.currentTarget.parentElement?.parentElement?.parentElement?.clientHeight || 1;
                                    
                                    const onMove = (mE: PointerEvent) => {
                                      const dY = (startY - mE.clientY) / parentH * 100;
                                      setNewSlide(prev => ({
                                        ...prev,
                                        button_pos_y: Number(Math.max(0, Math.min(startYPos + startH - 5, startYPos - dY)).toFixed(1)),
                                        button_height: Number(Math.max(5, startH + dY)).toFixed(1)
                                      }));
                                    };
                                    const onUp = () => { window.removeEventListener('pointermove', onMove); window.removeEventListener('pointerup', onUp); };
                                    window.addEventListener('pointermove', onMove); window.addEventListener('pointerup', onUp);
                                  }}
                                />

                                {/* Bottom */}
                                <div 
                                  className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-12 h-6 cursor-ns-resize pointer-events-auto z-40"
                                  onPointerDown={(e) => {
                                    e.stopPropagation();
                                    const startY = e.clientY;
                                    const startH = newSlide.button_height;
                                    const parentH = e.currentTarget.parentElement?.parentElement?.parentElement?.clientHeight || 1;
                                    
                                    const onMove = (mE: PointerEvent) => {
                                      const dY = (mE.clientY - startY) / parentH * 100;
                                      setNewSlide(prev => ({
                                        ...prev,
                                        button_height: Number(Math.max(5, Math.min(100 - (prev.button_pos_y || 0), startH + dY)).toFixed(1))
                                      }));
                                    };
                                    const onUp = () => { window.removeEventListener('pointermove', onMove); window.removeEventListener('pointerup', onUp); };
                                    window.addEventListener('pointermove', onMove); window.addEventListener('pointerup', onUp);
                                  }}
                                />

                                {/* Right */}
                                <div 
                                  className="absolute top-1/2 -translate-y-1/2 -right-3 w-6 h-12 cursor-ew-resize pointer-events-auto z-40"
                                  onPointerDown={(e) => {
                                    e.stopPropagation();
                                    const startX = e.clientX;
                                    const startW = newSlide.button_width;
                                    const startXPos = newSlide.button_pos_x;
                                    const parentW = e.currentTarget.parentElement?.parentElement?.parentElement?.clientWidth || 1;
                                    
                                    const onMove = (mE: PointerEvent) => {
                                      const dX = (startX - mE.clientX) / parentW * 100;
                                      setNewSlide(prev => ({
                                        ...prev,
                                        button_pos_x: Number(Math.max(0, Math.min(startXPos + startW - 5, startXPos + dX)).toFixed(1)),
                                        button_width: Number(Math.max(5, startW - dX)).toFixed(1)
                                      }));
                                    };
                                    const onUp = () => { window.removeEventListener('pointermove', onMove); window.removeEventListener('pointerup', onUp); };
                                    window.addEventListener('pointermove', onMove); window.addEventListener('pointerup', onUp);
                                  }}
                                />

                                {/* Left */}
                                <div 
                                  className="absolute top-1/2 -translate-y-1/2 -left-3 w-6 h-12 cursor-ew-resize pointer-events-auto z-40"
                                  onPointerDown={(e) => {
                                    e.stopPropagation();
                                    const startX = e.clientX;
                                    const startW = newSlide.button_width;
                                    const parentW = e.currentTarget.parentElement?.parentElement?.parentElement?.clientWidth || 1;
                                    
                                    const onMove = (mE: PointerEvent) => {
                                      const dX = (mE.clientX - startX) / parentW * 100;
                                      setNewSlide(prev => ({
                                        ...prev,
                                        button_width: Number(Math.max(5, Math.min(100 - (prev.button_pos_x || 0), startW + dX)).toFixed(1))
                                      }));
                                    };
                                    const onUp = () => { window.removeEventListener('pointermove', onMove); window.removeEventListener('pointerup', onUp); };
                                    window.addEventListener('pointermove', onMove); window.addEventListener('pointerup', onUp);
                                  }}
                                />
                              </div>
                           </motion.div>

                          <div className="absolute top-4 right-4 px-3 py-1 bg-black/80 backdrop-blur-md rounded-xl text-[9px] font-black text-white border border-white/20 pointer-events-none z-20">
                             باکس را بکشید یا برای جابجایی سریع روی تصویر کلیک کنید
                          </div>
                       </div>
                     </div>
                  </div>
               </div>

               <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-6">
                          <div className="space-y-4">
                             <label className="text-[11px] font-black text-gray-400 mr-2 uppercase tracking-widest">محتوای متنی</label>
                             <input
                                className="w-full bg-white border border-gray-100 rounded-2xl p-5 text-sm font-bold focus:outline-none focus:placeholder-transparent transition-all shadow-sm"
                                value={newSlide.title}
                                onChange={e => setNewSlide({ ...newSlide, title: e.target.value })}
                                placeholder="عنوان اصلی اسلایدر"
                             />
                             <input
                                className="w-full bg-white border border-gray-100 rounded-2xl p-5 text-sm font-bold focus:outline-none focus:placeholder-transparent transition-all shadow-sm"
                                value={newSlide.subtitle}
                                onChange={e => setNewSlide({ ...newSlide, subtitle: e.target.value })}
                                placeholder="متن تکمیلی (Subtitle)"
                             />
                          </div>
                          
                          <div className="space-y-4">
                             <label className="text-[11px] font-black text-gray-400 mr-2 uppercase tracking-widest">تنظیمات منطقه کلیک</label>
                             <div className="bg-gray-50 p-6 rounded-[2.5rem] border border-gray-100/50">
                                <p className="text-[11px] font-bold text-gray-400 mb-4 leading-relaxed">
                                   برای جابجایی منطقه کلیک، آن را بکشید یا روی تصویر کلیک کنید. برای تغییر اندازه، گوشه پایین سمت چپ کادر را بکشید.
                                </p>
                                <div className="grid grid-cols-2 gap-4">
                                   <div className="flex flex-col gap-1">
                                      <span className="text-[10px] font-black text-gray-400 uppercase">موقعیت X</span>
                                      <span className="text-sm font-black text-gray-900">{newSlide.button_pos_x}%</span>
                                   </div>
                                   <div className="flex flex-col gap-1">
                                      <span className="text-[10px] font-black text-gray-400 uppercase">موقعیت Y</span>
                                      <span className="text-sm font-black text-gray-900">{newSlide.button_pos_y}%</span>
                                   </div>
                                   <div className="flex flex-col gap-1">
                                      <span className="text-[10px] font-black text-gray-400 uppercase">عرض</span>
                                      <span className="text-sm font-black text-gray-900">{newSlide.button_width}%</span>
                                   </div>
                                   <div className="flex flex-col gap-1">
                                      <span className="text-[10px] font-black text-gray-400 uppercase">ارتفاع</span>
                                      <span className="text-sm font-black text-gray-900">{newSlide.button_height}%</span>
                                   </div>
                                </div>
                             </div>
                          </div>
                       </div>

                       <div className="space-y-6">
                          <div className="space-y-4 h-full flex flex-col">
                             <label className="text-[11px] font-black text-gray-400 mr-2 uppercase tracking-widest">اتصال به محصول</label>
                             <select
                                className="w-full bg-white border border-gray-100 rounded-2xl p-5 text-sm font-bold focus:outline-none transition-all shadow-sm appearance-none cursor-pointer"
                                value={newSlide.product_id || ''}
                                onChange={e => setNewSlide({ ...newSlide, product_id: e.target.value ? Number(e.target.value) : null })}
                             >
                                <option value="">بدون لینک (فقط عکس)</option>
                                {products.map(p => (
                                  <option key={p.id} value={p.id}>{p.title}</option>
                                ))}
                             </select>
                             
                             <div className="mt-auto pt-6">
                                <button
                                  onClick={handleCreateSlide}
                                  disabled={isUploading}
                                  className="w-full py-6 bg-[#EF2020] text-white rounded-[30px] text-lg font-black hover:bg-black hover:shadow-2xl transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-xl shadow-red-100"
                                >
                                  {isUploading ? (
                                     <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
                                  ) : <Check className="w-7 h-7" />}
                                  <span>{isUploading ? 'در حال پردازش...' : (editingSlideId ? 'ذخیره تغییرات اسلاید' : 'ثبت و انتشار اسلاید ')}</span>
                                </button>
                                <button 
                                  onClick={() => { setShowAddForm(false); setEditingSlideId(null); }}
                                  className="w-full py-4 text-gray-400 text-sm font-black hover:text-gray-900 transition-colors mt-2"
                                >
                                  بی‌خیال، انصراف
                                </button>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
           </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {slides.length === 0 ? (
              <div className="md:col-span-2 text-center py-24 bg-gray-50 rounded-[50px] border-2 border-dashed border-gray-200">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                   <ImageIcon className="w-10 h-10 text-gray-200" />
                </div>
                <div className="text-lg font-black text-gray-900">اسلایدی موجود نیست</div>
                <p className="text-sm font-bold text-gray-400 mt-2">اولین اسلاید جذاب خود را با دکمه "افزودن اسلاید" بسازید.</p>
              </div>
            ) : (
              slides.map((slide, idx) => (
                <div key={slide.id} className="bg-white rounded-[45px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all flex flex-col relative">
                   <div className="aspect-[21/9] relative scale-[1.001]">
                      <img src={slide.image} className="w-full h-full object-cover" />
                      
                      {/* Action Buttons - Large and persistent for touch compatibility */}
                      <div className="absolute top-3 md:top-4 left-3 md:left-4 flex gap-2 z-10">
                         <button 
                            onClick={(e) => { e.stopPropagation(); handleEditSlide(slide); }} 
                            className="p-2.5 md:p-3 bg-white/95 backdrop-blur-md text-gray-800 rounded-2xl md:rounded-3xl hover:bg-black hover:text-white transition-all shadow-xl border border-white"
                            title="ویرایش اسلاید"
                         >
                            <Settings className="w-4 h-4 md:w-5 md:h-5" />
                         </button>
                         <button 
                            onClick={(e) => { e.stopPropagation(); handleDeleteSlide(slide.id); }} 
                            className="p-2.5 md:p-3 bg-red-500/95 backdrop-blur-md text-white rounded-2xl md:rounded-3xl hover:bg-red-600 transition-all shadow-xl border border-red-400"
                            title="حذف اسلاید"
                         >
                            <X className="w-4 h-4 md:w-5 md:h-5" />
                         </button>
                      </div>

                      {deletingSlideId === slide.id && (
                        <div className="absolute inset-0 bg-white/95 backdrop-blur-md z-40 flex flex-col items-center justify-center p-6 text-center">
                           <ShieldAlert className="w-12 h-12 text-red-500 mb-2" />
                           <p className="text-sm font-black text-gray-900 mb-4">واقعاً حذف شود؟</p>
                           <div className="flex gap-2">
                             <button onClick={() => confirmDeleteSlide(slide.id)} className="bg-red-500 text-white px-6 py-2 rounded-xl text-xs font-black shadow-lg">حذف قطعی</button>
                             <button onClick={() => setDeletingSlideId(null)} className="bg-gray-100 text-gray-600 px-6 py-2 rounded-xl text-xs font-black">انصراف</button>
                           </div>
                        </div>
                      )}

                      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-black text-gray-900 border border-white shadow-xl">
                        #{idx + 1}
                      </div>

                      {/* Visual Indicator of Button Hotspot in list - Glassy/Proper style */}
                      <div 
                         className="absolute border border-white/80 bg-white/10 backdrop-blur-[1px] shadow-xl overflow-hidden pointer-events-none"
                         style={{ 
                            right: `${slide.button_pos_x}%`, 
                            top: `${slide.button_pos_y}%`, 
                            width: `${slide.button_width || 15}%`,
                            height: `${slide.button_height || 10}%`,
                         }}
                      >
                         <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-20">
                            <div className="border-r border-b border-white" />
                            <div className="border-r border-b border-white" />
                            <div className="border-b border-white" />
                            <div className="border-r border-b border-white" />
                            <div className="border-r border-b border-white" />
                            <div className="border-b border-white" />
                         </div>
                      </div>
                   </div>
                   
                   <div className="p-8 flex flex-col flex-grow">
                      <div className="flex items-start justify-between">
                         <div>
                            <h5 className="font-black text-gray-900 text-lg leading-tight line-clamp-1">{slide.title || 'بدون عنوان'}</h5>
                            <p className="text-xs text-gray-400 font-bold mt-1 line-clamp-1">{slide.subtitle || 'بدون زیرنویس'}</p>
                         </div>
                         <div className="px-4 py-2 bg-gray-50 rounded-xl text-[10px] font-black text-gray-400 border border-gray-100">
                            ترتیب: {slide.order_index}
                         </div>
                      </div>

                      <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
                               <ShoppingCart className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col">
                               <span className="text-[10px] font-black text-gray-900">کالای متصل</span>
                               <span className="text-[11px] font-bold text-gray-400">{products.find(p => p.id === slide.product_id)?.title || 'لینک عمومی'}</span>
                            </div>
                         </div>
                         
                         <button 
                            onClick={() => handleEditSlide(slide)}
                            className="text-xs font-black text-[#EF2020] flex items-center gap-2 group"
                         >
                            <span>ویرایش جزییات</span>
                            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                         </button>
                      </div>
                   </div>
                </div>
              ))
            )}
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}


function OrdersSection() {
  const [activeTab, setActiveTab] = useState('all');
  const tabs = [
    { id: 'all', label: 'همه' },
    { id: 'pending', label: 'در انتظار پرداخت' },
    { id: 'processing', label: 'در حال پردازش' },
    { id: 'shipped', label: 'ارسال شده' },
    { id: 'delivered', label: 'تحویل داده شده' },
    { id: 'returned', label: 'مرجوع شده' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar bg-white p-1 rounded-2xl border border-gray-100 shadow-sm">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`whitespace-nowrap px-6 py-2.5 rounded-xl font-black text-[13px] transition-all ${
              activeTab === tab.id ? 'bg-[#EF2020] text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Order List */}
      <div className="space-y-4">
        {[1, 2].map((order) => (
          <div key={order} className="bg-white rounded-3xl border border-gray-100 p-6 flex flex-col md:flex-row items-center gap-8 shadow-sm hover:shadow-md transition-shadow">
            {/* Status & Info */}
            <div className="flex-grow flex flex-col md:flex-row items-center gap-8 w-full md:w-auto">
              <div className="flex flex-col items-center md:items-start gap-1">
                 <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-[13px] font-black text-green-600 bg-green-50 px-3 py-1 rounded-lg">تحویل داده شده</span>
                 </div>
                 <div className="text-[12px] font-bold text-gray-400">کد سفارش: DKC-4928130</div>
                 <div className="text-[13px] font-black text-gray-900 mt-1">۱۲ فروردین ۱۴۰۳</div>
              </div>
              
              <div className="h-10 w-px bg-gray-100 hidden md:block"></div>

              {/* Product Thumbnails */}
              <div className="flex -space-x-4 space-x-reverse relative">
                 {ALL_PRODUCTS.slice(0, 3).map((p, idx) => (
                   <div key={idx} className="w-14 h-14 rounded-2xl bg-gray-50 border-2 border-white flex items-center justify-center p-2 shadow-sm overflow-hidden bg-white">
                      <img src={p.image} className="w-full h-full object-contain" />
                   </div>
                 ))}
                 <div className="w-14 h-14 rounded-2xl bg-gray-100 border-2 border-white flex items-center justify-center text-[10px] font-black text-gray-500 shadow-sm">
                    +۲ مورد
                 </div>
              </div>
            </div>

            {/* Price & Actions */}
            <div className="flex flex-col items-center md:items-end gap-1 w-full md:w-auto">
               <div className="text-[12px] font-bold text-gray-400 text-left w-full md:text-right">مبلغ کل:</div>
               <div className="text-xl font-black text-gray-900">
                  ۳,۴۰۰,۰۰۰ <span className="text-[10px] opacity-40 font-medium">تومان</span>
               </div>
               <div className="flex gap-2 mt-4 w-full">
                  <button className="flex-grow md:flex-none border border-gray-100 text-gray-700 font-black px-6 py-2.5 rounded-xl hover:bg-gray-50 transition-all text-xs">
                     مشاهده جزئیات
                  </button>
                  <button className="flex-grow md:flex-none bg-[#EF2020] text-white font-black px-6 py-2.5 rounded-xl hover:bg-red-700 transition-all text-xs shadow-lg shadow-red-100">
                     پیگیری سفارش
                  </button>
               </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function WalletSection() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      {/* Balance Card */}
      <div className="relative rounded-[40px] overflow-hidden p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 bg-gradient-to-br from-[#EF2020] to-[#b91c1c] shadow-2xl shadow-red-200">
         <div className="z-10 text-center md:text-right">
            <div className="flex items-center gap-2 justify-center md:justify-start opacity-70 mb-4">
               <Wallet className="w-5 h-5" />
               <span className="text-sm font-bold">موجودی کیف پول شما</span>
            </div>
            <div className="flex items-baseline gap-3">
               <span className="text-5xl font-black tabular-nums">۷,۴۰۰,۰۰۰</span>
               <span className="text-lg opacity-60">تومان</span>
            </div>
         </div>
         
         <div className="z-10 flex gap-4 w-full md:w-auto">
            <button className="flex-grow bg-white/20 backdrop-blur-xl border border-white/20 px-8 py-4 rounded-3xl font-black hover:bg-white hover:text-[#EF2020] transition-all flex items-center justify-center gap-2 group">
               <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
               <span>افزایش موجودی</span>
            </button>
            <button className="flex-grow bg-white text-[#EF2020] px-8 py-4 rounded-3xl font-black shadow-xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2 group">
               <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
               <span>انتقال به حساب بانکی</span>
            </button>
         </div>
         
         {/* Decorative Circles */}
         <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
         <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
         <div className="p-8 border-b border-gray-50 flex items-center justify-between">
            <h4 className="font-black text-xl text-gray-900">تاریخچه تراکنش‌ها</h4>
            <button className="text-sm text-gray-400 font-bold hover:text-gray-900 transition-colors">مشاهده همه تراکنش‌ها</button>
         </div>
         
         <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-right" dir="rtl">
               <thead className="bg-gray-50/50 text-[11px] font-black text-gray-400 uppercase tracking-widest">
                  <tr>
                     <th className="px-8 py-4">نوع تراکنش</th>
                     <th className="px-8 py-4">تاریخ و زمان</th>
                     <th className="px-8 py-4 text-center">مبلغ تراکنش</th>
                     <th className="px-8 py-4 text-left">موجودی نهایی</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-50">
                  {[
                    { type: 'increase', desc: 'افزایش موجودی - درگاه شتاب', date: '۱۴ فروردین ۱۴۰۳ - ۱۲:۳۴', amount: '+۵,۰۰۰,۰۰۰', balance: '۷,۴۰۰,۰۰۰', status: 'success' },
                    { type: 'purchase', desc: 'خرید از سایت - سفارش DKC-492', date: '۱۲ فروردین ۱۴۰۳ - ۱۸:۲۰', amount: '-۱,۲۰۰,۰۰۰', balance: '۲,۴۰۰,۰۰۰', status: 'success' },
                    { type: 'return', desc: 'استرداد وجه - مرجوعی کالا', date: '۱۰ فروردین ۱۴۰۳ - ۰۹:۱۵', amount: '+۸۰۰,۰۰۰', balance: '۳,۶۰۰,۰۰۰', status: 'success' },
                  ].map((tr, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors group">
                       <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                             <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                               tr.type === 'increase' ? 'bg-green-50 text-green-600' : 
                               tr.type === 'return' ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'
                             }`}>
                                {tr.type === 'increase' ? <Plus className="w-5 h-5" /> : 
                                 tr.type === 'return' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                             </div>
                             <div>
                                <div className="text-[14px] font-black text-gray-900">{tr.desc}</div>
                                <div className="text-[10px] font-bold text-gray-400 mt-0.5">شناسه پرداخت: ۸۲۹۳۰۱۸۳</div>
                             </div>
                          </div>
                       </td>
                       <td className="px-8 py-6 text-[12px] font-bold text-gray-400">{tr.date}</td>
                       <td className={`px-8 py-6 text-center font-black ${tr.amount.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                          {tr.amount} <span className="text-[10px] font-medium opacity-40">تومان</span>
                       </td>
                       <td className="px-8 py-6 text-left font-black text-gray-900 group-hover:translate-x-2 transition-transform">
                          {tr.balance} <span className="text-[10px] font-medium opacity-40">تومان</span>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </motion.div>
  );
}

function WishlistSection({ 
  wishlist, 
  onToggleWishlist, 
  onAddToCart,
  onProductClick
}: { 
  wishlist: number[]; 
  onToggleWishlist: (id: number) => void;
  onAddToCart: (p: ProductData) => void;
  onProductClick: (id: number) => void;
}) {
  const wishlistItems = ALL_PRODUCTS.filter(p => wishlist.includes(p.id));

  if (wishlistItems.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-20 text-center"
      >
        <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center mb-8 relative">
           <Heart className="w-16 h-16 text-gray-200" />
           <div className="absolute top-2 right-2 w-6 h-6 bg-red-100 rounded-full animate-bounce"></div>
        </div>
        <h4 className="text-2xl font-black text-gray-900 mb-2">لیست علاقه‌مندی‌های شما خالی است</h4>
        <p className="text-gray-400 max-w-sm">هنوز کالایی را به لیست علاقه‌مندی‌های خود اضافه نکرده‌اید. با انتخاب قلب روی کالاها، آن‌ها را اینجا ذخیره کنید.</p>
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="mt-8 bg-[#EF2020] text-white px-10 py-4 rounded-3xl font-black shadow-xl shadow-red-100 hover:bg-red-700 transition-all"
        >
          مشاهده کالاها و خرید
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlistItems.map((product) => (
          <motion.div
            key={product.id}
            whileHover={{ y: -8 }}
            className="bg-white rounded-[32px] p-6 flex flex-col gap-4 shadow-sm border border-gray-100 hover:shadow-xl transition-all group relative"
          >
            {/* Remove from wishlist */}
            <button 
              onClick={() => onToggleWishlist(product.id)}
              className="absolute top-4 left-4 z-10 p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors shadow-sm"
              title="حذف از لیست"
            >
              <X className="w-4 h-4" />
            </button>

            <div 
              className="aspect-square relative p-4 flex items-center justify-center cursor-pointer"
              onClick={() => onProductClick(product.id)}
            >
              <img 
                src={product.image} 
                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" 
                referrerPolicy="no-referrer" 
              />
            </div>

            <div className="px-2">
              <h4 className="text-sm font-black text-gray-800 line-clamp-2 leading-relaxed min-h-[44px]">
                {product.title}
              </h4>
              <div className="mt-4 flex items-center justify-between">
                 <div className="flex flex-col">
                    <span className="text-xl font-black text-[#EF2020]">{product.price.toLocaleString()}</span>
                    <span className="text-[10px] font-bold text-gray-400">تومان</span>
                 </div>
                 
                 <button 
                   onClick={() => onAddToCart(product)}
                   className="p-3 bg-gray-50 text-gray-700 rounded-2xl hover:bg-[#EF2020] hover:text-white transition-all shadow-sm group/btn"
                 >
                    <ShoppingCart className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                 </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
