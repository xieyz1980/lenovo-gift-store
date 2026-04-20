import { NextRequest, NextResponse } from 'next/server';
import { updateOrderStatus } from '@/lib/db';

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body;
    
    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: '缺少必要参数' },
        { status: 400 }
      );
    }
    
    await updateOrderStatus(id, status);
    
    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error('更新订单状态失败:', error);
    return NextResponse.json(
      { success: false, error: '更新订单状态失败' },
      { status: 500 }
    );
  }
}
