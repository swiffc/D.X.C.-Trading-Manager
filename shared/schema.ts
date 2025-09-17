import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, timestamp, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Trading-specific tables
export const trades = pgTable("trades", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  title: text("title").notNull(),
  pair: text("pair").notNull(),
  tradeType: integer("trade_type").notNull(), // 1, 2, 3, 4 (Type 1-4 patterns)
  status: text("status").notNull(), // 'live', 'closed-profit', 'closed-loss', 'case-study'
  entry: decimal("entry", { precision: 10, scale: 5 }),
  exit: decimal("exit", { precision: 10, scale: 5 }),
  pnl: decimal("pnl", { precision: 8, scale: 2 }),
  timeframe: text("timeframe").notNull(),
  session: text("session"),
  notes: text("notes").default(""),
  confluences: jsonb("confluences").default([]), // Array of confluence strings
  // Bias-first fields for BTMM methodology
  biasLevel: integer("bias_level"), // 1, 2, or 3
  emaCrossovers: jsonb("ema_crossovers").default([]), // Array of EMA crossover strings like "5/13", "13/50", "50/200", "200/800", "50/800"
  adr5: decimal("adr5", { precision: 8, scale: 2 }), // 5-day Average Daily Range
  todayRange: decimal("today_range", { precision: 8, scale: 2 }), // Today's range in pips
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const screenshots = pgTable("screenshots", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tradeId: varchar("trade_id").notNull(),
  fileName: text("file_name").notNull(),
  originalName: text("original_name").notNull(),
  url: text("url").notNull(),
  timeframe: text("timeframe").notNull(),
  orderIndex: integer("order_index").notNull().default(0),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  trades: many(trades),
}));

export const tradesRelations = relations(trades, ({ one, many }) => ({
  user: one(users, {
    fields: [trades.userId],
    references: [users.id],
  }),
  screenshots: many(screenshots),
}));

export const screenshotsRelations = relations(screenshots, ({ one }) => ({
  trade: one(trades, {
    fields: [screenshots.tradeId],
    references: [trades.id],
  }),
}));

// Insert schemas
export const insertTradeSchema = createInsertSchema(trades).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  confluences: z.array(z.string()).default([]),
  emaCrossovers: z.array(z.string()).default([]),
  biasLevel: z.number().int().min(1).max(3).optional(),
  adr5: z.string().optional(), // Will be parsed as decimal on backend
  todayRange: z.string().optional(), // Will be parsed as decimal on backend
});

export const insertScreenshotSchema = createInsertSchema(screenshots).omit({
  id: true,
  uploadedAt: true,
});

// Types
export type Trade = typeof trades.$inferSelect;
export type InsertTrade = z.infer<typeof insertTradeSchema>;
export type Screenshot = typeof screenshots.$inferSelect;
export type InsertScreenshot = z.infer<typeof insertScreenshotSchema>;
