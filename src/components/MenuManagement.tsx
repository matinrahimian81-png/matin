import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as LucideIcons from 'lucide-react';
import { 
  ChevronDown, 
  ChevronLeft, 
  ChevronUp,
  ArrowUp,
  ArrowDown,
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
import { MenuConfig, Level1Item, Level2Category, MenuColumn, MenuLinkItem, ProductData } from '../types';
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
      icon: "Smartphone",
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
      icon: "Laptop",
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
      icon: "Shirt",
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
    },
    {
      id: "cat_4",
      title: "شگفت‌انگیز",
      useDefaultIcon: true,
      icon: "Sparkles",
      columns: [
        {
          id: "col_4_1",
          title: "پیشنهادات داغ شگفت‌انگیز",
          items: [
            { id: "item_4_1_1", title: "پرفروش‌ترین‌های تخفیف‌دار", productId: null },
            { id: "item_4_1_2", title: "کالاهای منتخب ویژه دیجی‌ماتین", productId: null },
          ]
        },
        {
          id: "col_4_2",
          title: "شگفت‌انگیز روزانه",
          items: [
            { id: "item_4_2_1", title: "کالای دیجیتال شگفت‌انگیز", productId: null },
            { id: "item_4_2_2", title: "تجهیزات خانگی ویژه", productId: null },
          ]
        },
        {
          id: "col_4_3",
          title: "تخفیف‌های بالای ۵۰٪",
          items: [
            { id: "item_4_3_1", title: "تی‌شرت و شلوار شگفت‌انگیز", productId: null },
            { id: "item_4_3_2", title: "اکسسوری و ساعت با نصف قیمت", productId: null },
          ]
        }
      ]
    },
    {
      id: "cat_5",
      title: "سوپرمارکت",
      useDefaultIcon: true,
      icon: "LayoutGrid",
      columns: [
        {
          id: "col_5_1",
          title: "کالاهای اساسی و خواربار",
          items: [
            { id: "item_5_1_1", title: "برنج و روغن سرخ‌کردنی", productId: null },
            { id: "item_5_1_2", title: "قند و شکر سفید", productId: null },
          ]
        },
        {
          id: "col_5_2",
          title: "لبنیات و پروتئینی تازه",
          items: [
            { id: "item_5_2_1", title: "شیر کم چرب و ماست دبه", productId: null },
            { id: "item_5_2_2", title: "تخم مرغ و فیله مرغ تازه", productId: null },
          ]
        },
        {
          id: "col_5_3",
          title: "مواد شوینده و بهداشتی",
          items: [
            { id: "item_5_3_1", title: "مایع دستشویی و پودر لباس", productId: null },
            { id: "item_5_3_2", title: "دستمال کاغذی جعبه‌ای", productId: null },
          ]
        }
      ]
    },
    {
      id: "cat_6",
      title: "کارت هدیه",
      useDefaultIcon: true,
      icon: "Trophy",
      columns: [
        {
          id: "col_6_1",
          title: "کارت هدیه تولد و سالگرد",
          items: [
            { id: "item_6_1_1", title: "کارت هدیه طرح تولد مبارک", productId: null },
            { id: "item_6_1_2", title: "طرح سالگرد ازدواج و نامزدی", productId: null },
          ]
        },
        {
          id: "col_6_2",
          title: "کارت هدیه سازمانی",
          items: [
            { id: "item_6_2_1", title: "کارت خرید گروهی و انفرادی", productId: null },
            { id: "item_6_2_2", title: "هدیه مناسبتی پرسنل", productId: null },
          ]
        },
        {
          id: "col_6_3",
          title: "کارت‌های اعتباری مختلف",
          items: [
            { id: "item_6_3_1", title: "کارت اعتباری ۲۰۰ هزار تومانی", productId: null },
            { id: "item_6_3_2", title: "کارت اعتباری ۱ میلیون تومانی", productId: null },
          ]
        }
      ]
    },
    {
      id: "cat_7",
      title: "پرفروش‌ترین‌ها",
      useDefaultIcon: true,
      icon: "Heart",
      columns: [
        {
          id: "col_7_1",
          title: "دیجیتال پرفروش هفته",
          items: [
            { id: "item_7_1_1", title: "موبایل سامسونگ پرفروش", productId: null },
            { id: "item_7_1_2", title: "ساعت هوشمند پرطرفدار", productId: null },
          ]
        },
        {
          id: "col_7_2",
          title: "لوازم خانه پرطرفدار",
          items: [
            { id: "item_7_2_1", title: "جاروبرقی و تلویزیون پرفروش", productId: null },
            { id: "item_7_2_2", title: "همزن برقی و مخلوط کن", productId: null },
          ]
        },
        {
          id: "col_7_3",
          title: "مد و پوشاک برگزیده",
          items: [
            { id: "item_7_3_1", title: "کفش ورزشی مردانه ترند", productId: null },
            { id: "item_7_3_2", title: "شلوار کتان اسپرت", productId: null },
          ]
        }
      ]
    },
    {
      id: "cat_8",
      title: "تخفیف‌ها",
      useDefaultIcon: true,
      icon: "Trophy",
      columns: [
        {
          id: "col_8_1",
          title: "تخفیف‌های استثنایی کالا",
          items: [
            { id: "item_8_1_1", title: "کالاهای نصف قیمت (۵۰٪)", productId: null },
            { id: "item_8_1_2", title: "تخفیف روی لوازم جانبی موبایل", productId: null },
          ]
        },
        {
          id: "col_8_2",
          title: "پیشنهادات شگفت‌انگیز سوپرمارکت",
          items: [
            { id: "item_8_2_1", title: "تخفیف روی لبنیات روزانه", productId: null },
            { id: "item_8_2_2", title: "شوینده‌های پر تخفیف", productId: null },
          ]
        },
        {
          id: "col_8_3",
          title: "کدهای تخفیف جشنواره و خرید اول",
          items: [
            { id: "item_8_3_1", title: "کد تخفیف خرید اول مشتریان", productId: null },
            { id: "item_8_3_2", title: "ارسال کاملاً رایگان برای خرید اول", productId: null },
          ]
        }
      ]
    }
  ],
  extraLinks: [
    { id: "extra_1", title: "شگفت‌انگیز", url: "#", useDefaultIcon: true, icon: "Sparkles" },
    { id: "extra_2", title: "سوپرمارکت", url: "#", useDefaultIcon: true, icon: "LayoutGrid" },
    { id: "extra_3", title: "کارت هدیه", url: "#", useDefaultIcon: true, icon: "Trophy" },
    { id: "extra_4", title: "پرفروش‌ترین‌ها", url: "#", useDefaultIcon: true, icon: "Heart" },
    { id: "extra_5", title: "تخفیف‌ها", url: "#", useDefaultIcon: true, icon: "Sparkles" },
  ]
};

