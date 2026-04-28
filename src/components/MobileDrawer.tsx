import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, Smartphone, Laptop, Shirt, Home, Sparkles, Gamepad2, Book, Trophy, User } from 'lucide-react';

const CATEGORIES = [
  { id: 1, name: 'موبایل', icon: Smartphone },
  { id: 2, name: 'لپ‌تاپ', icon: Laptop },
  { id: 3, name: 'پوشاک', icon: Shirt },
  { id: 4, name: 'خانه و آشپزخانه', icon: Home },
  { id: 5, name: 'زیبایی و سلامت', icon: Sparkles },
  { id: 6, name: 'اسباب‌بازی', icon: Gamepad2 },
  { id: 7, name: 'کتاب و هنر', icon: Book },
  { id: 8, name: 'ورزش و سفر', icon: Trophy },
];

export default function MobileDrawer({ 
  isOpen, 
  onClose,
  user,
  onUserClick
}: { 
  isOpen: boolean; 
  onClose: () => void;
  user: any;
  onUserClick: () => void;
}) {
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
            className="fixed inset-0 bg-black/50 z-[100] backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-[85%] max-w-[320px] bg-white z-[101] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div className="text-[#EF2020] text-xl font-black italic">DIGIKALA</div>
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

            {/* Categories */}
            <div className="flex-grow overflow-y-auto px-4 py-6">
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 pr-2">دسته‌بندی‌ها</h4>
              <div className="space-y-1">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                  >
                    <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-white border border-transparent group-hover:border-gray-100">
                      <cat.icon className="w-5 h-5 text-gray-500 group-hover:text-[#EF2020]" />
                    </div>
                    <span className="text-sm font-bold text-gray-700">{cat.name}</span>
                    <ChevronLeft className="w-4 h-4 text-gray-300 mr-auto opacity-0 group-hover:opacity-100" />
                  </button>
                ))}
              </div>
            </div>

            {/* Footer Links */}
            <div className="p-6 border-t border-gray-100 bg-gray-50/50">
              <div className="grid grid-cols-2 gap-4">
                <a href="#" className="text-[10px] font-bold text-gray-500 hover:text-gray-900">درباره ما</a>
                <a href="#" className="text-[10px] font-bold text-gray-500 hover:text-gray-900">تماس با ما</a>
                <a href="#" className="text-[10px] font-bold text-gray-500 hover:text-gray-900">قوانین و مقررات</a>
                <a href="#" className="text-[10px] font-bold text-gray-500 hover:text-gray-900">سوالات متداول</a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
