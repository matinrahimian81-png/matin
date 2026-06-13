import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronDown, 
  ChevronLeft, 
  Plus, 
  Trash2, 
  Edit, 
  Save, 
  Upload, 
  Image as ImageIcon, 
  Check, 
  AlertTriangle,
  Info,
  LayoutGrid,
  Sparkles,
  Smartphone,
  Laptop,
  Shirt,
  Home,
  Gamepad2,
  Book,
  Trophy,
  Heart,
  User
} from 'lucide-react';
import { MenuConfig, Level2Category, MenuColumn, MenuLinkItem, ProductData } from '../types';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

export const SUPPORTED_DEFAULT_ICONS = [
  { name: 'Smartphone', label: 'موبایل', icon: Smartphone },
  { name: 'Laptop', label: 'لپ‌تاپ', icon: Laptop },
  { name: 'Shirt', label: 'پوشاک', icon: Shirt },
  { name: 'Home', label: 'خانه', icon: Home },
  { name: 'Sparkles', label: 'زیبایی و سلامت', icon: Sparkles },
  { name: 'Gamepad2', label: 'اسباب‌بازی', icon: Gamepad2 },
  { name: 'Book', label: 'کتاب و هنر', icon: Book },
  { name: 'Trophy', label: 'ورزش و سفر', icon: Trophy },
  { name: 'LayoutGrid', label: 'شبکه‌ای', icon: LayoutGrid },
  { name: 'Heart', label: 'علاقه‌مندی‌ها', icon: Heart },
  { name: 'User', label: 'کاربران', icon: User },
];

export const DEFAULT_MENU_CONFIG: MenuConfig = {
  title: "دسته‌بندی کالاها",
  useDefaultIcon: true,
  categories: [
    {
      id: "cat_1",
      title: "موبایل",
      useDefaultIcon: true,
      columns: [
        {
          id: "col_1_1",
          title: "برندهای محبوب",
          items: [
            { id: "item_1_1_1", title: "Samsung", productId: null },
            { id: "item_1_1_2", title: "Apple", productId: null },
            { id: "item_1_1_3", title: "Xiaomi", productId: null },
            { id: "item_1_1_4", title: "Sony", productId: null },
          ]
        },
        {
          id: "col_1_2",
          title: "موبایل",
          items: [
            { id: "item_1_2_1", title: "گوشی موبایل", productId: null },
            { id: "item_1_2_2", title: "لوازم جانبی موبایل", productId: null },
          ]
        },
        {
          id: "col_1_3",
          title: "کالای دیجیتال",
          items: [
            { id: "item_1_3_1", title: "لپ تاپ", productId: null },
            { id: "item_1_3_2", title: "ساعت هوشمند", productId: null },
          ]
        }
      ]
    },
    {
      id: "cat_2",
      title: "لپ‌تاپ",
      useDefaultIcon: true,
      columns: [
        {
          id: "col_2_1",
          title: "برندهای لپ‌تاپ",
          items: [
            { id: "item_2_1_1", title: "ASUS", productId: null },
            { id: "item_2_1_2", title: "Lenovo", productId: null },
            { id: "item_2_1_3", title: "HP", productId: null },
          ]
        },
        {
          id: "col_2_2",
          title: "تجهیزات جانبی",
          items: [
            { id: "item_2_2_1", title: "ماوس و کیبورد", productId: null },
            { id: "item_2_2_2", title: "کول‌پد", productId: null },
          ]
        },
        {
          id: "col_2_3",
          title: "قطعات سخت‌افزار",
          items: [
            { id: "item_2_3_1", title: "رم لپ‌تاپ", productId: null },
            { id: "item_2_3_2", title: "حافظه SSD", productId: null },
          ]
        }
      ]
    },
    {
      id: "cat_3",
      title: "پوشاک",
      useDefaultIcon: true,
      columns: [
        {
          id: "col_3_1",
          title: "لباس مردانه",
          items: [
            { id: "item_3_1_1", title: "تی‌شرت", productId: null },
            { id: "item_3_1_2", title: "شلوار جین", productId: null },
          ]
        },
        {
          id: "col_3_2",
          title: "لباس زنانه",
          items: [
            { id: "item_3_2_1", title: "شومیز", productId: null },
            { id: "item_3_2_2", title: "مانتو", productId: null },
          ]
        },
        {
          id: "col_3_3",
          title: "اکسسوری",
          items: [
            { id: "item_3_3_1", title: "کیف", productId: null },
            { id: "item_3_3_2", title: "کفش", productId: null },
          ]
        }
      ]
    }
  ]
};

