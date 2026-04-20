'use client';

import Link from 'next/link';
import { Gift, ShoppingCart, ArrowLeft, LayoutDashboard } from 'lucide-react';

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <div className="sticky top-0 bg-white border-b border-gray-100 z-40">
        <div className="flex items-center h-14 px-4">
          <Link href="/" className="p-2 -ml-2 flex items-center gap-1 text-gray-600">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">返回前台</span>
          </Link>
          <h1 className="flex-1 text-center font-semibold text-gray-900 -ml-10">
            后台管理
          </h1>
        </div>
      </div>
      
      <div className="p-4 space-y-4 max-w-lg mx-auto">
        <Link
          href="/admin/gifts"
          className="block bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-red-50 rounded-xl flex items-center justify-center">
              <Gift className="w-7 h-7 text-[#E60012]" />
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-gray-900 text-lg">礼品管理</h2>
              <p className="text-gray-500 text-sm mt-1">上架、下架、编辑礼品信息</p>
            </div>
          </div>
        </Link>
        
        <Link
          href="/admin/orders"
          className="block bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center">
              <ShoppingCart className="w-7 h-7 text-blue-500" />
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-gray-900 text-lg">订单管理</h2>
              <p className="text-gray-500 text-sm mt-1">查看和处理用户订单</p>
            </div>
          </div>
        </Link>
        
        <div className="bg-gradient-to-r from-[#E60012] to-[#FF6B00] rounded-xl p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <LayoutDashboard className="w-6 h-6" />
            <h2 className="font-semibold">联想未来中心</h2>
          </div>
          <p className="text-white/80 text-sm">
            管理礼品库存与订单，用未来值连接未来
          </p>
        </div>
      </div>
    </div>
  );
}
