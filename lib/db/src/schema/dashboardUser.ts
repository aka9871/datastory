import { pgTable, varchar, primaryKey } from "drizzle-orm/pg-core";
import { dashboardTable } from "./dashboard";
import { userTable } from "./user";

export const dashboardUserTable = pgTable("DashboardUser", {
  dashboardId: varchar("dashboard_id", { length: 36 }).notNull().references(() => dashboardTable.id, { onDelete: "cascade" }),
  userId: varchar("user_id", { length: 36 }).notNull().references(() => userTable.id, { onDelete: "cascade" }),
}, (table) => ({
  pk: primaryKey({ columns: [table.dashboardId, table.userId] }),
}));

export type DashboardUser = typeof dashboardUserTable.$inferSelect;
