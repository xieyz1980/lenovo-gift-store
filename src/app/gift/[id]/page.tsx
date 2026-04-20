'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import { ArrowLeft, ShoppingCart, Package, TrendingUp } from 'lucide-react';

interface Gift {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  category_id: string | null;
  future_value: number;
  stock: number;
  exchange_count: number;
  is_active: boolean;
  categories?: { name: string } | null;
}

export default function GiftDetailPage() {
  const router = useRouter();
  const params = useParams();
  const giftId = params.id as string;
  const { addItem } = useCart();
  const [gift, setGift] = useState<Gift | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchGiftDetail();
  }, [giftId]);

  const fetchGiftDetail = async () => {
    try {
      const res = await fetch(`/api/admin/gifts`);
      const data = await res.json();
      if (data.success) {
        const foundGift = data.data.find((g: Gift) => g.id === giftId);
        setGift(foundGift || null);
      }
    } catch (error) {
      console.error('获取礼品详情失败:', error);
      toast.error('获取礼品详情失败');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!gift) return;
    if (gift.stock <= 0) {
      toast.error('库存不足');
      return;
    }
    if (quantity > gift.stock) {
      toast.error(`库存不足，最多只能购买 ${gift.stock} 件`);
      return;
    }
    addItem({
      giftId: gift.id,
      name: gift.name,
      imageUrl: gift.image_url || '/placeholder.png',
      futureValue: gift.future_value,
      quantity: quantity,
    });
    toast.success(`已添加 ${quantity} 件到购物车`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!gift) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400">
        <Package className="w-12 h-12 mb-3" />
        <p>礼品不存在</p>
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="mt-4"
        >
          返回
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <div className="sticky top-0 bg-white border-b border-gray-100 z-40">
        <div className="flex items-center h-14 px-4">
          <button
            onClick={() => router.back()}
            className="p-2 -ml-2 flex items-center gap-1 text-gray-600"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="flex-1 text-center font-semibold text-gray-900 -ml-10 pr-10">
            礼品详情
          </h1>
        </div>
      </div>

      {/* 商品图片 */}
      <div className="bg-white">
        <div className="aspect-square max-w-lg mx-auto relative">
          <Image
            src={gift.image_url || '/placeholder.png'}
            alt={gift.name}
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* 商品信息 */}
      <div className="p-4 space-y-4">
        {/* 价格和名称 */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-3xl font-bold text-[#E60012]">
              {gift.future_value}
            </span>
            <span className="text-[#E60012] text-sm">未来值</span>
          </div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            {gift.name}
          </h1>
          {gift.categories?.name && (
            <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
              {gift.categories.name}
            </span>
          )}
        </div>

        {/* 统计数据 */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex justify-around">
            <div className="text-center">
              <div className="flex items-center justify-center text-gray-400 mb-1">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span className="text-xs">已兑换</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">
                {gift.exchange_count}
              </span>
              <span className="text-xs text-gray-400 ml-1">件</span>
            </div>
            <div className="w-px bg-gray-100"></div>
            <div className="text-center">
              <div className="flex items-center justify-center text-gray-400 mb-1">
                <Package className="w-4 h-4 mr-1" />
                <span className="text-xs">库存</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">
                {gift.stock}
              </span>
              <span className="text-xs text-gray-400 ml-1">件</span>
            </div>
          </div>
        </div>

        {/* 商品描述 */}
        {gift.description && (
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h2 className="font-semibold text-gray-900 mb-2">商品描述</h2>
            <p className="text-gray-600 leading-relaxed">
              {gift.description}
            </p>
          </div>
        )}

        {/* 数量选择 */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-900">兑换数量</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <span className="text-lg">-</span>
              </button>
              <span className="w-12 text-center font-semibold text-lg">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(Math.min(gift.stock, quantity + 1))}
                disabled={quantity >= gift.stock}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                <span className="text-lg">+</span>
              </button>
            </div>
          </div>
          <div className="mt-3 text-right text-sm text-gray-500">
            合计:{' '}
            <span className="text-[#E60012] font-semibold">
              {gift.future_value * quantity}
            </span>{' '}
            未来值
          </div>
        </div>
      </div>

      {/* 底部操作栏 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 z-50">
        <div className="flex gap-3 max-w-lg mx-auto">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex-1"
          >
            返回
          </Button>
          <Button
            onClick={handleAddToCart}
            disabled={gift.stock <= 0}
            className="flex-1 bg-[#E60012] hover:bg-[#c4000f]"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {gift.stock > 0 ? '加入购物车' : '暂无库存'}
          </Button>
        </div>
      </div>
    </div>
  );
}
