/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Package, Heart, Wallet, MapPin, MessageSquare, 
  Bell, User, LogOut, Camera, ChevronLeft, 
  Plus, ArrowUpRight, ArrowDownLeft, X, ShoppingCart,
  ShieldCheck, ShieldAlert, Mail, Lock, Eye, EyeOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ALL_PRODUCTS } from '../data';
import { ProductData } from '../types';
import { isSupabaseConfigured } from '../lib/supabase';

type DashboardSection = 'orders' | 'wishlist' | 'wallet' | 'addresses' | 'comments' | 'notifications' | 'account';

export default function UserDashboard({ 
  onClose,
  wishlist = [],
  onToggleWishlist,
  onAddToCart,
  onProductClick
}: { 
  onClose: () => void;
  wishlist: number[];
  onToggleWishlist: (id: number) => void;
  onAddToCart: (p: ProductData) => void;
  onProductClick: (id: number) => void;
}) {
  const [activeSection, setActiveSection] = useState<DashboardSection>('orders');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
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
    try {
      const { supabaseService } = await import('../services/supabaseService');
      const currentUser = await supabaseService.getCurrentUser();
      if (currentUser) setUser(currentUser);
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
    { id: 'wallet', label: 'کیف پول دیجی‌پی', icon: Wallet },
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
      className="fixed inset-0 bg-gray-50 z-[100] flex flex-col md:flex-row overflow-hidden"
      dir="rtl"
    >
      {/* Sidebar */}
      <aside className="w-full md:w-[280px] bg-white border-l border-gray-100 flex flex-col h-full shadow-xl">
        {/* User Info */}
        <div className="p-8 flex flex-col items-center text-center border-b border-gray-50">
          <div className="relative group mb-4">
            <div className="w-20 h-20 rounded-full bg-gray-100 border-4 border-white shadow-lg overflow-hidden flex items-center justify-center overflow-hidden">
               <img 
                 src={user?.user_metadata?.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150"} 
                 alt="User" 
                 className="w-full h-full object-cover"
               />
            </div>
            <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md text-gray-500 hover:text-[#EF2020] transition-colors">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          
          {user ? (
            <div className="text-center w-full">
              <h3 className="font-black text-gray-900 mb-1">{user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'کاربر'}</h3>
              <p className="text-[12px] text-gray-400 font-medium mb-4">{user?.email}</p>
              
              <button 
                onClick={handleLogout}
                className="w-full text-red-500 py-2 text-[10px] font-black hover:bg-red-50 rounded-xl transition-all"
              >
                خروج از حساب
              </button>
            </div>
          ) : (
            <div className="w-full space-y-4 px-2">
              <div className="flex bg-gray-100 p-1 rounded-xl mb-4">
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
                    type="email"
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
        <nav className="flex-grow p-4 space-y-1 overflow-y-auto no-scrollbar">
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
          
          <button 
            onClick={handleLogout}
            disabled={loading}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all font-bold text-sm mt-8 border-t border-gray-50 pt-8"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span>{loading ? 'در حال خروج...' : 'خروج از حساب'}</span>
          </button>

          {/* Connection Status Indicator */}
          <div className="mt-4 px-4 py-3 rounded-2xl bg-gray-50 flex flex-col gap-3">
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
                <div className="mt-4 p-4 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldAlert className="w-4 h-4 text-amber-500" />
                    <span className="text-[10px] font-black text-gray-400 tracking-tighter">سیستم ورود غیرفعال است</span>
                  </div>
                  <p className="text-[9px] text-gray-400 font-medium leading-relaxed">
                    لطفاً اطلاعات اتصال را در بخش تنظیمات وارد کنید تا امکان ورود فراهم شود.
                  </p>
                </div>
              )}
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-grow overflow-y-auto p-4 md:p-10 no-scrollbar relative">
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
            {activeSection === 'orders' && <OrdersSection key="orders" />}
            {activeSection === 'wishlist' && (
              <WishlistSection 
                key="wishlist" 
                wishlist={wishlist} 
                onToggleWishlist={onToggleWishlist} 
                onAddToCart={onAddToCart}
                onProductClick={onProductClick}
              />
            )}
            {activeSection === 'wallet' && <WalletSection key="wallet" />}
            {(activeSection !== 'orders' && activeSection !== 'wishlist' && activeSection !== 'wallet') && (
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
