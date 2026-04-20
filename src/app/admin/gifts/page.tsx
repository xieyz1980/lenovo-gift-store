'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { ArrowLeft, Plus, Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';

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

export default function AdminGiftsPage() {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingGift, setEditingGift] = useState<Partial<Gift>>({});
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: '',
    categoryId: '',
    futureValue: 0,
    stock: 0,
    isActive: true,
  });
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    try {
      const [giftsRes, categoriesRes] = await Promise.all([
        fetch('/api/admin/gifts'),
        fetch('/api/admin/categories'),
      ]);
      
      const [giftsData, categoriesData] = await Promise.all([
        giftsRes.json(),
        categoriesRes.json(),
      ]);
      
      if (giftsData.success) setGifts(giftsData.data);
      if (categoriesData.success) setCategories(categoriesData.data);
    } catch (error) {
      console.error('获取数据失败:', error);
      toast.error('获取数据失败');
    } finally {
      setLoading(false);
    }
  };
  
  const handleEdit = (gift: Gift) => {
    setEditingGift(gift);
    setFormData({
      name: gift.name,
      description: gift.description || '',
      imageUrl: gift.image_url || '',
      categoryId: gift.category_id || '',
      futureValue: gift.future_value,
      stock: gift.stock,
      isActive: gift.is_active,
    });
    setEditDialogOpen(true);
  };
  
  const handleNew = () => {
    setEditingGift({});
    setFormData({
      name: '',
      description: '',
      imageUrl: '',
      categoryId: categories[0]?.id || '',
      futureValue: 0,
      stock: 0,
      isActive: true,
    });
    setEditDialogOpen(true);
  };
  
  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error('请输入礼品名称');
      return;
    }
    
    try {
      const res = await fetch('/api/admin/gifts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingGift.id || undefined,
          ...formData,
        }),
      });
      
      const data = await res.json();
      if (data.success) {
        toast.success(editingGift.id ? '更新成功' : '创建成功');
        setEditDialogOpen(false);
        fetchData();
      } else {
        toast.error(data.error || '操作失败');
      }
    } catch (error) {
      console.error('保存失败:', error);
      toast.error('保存失败');
    }
  };
  
  const handleToggleActive = async (gift: Gift) => {
    try {
      const res = await fetch('/api/admin/gifts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: gift.id,
          isActive: !gift.is_active,
        }),
      });
      
      const data = await res.json();
      if (data.success) {
        toast.success(gift.is_active ? '已下架' : '已上架');
        fetchData();
      } else {
        toast.error(data.error || '操作失败');
      }
    } catch (error) {
      console.error('操作失败:', error);
      toast.error('操作失败');
    }
  };
  
  const handleDelete = async (gift: Gift) => {
    if (!confirm(`确定删除礼品「${gift.name}」吗？`)) return;
    
    try {
      const res = await fetch(`/api/admin/gifts?id=${gift.id}`, {
        method: 'DELETE',
      });
      
      const data = await res.json();
      if (data.success) {
        toast.success('删除成功');
        fetchData();
      } else {
        toast.error(data.error || '删除失败');
      }
    } catch (error) {
      console.error('删除失败:', error);
      toast.error('删除失败');
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <div className="sticky top-0 bg-white border-b border-gray-100 z-40">
        <div className="flex items-center justify-between h-14 px-4">
          <Link href="/admin" className="p-2 -ml-2 flex items-center gap-1 text-gray-600">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-semibold text-gray-900">礼品管理</h1>
          <Button onClick={handleNew} size="sm" className="bg-[#E60012] hover:bg-[#c4000f]">
            <Plus className="w-4 h-4 mr-1" />
            新增
          </Button>
        </div>
      </div>
      
      {/* 礼品列表 */}
      <div className="p-4 space-y-3">
        {gifts.map((gift) => (
          <div
            key={gift.id}
            className={`bg-white rounded-lg p-4 shadow-sm ${
              !gift.is_active ? 'opacity-60' : ''
            }`}
          >
            <div className="flex gap-3">
              <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                <Image
                  src={gift.image_url || '/placeholder.png'}
                  alt={gift.name}
                  fill
                  className="object-cover"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900 line-clamp-1">
                      {gift.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {gift.categories?.name || '未分类'}
                    </p>
                  </div>
                  <Badge variant={gift.is_active ? 'default' : 'secondary'}>
                    {gift.is_active ? '上架' : '下架'}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4 mt-2 text-sm">
                  <span className="text-[#E60012] font-medium">
                    {gift.future_value} 未来值
                  </span>
                  <span className="text-gray-500">
                    库存: {gift.stock}
                  </span>
                  <span className="text-gray-400">
                    已兑: {gift.exchange_count}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleActive(gift)}
                  >
                    {gift.is_active ? (
                      <>
                        <ToggleRight className="w-4 h-4 mr-1 text-gray-400" />
                        下架
                      </>
                    ) : (
                      <>
                        <ToggleRight className="w-4 h-4 mr-1 text-green-500" />
                        上架
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(gift)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    编辑
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(gift)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    删除
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {gifts.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            暂无礼品，点击右上角新增
          </div>
        )}
      </div>
      
      {/* 编辑弹窗 */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingGift.id ? '编辑礼品' : '新增礼品'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <Label>礼品名称</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="请输入礼品名称"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label>描述</Label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="请输入礼品描述"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label>图片URL</Label>
              <Input
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="请输入图片URL"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label>分类</Label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="请选择分类" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>未来值</Label>
                <Input
                  type="number"
                  value={formData.futureValue}
                  onChange={(e) => setFormData({ ...formData, futureValue: Number(e.target.value) })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>库存</Label>
                <Input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleSave} className="bg-[#E60012] hover:bg-[#c4000f]">
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
