import { pgTable, varchar, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { companyTable } from "./company";
import { franchiseTable } from "./franchise";

export const userRoleEnum = pgEnum("user_role", ["admin", "brand_admin", "viewer"]);

export const userTable = pgTable("User", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  firstname: varchar("firstname", { length: 255 }).notNull().default(""),
  lastname: varchar("lastname", { length: 255 }).notNull().default(""),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }),
  role: userRoleEnum("role").notNull().default("viewer"),
  companyId: varchar("company_id", { length: 36 }).references(() => companyTable.id, { onDelete: "set null" }),
  franchiseId: varchar("franchise_id", { length: 36 }).references(() => franchiseTable.id, { onDelete: "set null" }),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertUserSchema = createInsertSchema(userTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof userTable.$inferSelect;
