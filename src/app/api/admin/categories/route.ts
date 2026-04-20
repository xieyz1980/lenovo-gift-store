import { NextRequest, NextResponse } from 'next/server';
import { getCategories, createCategory } from '@/lib/db';

export async function GET() {
  try {
    const categories = await getCategories();
    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error('获取分类列表失败:', error);
    return NextResponse.json(
      { success: false, error: '获取分类列表失败' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, sortOrder } = body;
    
    if (!name) {
      return NextResponse.json(
        { success: false, error: '分类名称不能为空' },
        { status: 400 }
      );
    }
    
    const category = await createCategory(name, sortOrder ?? 0);
    
    return NextResponse.json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error('创建分类失败:', error);
    return NextResponse.json(
      { success: false, error: '创建分类失败' },
      { status: 500 }
    );
  }
}
