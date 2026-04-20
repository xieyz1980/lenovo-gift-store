'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Search, Package, ChevronRight } from 'lucide-react';

interface OrderItem {
  id: string;
  gift_id: string;
  gift_name: string;
  quantity: number;
  future_value: number;
  gifts?: { name: string };
}

interface Order {
  id: string;
  order_no: string;
  user_name: string;
  user_phone: string;
  user_address: string;
  status: string;
  total_future_value: number;
  remark: string | null;
  created_at: string;
  order_items?: OrderItem[];
}

const statusMap: Record<string, { label: string; color: string }> = {
  pending: { label: '待处理', color: 'bg-yellow-100 text-yellow-700' },
  processing: { label: '处理中', color: 'bg-blue-100 text-blue-700' },
  shipped: { label: '已发货', color: 'bg-purple-100 text-purple-700' },
  completed: { label: '已完成', color: 'bg-green-100 text-green-700' },
  cancelled: { label: '已取消', color: 'bg-gray-100 text-gray-500' },
};

export default function OrdersPage() {
  const [phone, setPhone] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  
  const handleSearch = async () => {
    if (!phone.trim()) {
      toast.error('请输入手机号');
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/query?phone=${encodeURIComponent(phone)}`);
      const data = await res.json();
      if (data.success) {
        setOrders(data.data);
        setSearched(true);
      } else {
        toast.error(data.error || '查询失败');
      }
    } catch (error) {
      console.error('查询失败:', error);
      toast.error('查询失败，请重试');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="p-4">
      {/* 搜索框 */}
      <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="请输入下单时的手机号"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-10"
            />
          </div>
          <Button
            onClick={handleSearch}
            disabled={loading}
            className="bg-[#E60012] hover:bg-[#c4000f]"
          >
            {loading ? '查询中...' : '查询'}
          </Button>
        </div>
      </div>
      
      {/* 订单列表 */}
      {!searched ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
          <Package className="w-12 h-12 mb-3" />
          <p>输入手机号查询订单</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
          <Package className="w-12 h-12 mb-3" />
          <p>暂无订单记录</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const statusInfo = statusMap[order.status] || { label: order.status, color: 'bg-gray-100' };
            
            return (
              <div key={order.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                  <span className="font-mono text-sm text-gray-600">
                    {order.order_no}
                  </span>
                  <Badge className={statusInfo.color}>
                    {statusInfo.label}
                  </Badge>
                </div>
                
                <div className="p-4 space-y-3">
                  {/* 商品信息 */}
                  {order.order_items?.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="text-sm text-gray-600 flex-1">
                        {item.gift_name}
                      </div>
                      <div className="text-sm text-gray-500">
                        ×{item.quantity}
                      </div>
                      <div className="text-sm text-[#E60012]">
                        {item.future_value * item.quantity} 未来值
                      </div>
                    </div>
                  ))}
                  
                  {/* 收货信息 */}
                  <div className="pt-3 border-t border-gray-100 text-sm">
                    <div className="text-gray-500 mb-1">
                      收货人：{order.user_name} {order.user_phone}
                    </div>
                    <div className="text-gray-500 line-clamp-1">
                      地址：{order.user_address}
                    </div>
                    {order.remark && (
                      <div className="text-gray-400 mt-1 text-xs">
                        备注：{order.remark}
                      </div>
                    )}
                  </div>
                  
                  {/* 总价 */}
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-gray-500 text-sm">
                      {new Date(order.created_at).toLocaleString('zh-CN')}
                    </span>
                    <span className="text-[#E60012] font-semibold">
                      合计：{order.total_future_value} 未来值
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
