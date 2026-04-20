'use client';

import { useCart } from '@/contexts/CartContext';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function CartPage() {
  const { state, removeItem, updateQuantity, clearCart } = useCart();
  
  if (state.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-gray-400">
        <ShoppingBag className="w-16 h-16 mb-4" />
        <p className="text-base mb-2">购物车是空的</p>
        <p className="text-sm">快去挑选心仪的礼品吧</p>
        <Link href="/" className="mt-4">
          <Button className="bg-[#E60012] hover:bg-[#c4000f]">
            去逛逛
          </Button>
        </Link>
      </div>
    );
  }
  
  return (
    <div className="p-3">
      {/* 购物车列表 */}
      <div className="space-y-3">
        {state.items.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg p-3 flex gap-3 shadow-sm"
          >
            <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
              <Image
                src={item.imageUrl}
                alt={item.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-between">
              <h3 className="font-medium text-gray-900 text-sm line-clamp-2">
                {item.name}
              </h3>
              <div className="flex items-center justify-between mt-2">
                <div>
                  <span className="text-[#E60012] font-semibold">
                    {item.futureValue}
                  </span>
                  <span className="text-xs text-[#E60012]"> 未来值</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-8 text-center font-medium">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
            <button
              onClick={() => removeItem(item.id)}
              className="text-gray-400 hover:text-red-500 transition-colors self-start"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
      
      {/* 底部结算栏 */}
      <div className="fixed bottom-[64px] left-0 right-0 bg-white border-t border-gray-100 p-3 z-40">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div>
            <span className="text-gray-500 text-sm">合计：</span>
            <span className="text-[#E60012] font-bold text-xl">
              {state.totalFutureValue}
            </span>
            <span className="text-[#E60012] text-sm"> 未来值</span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={clearCart}
              className="text-gray-500"
            >
              清空
            </Button>
            <Link href="/checkout">
              <Button className="bg-[#E60012] hover:bg-[#c4000f] px-6">
                去结算 ({state.items.length})
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
