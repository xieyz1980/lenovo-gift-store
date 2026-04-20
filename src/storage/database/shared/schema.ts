import { pgTable, text, varchar, timestamp, boolean, integer, index, serial } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// 健康检查表（系统内置，禁止删除）
export const healthCheck = pgTable("health_check", {
  id: serial().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

// 礼品分类表
export const categories = pgTable(
  "categories",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    name: varchar("name", { length: 100 }).notNull(),
    sort_order: integer("sort_order").default(0).notNull(),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("categories_sort_order_idx").on(table.sort_order),
  ]
);

// 礼品表
export const gifts = pgTable(
  "gifts",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    name: varchar("name", { length: 200 }).notNull(),
    description: text("description"),
    image_url: varchar("image_url", { length: 500 }),
    category_id: varchar("category_id", { length: 36 }).references(() => categories.id),
    future_value: integer("future_value").notNull().default(100), // 未来值/价格
    stock: integer("stock").notNull().default(0), // 库存
    exchange_count: integer("exchange_count").notNull().default(0), // 已兑换数量
    is_active: boolean("is_active").notNull().default(true), // 是否上架
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("gifts_category_id_idx").on(table.category_id),
    index("gifts_is_active_idx").on(table.is_active),
    index("gifts_created_at_idx").on(table.created_at),
  ]
);

// 订单表
export const orders = pgTable(
  "orders",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    order_no: varchar("order_no", { length: 50 }).notNull().unique(), // 订单号
    user_name: varchar("user_name", { length: 100 }).notNull(),
    user_phone: varchar("user_phone", { length: 20 }).notNull(),
    user_address: text("user_address").notNull(),
    status: varchar("status", { length: 20 }).notNull().default("pending"), // pending待处理, processing处理中, shipped已发货, completed已完成, cancelled已取消
    total_future_value: integer("total_future_value").notNull().default(0), // 订单总未来值
    remark: text("remark"), // 备注
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("orders_order_no_idx").on(table.order_no),
    index("orders_status_idx").on(table.status),
    index("orders_created_at_idx").on(table.created_at),
  ]
);

// 订单明细表
export const orderItems = pgTable(
  "order_items",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    order_id: varchar("order_id", { length: 36 }).notNull().references(() => orders.id, { onDelete: "cascade" }),
    gift_id: varchar("gift_id", { length: 36 }).notNull().references(() => gifts.id),
    gift_name: varchar("gift_name", { length: 200 }).notNull(), // 下单时保存礼品名称
    quantity: integer("quantity").notNull().default(1),
    future_value: integer("future_value").notNull(), // 下单时的未来值
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("order_items_order_id_idx").on(table.order_id),
    index("order_items_gift_id_idx").on(table.gift_id),
  ]
);

// 导出类型
export type Category = typeof categories.$inferSelect;
export type Gift = typeof gifts.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;
