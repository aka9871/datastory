import { pgTable, varchar, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { companyTable } from "./company";

export const franchiseTable = pgTable("Franchise", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull().default(""),
  companyId: varchar("company_id", { length: 36 }).notNull().references(() => companyTable.id, { onDelete: "cascade" }),
  code: varchar("code", { length: 100 }).notNull().default(""),
  address: varchar("address", { length: 500 }).notNull().default(""),
  zipcode: varchar("zipcode", { length: 20 }).notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertFranchiseSchema = createInsertSchema(franchiseTable).omit({ id: true, createdAt: true });
export type InsertFranchise = z.infer<typeof insertFranchiseSchema>;
export type Franchise = typeof franchiseTable.$inferSelect;
