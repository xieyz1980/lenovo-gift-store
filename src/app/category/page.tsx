'use client';

import { useEffect, useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import { Sparkles } from 'lucide-react';

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
}

export default function CategoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  
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
  
  const handleAddToCart = (gift: Gift) => {
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
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div>
      {/* 分类标签 */}
      <div className="bg-white px-4 py-3 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
              selectedCategory === null
                ? 'gradient-btn text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            全部
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
                selectedCategory === cat.id
                  ? 'gradient-btn text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>
      
      {/* 商品网格 */}
      <div className="p-3 grid grid-cols-2 gap-3">
        {filteredGifts.map((gift) => (
          <div
            key={gift.id}
            className="bg-white rounded-lg overflow-hidden shadow-sm"
          >
            <div className="aspect-square bg-gray-100 relative">
              <Image
                src={gift.image_url || '/placeholder.png'}
                alt={gift.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-2">
              <h3 className="font-medium text-gray-900 text-sm line-clamp-2 min-h-[2.5rem]">
                {gift.name}
              </h3>
              <div className="mt-1.5 flex items-center justify-between">
                <div>
                  <span className="text-[#E60012] font-semibold text-sm">
                    {gift.future_value}
                  </span>
                  <span className="text-xs text-[#E60012]"> 未来值</span>
                </div>
                <button
                  onClick={() => handleAddToCart(gift)}
                  disabled={gift.stock <= 0}
                  className={`p-1.5 rounded-full transition-colors ${
                    gift.stock > 0
                      ? 'bg-[#E60012] text-white hover:bg-[#c4000f]'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1">已兑 {gift.exchange_count} 件</p>
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
    </div>
  );
}