export function normalizeMenuConfig(config: any): MenuConfig {
  if (!config) return { items: [] };

  // If already normalized
  if (config.items && Array.isArray(config.items) && config.items.length > 0) {
    return {
      items: config.items.map((it: any) => ({
        id: it.id || "l1_" + Math.random(),
        title: it.title || "بدون عنوان",
        url: it.url || "#",
        useDefaultIcon: it.useDefaultIcon !== undefined ? it.useDefaultIcon : true,
        icon: it.icon || "Sparkles",
        categories: Array.isArray(it.categories) ? it.categories.map((c: any) => ({
          ...c,
          columns: Array.isArray(c.columns) ? c.columns : []
        })) : []
      }))
    };
  }

  // Convert legacy structure
  const mainL1Item: Level1Item = {
    id: "level1_first",
    title: config.title || "دسته‌بندی کالاها",
    url: "#",
    useDefaultIcon: config.useDefaultIcon !== undefined ? config.useDefaultIcon : true,
    icon: config.icon || "LayoutGrid",
    categories: Array.isArray(config.categories) ? config.categories.map((c: any) => ({
      ...c,
      columns: Array.isArray(c.columns) ? c.columns : []
    })) : []
  };

  const extraL1Items: Level1Item[] = Array.isArray(config.extraLinks) 
    ? config.extraLinks.map((link: any, index: number) => ({
        id: link.id || "extra_" + index,
        title: link.title || "بدون عنوان",
        url: link.url || "#",
        useDefaultIcon: link.useDefaultIcon !== undefined ? link.useDefaultIcon : true,
        icon: link.icon || "Sparkles",
        categories: [] // extra links usually start with no nested sub-categories
      }))
    : [];

  return {
    items: [mainL1Item, ...extraL1Items]
  };
}

