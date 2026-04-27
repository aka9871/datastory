import { pgTable, varchar, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { companyTable } from "./company";

export const dashboardTable = pgTable("Dashboard", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull().default(""),
  companyId: varchar("company_id", { length: 36 }).notNull().references(() => companyTable.id, { onDelete: "cascade" }),
  lookerUrl: text("looker_url").notNull(),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertDashboardSchema = createInsertSchema(dashboardTable).omit({ id: true, createdAt: true });
export type InsertDashboard = z.infer<typeof insertDashboardSchema>;
export type Dashboard = typeof dashboardTable.$inferSelect;
