import { Router, type IRouter } from "express";
import { randomUUID } from "crypto";
import { db, franchiseTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth, requireRole } from "../middlewares/authMiddleware";

const router: IRouter = Router();

router.get("/franchises", requireAuth, async (req, res) => {
  const user = req.user!;
  const companyId = req.query["companyId"] as string | undefined;

  if (user.role === "admin") {
    const query = db.select().from(franchiseTable);
    const results = companyId
      ? await query.where(eq(franchiseTable.companyId, companyId))
      : await query;
    res.json(results);
    return;
  }

  if (user.companyId) {
    const results = await db
      .select()
      .from(franchiseTable)
      .where(eq(franchiseTable.companyId, user.companyId));
    res.json(results);
    return;
  }

  if (user.franchiseId) {
    const [franchise] = await db
      .select()
      .from(franchiseTable)
      .where(eq(franchiseTable.id, user.franchiseId))
      .limit(1);
    res.json(franchise ? [franchise] : []);
    return;
  }

  res.json([]);
});

router.post("/franchises", requireAuth, requireRole("admin"), async (req, res) => {
  const { name, companyId, code = "", address = "", zipcode = "" } = req.body as {
    name: string;
    companyId: string;
    code?: string;
    address?: string;
    zipcode?: string;
  };

  if (!name || !companyId) {
    res.status(400).json({ error: "name and companyId are required" });
    return;
  }

  const id = randomUUID();
  const [created] = await db
    .insert(franchiseTable)
    .values({ id, name, companyId, code, address, zipcode })
    .returning();

  res.status(201).json(created);
});

router.put("/franchises/:id", requireAuth, requireRole("admin", "brand_admin"), async (req, res) => {
  const { id } = req.params;
  const { name, code, address, zipcode } = req.body as {
    name?: string;
    code?: string;
    address?: string;
    zipcode?: string;
  };

  const updates: Record<string, unknown> = {};
  if (name !== undefined) updates["name"] = name;
  if (code !== undefined) updates["code"] = code;
  if (address !== undefined) updates["address"] = address;
  if (zipcode !== undefined) updates["zipcode"] = zipcode;

  if (Object.keys(updates).length === 0) {
    res.status(400).json({ error: "No fields to update" });
    return;
  }

  const [updated] = await db
    .update(franchiseTable)
    .set(updates)
    .where(eq(franchiseTable.id, id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(updated);
});

router.delete("/franchises/:id", requireAuth, requireRole("admin"), async (req, res) => {
  const { id } = req.params;
  await db.delete(franchiseTable).where(eq(franchiseTable.id, id));
  res.status(204).send();
});

export default router;
