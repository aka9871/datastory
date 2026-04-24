import { Router, type IRouter } from "express";
import { createClerkClient } from "@clerk/express";
import { eq, and } from "drizzle-orm";
import { db, userClientsTable } from "@workspace/db";

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
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

router.get("/admin/users", async (_req, res): Promise<void> => {
  try {
    const { data: clerkUsers } = await clerk.users.getUserList({ limit: 200 });
    const assignments = await db.select().from(userClientsTable);

    const users = clerkUsers.map((u) => ({
      id: u.id,
      email: u.emailAddresses[0]?.emailAddress ?? "",
      firstName: u.firstName,
      lastName: u.lastName,
      createdAt: u.createdAt,
      assignedClientIds: assignments
        .filter((a) => a.clerkUserId === u.id)
        .map((a) => a.clientId),
    }));

    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to list users" });
  }
});

router.post("/admin/users", async (req, res): Promise<void> => {
  const { email, password, firstName, lastName } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: "email and password are required" });
    return;
  }
  try {
    const user = await clerk.users.createUser({
      emailAddress: [email],
      password,
      firstName: firstName ?? undefined,
      lastName: lastName ?? undefined,
      skipPasswordChecks: false,
    });

    res.status(201).json({
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress ?? email,
      firstName: user.firstName,
      lastName: user.lastName,
      createdAt: user.createdAt,
      assignedClientIds: [],
    });
  } catch (err: any) {
    const msg = err?.errors?.[0]?.longMessage ?? err?.message ?? "Failed to create user";
    res.status(400).json({ error: msg });
  }
});

router.delete("/admin/users/:userId", async (req, res): Promise<void> => {
  const { userId } = req.params;
  try {
    await clerk.users.deleteUser(userId);
    await db.delete(userClientsTable).where(eq(userClientsTable.clerkUserId, userId));
    res.sendStatus(204);
  } catch (err) {
    res.status(404).json({ error: "User not found" });
  }
});

router.get("/admin/users/:userId/clients", async (req, res): Promise<void> => {
  const { userId } = req.params;
  const assignments = await db
    .select()
    .from(userClientsTable)
    .where(eq(userClientsTable.clerkUserId, userId));
  res.json(serializeDates(assignments));
});

router.post("/admin/users/:userId/clients", async (req, res): Promise<void> => {
  const { userId } = req.params;
  const { clientId } = req.body;
  if (!clientId) {
    res.status(400).json({ error: "clientId is required" });
    return;
  }
  try {
    const [assignment] = await db
      .insert(userClientsTable)
      .values({ clerkUserId: userId, clientId: Number(clientId) })
      .onConflictDoNothing()
      .returning();
    if (!assignment) {
      res.status(400).json({ error: "Assignment already exists" });
      return;
    }
    res.status(201).json(serializeDates(assignment));
  } catch (err) {
    res.status(400).json({ error: "Failed to assign client" });
  }
});

router.delete("/admin/users/:userId/clients/:clientId", async (req, res): Promise<void> => {
  const { userId, clientId } = req.params;
  const [removed] = await db
    .delete(userClientsTable)
    .where(
      and(
        eq(userClientsTable.clerkUserId, userId),
        eq(userClientsTable.clientId, Number(clientId)),
      ),
    )
    .returning();
  if (!removed) {
    res.status(404).json({ error: "Assignment not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;
