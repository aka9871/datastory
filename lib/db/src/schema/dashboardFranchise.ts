import { pgTable, varchar, primaryKey } from "drizzle-orm/pg-core";
import { dashboardTable } from "./dashboard";
import { franchiseTable } from "./franchise";

export const dashboardFranchiseTable = pgTable("DashboardFranchise", {
  dashboardId: varchar("dashboard_id", { length: 36 }).notNull().references(() => dashboardTable.id, { onDelete: "cascade" }),
  franchiseId: varchar("franchise_id", { length: 36 }).notNull().references(() => franchiseTable.id, { onDelete: "cascade" }),
}, (table) => ({
  pk: primaryKey({ columns: [table.dashboardId, table.franchiseId] }),
}));

export type DashboardFranchise = typeof dashboardFranchiseTable.$inferSelect;
