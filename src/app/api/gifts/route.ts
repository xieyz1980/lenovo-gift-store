import { NextRequest, NextResponse } from 'next/server';
import { getCategories, getGifts } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId') || undefined;
    
    const categories = await getCategories();
    const gifts = await getGifts(categoryId);
    
    return NextResponse.json({
      success: true,
      data: { categories, gifts },
    });
  } catch (error) {
    console.error('获取礼品列表失败:', error);
    return NextResponse.json(
      { success: false, error: '获取礼品列表失败' },
      { status: 500 }
    );
  }
}
