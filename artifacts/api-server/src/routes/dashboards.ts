import { Router, type IRouter } from "express";
import { eq, inArray } from "drizzle-orm";
import { db, dashboardsTable, userClientsTable } from "@workspace/db";
import {
  CreateDashboardBody,
  UpdateDashboardBody,
  GetDashboardParams,
  UpdateDashboardParams,
  DeleteDashboardParams,
  ListClientDashboardsParams,
} from "@workspace/api-zod";
import { getAuth } from "@clerk/express";

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

router.get("/clients/:clientId/dashboards", async (req, res): Promise<void> => {
  const params = ListClientDashboardsParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const dashboards = await db
    .select()
    .from(dashboardsTable)
    .where(eq(dashboardsTable.clientId, params.data.clientId))
    .orderBy(dashboardsTable.order);
  res.json(serializeDates(dashboards));
});

router.get("/dashboards/my", async (req, res): Promise<void> => {
  const { userId } = getAuth(req);
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const assignments = await db
    .select()
    .from(userClientsTable)
    .where(eq(userClientsTable.clerkUserId, userId));

  if (assignments.length === 0) {
    res.json([]);
    return;
  }

  const clientIds = assignments.map((a) => a.clientId);
  const dashboards = await db
    .select()
    .from(dashboardsTable)
    .where(inArray(dashboardsTable.clientId, clientIds))
    .orderBy(dashboardsTable.order);
  res.json(serializeDates(dashboards));
});

router.get("/dashboards", async (_req, res): Promise<void> => {
  const dashboards = await db.select().from(dashboardsTable).orderBy(dashboardsTable.order);
  res.json(serializeDates(dashboards));
});

router.post("/dashboards", async (req, res): Promise<void> => {
  const parsed = CreateDashboardBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [dashboard] = await db.insert(dashboardsTable).values(parsed.data).returning();
  res.status(201).json(serializeDates(dashboard));
});

router.get("/dashboards/:id", async (req, res): Promise<void> => {
  const params = GetDashboardParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [dashboard] = await db.select().from(dashboardsTable).where(eq(dashboardsTable.id, params.data.id));
  if (!dashboard) {
    res.status(404).json({ error: "Dashboard not found" });
    return;
  }
  res.json(serializeDates(dashboard));
});

router.patch("/dashboards/:id", async (req, res): Promise<void> => {
  const params = UpdateDashboardParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateDashboardBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [dashboard] = await db
    .update(dashboardsTable)
    .set(parsed.data)
    .where(eq(dashboardsTable.id, params.data.id))
    .returning();
  if (!dashboard) {
    res.status(404).json({ error: "Dashboard not found" });
    return;
  }
  res.json(serializeDates(dashboard));
});

router.delete("/dashboards/:id", async (req, res): Promise<void> => {
  const params = DeleteDashboardParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [dashboard] = await db.delete(dashboardsTable).where(eq(dashboardsTable.id, params.data.id)).returning();
  if (!dashboard) {
    res.status(404).json({ error: "Dashboard not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;
