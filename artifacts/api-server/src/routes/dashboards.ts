import { Router, type IRouter } from "express";
import { randomUUID } from "crypto";
import {
  db,
  dashboardTable,
  dashboardUserTable,
  dashboardFranchiseTable,
} from "@workspace/db";
import { eq, inArray, and } from "drizzle-orm";
import { requireAuth, requireRole } from "../middlewares/authMiddleware";

const router: IRouter = Router();

router.get("/dashboards", requireAuth, async (req, res) => {
  const user = req.user!;

  if (user.role === "admin") {
    const dashboards = await db.select().from(dashboardTable).orderBy(dashboardTable.name);
    res.json(dashboards);
    return;
  }

  if (user.role === "brand_admin" && user.companyId) {
    const dashboards = await db
      .select()
      .from(dashboardTable)
      .where(eq(dashboardTable.companyId, user.companyId))
      .orderBy(dashboardTable.name);
    res.json(dashboards);
    return;
  }

  const dashboardIds = new Set<string>();

  const directAssignments = await db
    .select({ dashboardId: dashboardUserTable.dashboardId })
    .from(dashboardUserTable)
    .where(eq(dashboardUserTable.userId, user.id));

  for (const { dashboardId } of directAssignments) {
    dashboardIds.add(dashboardId);
  }

  if (user.franchiseId) {
    const franchiseAssignments = await db
      .select({ dashboardId: dashboardFranchiseTable.dashboardId })
      .from(dashboardFranchiseTable)
      .where(eq(dashboardFranchiseTable.franchiseId, user.franchiseId));

    for (const { dashboardId } of franchiseAssignments) {
      dashboardIds.add(dashboardId);
    }
  }

  if (dashboardIds.size === 0) {
    res.json([]);
    return;
  }

  const dashboards = await db
    .select()
    .from(dashboardTable)
    .where(inArray(dashboardTable.id, [...dashboardIds]))
    .orderBy(dashboardTable.name);

  res.json(dashboards);
});

router.get("/dashboards/:id", requireAuth, async (req, res) => {
  const user = req.user!;
  const { id } = req.params;

  const [dashboard] = await db
    .select()
    .from(dashboardTable)
    .where(eq(dashboardTable.id, id))
    .limit(1);

  if (!dashboard) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  if (user.role === "admin") {
    res.json(dashboard);
    return;
  }

  if (user.role === "brand_admin" && user.companyId === dashboard.companyId) {
    res.json(dashboard);
    return;
  }

  const [directAccess] = await db
    .select()
    .from(dashboardUserTable)
    .where(
      and(
        eq(dashboardUserTable.dashboardId, id),
        eq(dashboardUserTable.userId, user.id),
      ),
    )
    .limit(1);

  if (directAccess) {
    res.json(dashboard);
    return;
  }

  if (user.franchiseId) {
    const [franchiseAccess] = await db
      .select()
      .from(dashboardFranchiseTable)
      .where(
        and(
          eq(dashboardFranchiseTable.dashboardId, id),
          eq(dashboardFranchiseTable.franchiseId, user.franchiseId),
        ),
      )
      .limit(1);

    if (franchiseAccess) {
      res.json(dashboard);
      return;
    }
  }

  res.status(403).json({ error: "Forbidden" });
});

router.post("/dashboards", requireAuth, requireRole("admin", "brand_admin"), async (req, res) => {
  const user = req.user!;
  const { name, companyId, lookerUrl, active = true } = req.body as {
    name: string;
    companyId: string;
    lookerUrl: string;
    active?: boolean;
  };

  if (!name || !companyId || !lookerUrl) {
    res.status(400).json({ error: "name, companyId, and lookerUrl are required" });
    return;
  }

  if (user.role === "brand_admin" && user.companyId !== companyId) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  const id = randomUUID();
  const [created] = await db
    .insert(dashboardTable)
    .values({ id, name, companyId, lookerUrl, active })
    .returning();

  res.status(201).json(created);
});

