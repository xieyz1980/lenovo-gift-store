import { NextRequest, NextResponse } from 'next/server';
import { createOrder } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userName, userPhone, userAddress, remark, items } = body;
    
    if (!userName || !userPhone || !userAddress || !items?.length) {
      return NextResponse.json(
        { success: false, error: '缺少必要参数' },
        { status: 400 }
      );
    }
    
    const order = await createOrder({ userName, userPhone, userAddress, remark, items });
    
    return NextResponse.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error('创建订单失败:', error);
    return NextResponse.json(
      { success: false, error: '创建订单失败' },
      { status: 500 }
    );
  }
}