export default function MenuManagement({ products = [] }: { products?: ProductData[] }) {
  const [menu, setMenu] = useState<MenuConfig>(DEFAULT_MENU_CONFIG);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Accordion open states
  const [expandedL1Id, setExpandedL1Id] = useState<string | null>("level1_first");
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
          const parsed = JSON.parse(cached);
          const normalized = normalizeMenuConfig(parsed);
          setMenu(normalized);
        } catch (e) {
          console.error("Error reading cached menu config:", e);
        }
      } else {
        setMenu(normalizeMenuConfig(DEFAULT_MENU_CONFIG));
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
            const normalized = normalizeMenuConfig(data.value);
            setMenu(normalized);
            localStorage.setItem('matinkala_menu_config', JSON.stringify(normalized));
            window.dispatchEvent(new Event('matinkala_menu_changed'));
          } else {
            // Attempt 2: from menu_config table
            const { data: menuData, error: menuErr } = await supabase
              .from('menu_config')
              .select('config')
              .limit(1)
              .maybeSingle();

            if (!menuErr && menuData?.config) {
              const normalized = normalizeMenuConfig(menuData.config);
              setMenu(normalized);
              localStorage.setItem('matinkala_menu_config', JSON.stringify(normalized));
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

  // Level 1 Edit/CRUD
  const handleAddNewL1 = () => {
    const newL1: Level1Item = {
      id: "level1_" + Date.now(),
      title: "سطح جدید منو (سطح یک)",
      url: "#",
      useDefaultIcon: true,
      icon: "Sparkles",
      categories: [
        {
          id: "cat_new_" + Date.now(),
          title: "دسته‌بندی نمونه (سطح دو)",
          useDefaultIcon: true,
          icon: "Smartphone",
          columns: [
            { id: "col_new_1_" + Date.now(), title: "ستون اول (سطح سه)", items: [] },
            { id: "col_new_2_" + Date.now(), title: "ستون دوم (سطح سه)", items: [] },
            { id: "col_new_3_" + Date.now(), title: "ستون سوم (سطح سه)", items: [] }
          ]
        }
      ]
    };
    setMenu(prev => {
      const list = prev.items || [];
      return { ...prev, items: [newL1, ...list] };
    });
    setExpandedL1Id(newL1.id);
    setEditingItemType('level1');
    setEditingData({ ...newL1 });
    showToast("سطح جدید به بالای منوها اضافه شد.");
  };

  const handleEditL1 = (item: Level1Item) => {
    setEditingItemType('level1');
    setEditingData({ ...item });
  };

  const handleSaveLevel1 = () => {
    if (!editingData?.title?.trim()) {
      showToast("عنوان منو نمی‌تواند خالی باشد.", true);
      return;
    }
    setMenu(prev => ({
      ...prev,
      items: (prev.items || []).map(it => 
        it.id === editingData.id 
          ? { ...it, title: editingData.title, url: editingData.url, icon: editingData.icon, useDefaultIcon: editingData.useDefaultIcon }
          : it
      )
    }));
    setEditingItemType(null);
    showToast("تغییرات سطح یک ذخیره موقت شد.");
  };

  const handleDeleteL1 = (id: string) => {
    if (confirm("آیا از حذف این سطح و کلیه زیرمجموعه‌های آن اطمینان دارید؟")) {
      setMenu(prev => ({
        ...prev,
        items: (prev.items || []).filter(item => item.id !== id)
      }));
      showToast("سطح با موفقیت حذف شد.");
    }
  };

  const handleMoveL1Up = (index: number) => {
    if (index === 0) return;
    setMenu(prev => {
      const list = [...(prev.items || [])];
      const temp = list[index];
      list[index] = list[index - 1];
      list[index - 1] = temp;
      return { ...prev, items: list };
    });
    showToast("سطح به بالا منتقل شد.");
  };

  const handleMoveL1Down = (index: number) => {
    const items = menu.items || [];
    if (index === items.length - 1) return;
    setMenu(prev => {
      const list = [...(prev.items || [])];
      const temp = list[index];
      list[index] = list[index + 1];
      list[index + 1] = temp;
      return { ...prev, items: list };
    });
    showToast("سطح به پایین منتقل شد.");
  };

  // Level 2 CRUD
  const handleAddNewL2 = (l1Id: string) => {
    const newL2: Level2Category = {
      id: "cat_" + Date.now(),
      title: "دسته‌بندی جدید",
      useDefaultIcon: true,
      icon: "Smartphone",
      columns: [
        { id: "col_" + Date.now() + "_1", title: "بخش اول", items: [] },
        { id: "col_" + Date.now() + "_2", title: "بخش دوم", items: [] },
        { id: "col_" + Date.now() + "_3", title: "بخش سوم", items: [] },
      ]
    };
    setMenu(prev => ({
      ...prev,
      items: (prev.items || []).map(item => 
        item.id === l1Id 
          ? { ...item, categories: [...(item.categories || []), newL2] }
          : item
      )
    }));
    setExpandedL2Ids(prev => [...prev, newL2.id]);
    setEditingItemType('level2');
    setEditingData({ ...newL2, l1Id });
  };

  const handleEditL2 = (l1Id: string, cat: Level2Category) => {
    setEditingItemType('level2');
    setEditingData({ ...cat, l1Id });
  };

  const handleSaveL2 = () => {
    if (!editingData?.title?.trim()) {
      showToast("عنوان دسته‌بندی نمی‌تواند خالی باشد.", true);
      return;
    }
    setMenu(prev => ({
      ...prev,
      items: (prev.items || []).map(item => {
        if (item.id === editingData.l1Id) {
          return {
            ...item,
            categories: (item.categories || []).map(c => 
              c.id === editingData.id 
                ? { ...c, title: editingData.title, icon: editingData.icon, useDefaultIcon: editingData.useDefaultIcon }
                : c
            )
          };
        }
        return item;
      })
    }));
    setEditingItemType(null);
    showToast("تغییرات دسته‌بندی ذخیره موقت شد.");
  };

  const handleDeleteL2 = (l1Id: string, catId: string) => {
    if (confirm("آیا از حذف این دسته‌بندی و تمامی زیرمجموعه‌های آن اطمینان دارید؟")) {
      setMenu(prev => ({
        ...prev,
        items: (prev.items || []).map(item => 
          item.id === l1Id 
            ? { ...item, categories: (item.categories || []).filter(c => c.id !== catId) }
            : item
        )
      }));
      showToast("دسته‌بندی با موفقیت حذف شد.");
    }
  };

  const handleMoveL2Up = (l1Id: string, index: number) => {
    if (index === 0) return;
    setMenu(prev => ({
      ...prev,
      items: (prev.items || []).map(item => {
        if (item.id === l1Id) {
          const list = [...(item.categories || [])];
          const temp = list[index];
          list[index] = list[index - 1];
          list[index - 1] = temp;
          return { ...item, categories: list };
        }
        return item;
      })
    }));
    showToast("دسته‌بندی به بالا منتقل شد.");
  };

  const handleMoveL2Down = (l1Id: string, index: number) => {
    const l1Item = (menu.items || []).find(item => item.id === l1Id);
    if (!l1Item || index === (l1Item.categories || []).length - 1) return;
    setMenu(prev => ({
      ...prev,
      items: (prev.items || []).map(item => {
        if (item.id === l1Id) {
          const list = [...(item.categories || [])];
          const temp = list[index];
          list[index] = list[index + 1];
          list[index + 1] = temp;
          return { ...item, categories: list };
        }
        return item;
      })
    }));
    showToast("دسته‌بندی به پایین منتقل شد.");
  };

  // Level 3 Column CRUD
  const handleAddCol = (l1Id: string, catId: string) => {
    const l1Item = (menu.items || []).find(item => item.id === l1Id);
    const cat = (l1Item?.categories || []).find(c => c.id === catId);
    if (cat && cat.columns.length >= 3) {
      showToast("تعداد کل ستون‌ها نباید بیشتر از ۳ باشد! برای ورود یک ستون جدید، یکی از ۳ ستون فعلی را حذف کنید.", true);
      return;
    }
    const newCol: MenuColumn = {
      id: "col_" + Date.now(),
      title: "عنوان بخش جدید",
      items: []
    };
    setMenu(prev => ({
      ...prev,
      items: (prev.items || []).map(item => {
        if (item.id === l1Id) {
          return {
            ...item,
            categories: (item.categories || []).map(c => 
              c.id === catId ? { ...c, columns: [...c.columns, newCol] } : c
            )
          };
        }
        return item;
      })
    }));
  };

  const handleEditCol = (l1Id: string, catId: string, col: MenuColumn) => {
    setEditingItemType('level3_col');
    setEditingData({
      l1Id,
      catId,
      colId: col.id,
      title: col.title
    });
  };

  const handleSaveCol = () => {
    if (!editingData?.title?.trim()) {
      showToast("عنوان ستون نمی‌تواند خالی باشد.", true);
      return;
    }
    setMenu(prev => ({
      ...prev,
      items: (prev.items || []).map(item => {
        if (item.id === editingData.l1Id) {
          return {
            ...item,
            categories: (item.categories || []).map(c => {
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
          };
        }
        return item;
      })
    }));
    setEditingItemType(null);
    showToast("عنوان ستون با موفقیت تغییر کرد.");
  };

  const handleDeleteCol = (l1Id: string, catId: string, colId: string) => {
    if (confirm("آیا مطمئن هستید که می‌خواهید این ستون را به همراه تمام لینک‌های آن حذف کنید؟")) {
      setMenu(prev => ({
        ...prev,
        items: (prev.items || []).map(item => {
          if (item.id === l1Id) {
            return {
              ...item,
              categories: (item.categories || []).map(c => {
                if (c.id === catId) {
                  return {
                    ...c,
                    columns: c.columns.filter(col => col.id !== colId)
                  };
                }
                return c;
              })
            };
          }
          return item;
        })
      }));
      showToast("ستون حذف شد.");
    }
  };

  // Level 4 Link Items CRUD
  const handleAddLink = (l1Id: string, catId: string, colId: string) => {
    setEditingItemType('level3_link');
    setEditingData({
      l1Id,
      catId,
      colId,
      linkId: null,
      title: '',
      productId: null
    });
  };

  const handleEditLink = (l1Id: string, catId: string, colId: string, item: MenuLinkItem) => {
    setEditingItemType('level3_link');
    setEditingData({
      l1Id,
      catId,
      colId,
      linkId: item.id,
      title: item.title,
      productId: item.productId
    });
  };

  const handleSaveLink = () => {
    if (!editingData?.title?.trim()) {
      showToast("عنوان نوشته/لینک نمی‌تواند خالی باشد.", true);
      return;
    }
    setMenu(prev => ({
      ...prev,
      items: (prev.items || []).map(item => {
        if (item.id === editingData.l1Id) {
          return {
            ...item,
            categories: (item.categories || []).map(c => {
              if (c.id === editingData.catId) {
                return {
                  ...c,
                  columns: c.columns.map(col => {
                    if (col.id === editingData.colId) {
                      if (editingData.linkId) {
                        return {
                          ...col,
                          items: col.items.map(it => 
                            it.id === editingData.linkId 
                              ? { ...it, title: editingData.title, productId: editingData.productId ? Number(editingData.productId) : null }
                              : it
                          )
                        };
                      } else {
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
          };
        }
        return item;
      })
    }));
    setEditingItemType(null);
    showToast("لینک تغییر یافته ذخیره موقت شد.");
  };

  const handleDeleteLink = (l1Id: string, catId: string, colId: string, linkId: string) => {
    setMenu(prev => ({
      ...prev,
      items: (prev.items || []).map(item => {
        if (item.id === l1Id) {
          return {
            ...item,
            categories: (item.categories || []).map(c => {
              if (c.id === catId) {
                return {
                  ...c,
                  columns: c.columns.map(col => {
                    if (col.id === colId) {
                      return {
                        ...col,
                        items: col.items.filter(it => it.id !== linkId)
                      };
                    }
                    return col;
                  })
                };
              }
              return c;
            })
          };
        }
        return item;
      })
    }));
    showToast("لینک حذف شد.");
  };

  // --- SAVE DIRECT TO LOCAL STORAGE WITH STRICT VALIDATIONS ---
  const handleFinalSave = () => {
    const items = menu.items || [];
    
    // Validate that each Category has exactly 3 columns
    for (const l1 of items) {
      for (const cat of (l1.categories || [])) {
        if (cat.columns.length !== 3) {
          showToast(
            `خطا در ذخیره‌سازی: تعداد ستون‌های سطح ۳ برای دسته‌بندی "${cat.title || "دسته‌بندی بی‌نام"}" در تب "${l1.title}" حتماً باید دقیقاً ۳ ستون باشد.`,
            true
          );
          return;
        }
      }
    }

    try {
      localStorage.setItem('matinkala_menu_config', JSON.stringify(menu));
      
      if (isSupabaseConfigured) {
        (async () => {
          try {
            const { error } = await supabase
              .from('settings')
              .upsert({ key: 'menu_config', value: menu }, { onConflict: 'key' });
            
            if (error) {
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

      window.dispatchEvent(new Event('matinkala_menu_changed'));
      
      showToast(isSupabaseConfigured 
        ? "پیکربندی منوی یکپارچه با موفقیت در دیتابیسی سوپابیس ذخیره و اعمال شد. 🎉" 
        : "پیکربندی منوی یکپارچه با موفقیت در این مرورگر ذخیره و اعمال شد. 🎉"
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
            تنظیمات منوی اصلی (مدیریت تمامی سطوح هدر)
          </h3>
          <p className="text-xs text-gray-400 font-medium mt-1">
            ویرایش، افزودن، حذف و مرتب‌سازی تمامی سطوح منو به صورت یکپارچه و مستقیم. دکمه افزودن سطح ۱ در بالا به شما اجازه ارتقاء می‌دهد.
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

      {/* Unified List of Level 1 items */}
      <div className="space-y-6 max-w-4xl">
        
        {/* ADD NEW LEVEL 1 BLOCK AT THE VERY TOP OF ALL MAIN CATEGORIES AS DIRECTED BY THE USER */}
        <div className="flex justify-between items-center bg-white p-4 border border-gray-100 rounded-2xl shadow-sm">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-[#EF2020] animate-pulse" />
            <div>
              <span className="text-xs font-black text-gray-800">ایجاد سطح هدر جدید (سطح یک)</span>
              <p className="text-[10px] text-gray-400 font-bold mt-0.5">تب‌های اضافی هدر که در کنار منوی اصلی به نمایش در می‌آیند.</p>
            </div>
          </div>
          <button 
            onClick={handleAddNewL1}
            className="p-2.5 px-5 bg-red-50 text-[#EF2020] hover:bg-[#EF2020] hover:text-white rounded-xl transition-all font-black flex items-center gap-1.5 text-xs text-center shadow-sm"
          >
            <Plus className="w-4.5 h-4.5" />
            <span>افزودن سطح جدید</span>
          </button>
        </div>

        {/* Level 1 Accordion List */}
        <div className="space-y-4">
          {(menu.items || []).map((l1Item, l1Idx) => {
            const isL1Expanded = expandedL1Id === l1Item.id;
            
            // Resolve icon
            let IconComponent = Sparkles;
            if (l1Item.useDefaultIcon && l1Item.icon) {
              const res = (LucideIcons as any)[l1Item.icon];
              if (res) IconComponent = res;
            }

            return (
              <div key={l1Item.id} className="bg-white border border-gray-100 rounded-[24px] shadow-sm overflow-hidden transition-all">
                {/* LEVEL 1 ITEM ROW */}
                <div 
                  onClick={() => setExpandedL1Id(isL1Expanded ? null : l1Item.id)}
                  className={`p-5 flex items-center justify-between cursor-pointer transition-colors ${isL1Expanded ? 'bg-red-50/10 border-b border-gray-100' : 'hover:bg-gray-50/40'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-red-50 text-[#EF2020] rounded-xl transition-transform" style={{ transform: isL1Expanded ? 'rotate(-90deg)' : 'rotate(0deg)' }}>
                      <ChevronLeft className="w-4.5 h-4.5" />
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gray-50 border border-gray-100 flex items-center justify-center text-[#EF2020] rounded-xl shrink-0">
                        {l1Item.useDefaultIcon ? (
                          <IconComponent className="w-5 h-5" />
                        ) : l1Item.icon ? (
                          <img src={l1Item.icon} className="w-7 h-7 object-contain" />
                        ) : (
                          <LayoutGrid className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-gray-800">{l1Item.title || "سطح بدون‌نام"}</span>
                          <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${l1Idx === 0 ? 'bg-[#EF2020]/10 text-[#EF2020]' : 'bg-gray-100 text-gray-500'}`}>
                            {l1Idx === 0 ? "طرح منوی اصلی خریدار" : `تب کمکی سطح یک (${l1Idx + 1})`}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-400 font-mono tracking-tight text-right mt-0.5" dir="ltr">{l1Item.url}</p>
                      </div>
                    </div>
                  </div>

                  {/* Level 1 Actions */}
                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    {/* Reorder Buttons */}
                    <button
                      onClick={() => handleMoveL1Up(l1Idx)}
                      disabled={l1Idx === 0}
                      className={`p-2 rounded-lg transition-colors ${l1Idx === 0 ? 'text-gray-200 cursor-not-allowed' : 'text-gray-400 hover:text-gray-800 hover:bg-gray-50'}`}
                      title="حرکت به بالا"
                    >
                      <ChevronUp className="w-4.5 h-4.5" />
                    </button>
                    <button
                      onClick={() => handleMoveL1Down(l1Idx)}
                      disabled={l1Idx === (menu.items || []).length - 1}
                      className={`p-2 rounded-lg transition-colors ${l1Idx === (menu.items || []).length - 1 ? 'text-gray-200 cursor-not-allowed' : 'text-gray-400 hover:text-gray-800 hover:bg-gray-50'}`}
                      title="حرکت به پایین"
                    >
                      <ChevronDown className="w-4.5 h-4.5" />
                    </button>

                    <div className="w-px h-5 bg-gray-100 mx-1" />

                    <button
                      onClick={() => handleEditL1(l1Item)}
                      className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                      title="ویرایش عنوان و پیوند سطح ۱"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    {l1Idx > 0 && (
                      <button
                        onClick={() => handleDeleteL1(l1Item.id)}
                        className="p-2 text-gray-300 hover:text-[#EF2020] hover:bg-red-50 rounded-lg transition-colors"
                        title="حذف سطح ۱"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}

                    <div className="w-px h-5 bg-gray-100 mx-1" />

                    <button
                      onClick={() => handleAddNewL2(l1Item.id)}
                      className="p-2 px-3 bg-red-50 hover:bg-[#EF2020] hover:text-white text-[#EF2020] text-[10px] font-black rounded-lg flex items-center gap-1 transition-all"
                      title="افزودن دسته‌بندی سطح دوم"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>افزودن دسته‌بندی (سطح ۲)</span>
                    </button>
                  </div>
                </div>

                {/* LEVEL 2 CHILDREN PANEL */}
                <AnimatePresence initial={false}>
                  {isL1Expanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden bg-gray-50/30"
                    >
                      <div className="p-4 md:p-6 space-y-4 border-t border-gray-100">
                        {(!l1Item.categories || l1Item.categories.length === 0) ? (
                          <div className="text-center py-8 border border-dashed border-gray-200 bg-white rounded-xl flex flex-col items-center justify-center p-4">
                            <LayoutGrid className="w-10 h-10 text-gray-300 mb-2" />
                            <p className="text-xs text-gray-400 font-bold">هیچ زیرمجموعه دسته‌بندی (سطح ۲) در این بخش پیکربندی نشده است.</p>
                            <button
                              onClick={() => handleAddNewL2(l1Item.id)}
                              className="mt-3 bg-red-50 text-[#EF2020] hover:bg-[#EF2020] hover:text-white px-4 py-2 rounded-xl text-xs font-black transition-all"
                            >
                              افزودن دسته‌بندی سطح ۲
                            </button>
                          </div>
                        ) : (
                          l1Item.categories.map((cat, catIdx) => {
                            const isL2Expanded = expandedL2Ids.includes(cat.id);
                            
                            let CatIcon = LayoutGrid;
                            if (cat.useDefaultIcon && cat.icon) {
                              const res = (LucideIcons as any)[cat.icon];
                              if (res) CatIcon = res;
                            }

                            return (
                              <div key={cat.id} className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                                {/* LEVEL 2 ROW */}
                                <div 
                                  onClick={(e) => toggleL2Expand(cat.id, e)}
                                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50/45 transition-colors border-b border-gray-50"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="p-1.5 bg-gray-50 text-gray-500 rounded-lg transition-transform" style={{ transform: isL2Expanded ? 'rotate(-90deg)' : 'rotate(0deg)' }}>
                                      <ChevronLeft className="w-4.5 h-4.5" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-[#EF2020] shrink-0">
                                        {cat.useDefaultIcon ? (
                                          <CatIcon className="w-4 h-4" />
                                        ) : cat.icon ? (
                                          <img src={cat.icon} className="w-6 h-6 object-contain" />
                                        ) : (
                                          <LayoutGrid className="w-4 h-4" />
                                        )}
                                      </div>
                                      <div>
                                        <div className="flex items-center gap-1.5">
                                          <span className="text-xs md:text-sm font-black text-gray-700">{cat.title || "دسته‌بندی بدون‌عنوان"}</span>
                                          <span className="text-[9px] bg-red-50 text-[#EF2020] px-2 py-0.5 rounded-full font-black">
                                            دسته‌بندی سطح دو ({catIdx + 1})
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Level 2 Actions */}
                                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                                    <button
                                      onClick={() => handleMoveL2Up(l1Item.id, catIdx)}
                                      disabled={catIdx === 0}
                                      className={`p-1.5 rounded-lg transition-colors ${catIdx === 0 ? 'text-gray-200 cursor-not-allowed' : 'text-gray-400 hover:text-gray-800 hover:bg-gray-50'}`}
                                      title="حرکت به بالا"
                                    >
                                      <ChevronUp className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => handleMoveL2Down(l1Item.id, catIdx)}
                                      disabled={catIdx === l1Item.categories.length - 1}
                                      className={`p-1.5 rounded-lg transition-colors ${catIdx === l1Item.categories.length - 1 ? 'text-gray-200 cursor-not-allowed' : 'text-gray-400 hover:text-gray-800 hover:bg-gray-50'}`}
                                      title="حرکت به پایین"
                                    >
                                      <ChevronDown className="w-4 h-4" />
                                    </button>

                                    <div className="w-px h-5 bg-gray-100 mx-1" />

                                    <button
                                      onClick={() => handleEditL2(l1Item.id, cat)}
                                      className="p-1.5 text-gray-400 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
                                      title="ویرایش عنوان"
                                    >
                                      <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteL2(l1Item.id, cat.id)}
                                      className="p-1.5 text-gray-300 hover:text-[#EF2020] hover:bg-red-50 rounded-lg transition-colors"
                                      title="حذف دسته‌بندی"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>

                                    <div className="w-px h-5 bg-gray-100 mx-1" />

                                    <button 
                                      onClick={() => handleAddCol(l1Item.id, cat.id)}
                                      className="p-1.5 px-2 bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-900 rounded-lg text-[9px] font-black flex items-center gap-1 transition-all"
                                      title="افزودن ستون سطح ۳"
                                    >
                                      <Plus className="w-3 h-3" />
                                      <span>افزودن ستون (سطح ۳)</span>
                                    </button>
                                  </div>
                                </div>

                                {/* LEVEL 3 EXPENDABLE GRID */}
                                <AnimatePresence initial={false}>
                                  {isL2Expanded && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: "auto", opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      className="overflow-hidden bg-gray-50/10"
                                    >
                                      <div className="p-4 md:p-6">
                                        <div className="mb-4 bg-orange-50/50 border border-orange-100/80 p-3 rounded-xl flex items-start gap-2.5">
                                          <Info className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                                          <p className="text-[10px] md:text-xs text-orange-700 font-bold leading-relaxed">
                                            برای چیدمان منظم وب‌سایت، این بخش باید <strong className="text-orange-900 font-black">سازگار با دقیقا ۳ ستون</strong> باشد (نه کمتر و نه بیشتر).
                                          </p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                          {(cat.columns || []).map((col, colIdx) => (
                                            <div key={col.id} className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm flex flex-col justify-between relative min-h-[220px]">
                                              <div>
                                                <div className="flex items-center justify-between pb-3 border-b border-gray-50 mb-3">
                                                  <span className="text-[11px] font-black text-gray-800 flex items-center gap-1.5">
                                                    <span className="w-2 h-2 rounded-full bg-[#EF2020]/80 shrink-0" />
                                                    {col.title}
                                                  </span>
                                                  <div className="flex items-center gap-1">
                                                    <button 
                                                      onClick={() => handleEditCol(l1Item.id, cat.id, col)}
                                                      className="p-1 text-gray-400 hover:text-gray-600 rounded"
                                                    >
                                                      <Edit className="w-3 h-3" />
                                                    </button>
                                                    <button 
                                                      onClick={() => handleDeleteCol(l1Item.id, cat.id, col.id)}
                                                      className="p-1 text-gray-300 hover:text-[#EF2020] rounded"
                                                    >
                                                      <Trash2 className="w-3 h-3" />
                                                    </button>
                                                  </div>
                                                </div>

                                                <div className="space-y-1.5">
                                                  {(!col.items || col.items.length === 0) ? (
                                                    <div className="text-center py-6 text-[10px] text-gray-300 font-bold">
                                                      بدون آیتم جهت ارجاع
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
                                                                لینک به محصول: {linkedProduct.title}
                                                               </span>
                                                            )}
                                                          </div>
                                                          <div className="opacity-0 group-hover/link:opacity-100 flex items-center gap-1 transition-opacity">
                                                            <button 
                                                              onClick={() => handleEditLink(l1Item.id, cat.id, col.id, item)}
                                                              className="p-0.5 text-gray-400 hover:text-gray-600"
                                                            >
                                                              <Edit className="w-3 h-3" />
                                                            </button>
                                                            <button 
                                                              onClick={() => handleDeleteLink(l1Item.id, cat.id, col.id, item.id)}
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

                                              <button
                                                onClick={() => handleAddLink(l1Item.id, cat.id, col.id)}
                                                className="mt-4 w-full flex items-center justify-center gap-1 p-2 bg-gray-50 hover:bg-red-50/50 hover:text-[#EF2020] text-gray-400 rounded-lg text-[10px] font-black transition-all border border-dashed border-gray-100 group"
                                              >
                                                <Plus className="w-3 h-3 group-hover:scale-110" />
                                                <span>افزودن نوشته (سطح ۴)</span>
                                              </button>
                                            </div>
                                          ))}

                                          {/* Placeholder if column setup is less than 3 */}
                                          {(cat.columns || []).length < 3 && (
                                            <div className="bg-red-50/50 border-2 border-dashed border-red-100 p-4 rounded-xl flex flex-col items-center justify-center text-center text-xs text-red-700">
                                              <AlertTriangle className="w-7 h-7 text-[#EF2020] mb-2" />
                                              <span className="font-black">ستون کمه!</span>
                                              <button
                                                onClick={() => handleAddCol(l1Item.id, cat.id)}
                                                className="mt-3 bg-red-100 hover:bg-red-200 text-[#EF2020] font-black text-[9px] px-3 py-1 rounded-lg"
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
            );
          })}
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
                {editingItemType === 'level3_link' && (editingData?.linkId ? "ویرایش لینک محصول (سطح چهارم)" : "افزودن لینک محصول جدید")}
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

                {/* Redirect URL Field (Optional for Level 1) */}
                {editingItemType === 'level1' && (
                  <div className="space-y-2 pt-2 border-t border-gray-50">
                    <label className="text-xs font-black text-gray-500 block">لینک یا آدرس ارجاع (مانند آدرس اینترنتی یا شناسه)</label>
                    <input
                      type="text"
                      value={editingData?.url || ''}
                      placeholder="مانند # یا /special-offers..."
                      onChange={(e) => setEditingData((prev: any) => ({ ...prev, url: e.target.value }))}
                      className="w-full bg-gray-50 border border-gray-100 px-4 py-3 text-xs md:text-sm rounded-xl outline-none focus:border-red-400 font-mono text-left"
                      dir="ltr"
                    />
                    <p className="text-[10px] text-gray-400 font-bold text-right">آدرسی که با کلیک کاربر روی این منو در هدر او را به آنجا هدایت می‌کند.</p>
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
                      <option value="">-- فاقد لینک ارجاع مستقیم (فقط متن ساده) --</option>
                      {products.map(p => (
                        <option key={p.id} value={p.id}>{p.title} ({p.price.toLocaleString('fa-IR')} تومان)</option>
                      ))}
                    </select>
                    <p className="text-[10px] text-gray-400 font-bold">
                      با انتخاب محصول، کلیک کاربر بر روی این متن او را مستقیماً به جزئیات آن کالا هدایت می‌کند.
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
