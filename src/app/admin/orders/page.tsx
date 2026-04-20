'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { ArrowLeft, Eye, CheckCircle, Truck, XCircle } from 'lucide-react';

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

const statusOptions = [
  { value: 'pending', label: '待处理', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'processing', label: '处理中', color: 'bg-blue-100 text-blue-700' },
  { value: 'shipped', label: '已发货', color: 'bg-purple-100 text-purple-700' },
  { value: 'completed', label: '已完成', color: 'bg-green-100 text-green-700' },
  { value: 'cancelled', label: '已取消', color: 'bg-gray-100 text-gray-500' },
];

const statusIcons: Record<string, React.ReactNode> = {
  pending: <XCircle className="w-4 h-4" />,
  processing: <Eye className="w-4 h-4" />,
  shipped: <Truck className="w-4 h-4" />,
  completed: <CheckCircle className="w-4 h-4" />,
  cancelled: <XCircle className="w-4 h-4" />,
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);
  
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const url = statusFilter !== 'all' 
        ? `/api/admin/orders?status=${statusFilter}`
        : '/api/admin/orders';
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setOrders(data.data.orders);
      }
    } catch (error) {
      console.error('获取订单失败:', error);
      toast.error('获取订单失败');
    } finally {
      setLoading(false);
    }
  };
  
  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      });
      
      const data = await res.json();
      if (data.success) {
        toast.success('状态更新成功');
        fetchOrders();
      } else {
        toast.error(data.error || '更新失败');
      }
    } catch (error) {
      console.error('更新失败:', error);
      toast.error('更新失败');
    }
  };
  
  const openDetail = (order: Order) => {
    setSelectedOrder(order);
    setDetailDialogOpen(true);
  };
  
  const getStatusBadge = (status: string) => {
    const option = statusOptions.find((s) => s.value === status);
    return option
      ? { label: option.label, color: option.color }
      : { label: status, color: 'bg-gray-100' };
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
          <h1 className="font-semibold text-gray-900">订单管理</h1>
          <div className="w-16"></div>
        </div>
        
        {/* 状态筛选 */}
        <div className="px-4 pb-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="筛选状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部订单</SelectItem>
              {statusOptions.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* 订单列表 */}
      <div className="p-4 space-y-3">
        {orders.map((order) => {
          const statusInfo = getStatusBadge(order.status);
          
          return (
            <div key={order.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <span className="font-mono text-sm text-gray-600">
                  {order.order_no}
                </span>
                <Badge className={statusInfo.color}>
                  {statusIcons[order.status]}
                  <span className="ml-1">{statusInfo.label}</span>
                </Badge>
              </div>
              
              <div className="p-4">
                {/* 商品摘要 */}
                <div className="space-y-2">
                  {order.order_items?.slice(0, 2).map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 truncate flex-1">
                        {item.gift_name}
                      </span>
                      <span className="text-gray-500 ml-2">×{item.quantity}</span>
                    </div>
                  ))}
                  {order.order_items && order.order_items.length > 2 && (
                    <div className="text-sm text-gray-400">
                      还有 {order.order_items.length - 2} 件商品...
                    </div>
                  )}
                </div>
                
                {/* 收货信息 */}
                <div className="mt-3 pt-3 border-t border-gray-100 text-sm">
                  <div className="text-gray-500">
                    {order.user_name} · {order.user_phone}
                  </div>
                  <div className="text-gray-400 mt-1 line-clamp-1">
                    {order.user_address}
                  </div>
                </div>
                
                {/* 操作栏 */}
                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <div className="text-sm">
                    <span className="text-gray-500">
                      {new Date(order.created_at).toLocaleString('zh-CN')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openDetail(order)}
                    >
                      详情
                    </Button>
                    {order.status !== 'completed' && order.status !== 'cancelled' && (
                      <Select
                        value={order.status}
                        onValueChange={(value) => handleStatusChange(order.id, value)}
                      >
                        <SelectTrigger className="w-24 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions
                            .filter((s) => s.value !== 'completed' && s.value !== 'cancelled')
                            .map((s) => (
                              <SelectItem key={s.value} value={s.value}>
                                {s.label}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    )}
                    {order.status === 'pending' && (
                      <Button
                        size="sm"
                        className="bg-green-500 hover:bg-green-600"
                        onClick={() => handleStatusChange(order.id, 'completed')}
                      >
                        完成
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        
        {orders.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            暂无订单
          </div>
        )}
      </div>
      
      {/* 订单详情弹窗 */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>订单详情</DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-4 py-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-sm text-gray-500 mb-1">订单号</div>
                <div className="font-mono">{selectedOrder.order_no}</div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">商品清单</h4>
                <div className="space-y-2">
                  {selectedOrder.order_items?.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-gray-600">{item.gift_name}</span>
                      <span className="text-gray-500">×{item.quantity}</span>
                      <span className="text-[#E60012]">
                        {item.future_value * item.quantity} 未来值
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between font-medium">
                  <span>合计</span>
                  <span className="text-[#E60012]">
                    {selectedOrder.total_future_value} 未来值
                  </span>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">收货信息</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>{selectedOrder.user_name} · {selectedOrder.user_phone}</p>
                  <p className="text-gray-500">{selectedOrder.user_address}</p>
                  {selectedOrder.remark && (
                    <p className="text-gray-400">备注：{selectedOrder.remark}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <Badge className={getStatusBadge(selectedOrder.status).color}>
                  {getStatusBadge(selectedOrder.status).label}
                </Badge>
                <span className="text-sm text-gray-500">
                  {new Date(selectedOrder.created_at).toLocaleString('zh-CN')}
                </span>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDetailDialogOpen(false)}
            >
              关闭
            </Button>
            {selectedOrder && selectedOrder.status !== 'completed' && selectedOrder.status !== 'cancelled' && (
              <Button
                className="bg-green-500 hover:bg-green-600"
                onClick={() => {
                  if (selectedOrder) {
                    handleStatusChange(selectedOrder.id, 'completed');
                    setDetailDialogOpen(false);
                  }
                }}
              >
                标记完成
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
