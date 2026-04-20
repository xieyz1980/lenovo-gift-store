# 联想未来中心礼品店 - 项目文档

## 项目概述

联想未来中心礼品店是一个基于 Next.js 16 + Supabase 的全栈电商应用，用户可以使用"未来值"兑换精美的联想文创礼品。

## 技术栈

- **前端框架**: Next.js 16 (App Router)
- **UI 组件**: shadcn/ui (基于 Radix UI)
- **样式**: Tailwind CSS 4
- **数据库**: Supabase (PostgreSQL)
- **状态管理**: React Context

## 功能模块

### 前端功能

1. **礼品浏览** (`/`)
   - 侧边栏分类导航
   - 礼品列表展示（未来值、已兑换数量）
   - 一键加入购物车

2. **分类页** (`/category`)
   - 分类标签筛选
   - 商品网格布局

3. **购物车** (`/cart`)
   - 商品数量调整
   - 删除商品
   - 清空购物车
   - 结算入口

4. **下单结算** (`/checkout`)
   - 收货信息填写
   - 订单确认

5. **下单成功** (`/order-success`)
   - 订单号展示

6. **我的订单** (`/orders`)
   - 手机号查询订单
   - 订单状态展示

### 后台管理

1. **后台首页** (`/admin`)
   - 礼品管理入口
   - 订单管理入口

2. **礼品管理** (`/admin/gifts`)
   - 礼品列表展示
   - 上架/下架切换
   - 新增/编辑礼品
   - 删除礼品

3. **订单管理** (`/admin/orders`)
   - 订单状态筛选
   - 订单详情查看
   - 订单状态更新（待处理→处理中→已发货→已完成）

## 数据库表结构

### categories (礼品分类表)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | varchar(36) | 主键 UUID |
| name | varchar(100) | 分类名称 |
| sort_order | integer | 排序 |
| created_at | timestamp | 创建时间 |

### gifts (礼品表)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | varchar(36) | 主键 UUID |
| name | varchar(200) | 礼品名称 |
| description | text | 描述 |
| image_url | varchar(500) | 图片URL |
| category_id | varchar(36) | 分类ID |
| future_value | integer | 未来值/价格 |
| stock | integer | 库存 |
| exchange_count | integer | 已兑换数量 |
| is_active | boolean | 是否上架 |
| created_at | timestamp | 创建时间 |
| updated_at | timestamp | 更新时间 |

### orders (订单表)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | varchar(36) | 主键 UUID |
| order_no | varchar(50) | 订单号 |
| user_name | varchar(100) | 收货人 |
| user_phone | varchar(20) | 手机号 |
| user_address | text | 收货地址 |
| status | varchar(20) | 状态 |
| total_future_value | integer | 订单总未来值 |
| remark | text | 备注 |
| created_at | timestamp | 创建时间 |
| updated_at | timestamp | 更新时间 |

### order_items (订单明细表)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | varchar(36) | 主键 UUID |
| order_id | varchar(36) | 订单ID |
| gift_id | varchar(36) | 礼品ID |
| gift_name | varchar(200) | 礼品名称(快照) |
| quantity | integer | 数量 |
| future_value | integer | 下单时的未来值 |
| created_at | timestamp | 创建时间 |

## API 接口

### 前端 API

- `GET /api/gifts` - 获取礼品列表
- `POST /api/orders` - 创建订单
- `GET /api/orders/query?phone=xxx` - 查询订单

### 后台管理 API

- `GET /api/admin/gifts` - 获取所有礼品
- `POST /api/admin/gifts` - 创建/更新礼品
- `PUT /api/admin/gifts` - 更新礼品状态
- `DELETE /api/admin/gifts?id=xxx` - 删除礼品
- `GET /api/admin/orders` - 获取所有订单
- `PUT /api/admin/orders` - 更新订单状态
- `GET /api/admin/categories` - 获取分类
- `POST /api/admin/categories` - 创建分类

## 开发命令

```bash
pnpm dev      # 开发环境
pnpm build    # 构建生产版本
pnpm start    # 启动生产环境
pnpm ts-check # TypeScript 类型检查
```

## 设计规范

- 主色调: 联想红 #E60012
- 强调色: 渐变蓝紫色
- 底部导航: 首页/分类/购物车/我的
- 货币单位: 未来值
