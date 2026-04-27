import { Router, type IRouter } from "express";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";
import { db, userTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { requireAuth, requireRole } from "../middlewares/authMiddleware";

const router: IRouter = Router();

const SALT_ROUNDS = 10;

function sanitizeUser(user: typeof userTable.$inferSelect) {
  const { password: _pw, ...rest } = user;
  return rest;
}

router.get("/users", requireAuth, requireRole("admin", "brand_admin"), async (req, res) => {
  const user = req.user!;
  const companyId = req.query["companyId"] as string | undefined;

  let query = db.select().from(userTable).$dynamic();

  if (user.role === "brand_admin" && user.companyId) {
    query = query.where(eq(userTable.companyId, user.companyId));
  } else if (companyId) {
    query = query.where(eq(userTable.companyId, companyId));
  }

  const users = await query.orderBy(userTable.lastname);
  res.json(users.map(sanitizeUser));
});

router.get("/users/:id", requireAuth, requireRole("admin", "brand_admin"), async (req, res) => {
  const { id } = req.params;

  const [user] = await db
    .select()
    .from(userTable)
    .where(eq(userTable.id, id))
    .limit(1);

  if (!user) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  res.json(sanitizeUser(user));
});

router.post("/users", requireAuth, requireRole("admin", "brand_admin"), async (req, res) => {
  const currentUser = req.user!;
  const {
    email,
    firstname,
    lastname,
    role = "viewer",
    password,
    companyId = null,
    franchiseId = null,
  } = req.body as {
    email: string;
    firstname: string;
    lastname: string;
    role?: "admin" | "brand_admin" | "viewer";
    password?: string;
    companyId?: string | null;
    franchiseId?: string | null;
  };

  if (!email || !firstname || !lastname) {
    res.status(400).json({ error: "email, firstname, and lastname are required" });
    return;
  }

  if (currentUser.role === "brand_admin") {
    if (role === "admin" || companyId !== currentUser.companyId) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
  }

  const hashedPassword = password
    ? await bcrypt.hash(password, SALT_ROUNDS)
    : await bcrypt.hash(randomUUID(), SALT_ROUNDS);

  const id = randomUUID();
  const [created] = await db
    .insert(userTable)
    .values({
      id,
      email: email.toLowerCase().trim(),
      firstname,
      lastname,
      role,
      password: hashedPassword,
      companyId,
      franchiseId,
      isActive: true,
    })
    .returning();

  res.status(201).json(sanitizeUser(created));
});

router.put("/users/:id", requireAuth, requireRole("admin", "brand_admin"), async (req, res) => {
  const currentUser = req.user!;
  const { id } = req.params;

  const [existing] = await db
    .select()
    .from(userTable)
    .where(eq(userTable.id, id))
    .limit(1);

  if (!existing) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  if (currentUser.role === "brand_admin" && existing.companyId !== currentUser.companyId) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  const { email, firstname, lastname, role, password, companyId, franchiseId, isActive } = req.body as {
    email?: string;
    firstname?: string;
    lastname?: string;
    role?: "admin" | "brand_admin" | "viewer";
    password?: string;
    companyId?: string | null;
    franchiseId?: string | null;
    isActive?: boolean;
  };

  const updates: Record<string, unknown> = {};
  if (email !== undefined) updates["email"] = email.toLowerCase().trim();
  if (firstname !== undefined) updates["firstname"] = firstname;
  if (lastname !== undefined) updates["lastname"] = lastname;
  if (role !== undefined) {
    if (currentUser.role === "brand_admin" && role === "admin") {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    updates["role"] = role;
  }
  if (password !== undefined && password !== "") {
    updates["password"] = await bcrypt.hash(password, SALT_ROUNDS);
  }
  if (companyId !== undefined) updates["companyId"] = companyId;
  if (franchiseId !== undefined) updates["franchiseId"] = franchiseId;
  if (isActive !== undefined) updates["isActive"] = isActive;

  if (Object.keys(updates).length === 0) {
    res.status(400).json({ error: "No fields to update" });
    return;
  }

  const [updated] = await db
    .update(userTable)
    .set(updates)
    .where(eq(userTable.id, id))
    .returning();

  res.json(sanitizeUser(updated));
});

router.delete("/users/:id", requireAuth, requireRole("admin"), async (req, res) => {
  const { id } = req.params;
  await db.delete(userTable).where(eq(userTable.id, id));
  res.status(204).send();
});

export default router;
