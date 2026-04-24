import { pgTable, text, serial, timestamp, integer, unique } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { clientsTable } from "./clients";

export const userClientsTable = pgTable("user_clients", {
  id: serial("id").primaryKey(),
  clerkUserId: text("clerk_user_id").notNull(),
  clientId: integer("client_id").notNull().references(() => clientsTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  uniqueUserClient: unique().on(table.clerkUserId, table.clientId),
}));

export const insertUserClientSchema = createInsertSchema(userClientsTable).omit({ id: true, createdAt: true });
export type InsertUserClient = z.infer<typeof insertUserClientSchema>;
export type UserClient = typeof userClientsTable.$inferSelect;
