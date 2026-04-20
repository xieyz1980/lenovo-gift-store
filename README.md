# 联想未来中心礼品店

基于 Next.js 16 + Supabase 的全栈电商应用，用户可以使用"未来值"兑换精美的联想文创礼品。

## 在线访问

- 前台网站：https://abc123.dev.coze.site
- 后台管理：https://abc123.dev.coze.site/admin

## 功能特性

### 前台功能
- 礼品浏览（首页 + 分类页）
- 礼品详情页
- 购物车管理
- 下单结算
- 订单查询

### 后台管理
- 礼品管理（新增/编辑/上架/下架/删除）
- 订单管理（查看/更新状态）

## 技术栈

- **前端框架**: Next.js 16 (App Router)
- **UI 组件**: shadcn/ui (基于 Radix UI)
- **样式**: Tailwind CSS 4
- **数据库**: Supabase (PostgreSQL)
- **状态管理**: React Context

## 本地开发

### 环境要求

- Node.js 18+
- pnpm 8+

### 安装依赖

```bash
pnpm install
```

### 配置环境变量

创建 `.env.local` 文件，配置 Supabase 连接信息：

```env
COZE_SUPABASE_URL=你的Supabase项目URL
COZE_SUPABASE_ANON_KEY=你的Supabase匿名密钥
COZE_SUPABASE_SERVICE_ROLE_KEY=你的Supabase服务密钥
```

> Supabase 连接信息可在 Supabase 项目设置中找到。

### 启动开发服务器

```bash
pnpm dev
```

访问 http://localhost:5000

### 生产构建

```bash
pnpm build
pnpm start
```

## 项目结构

```
├── src/
│   ├── app/                    # Next.js App Router 页面
│   │   ├── api/               # API 路由
│   │   │   ├── admin/         # 后台管理 API
│   │   │   ├── gifts/         # 礼品相关 API
│   │   │   └── orders/        # 订单相关 API
│   │   ├── admin/             # 后台管理页面
│   │   ├── cart/              # 购物车页面
│   │   ├── category/          # 分类页面
│   │   ├── checkout/          # 结算页面
│   │   ├── gift/              # 礼品详情页面
│   │   ├── orders/            # 订单查询页面
│   │   └── page.tsx           # 首页
│   ├── components/             # React 组件
│   ├── contexts/               # React Context
│   └── lib/                    # 工具函数
├── public/                    # 静态资源
└── package.json
```

## 数据库表结构

| 表名 | 说明 |
|------|------|
| categories | 礼品分类表 |
| gifts | 礼品表 |
| orders | 订单表 |
| order_items | 订单明细表 |

详见 [AGENTS.md](./AGENTS.md)

## 设计规范

- **主色调**: 联想红 #E60012
- **强调色**: 渐变蓝紫色 (#667eea → #764ba2)
- **货币单位**: 未来值

## 常用命令

```bash
pnpm dev      # 开发环境
pnpm build    # 构建生产版本
pnpm start    # 启动生产环境
pnpm ts-check # TypeScript 类型检查
pnpm lint     # ESLint 检查
```