router.put("/dashboards/:id", requireAuth, requireRole("admin", "brand_admin"), async (req, res) => {
  const user = req.user!;
  const { id } = req.params;

  const [existing] = await db
    .select()
    .from(dashboardTable)
    .where(eq(dashboardTable.id, id))
    .limit(1);

  if (!existing) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  if (user.role === "brand_admin" && user.companyId !== existing.companyId) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  const { name, companyId: newCompanyId, lookerUrl, active } = req.body as {
    name?: string;
    companyId?: string;
    lookerUrl?: string;
    active?: boolean;
  };

  const updates: Record<string, unknown> = {};
  if (name !== undefined) updates["name"] = name;
  if (newCompanyId !== undefined) updates["companyId"] = newCompanyId;
  if (lookerUrl !== undefined) updates["lookerUrl"] = lookerUrl;
  if (active !== undefined) updates["active"] = active;

  if (Object.keys(updates).length === 0) {
    res.status(400).json({ error: "No fields to update" });
    return;
  }

  const [updated] = await db
    .update(dashboardTable)
    .set(updates)
    .where(eq(dashboardTable.id, id))
    .returning();

  res.json(updated);
});

router.delete("/dashboards/:id", requireAuth, requireRole("admin", "brand_admin"), async (req, res) => {
  const user = req.user!;
  const { id } = req.params;

  if (user.role === "brand_admin") {
    const [existing] = await db
      .select()
      .from(dashboardTable)
      .where(eq(dashboardTable.id, id))
      .limit(1);
    if (!existing || existing.companyId !== user.companyId) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
  }

  await db.delete(dashboardTable).where(eq(dashboardTable.id, id));
  res.status(204).send();
});

router.get("/dashboards/:id/users", requireAuth, requireRole("admin", "brand_admin"), async (req, res) => {
  const { id } = req.params;
  const rows = await db
    .select({ userId: dashboardUserTable.userId })
    .from(dashboardUserTable)
    .where(eq(dashboardUserTable.dashboardId, id));
  res.json(rows.map((r) => r.userId));
});

router.put("/dashboards/:id/users", requireAuth, requireRole("admin", "brand_admin"), async (req, res) => {
  const { id } = req.params;
  const { userIds } = req.body as { userIds: string[] };

  if (!Array.isArray(userIds)) {
    res.status(400).json({ error: "userIds must be an array" });
    return;
  }

  await db.delete(dashboardUserTable).where(eq(dashboardUserTable.dashboardId, id));

  if (userIds.length > 0) {
    await db
      .insert(dashboardUserTable)
      .values(userIds.map((userId) => ({ dashboardId: id, userId })))
      .onConflictDoNothing();
  }

  res.json({ ok: true });
});

router.get("/dashboards/:id/franchises", requireAuth, requireRole("admin", "brand_admin"), async (req, res) => {
  const { id } = req.params;
  const rows = await db
    .select({ franchiseId: dashboardFranchiseTable.franchiseId })
    .from(dashboardFranchiseTable)
    .where(eq(dashboardFranchiseTable.dashboardId, id));
  res.json(rows.map((r) => r.franchiseId));
});

router.put("/dashboards/:id/franchises", requireAuth, requireRole("admin", "brand_admin"), async (req, res) => {
  const { id } = req.params;
  const { franchiseIds } = req.body as { franchiseIds: string[] };

  if (!Array.isArray(franchiseIds)) {
    res.status(400).json({ error: "franchiseIds must be an array" });
    return;
  }

  await db.delete(dashboardFranchiseTable).where(eq(dashboardFranchiseTable.dashboardId, id));

  if (franchiseIds.length > 0) {
    await db
      .insert(dashboardFranchiseTable)
      .values(franchiseIds.map((franchiseId) => ({ dashboardId: id, franchiseId })))
      .onConflictDoNothing();
  }

  res.json({ ok: true });
});

export default router;
