'use client';

import { useEffect, useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart, Sparkles, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface Category {
  id: string;
  name: string;
  sort_order: number;
}

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

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const router = useRouter();
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    try {
      const res = await fetch('/api/gifts');
      const data = await res.json();
      if (data.success) {
        setCategories(data.data.categories);
        setGifts(data.data.gifts);
        if (data.data.categories.length > 0) {
          setSelectedCategory(data.data.categories[0].id);
        }
      }
    } catch (error) {
      console.error('获取数据失败:', error);
      toast.error('获取数据失败');
    } finally {
      setLoading(false);
    }
  };
  
  const filteredGifts = selectedCategory
    ? gifts.filter((g) => g.category_id === selectedCategory)
    : gifts;
  
  const handleAddToCart = (e: React.MouseEvent, gift: Gift) => {
    e.stopPropagation(); // 阻止冒泡到卡片点击
    if (gift.stock <= 0) {
      toast.error('库存不足');
      return;
    }
    addItem({
      giftId: gift.id,
      name: gift.name,
      imageUrl: gift.image_url || '/placeholder.png',
      futureValue: gift.future_value,
      quantity: 1,
    });
    toast.success('已添加到购物车');
  };
  
  const handleCardClick = (gift: Gift) => {
    router.push(`/gift/${gift.id}`);
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="flex">
      {/* 左侧分类栏 */}
      <aside className="w-28 bg-gray-50 border-r border-gray-100 fixed left-0 top-[57px] bottom-[64px] overflow-y-auto">
        <div className="py-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`w-full px-3 py-3 text-sm text-left transition-all ${
                selectedCategory === cat.id
                  ? 'bg-white text-primary font-medium border-l-2 border-primary'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </aside>
      
      {/* 右侧商品列表 */}
      <main className="flex-1 ml-28 p-3">
        <div className="space-y-3">
          {filteredGifts.map((gift) => (
            <div
              key={gift.id}
              onClick={() => handleCardClick(gift)}
              className="bg-white rounded-lg p-3 flex gap-3 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                <Image
                  src={gift.image_url || '/placeholder.png'}
                  alt={gift.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 text-sm line-clamp-2">
                    {gift.name}
                  </h3>
                  {gift.description && (
                    <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                      {gift.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div>
                    <span className="text-[#E60012] font-semibold">
                      {gift.future_value}
                    </span>
                    <span className="text-xs text-[#E60012]"> 未来值</span>
                    <p className="text-xs text-gray-400 mt-0.5">
                      已兑 {gift.exchange_count} 件
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleAddToCart(e, gift)}
                      disabled={gift.stock <= 0}
                      className={`p-2 rounded-full transition-colors ${
                        gift.stock > 0
                          ? 'bg-[#E60012] text-white hover:bg-[#c4000f]'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredGifts.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <Sparkles className="w-12 h-12 mb-3" />
            <p>暂无商品</p>
          </div>
        )}
      </main>
    </div>
  );
}
