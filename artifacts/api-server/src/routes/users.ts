import { Router } from 'express';
import { db, users, organizations, organizationMembers } from '@workspace/db';
import { eq, and, desc, sql } from 'drizzle-orm';
import { scryptSync, randomBytes } from 'crypto';
import { requireAuth } from '../middlewares/auth.js';

const router = Router();

function hashPassword(pw: string): string {
  const salt = randomBytes(16).toString('hex');
  return scryptSync(pw, salt, 64).toString('hex') + '.' + salt;
}

const publicFields = {
  id: users.id, email: users.email, firstName: users.firstName,
  lastName: users.lastName, role: users.role, avatarUrl: users.avatarUrl,
  isActive: users.isActive, organizationId: users.organizationId, createdAt: users.createdAt,
};

router.get('/', requireAuth, async (req, res) => {
  try {
    const directUsers = await db.select(publicFields).from(users)
      .where(and(eq(users.organizationId, req.organizationId), eq(users.isActive, true)))
      .orderBy(desc(users.createdAt));

    const memberRows = await db.select({
      id: users.id,
      email: users.email,
      firstName: users.firstName,
      lastName: users.lastName,
      role: organizationMembers.role,
      avatarUrl: users.avatarUrl,
      isActive: users.isActive,
      organizationId: organizationMembers.organizationId,
      createdAt: organizationMembers.createdAt,
    })
    .from(organizationMembers)
    .innerJoin(users, eq(users.id, organizationMembers.userId))
    .where(and(eq(organizationMembers.organizationId, req.organizationId), eq(users.isActive, true)));

    const map = new Map<number, any>();
    for (const u of directUsers) map.set(u.id, u);
    for (const m of memberRows) map.set(m.id, { ...m });

    res.json(Array.from(map.values()));
  } catch (err) { console.error(err); res.status(500).json({ error: 'Internal server error' }); }
});

router.get('/:id', requireAuth, async (req, res) => {
  try {
    const [row] = await db.select(publicFields).from(users)
      .where(and(eq(users.id, Number(req.params.id)), eq(users.organizationId, req.organizationId)))
      .limit(1);
    if (!row) { res.status(404).json({ error: 'Not found' }); return; }
    res.json(row);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Internal server error' }); }
});

router.post('/', requireAuth, async (req, res) => {
  try {
    const { email, password, firstName, lastName, role = 'agent' } = req.body ?? {};
    if (!email || !firstName || !lastName) {
      res.status(400).json({ error: 'First name, last name, and email are required' }); return;
    }

    const cleanEmail = String(email).trim().toLowerCase();

    // Check organization user limits
    const [org] = await db.select({ maxUsers: organizations.maxUsers })
      .from(organizations)
      .where(eq(organizations.id, req.organizationId))
      .limit(1);

    const [currentMembersCount] = await db.select({ count: sql<number>`count(*)::int` })
      .from(organizationMembers)
      .where(eq(organizationMembers.organizationId, req.organizationId));

    if (org && (currentMembersCount?.count ?? 0) >= org.maxUsers) {
      res.status(400).json({ 
        error: `User limit of ${org.maxUsers} reached for this company. Please upgrade the subscription plan.` 
      });
      return;
    }

    // Check if user exists globally
    const [existingUser] = await db.select().from(users)
      .where(eq(users.email, cleanEmail)).limit(1);

    let targetUserId: number;
    let finalUser: any;

    if (existingUser) {
      targetUserId = existingUser.id;
      finalUser = existingUser;
    } else {
      const userPw = password || 'User@123456';
      const [newUser] = await db.insert(users).values({
        organizationId: req.organizationId,
        email: cleanEmail,
        passwordHash: hashPassword(String(userPw)),
        firstName: String(firstName).trim(),
        lastName: String(lastName).trim(),
        role: String(role),
      }).returning();
      targetUserId = newUser.id;
      finalUser = newUser;
    }

    // Upsert into organization_members
    await db.execute(sql`
      INSERT INTO organization_members (organization_id, user_id, role)
      VALUES (${req.organizationId}, ${targetUserId}, ${String(role)})
      ON CONFLICT (organization_id, user_id)
      DO UPDATE SET role = EXCLUDED.role;
    `);

    const { passwordHash: _, ...safe } = finalUser;
    res.status(201).json({ ...safe, role: String(role) });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.patch('/:id', requireAuth, async (req, res) => {
  try {
    const [existing] = await db.select({ id: users.id }).from(users)
      .where(and(eq(users.id, Number(req.params.id)), eq(users.organizationId, req.organizationId))).limit(1);
    if (!existing) { res.status(404).json({ error: 'Not found' }); return; }
    const { firstName, lastName, role, isActive } = req.body ?? {};
    const [row] = await db.update(users).set({
      ...(firstName && { firstName: String(firstName) }),
      ...(lastName && { lastName: String(lastName) }),
      ...(role && { role: String(role) }),
      ...(isActive !== undefined && { isActive: Boolean(isActive) }),
      updatedAt: new Date(),
    }).where(eq(users.id, Number(req.params.id))).returning();
    const { passwordHash: _, ...safe } = row;
    res.json(safe);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Internal server error' }); }
});

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const [existing] = await db.select({ id: users.id, role: users.role }).from(users)
      .where(and(eq(users.id, Number(req.params.id)), eq(users.organizationId, req.organizationId))).limit(1);
    if (!existing) { res.status(404).json({ error: 'Not found' }); return; }
    if (existing.role === 'owner') { res.status(403).json({ error: 'Cannot remove owner' }); return; }
    // Soft delete
    await db.update(users).set({ isActive: false, updatedAt: new Date() })
      .where(eq(users.id, Number(req.params.id)));
    res.status(204).send();
  } catch (err) { console.error(err); res.status(500).json({ error: 'Internal server error' }); }
});

export default router;
