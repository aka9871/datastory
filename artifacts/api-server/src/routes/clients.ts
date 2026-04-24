import { Router, type IRouter } from "express";
import { eq, count } from "drizzle-orm";
import { db, clientsTable, dashboardsTable } from "@workspace/db";
import {
  CreateClientBody,
  UpdateClientBody,
  GetClientParams,
  UpdateClientParams,
  DeleteClientParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

function serializeDates<T>(obj: T): T {
  if (Array.isArray(obj)) return obj.map(serializeDates) as T;
  if (obj && typeof obj === "object") {
    const result: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
      result[k] = v instanceof Date ? v.toISOString() : v;
    }
    return result as T;
  }
  return obj;
}

router.get("/clients", async (_req, res): Promise<void> => {
  const clients = await db.select().from(clientsTable).orderBy(clientsTable.name);
  res.json(serializeDates(clients));
});

router.post("/clients", async (req, res): Promise<void> => {
  const parsed = CreateClientBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [client] = await db.insert(clientsTable).values(parsed.data).returning();
  res.status(201).json(serializeDates(client));
});

router.get("/clients/:id", async (req, res): Promise<void> => {
  const params = GetClientParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [client] = await db.select().from(clientsTable).where(eq(clientsTable.id, params.data.id));
  if (!client) {
    res.status(404).json({ error: "Client not found" });
    return;
  }
  res.json(serializeDates(client));
});

router.patch("/clients/:id", async (req, res): Promise<void> => {
  const params = UpdateClientParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateClientBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [client] = await db
    .update(clientsTable)
    .set(parsed.data)
    .where(eq(clientsTable.id, params.data.id))
    .returning();
  if (!client) {
    res.status(404).json({ error: "Client not found" });
    return;
  }
  res.json(serializeDates(client));
});

router.delete("/clients/:id", async (req, res): Promise<void> => {
  const params = DeleteClientParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [client] = await db.delete(clientsTable).where(eq(clientsTable.id, params.data.id)).returning();
  if (!client) {
    res.status(404).json({ error: "Client not found" });
    return;
  }
  res.sendStatus(204);
});

router.get("/stats/overview", async (_req, res): Promise<void> => {
  const [totalClients] = await db.select({ count: count() }).from(clientsTable);
  const [activeClients] = await db.select({ count: count() }).from(clientsTable).where(eq(clientsTable.active, true));
  const [totalDashboards] = await db.select({ count: count() }).from(dashboardsTable);
  const [activeDashboards] = await db.select({ count: count() }).from(dashboardsTable).where(eq(dashboardsTable.active, true));

  res.json({
    totalClients: Number(totalClients?.count ?? 0),
    activeClients: Number(activeClients?.count ?? 0),
    totalDashboards: Number(totalDashboards?.count ?? 0),
    activeDashboards: Number(activeDashboards?.count ?? 0),
  });
});

export default router;
