import { Router } from 'express';
import { db } from '@workspace/db';
import { contacts } from '@workspace/db';
import { eq, and, or, ilike, desc } from 'drizzle-orm';
import { requireAuth } from '../middlewares/auth.js';

const router = Router();

// GET /api/contacts
router.get('/', requireAuth, async (req, res) => {
  try {
    const { search, page = '1', limit = '50' } = req.query as Record<string, string>;
    const orgId = req.organizationId;
    const where = search
      ? and(eq(contacts.organizationId, orgId), or(
          ilike(contacts.firstName, `%${search}%`),
          ilike(contacts.lastName, `%${search}%`),
          ilike(contacts.email, `%${search}%`),
        ))
      : eq(contacts.organizationId, orgId);
    const rows = await db.select().from(contacts)
      .where(where)
      .orderBy(desc(contacts.createdAt))
      .limit(Number(limit))
      .offset((Number(page) - 1) * Number(limit));
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/contacts/:id
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const [row] = await db.select().from(contacts)
      .where(and(eq(contacts.id, Number(req.params.id)), eq(contacts.organizationId, req.organizationId)))
      .limit(1);
    if (!row) { res.status(404).json({ error: 'Not found' }); return; }
    res.json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/contacts
router.post('/', requireAuth, async (req, res) => {
  try {
    const { firstName, lastName, email, phone, companyName, companyId, avatarUrl } = req.body ?? {};
    if (!firstName || !lastName) {
      res.status(400).json({ error: 'First name and last name are required' });
      return;
    }
    const [row] = await db.insert(contacts).values({
      organizationId: req.organizationId,
      firstName: String(firstName),
      lastName: String(lastName),
      email: email ? String(email) : undefined,
      phone: phone ? String(phone) : undefined,
      companyName: companyName ? String(companyName) : undefined,
      companyId: companyId ? Number(companyId) : undefined,
      avatarUrl: avatarUrl ? String(avatarUrl) : undefined,
    }).returning();
    res.status(201).json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/contacts/:id
router.patch('/:id', requireAuth, async (req, res) => {
  try {
    const { firstName, lastName, email, phone, companyName, avatarUrl } = req.body ?? {};
    const [existing] = await db.select({ id: contacts.id }).from(contacts)
      .where(and(eq(contacts.id, Number(req.params.id)), eq(contacts.organizationId, req.organizationId)))
      .limit(1);
    if (!existing) { res.status(404).json({ error: 'Not found' }); return; }
    const [row] = await db.update(contacts).set({
      ...(firstName && { firstName: String(firstName) }),
      ...(lastName && { lastName: String(lastName) }),
      ...(email !== undefined && { email: String(email) }),
      ...(phone !== undefined && { phone: String(phone) }),
      ...(companyName !== undefined && { companyName: String(companyName) }),
      ...(avatarUrl !== undefined && { avatarUrl: String(avatarUrl) }),
      updatedAt: new Date(),
    }).where(eq(contacts.id, Number(req.params.id))).returning();
    res.json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/contacts/:id
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const [existing] = await db.select({ id: contacts.id }).from(contacts)
      .where(and(eq(contacts.id, Number(req.params.id)), eq(contacts.organizationId, req.organizationId)))
      .limit(1);
    if (!existing) { res.status(404).json({ error: 'Not found' }); return; }
    await db.delete(contacts).where(eq(contacts.id, Number(req.params.id)));
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
