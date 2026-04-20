'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

function OrderSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderNo = searchParams.get('orderNo') || '';
  const { clearCart } = useCart();
  
  useEffect(() => {
    clearCart();
  }, [clearCart]);
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">下单成功</h1>
        <p className="text-gray-500 mb-6">感谢您的兑换，礼品将尽快发出</p>
        
        {orderNo && (
          <div className="bg-white rounded-lg p-4 mb-6 text-left max-w-sm mx-auto shadow-sm">
            <div className="text-sm text-gray-500 mb-1">订单号</div>
            <div className="font-mono text-gray-900">{orderNo}</div>
          </div>
        )}
        
        <div className="space-y-3 max-w-xs mx-auto">
          <Link href="/orders" className="block">
            <Button variant="outline" className="w-full">
              查看订单
            </Button>
          </Link>
          <Link href="/" className="block">
            <Button className="w-full bg-[#E60012] hover:bg-[#c4000f]">
              继续兑换
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <OrderSuccessContent />
    </Suspense>
  );
}