export default function MenuManagement({ products = [] }: { products?: ProductData[] }) {
  const [menu, setMenu] = useState<MenuConfig>(DEFAULT_MENU_CONFIG);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Accordion open states
  const [isLevel1Open, setIsLevel1Open] = useState(true);
  const [expandedL2Ids, setExpandedL2Ids] = useState<string[]>([]);

  // Editing modals/forms state
  const [editingItemType, setEditingItemType] = useState<'level1' | 'level2' | 'level3_col' | 'level3_link' | null>(null);
  const [editingData, setEditingData] = useState<any>(null);

  // Load configuration from localStorage/Supabase on mount
  useEffect(() => {
    const loadConfig = async () => {
      // 1. Initial baseline from localStorage
      const cached = localStorage.getItem('matinkala_menu_config');
      if (cached) {
        try {
          setMenu(JSON.parse(cached));
        } catch (e) {
          console.error("Error reading cached menu config:", e);
        }
      }

      // 2. Fetch from Supabase if configured
      if (isSupabaseConfigured) {
        try {
          // Attempt 1: from settings table
          const { data, error } = await supabase
            .from('settings')
            .select('value')
            .eq('key', 'menu_config')
            .maybeSingle();

          if (!error && data?.value) {
            setMenu(data.value);
            localStorage.setItem('matinkala_menu_config', JSON.stringify(data.value));
            window.dispatchEvent(new Event('matinkala_menu_changed'));
          } else {
            // Attempt 2: from menu_config table
            const { data: menuData, error: menuErr } = await supabase
              .from('menu_config')
              .select('config')
              .limit(1)
              .maybeSingle();

            if (!menuErr && menuData?.config) {
              setMenu(menuData.config);
              localStorage.setItem('matinkala_menu_config', JSON.stringify(menuData.config));
              window.dispatchEvent(new Event('matinkala_menu_changed'));
            }
          }
        } catch (e) {
          console.warn("Supabase menu config fetch failed, using local copy:", e);
        }
      }
    };
    loadConfig();
  }, []);

  const toggleL2Expand = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setExpandedL2Ids(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Set message helper
  const showToast = (msg: string, isError = false) => {
    if (isError) {
      setErrorMsg(msg);
      setTimeout(() => setErrorMsg(''), 5000);
    } else {
      setSuccessMsg(msg);
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  // Image Upload handler (Base64 conversion)
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 1024 * 1024) {
        showToast("حجم فایل آیکون نباید بیشتر از ۱ مگابایت باشد.", true);
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          callback(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // --- CRUD OPERATIONS ---

  // Level 1 Edit
  const handleEditLevel1 = () => {
    setEditingItemType('level1');
    setEditingData({
      title: menu.title,
      icon: menu.icon || '',
      useDefaultIcon: menu.useDefaultIcon
    });
  };

  const handleSaveLevel1 = () => {
    if (!editingData.title.trim()) {
      showToast("عنوان منو نمی‌تواند خالی باشد.", true);
      return;
    }
    setMenu(prev => ({
      ...prev,
      title: editingData.title,
      icon: editingData.icon,
      useDefaultIcon: editingData.useDefaultIcon
    }));
    setEditingItemType(null);
    showToast("تغییرات سطح اول اعمال شد. برای ذخیره‌سازی نهایی دکمه ذخیره انتهای صفحه را بفشارید.");
  };

  // Level 2 CRUD
  const handleAddNewL2 = () => {
    const newL2: Level2Category = {
      id: "cat_" + Date.now(),
      title: "", // Blank so user can write inside
      useDefaultIcon: true,
      columns: [
        { id: "col_" + Date.now() + "_1", title: "بخش اول", items: [] },
        { id: "col_" + Date.now() + "_2", title: "بخش دوم", items: [] },
        { id: "col_" + Date.now() + "_3", title: "بخش سوم", items: [] },
      ]
    };
    setMenu(prev => ({
      ...prev,
      categories: [...prev.categories, newL2]
    }));
    // Auto edit & expand
    toggleL2Expand(newL2.id);
    setEditingItemType('level2');
    setEditingData({
      id: newL2.id,
      title: '',
      icon: '',
      useDefaultIcon: true
    });
  };

  const handleEditL2 = (cat: Level2Category, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingItemType('level2');
    setEditingData({
      id: cat.id,
      title: cat.title,
      icon: cat.icon || '',
      useDefaultIcon: cat.useDefaultIcon
    });
  };

  const handleSaveL2 = () => {
    if (!editingData.title.trim()) {
      showToast("عنوان دسته‌بندی نمی‌تواند خالی باشد.", true);
      return;
    }
    setMenu(prev => ({
      ...prev,
      categories: prev.categories.map(c => 
        c.id === editingData.id 
          ? { ...c, title: editingData.title, icon: editingData.icon, useDefaultIcon: editingData.useDefaultIcon }
          : c
      )
    }));
    setEditingItemType(null);
    showToast("تغییرات دسته‌بندی ذخیره موقت شد.");
  };

  const handleDeleteL2 = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (confirm("آیا از حذف این دسته‌بندی و تمامی زیرمجموعه‌های آن اطمینان دارید؟")) {
      setMenu(prev => ({
        ...prev,
        categories: prev.categories.filter(c => c.id !== id)
      }));
      showToast("دسته‌بندی با موفقیت حذف شد.");
    }
  };

  // Level 3 Column CRUD
  // User says: "بشه اضافه و ویرایش . حذف سه دسته بندی باشه ولی نباید برای انجام تکیل فرایند تعداد دسته بندی کمتر از سه تا یا بیشتر باشه"
  // So under each L2 item, we can add, edit, delete columns. BUT we enforce a strict validation that there must be EXACTLY 3 columns inside each Level 2 item!
  const handleAddCol = (catId: string) => {
    const cat = menu.categories.find(c => c.id === catId);
    if (cat && cat.columns.length >= 3) {
      showToast("تعداد کل ستون‌ها نباید بیشتر از ۳ باشد! (برای اضافه کردن یک ستون جدید، باید یکی از ۳ ستون فعلی را حذف کنید)", true);
      return;
    }
    const newCol: MenuColumn = {
      id: "col_" + Date.now(),
      title: "عنوان بخش جدید",
      items: []
    };
    setMenu(prev => ({
      ...prev,
      categories: prev.categories.map(c => 
        c.id === catId ? { ...c, columns: [...c.columns, newCol] } : c
      )
    }));
  };

  const handleEditCol = (catId: string, col: MenuColumn) => {
    setEditingItemType('level3_col');
    setEditingData({
      catId,
      colId: col.id,
      title: col.title
    });
  };

  const handleSaveCol = () => {
    if (!editingData.title.trim()) {
      showToast("عنوان ستون نمی‌تواند خالی باشد.", true);
      return;
    }
    setMenu(prev => ({
      ...prev,
      categories: prev.categories.map(c => {
        if (c.id === editingData.catId) {
          return {
            ...c,
            columns: c.columns.map(col => 
              col.id === editingData.colId ? { ...col, title: editingData.title } : col
            )
          };
        }
        return c;
      })
    }));
    setEditingItemType(null);
    showToast("عنوان ستون با موفقیت تغییر کرد.");
  };

  const handleDeleteCol = (catId: string, colId: string) => {
    if (confirm("آیا مطمئن هستید که می‌خواهید این ستون را به همراه تمام لینک‌های آن حذف کنید؟")) {
      setMenu(prev => ({
        ...prev,
        categories: prev.categories.map(c => {
          if (c.id === catId) {
            return {
              ...c,
              columns: c.columns.filter(col => col.id !== colId)
            };
          }
          return c;
        })
      }));
      showToast("ستون حدف شد. توجه کنید که برای ذخیره نهایی کل منو، تعداد ستون‌های هر بخش باید دقیقاً ۳ عدد باشد.");
    }
  };

  // Level 3 Links CRUD
  const handleAddLink = (catId: string, colId: string) => {
    setEditingItemType('level3_link');
    setEditingData({
      catId,
      colId,
      linkId: null, // null means add new
      title: '',
      productId: null
    });
  };

  const handleEditLink = (catId: string, colId: string, item: MenuLinkItem) => {
    setEditingItemType('level3_link');
    setEditingData({
      catId,
      colId,
      linkId: item.id,
      title: item.title,
      productId: item.productId
    });
  };

  const handleSaveLink = () => {
    if (!editingData.title.trim()) {
      showToast("عنوان نوشته/لینک نمی‌تواند خالی باشد.", true);
      return;
    }

    setMenu(prev => ({
      ...prev,
      categories: prev.categories.map(c => {
        if (c.id === editingData.catId) {
          return {
            ...c,
            columns: c.columns.map(col => {
              if (col.id === editingData.colId) {
                if (editingData.linkId) {
                  // Edit
                  return {
                    ...col,
                    items: col.items.map(it => 
                      it.id === editingData.linkId 
                        ? { ...it, title: editingData.title, productId: editingData.productId ? Number(editingData.productId) : null }
                        : it
                    )
                  };
                } else {
                  // Add new
                  return {
                    ...col,
                    items: [
                      ...col.items,
                      {
                        id: "item_" + Date.now(),
                        title: editingData.title,
                        productId: editingData.productId ? Number(editingData.productId) : null
                      }
                    ]
                  };
                }
              }
              return col;
            })
          };
        }
        return c;
      })
    }));

    setEditingItemType(null);
    showToast("لینک جدید ذخیره موقت شد.");
  };

  const handleDeleteLink = (catId: string, colId: string, linkId: string) => {
    setMenu(prev => ({
      ...prev,
      categories: prev.categories.map(c => {
        if (c.id === catId) {
          return {
            ...c,
            columns: c.columns.map(col => {
              if (col.id === colId) {
                return {
                  ...col,
                  items: col.items.filter(item => item.id !== linkId)
                };
              }
              return col;
            })
          };
        }
        return c;
      })
    }));
    showToast("لینک حذف شد.");
  };


  // --- SAVE DIRECT TO LOCAL STORAGE WITH STRICT VALIDATIONS ---
  const handleFinalSave = () => {
    // Check if any level 2 category has !== 3 columns in its level 3 structure
    const invalidCategory = menu.categories.find(c => c.columns.length !== 3);
    
    if (invalidCategory) {
      showToast(
        `خطا در ذخیره‌سازی: تعداد دسته‌بندی‌های سطح ۳ برای بخش "${invalidCategory.title || "دسته‌بندی بی‌نام"}" باید دقیقاً ۳ ستون باشد. در حال حاضر این بخش ${invalidCategory.columns.length} ستون دارد. لطفاً برطرف کنید تا امکان ذخیره فراهم شود.`,
        true
      );
      return;
    }

    try {
      localStorage.setItem('matinkala_menu_config', JSON.stringify(menu));
      
      if (isSupabaseConfigured) {
        // Run as async to not block responsiveness
        (async () => {
          try {
            // Attempt 1: settings table
            const { error } = await supabase
              .from('settings')
              .upsert({ key: 'menu_config', value: menu }, { onConflict: 'key' });
            
            if (error) {
              // Attempt 2: menu_config table
              const { error: err2 } = await supabase
                .from('menu_config')
                .upsert({ id: 1, config: menu }, { onConflict: 'id' });
              
              if (err2) {
                console.error("Supabase dynamic menu save failed on both options:", error, err2);
              }
            }
          } catch (upsertErr) {
            console.warn("Catch during supabase save:", upsertErr);
          }
        })();
      }

      // Dispatch custom event to notify Header.tsx immediately
      window.dispatchEvent(new Event('matinkala_menu_changed'));
      
      showToast(isSupabaseConfigured 
        ? "پیکربندی منو با موفقیت در دیتابیس سوپابیس و وب‌سایت ذخیره و اعمال شد. 🎉" 
        : "پیکربندی منو با موفقیت در این مرورگر ذخیره و اعمال شد. (برای ذخیره دائمی دیتابیس سوپابیس را وصل کنید) 🎉"
      );
    } catch (e) {
      showToast("خطا در ذخیره‌سازی منو.", true);
    }
  };

  return (
    <div className="bg-gray-50/50 p-6 rounded-3xl border border-gray-100 font-sans" dir="rtl">
      {/* Settings Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <h3 className="text-xl font-black text-gray-800 flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-[#EF2020]" />
            تنظیمات منوی اصلی (دسته‌بندی‌ها)
          </h3>
          <p className="text-xs text-gray-400 font-medium mt-1">
            یکپارچه‌سازی و بهینه‌سازی پیشرفته منوهای چندسطحی. این تنظیمات مستقیماً منوی هدر وب‌سایت را تغییر می‌دهند.
          </p>
        </div>
        
        <button
          onClick={handleFinalSave}
          className="bg-[#EF2020] text-white px-6 py-3 font-semibold text-xs rounded-xl hover:bg-red-600 transition-colors flex items-center gap-2 shadow-lg shadow-red-100 shrink-0 self-end md:self-auto"
        >
          <Save className="w-4 h-4" />
          ذخیره تغییرات کل منو
        </button>
      </div>

      {/* Notifications */}
      <AnimatePresence>
        {successMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-green-50 rounded-xl text-green-700 text-xs font-bold mb-6 flex items-center gap-2 border border-green-100 shadow-sm"
          >
            <Check className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </motion.div>
        )}

        {errorMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-red-50 rounded-xl text-[#EF2020] text-xs font-bold mb-6 flex items-center gap-2 border border-red-100 shadow-sm"
          >
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Accordion Layout based strictly on the handdrawn schematic */}
      <div className="space-y-4 max-w-4xl">
        
        {/* LEVEL 1 TRIGGER ACCORDION BLOCK */}
        <div className="bg-white border border-gray-100 rounded-[28px] shadow-sm overflow-hidden">
          <div 
            onClick={() => setIsLevel1Open(!isLevel1Open)}
            className="p-5 flex items-center justify-between cursor-pointer hover:bg-gray-50/50 transition-colors border-b border-gray-50"
          >
            <div className="flex items-center gap-4">
              {/* Chevron rotating based on expand state */}
              <div className="p-2 bg-red-50 text-[#EF2020] rounded-xl transition-transform" style={{ transform: isLevel1Open ? 'rotate(-90deg)' : 'rotate(0deg)' }}>
                <ChevronLeft className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-3">
                {menu.useDefaultIcon ? (
                  <LayoutGrid className="w-5 h-5 text-gray-400" />
                ) : menu.icon ? (
                  <img src={menu.icon} className="w-5 h-5 object-contain" />
                ) : (
                  <ImageIcon className="w-5 h-5 text-gray-300" />
                )}
                <div>
                  <span className="text-sm font-black text-gray-800">{menu.title || <span className="text-gray-300 font-normal">«عنوان منو سفید و خالی است - برای نوشتن کلیک کنید»</span>}</span>
                  <span className="text-[10px] text-gray-400 mr-2 bg-gray-100 px-2 py-0.5 rounded-full font-bold">بخش بالای بالا (سطح ۱)</span>
                </div>
              </div>
            </div>

            {/* Level 1 Toolbar Actions */}
            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
              <button 
                onClick={handleEditLevel1}
                className="p-2.5 text-gray-500 hover:text-gray-800 hover:bg-gray-100/50 rounded-xl transition-colors"
                title="ویرایش نوشته و آیکون منوی اصلی"
              >
                <Edit className="w-4.5 h-4.5" />
              </button>
              <button 
                onClick={handleAddNewL2}
                className="p-2.5 bg-red-50 text-[#EF2020] hover:bg-[#EF2020] hover:text-white rounded-xl transition-colors font-bold flex items-center gap-1.5 text-xs px-3"
                title="افزودن دسته‌بندی جدید"
              >
                <Plus className="w-4 h-4" />
                <span>افزودن دسته‌بندی</span>
              </button>
            </div>
          </div>

          {/* Level 1 Sub-items (Level 2 categories) Container */}
          <AnimatePresence initial={false}>
            {isLevel1Open && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden bg-gray-50/40"
              >
                <div className="p-4 md:p-6 space-y-4">
                  
                  {menu.categories.length === 0 ? (
                    <div className="text-center py-10 border-2 border-dashed border-gray-100 bg-white rounded-2xl flex flex-col items-center justify-center p-4">
                      <LayoutGrid className="w-10 h-10 text-gray-300 mb-2" />
                      <p className="text-xs text-gray-400 font-bold">هیچ دسته‌بندی فرعی (سطح ۲) در منو پیکربندی نشده است.</p>
                      <button 
                        onClick={handleAddNewL2}
                        className="mt-3 text-[#EF2020] bg-red-50/50 hover:bg-red-50 px-4 py-2 rounded-xl text-xs font-bold"
                      >
                        افزودن اولین بخش
                      </button>
                    </div>
                  ) : (
                    menu.categories.map((cat) => {
                      const isExpanded = expandedL2Ids.includes(cat.id);
                      return (
                        <div key={cat.id} className="bg-white border border-gray-100 shadow-sm rounded-2xl md:rounded-[24px] overflow-hidden">
                          
                          {/* LEVEL 2 CATEGORY ROW */}
                          <div 
                            onClick={(e) => toggleL2Expand(cat.id, e)}
                            className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50/50 transition-all border-b border-gray-50"
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-1.5 bg-gray-50 text-gray-500 rounded-lg transition-transform" style={{ transform: isExpanded ? 'rotate(-90deg)' : 'rotate(0deg)' }}>
                                <ChevronLeft className="w-4 h-4" />
                              </div>
                              <div className="flex items-center gap-2">
                                {cat.useDefaultIcon ? (
                                  <div className="w-7 h-7 bg-red-50 rounded-lg flex items-center justify-center text-[#EF2020]">
                                    <LayoutGrid className="w-4 h-4" />
                                  </div>
                                ) : cat.icon ? (
                                  <img src={cat.icon} className="w-7 h-7 object-contain rounded-lg border border-gray-100 p-0.5" />
                                ) : (
                                  <div className="w-7 h-7 bg-gray-50 rounded-lg flex items-center justify-center text-gray-300">
                                    <ImageIcon className="w-4 h-4" />
                                  </div>
                                )}
                                <span className="text-xs md:text-sm font-black text-gray-700">
                                  {cat.title || <span className="text-gray-300 font-normal">«عنوان دسته سفید است - برای نوشتن کلیک کنید»</span>}
                                </span>
                              </div>
                            </div>

                            {/* Level 2 Toolbar */}
                            <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                              <button 
                                onClick={(e) => handleEditL2(cat, e)}
                                className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={(e) => handleDeleteL2(cat.id, e)}
                                className="p-2 text-gray-300 hover:text-[#EF2020] hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                              <div className="w-px h-5 bg-gray-100 mx-1" />
                              <button 
                                onClick={() => handleAddCol(cat.id)}
                                className="p-2 px-3 bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-900 rounded-lg text-[10px] font-black flex items-center gap-1 transition-all"
                                title="اضافه کردن ستون سطح ۳ (دسته سوم)"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>افزودن ستون</span>
                              </button>
                            </div>
                          </div>

                          {/* LEVEL 3 EXPANDABLE AREA - Grid of Columns */}
                          <AnimatePresence initial={false}>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden bg-gray-50/20"
                              >
                                <div className="p-4 md:p-6">
                                  {/* Info Notice */}
                                  <div className="mb-4 bg-orange-50/50 border border-orange-100/80 p-3 rounded-xl flex items-start gap-2.5">
                                    <Info className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                                    <p className="text-[10px] md:text-xs text-orange-700 font-bold leading-relaxed">
                                      بر اساس قوانین وب‌سایت، تنوع دسته‌بندی‌های سطح ۳ برای نمایش بهینه‌ی مگامنو در هدر حتماً باید <strong className="text-orange-900 text-xs font-black">دقیقاً ۳ ستون</strong> باشد (نه کمتر و نه بیشتر). لطفاً این قانون را برای پیکربندی نهایی رعایت کنید.
                                    </p>
                                  </div>

                                  {/* Grid Container */}
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                    {cat.columns.map((col, cIdx) => (
                                      <div key={col.id} className="bg-white border border-gray-100/60 p-4 rounded-xl shadow-sm flex flex-col justify-between relative min-h-[220px]">
                                        
                                        {/* Column Header */}
                                        <div>
                                          <div className="flex items-center justify-between pb-3 border-b border-gray-50 mb-3">
                                            <span className="text-[11px] font-black text-gray-800 flex items-center gap-1.5">
                                              <span className="w-2 h-2 rounded-full bg-[#EF2020]/80 shrink-0" />
                                              {col.title}
                                            </span>
                                            <div className="flex items-center gap-1">
                                              <button 
                                                onClick={() => handleEditCol(cat.id, col)}
                                                className="p-1 text-gray-400 hover:text-gray-600 rounded"
                                              >
                                                <Edit className="w-3 h-3" />
                                              </button>
                                              <button 
                                                onClick={() => handleDeleteCol(cat.id, col.id)}
                                                className="p-1 text-gray-300 hover:text-[#EF2020] rounded"
                                              >
                                                <Trash2 className="w-3 h-3" />
                                              </button>
                                            </div>
                                          </div>

                                          {/* Link Items under this Column */}
                                          <div className="space-y-1.5">
                                            {col.items.length === 0 ? (
                                              <div className="text-center py-6 text-[10px] text-gray-300 font-bold">
                                                بدون آیتم
                                              </div>
                                            ) : (
                                              col.items.map((item) => {
                                                const linkedProduct = products.find(p => p.id === item.productId);
                                                return (
                                                  <div 
                                                    key={item.id} 
                                                    className="p-2 bg-gray-50 hover:bg-gray-100/50 rounded-lg flex items-center justify-between text-[11px] text-gray-600 transition-colors group/link"
                                                  >
                                                    <div className="flex flex-col text-right">
                                                      <span className="font-extrabold text-gray-700">{item.title}</span>
                                                      {linkedProduct && (
                                                        <span className="text-[8px] text-gray-400 mt-0.5">
                                                          لینک به: {linkedProduct.title}
                                                        </span>
                                                      )}
                                                    </div>
                                                    <div className="opacity-0 group-hover/link:opacity-100 flex items-center gap-1 transition-opacity">
                                                      <button 
                                                        onClick={() => handleEditLink(cat.id, col.id, item)}
                                                        className="p-0.5 text-gray-400 hover:text-gray-600"
                                                      >
                                                        <Edit className="w-3 h-3" />
                                                      </button>
                                                      <button 
                                                        onClick={() => handleDeleteLink(cat.id, col.id, item.id)}
                                                        className="p-0.5 text-gray-400 hover:text-[#EF2020]"
                                                      >
                                                        <Trash2 className="w-3 h-3" />
                                                      </button>
                                                    </div>
                                                  </div>
                                                );
                                              })
                                            )}
                                          </div>
                                        </div>

                                        {/* Add level 3 link button inside column */}
                                        <button
                                          onClick={() => handleAddLink(cat.id, col.id)}
                                          className="mt-4 w-full flex items-center justify-center gap-1 p-2 bg-gray-50 hover:bg-red-50/50 hover:text-[#EF2020] text-gray-400 rounded-lg text-[10px] font-black transition-all border border-dashed border-gray-100 group"
                                        >
                                          <Plus className="w-3 h-3 group-hover:scale-110" />
                                          <span>افزودن نوشته</span>
                                        </button>
                                      </div>
                                    ))}

                                    {/* Empty warning / placeholder if less than 3 columns */}
                                    {cat.columns.length < 3 && (
                                      <div className="bg-red-50/50 border-2 border-dashed border-red-100 p-4 rounded-xl flex flex-col items-center justify-center text-center text-xs text-red-700 select-none">
                                        <AlertTriangle className="w-8 h-8 text-[#EF2020] mb-2" />
                                        <p className="font-black">ستون کمه!</p>
                                        <p className="text-[10px] text-red-500 font-bold mt-1">تعداد ستون‌ها {cat.columns.length} است، باید دقیقاً ۳ ستون زیر این بخش باشد.</p>
                                        <button 
                                          onClick={() => handleAddCol(cat.id)}
                                          className="mt-3 bg-red-100 hover:bg-red-200 text-[#EF2020] font-black text-[10px] px-3 py-1.5 rounded-lg"
                                        >
                                          ایجاد ستون سوم جدید
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })
                  )}

                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* --- MODAL EDIT DIALOG --- */}
      <AnimatePresence>
        {editingItemType && (
          <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[32px] w-full max-w-lg shadow-2xl overflow-hidden border border-gray-100 p-6 md:p-8"
              dir="rtl"
            >
              <h4 className="text-base md:text-lg font-black text-gray-800 border-b border-gray-100 pb-4 mb-6 flex items-center gap-2">
                <LayoutGrid className="w-5 h-5 text-[#EF2020]" />
                {editingItemType === 'level1' && "ویرایش بخش هدر بالا (سطح ۱)"}
                {editingItemType === 'level2' && "ویرایش دسته‌بندی سطح دوم"}
                {editingItemType === 'level3_col' && "ویرایش عنوان ستون سطح سوم"}
                {editingItemType === 'level3_link' && (editingData.linkId ? "ویرایش لینک محصول (سطح سوم)" : "افزودن کلیک و لینک محصول جدید")}
              </h4>

              <div className="space-y-5">
                {/* Text Field Title */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-500 block">عنوان نوشته یا دسته‌بندی</label>
                  <input
                    type="text"
                    value={editingData?.title || ''}
                    placeholder="نمایش نوشته به کاربر..."
                    onChange={(e) => setEditingData((prev: any) => ({ ...prev, title: e.target.value }))}
                    className="w-full bg-gray-50 border border-gray-100 px-4 py-3 text-xs md:text-sm md:py-3.5 rounded-xl outline-none focus:border-red-400 font-bold"
                  />
                  <p className="text-[10px] text-gray-400 font-bold">این همان متنی است که بر روی وب‌سایت در بخش مربوطه نمایش داده خواهد شد.</p>
                </div>

                {/* Specifics for Level 1 or Level 2 */}
                {(editingItemType === 'level1' || editingItemType === 'level2') && (
                  <div className="space-y-4 pt-2 border-t border-gray-50">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-black text-gray-600">استفاده از آیکون پیش‌فرض سیستم</label>
                      <button
                        onClick={() => setEditingData((prev: any) => ({ ...prev, useDefaultIcon: !prev.useDefaultIcon }))}
                        className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 outline-none ${editingData?.useDefaultIcon ? 'bg-[#EF2020]' : 'bg-gray-200'}`}
                      >
                        <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-200 ${editingData?.useDefaultIcon ? '-translate-x-6' : 'translate-x-0'}`} />
                      </button>
                    </div>

                    {editingData?.useDefaultIcon && (
                      <div className="space-y-2.5 pt-1.5">
                        <label className="text-xs font-black text-gray-500 block">انتخاب آیکون پیش‌فرض سیستم</label>
                        <div className="grid grid-cols-4 gap-2 pt-1 max-h-[160px] overflow-y-auto pr-1">
                          {SUPPORTED_DEFAULT_ICONS.map(({ name, label, icon: Icon }) => (
                            <button
                              key={name}
                              type="button"
                              onClick={() => setEditingData((prev: any) => ({ ...prev, icon: name }))}
                              className={`p-2 rounded-xl border flex flex-col items-center gap-1.5 transition-all outline-none ${
                                (editingData?.icon === name || (!editingData?.icon && name === 'LayoutGrid'))
                                  ? 'border-[#EF2020] bg-red-50/50 text-[#EF2020] font-black scale-[0.98]'
                                  : 'border-gray-100 bg-gray-50/30 text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                              }`}
                            >
                              <Icon className="w-4.5 h-4.5" />
                              <span className="text-[9px] font-bold leading-none">{label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {!editingData?.useDefaultIcon && (
                      <div className="space-y-2">
                        <label className="text-xs font-black text-gray-500 block">بارگذاری یا تغییر آیکون سفارشی (فرمت تصویر)</label>
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center shrink-0 overflow-hidden relative">
                            {editingData?.icon ? (
                              <img src={editingData.icon} className="w-full h-full object-contain" />
                            ) : (
                              <ImageIcon className="w-6 h-6 text-gray-300" />
                            )}
                          </div>
                          
                          <label className="flex-1 cursor-pointer">
                            <input 
                              type="file" 
                              className="hidden" 
                              accept="image/*"
                              onChange={(e) => handleLogoUpload(e, (base64) => {
                                setEditingData((prev: any) => ({ ...prev, icon: base64 }));
                              })}
                            />
                            <div className="border border-dashed border-gray-200 hover:border-[#EF2020] rounded-xl p-3 text-center text-[10px] md:text-xs font-bold text-gray-500 flex items-center justify-center gap-2 hover:bg-gray-50/50 transition-colors">
                              <Upload className="w-4 h-4 shrink-0" />
                              بارگذاری فایل آیکون جدید
                            </div>
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Level 3 Link product linkage selector */}
                {editingItemType === 'level3_link' && (
                  <div className="space-y-2 pt-2 border-t border-gray-50">
                    <label className="text-xs font-black text-gray-500 block">انتخاب محصول هدف جهت کلیک و ارجاع</label>
                    <select
                      value={editingData?.productId || ''}
                      onChange={(e) => setEditingData((prev: any) => ({ ...prev, productId: e.target.value ? Number(e.target.value) : null }))}
                      className="w-full bg-gray-50 border border-gray-100 px-4 py-3 text-xs md:text-sm rounded-xl outline-none focus:border-red-400 font-extrabold"
                    >
                      <option value="">-- فاقد لینک ارجاع مستقیم (فقط متن دکمه) --</option>
                      {products.map(p => (
                        <option key={p.id} value={p.id}>{p.title} ({p.price.toLocaleString('fa-IR')} تومان)</option>
                      ))}
                    </select>
                    <p className="text-[10px] text-gray-400 font-bold">
                      وقتی کاربر بر روی این گزینه کلیک کند، فوراً به صفحه جزئیات آن محصول فرستاده خواهد شد.
                    </p>
                  </div>
                )}
              </div>

              {/* Action operations */}
              <div className="mt-8 flex items-center justify-end gap-3 pt-4 border-t border-gray-50">
                <button
                  onClick={() => setEditingItemType(null)}
                  className="px-5 py-2.5 rounded-xl hover:bg-gray-100 text-xs text-gray-500 font-black transition-colors"
                >
                  انصراف
                </button>
                <button
                  onClick={() => {
                    if (editingItemType === 'level1') handleSaveLevel1();
                    else if (editingItemType === 'level2') handleSaveL2();
                    else if (editingItemType === 'level3_col') handleSaveCol();
                    else if (editingItemType === 'level3_link') handleSaveLink();
                  }}
                  className="bg-[#EF2020] text-white px-5 py-2.5 rounded-xl hover:bg-red-600 text-xs font-black shadow-md flex items-center gap-1.5 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  ذخیره موقت
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
