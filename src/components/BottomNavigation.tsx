import { Home, Search, ShoppingBag, Heart, User } from 'lucide-react';

export default function BottomNavigation({ 
  activeTab, 
  onTabChange,
  orderCount = 0
}: { 
  activeTab: string; 
  onTabChange: (tab: string) => void;
  orderCount?: number;
}) {
  const tabs = [
    { id: 'home', label: 'خانه', icon: Home },
    { id: 'search', label: 'جستجو', icon: Search },
    { id: 'orders', label: 'سفارش‌ها', icon: ShoppingBag, badge: orderCount },
    { id: 'wishlist', label: 'علاقه‌مندی', icon: Heart },
    { id: 'profile', label: 'پروفایل', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] z-50 md:hidden flex justify-around items-center py-2 px-1">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center gap-1 transition-all flex-1 py-1 ${isActive ? 'text-[#EF2020]' : 'text-gray-400'}`}
          >
            <div className="relative">
              <Icon className={`w-6 h-6 ${isActive ? 'fill-[#EF2020]/10' : ''}`} />
              {tab.badge > 0 && (
                <span className="absolute -top-1 -right-2 bg-[#EF2020] text-white text-[8px] w-4 h-4 flex items-center justify-center rounded-full border border-white font-bold">
                  {tab.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] font-bold">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
