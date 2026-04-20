import { getSupabaseClient } from '@/storage/database/supabase-client';
import type { Category, Gift, Order, OrderItem } from '@/storage/database/shared/schema';

// 获取所有分类
export async function getCategories(): Promise<Category[]> {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw new Error(`获取分类失败: ${error.message}`);
  return data || [];
}

// 获取所有上架礼品（可按分类筛选）
export async function getGifts(categoryId?: string): Promise<Gift[]> {
  const client = getSupabaseClient();
  let query = client.from('gifts').select('*, categories(name)').eq('is_active', true);
  
  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }
  
  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) throw new Error(`获取礼品失败: ${error.message}`);
  return data || [];
}

// 根据ID获取单个礼品
export async function getGiftById(id: string): Promise<Gift | null> {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('gifts')
    .select('*, categories(name)')
    .eq('id', id)
    .maybeSingle();
  if (error) throw new Error(`获取礼品详情失败: ${error.message}`);
  return data;
}

// 创建订单
export async function createOrder(orderData: {
  userName: string;
  userPhone: string;
  userAddress: string;
  remark?: string;
  items: Array<{
    giftId: string;
    giftName: string;
    quantity: number;
    futureValue: number;
  }>;
}): Promise<Order> {
  const client = getSupabaseClient();
  
  // 生成订单号
  const orderNo = `FY${Date.now()}${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  const totalFutureValue = orderData.items.reduce(
    (sum, item) => sum + item.futureValue * item.quantity,
    0
  );

  // 插入订单
  const { data: order, error: orderError } = await client
    .from('orders')
    .insert({
      order_no: orderNo,
      user_name: orderData.userName,
      user_phone: orderData.userPhone,
      user_address: orderData.userAddress,
      status: 'pending',
      total_future_value: totalFutureValue,
      remark: orderData.remark || null,
    })
    .select()
    .single();
  
  if (orderError) throw new Error(`创建订单失败: ${orderError.message}`);

  // 插入订单明细
  const orderItemsData = orderData.items.map((item) => ({
    order_id: order.id,
    gift_id: item.giftId,
    gift_name: item.giftName,
    quantity: item.quantity,
    future_value: item.futureValue,
  }));

  const { error: itemsError } = await client.from('order_items').insert(orderItemsData);
  if (itemsError) throw new Error(`创建订单明细失败: ${itemsError.message}`);

  // 更新礼品的已兑换数量和库存
  for (const item of orderData.items) {
    await client
      .from('gifts')
      .update({
        exchange_count: client.rpc('increment', { x: item.quantity }).select('exchange_count'),
        stock: client.rpc('decrement', { x: item.quantity }).select('stock'),
      })
      .eq('id', item.giftId);
  }

  return order;
}

// 查询订单列表
export async function getOrders(phone: string): Promise<Order[]> {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        gifts (name)
      )
    `)
    .eq('user_phone', phone)
    .order('created_at', { ascending: false });
  if (error) throw new Error(`查询订单失败: ${error.message}`);
  return data || [];
}

// 根据订单号查询订单
export async function getOrderByNo(orderNo: string): Promise<Order | null> {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        gifts (name)
      )
    `)
    .eq('order_no', orderNo)
    .maybeSingle();
  if (error) throw new Error(`查询订单失败: ${error.message}`);
  return data;
}

// ===== 后台管理接口 =====

// 获取所有礼品（包括未上架）
export async function getAllGifts(categoryId?: string): Promise<Gift[]> {
  const client = getSupabaseClient();
  let query = client.from('gifts').select('*, categories(name)');
  
  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }
  
  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) throw new Error(`获取礼品失败: ${error.message}`);
  return data || [];
}

// 创建/更新礼品
export async function upsertGift(giftData: {
  id?: string;
  name: string;
  description?: string;
  imageUrl?: string;
  categoryId?: string;
  futureValue: number;
  stock: number;
  isActive: boolean;
}): Promise<Gift> {
  const client = getSupabaseClient();
  const now = new Date().toISOString();
  
  const payload: Record<string, unknown> = {
    name: giftData.name,
    description: giftData.description || null,
    image_url: giftData.imageUrl || null,
    category_id: giftData.categoryId || null,
    future_value: giftData.futureValue,
    stock: giftData.stock,
    is_active: giftData.isActive,
    updated_at: now,
  };

  if (giftData.id) {
    // 更新
    const { data, error } = await client
      .from('gifts')
      .update(payload)
      .eq('id', giftData.id)
      .select()
      .single();
    if (error) throw new Error(`更新礼品失败: ${error.message}`);
    return data;
  } else {
    // 新增
    payload.created_at = now;
    const { data, error } = await client.from('gifts').insert(payload).select().single();
    if (error) throw new Error(`创建礼品失败: ${error.message}`);
    return data;
  }
}

// 上架/下架礼品
export async function setGiftActive(id: string, isActive: boolean): Promise<void> {
  const client = getSupabaseClient();
  const { error } = await client
    .from('gifts')
    .update({ is_active: isActive, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw new Error(`${isActive ? '上架' : '下架'}礼品失败: ${error.message}`);
}

// 删除礼品
export async function deleteGift(id: string): Promise<void> {
  const client = getSupabaseClient();
  const { error } = await client.from('gifts').delete().eq('id', id);
  if (error) throw new Error(`删除礼品失败: ${error.message}`);
}

// 获取所有订单（后台）
export async function getAllOrders(status?: string): Promise<Order[]> {
  const client = getSupabaseClient();
  let query = client
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        gifts (name)
      )
    `)
    .order('created_at', { ascending: false });
  
  if (status) {
    query = query.eq('status', status);
  }
  
  const { data, error } = await query;
  if (error) throw new Error(`获取订单列表失败: ${error.message}`);
  return data || [];
}

// 更新订单状态
export async function updateOrderStatus(id: string, status: string): Promise<void> {
  const client = getSupabaseClient();
  const { error } = await client
    .from('orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw new Error(`更新订单状态失败: ${error.message}`);
}

// 创建分类
export async function createCategory(name: string, sortOrder: number = 0): Promise<Category> {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('categories')
    .insert({ name, sort_order: sortOrder })
    .select()
    .single();
  if (error) throw new Error(`创建分类失败: ${error.message}`);
  return data;
}
