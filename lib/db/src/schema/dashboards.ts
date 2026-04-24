import { pgTable, text, serial, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { clientsTable } from "./clients";

export const dashboardsTable = pgTable("dashboards", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull().references(() => clientsTable.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  lookerstudioUrl: text("lookerstudio_url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  category: text("category"),
  order: integer("order").notNull().default(0),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertDashboardSchema = createInsertSchema(dashboardsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertDashboard = z.infer<typeof insertDashboardSchema>;
export type Dashboard = typeof dashboardsTable.$inferSelect;
