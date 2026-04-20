import { NextRequest, NextResponse } from 'next/server';
import { getAllGifts, upsertGift, setGiftActive, deleteGift } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId') || undefined;
    
    const gifts = await getAllGifts(categoryId);
    
    return NextResponse.json({
      success: true,
      data: gifts,
    });
  } catch (error) {
    console.error('获取礼品列表失败:', error);
    return NextResponse.json(
      { success: false, error: '获取礼品列表失败' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, description, imageUrl, categoryId, futureValue, stock, isActive } = body;
    
    if (!name || futureValue === undefined) {
      return NextResponse.json(
        { success: false, error: '缺少必要参数' },
        { status: 400 }
      );
    }
    
    const gift = await upsertGift({
      id,
      name,
      description,
      imageUrl,
      categoryId,
      futureValue,
      stock: stock ?? 0,
      isActive: isActive ?? true,
    });
    
    return NextResponse.json({
      success: true,
      data: gift,
    });
  } catch (error) {
    console.error('保存礼品失败:', error);
    return NextResponse.json(
      { success: false, error: '保存礼品失败' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, isActive } = body;
    
    if (!id || isActive === undefined) {
      return NextResponse.json(
        { success: false, error: '缺少必要参数' },
        { status: 400 }
      );
    }
    
    await setGiftActive(id, isActive);
    
    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error('更新礼品状态失败:', error);
    return NextResponse.json(
      { success: false, error: '更新礼品状态失败' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: '缺少礼品ID' },
        { status: 400 }
      );
    }
    
    await deleteGift(id);
    
    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error('删除礼品失败:', error);
    return NextResponse.json(
      { success: false, error: '删除礼品失败' },
      { status: 500 }
    );
  }
}
