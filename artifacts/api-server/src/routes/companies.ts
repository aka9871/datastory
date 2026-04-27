import { Router, type IRouter } from "express";
import { randomUUID } from "crypto";
import { db, companyTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth, requireRole } from "../middlewares/authMiddleware";

const router: IRouter = Router();

router.get("/companies", requireAuth, async (req, res) => {
  const user = req.user!;
  if (user.role === "admin") {
    const companies = await db.select().from(companyTable).orderBy(companyTable.name);
    res.json(companies);
    return;
  }
  if (user.companyId) {
    const [company] = await db
      .select()
      .from(companyTable)
      .where(eq(companyTable.id, user.companyId))
      .limit(1);
    res.json(company ? [company] : []);
    return;
  }
  res.json([]);
});

router.get("/companies/:id", requireAuth, async (req, res) => {
  const user = req.user!;
  const { id } = req.params;

  if (user.role !== "admin" && user.companyId !== id) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  const [company] = await db
    .select()
    .from(companyTable)
    .where(eq(companyTable.id, id))
    .limit(1);

  if (!company) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(company);
});

router.post("/companies", requireAuth, requireRole("admin"), async (req, res) => {
  const { name, slug, domain, hasFranchise = false, logoUrl = null } = req.body as {
    name: string;
    slug: string;
    domain: string;
    hasFranchise?: boolean;
    logoUrl?: string | null;
  };

  if (!name || !slug || !domain) {
    res.status(400).json({ error: "name, slug, and domain are required" });
    return;
  }

  const id = randomUUID();
  const [created] = await db
    .insert(companyTable)
    .values({ id, name, slug, domain, hasFranchise, logoUrl })
    .returning();

  res.status(201).json(created);
});

router.put("/companies/:id", requireAuth, requireRole("admin"), async (req, res) => {
  const { id } = req.params;
  const { name, slug, domain, hasFranchise, logoUrl } = req.body as {
    name?: string;
    slug?: string;
    domain?: string;
    hasFranchise?: boolean;
    logoUrl?: string | null;
  };

  const updates: Record<string, unknown> = {};
  if (name !== undefined) updates["name"] = name;
  if (slug !== undefined) updates["slug"] = slug;
  if (domain !== undefined) updates["domain"] = domain;
  if (hasFranchise !== undefined) updates["hasFranchise"] = hasFranchise;
  if (logoUrl !== undefined) updates["logoUrl"] = logoUrl;

  if (Object.keys(updates).length === 0) {
    res.status(400).json({ error: "No fields to update" });
    return;
  }

  const [updated] = await db
    .update(companyTable)
    .set(updates)
    .where(eq(companyTable.id, id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(updated);
});

router.delete("/companies/:id", requireAuth, requireRole("admin"), async (req, res) => {
  const { id } = req.params;
  await db.delete(companyTable).where(eq(companyTable.id, id));
  res.status(204).send();
});

export default router;
