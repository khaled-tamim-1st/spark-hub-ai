import { Router } from 'express';
import { db } from '@workspace/db';
import { users } from '@workspace/db';
import { eq, and, desc } from 'drizzle-orm';
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
    const rows = await db.select(publicFields).from(users)
      .where(and(eq(users.organizationId, req.organizationId), eq(users.isActive, true)))
      .orderBy(desc(users.createdAt));
    res.json(rows);
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
    if (!email || !password || !firstName || !lastName) {
      res.status(400).json({ error: 'All fields are required' }); return;
    }
    const [row] = await db.insert(users).values({
      organizationId: req.organizationId,
      email: String(email).toLowerCase(),
      passwordHash: hashPassword(String(password)),
      firstName: String(firstName),
      lastName: String(lastName),
      role: String(role),
    }).returning();
    const { passwordHash: _, ...safe } = row;
    res.status(201).json(safe);
  } catch (err: any) {
    console.error(err);
    if (err?.code === '23505') { res.status(409).json({ error: 'Email already in use' }); return; }
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
