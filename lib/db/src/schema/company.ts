import { pgTable, varchar, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const companyTable = pgTable("Company", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull().default(""),
  slug: varchar("slug", { length: 255 }).notNull().default(""),
  domain: varchar("domain", { length: 255 }).notNull().default(""),
  hasFranchise: boolean("has_franchise").notNull().default(false),
  logoUrl: text("logo_url"),
  fontRegularFilename: varchar("font_regular_filename", { length: 255 }),
  fontBoldFilename: varchar("font_bold_filename", { length: 255 }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertCompanySchema = createInsertSchema(companyTable).omit({ id: true, createdAt: true });
export type InsertCompany = z.infer<typeof insertCompanySchema>;
export type Company = typeof companyTable.$inferSelect;
