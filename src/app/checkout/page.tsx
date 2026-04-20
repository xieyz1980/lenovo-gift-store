'use client';

import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ArrowLeft, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();
  const { state, removeItem } = useCart();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    userName: '',
    userPhone: '',
    userAddress: '',
    remark: '',
  });
  
  if (state.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-gray-400">
        <p className="text-base mb-4">购物车是空的</p>
        <Link href="/">
          <Button className="bg-[#E60012] hover:bg-[#c4000f]">
            去逛逛
          </Button>
        </Link>
      </div>
    );
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.userName.trim()) {
      toast.error('请输入收货人姓名');
      return;
    }
    if (!formData.userPhone.trim()) {
      toast.error('请输入手机号');
      return;
    }
    if (!/^1[3-9]\d{9}$/.test(formData.userPhone)) {
      toast.error('请输入正确的手机号');
      return;
    }
    if (!formData.userAddress.trim()) {
      toast.error('请输入收货地址');
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: formData.userName,
          userPhone: formData.userPhone,
          userAddress: formData.userAddress,
          remark: formData.remark,
          items: state.items.map((item) => ({
            giftId: item.giftId,
            giftName: item.name,
            quantity: item.quantity,
            futureValue: item.futureValue,
          })),
        }),
      });
      
      const data = await res.json();
      if (data.success) {
        router.push(`/order-success?orderNo=${data.data.order_no}`);
      } else {
        toast.error(data.error || '下单失败');
      }
    } catch (error) {
      console.error('下单失败:', error);
      toast.error('下单失败，请重试');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <div className="sticky top-0 bg-white border-b border-gray-100 z-40">
        <div className="flex items-center h-14 px-4">
          <Link href="/cart" className="p-2 -ml-2">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="flex-1 text-center font-semibold text-gray-900 -ml-10">
            确认订单
          </h1>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4 space-y-4">
        {/* 收货信息 */}
        <div className="bg-white rounded-lg p-4 space-y-4 shadow-sm">
          <h2 className="font-semibold text-gray-900">收货信息</h2>
          
          <div className="space-y-3">
            <div>
              <Label htmlFor="userName" className="text-gray-600">收货人</Label>
              <Input
                id="userName"
                placeholder="请输入收货人姓名"
                value={formData.userName}
                onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="userPhone" className="text-gray-600">手机号</Label>
              <Input
                id="userPhone"
                placeholder="请输入手机号"
                type="tel"
                maxLength={11}
                value={formData.userPhone}
                onChange={(e) => setFormData({ ...formData, userPhone: e.target.value })}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="userAddress" className="text-gray-600">收货地址</Label>
              <Input
                id="userAddress"
                placeholder="请输入详细收货地址"
                value={formData.userAddress}
                onChange={(e) => setFormData({ ...formData, userAddress: e.target.value })}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="remark" className="text-gray-600">备注（选填）</Label>
              <Input
                id="remark"
                placeholder="请输入备注信息"
                value={formData.remark}
                onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
                className="mt-1"
              />
            </div>
          </div>
        </div>
        
        {/* 商品清单 */}
        <div className="bg-white rounded-lg p-4 space-y-4 shadow-sm">
          <h2 className="font-semibold text-gray-900">商品清单</h2>
          
          <div className="space-y-3">
            {state.items.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 text-sm line-clamp-1">
                    {item.name}
                  </h3>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[#E60012] text-sm">
                      {item.futureValue} 未来值 × {item.quantity}
                    </span>
                    <span className="text-gray-500 text-sm">
                      小计：{item.futureValue * item.quantity}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
        
        {/* 底部提交 */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-600">商品总价</span>
            <span className="text-gray-900">
              <span className="text-[#E60012] font-bold text-xl">
                {state.totalFutureValue}
              </span>
              <span className="text-[#E60012] text-sm"> 未来值</span>
            </span>
          </div>
          
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#E60012] hover:bg-[#c4000f] h-12 text-base"
          >
            {loading ? '提交中...' : '提交订单'}
          </Button>
        </div>
      </form>
    </div>
  );
}
