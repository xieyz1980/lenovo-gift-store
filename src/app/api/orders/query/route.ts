import { NextRequest, NextResponse } from 'next/server';
import { getOrders } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get('phone');
    
    if (!phone) {
      return NextResponse.json(
        { success: false, error: '请提供手机号' },
        { status: 400 }
      );
    }
    
    const orders = await getOrders(phone);
    
    return NextResponse.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error('查询订单失败:', error);
    return NextResponse.json(
      { success: false, error: '查询订单失败' },
      { status: 500 }
    );
  }
}
