'use client';

import { CartProvider } from '@/contexts/CartContext';
import { Toaster } from '@/components/ui/sonner';
import { Home, Grid3X3, ShoppingCart, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';

function BottomNav() {
  const pathname = usePathname();
  const { itemCount } = useCart();
  
  const isActive = (path: string) => pathname === path;
  
  const navItems = [
    { path: '/', label: '首页', icon: Home },
    { path: '/category', label: '分类', icon: Grid3X3 },
    { path: '/cart', label: '购物车', icon: ShoppingCart, badge: itemCount },
    { path: '/orders', label: '我的', icon: User },
  ];
  
  // 隐藏底部导航的页面
  const hideNav = ['/admin', '/checkout', '/order-success'].some(path => pathname.startsWith(path));
  if (hideNav) return null;
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-bottom">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex flex-col items-center justify-center w-16 h-full relative ${
                active ? 'text-primary' : 'text-gray-500'
              }`}
            >
              <div className="relative">
                <Icon className="w-6 h-6" />
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-1 -right-2 min-w-[18px] h-[18px] bg-[#E60012] text-white text-xs rounded-full flex items-center justify-center px-1">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </div>
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function Header() {
  const pathname = usePathname();
  
  const getTitle = () => {
    if (pathname === '/') return '联想未来中心';
    if (pathname === '/category') return '商品分类';
    if (pathname === '/cart') return '购物车';
    if (pathname === '/orders') return '我的订单';
    if (pathname.startsWith('/admin')) return '后台管理';
    if (pathname === '/checkout') return '确认订单';
    if (pathname === '/order-success') return '下单成功';
    return '联想未来中心';
  };
  
  return (
    <header className="sticky top-0 bg-white border-b border-gray-100 z-40">
      <div className="flex items-center justify-center h-14 px-4">
        <h1 className="text-lg font-semibold text-gray-900">{getTitle()}</h1>
      </div>
    </header>
  );
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-1 pb-20">
          {children}
        </main>
        <BottomNav />
      </div>
      <Toaster position="top-center" />
    </CartProvider>
  );
}
