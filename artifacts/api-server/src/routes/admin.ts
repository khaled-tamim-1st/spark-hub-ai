import { Router } from 'express';
import { db } from '@workspace/db';
import { organizations, users, conversations, messages, channels } from '@workspace/db';
import { eq, desc, ilike, sql, and } from 'drizzle-orm';
import { scryptSync, randomBytes } from 'crypto';
import { requireAuth, requireSuperAdmin } from '../middlewares/auth.js';

const router = Router();

function hashPassword(pw: string): string {
  const salt = randomBytes(16).toString('hex');
  return scryptSync(pw, salt, 64).toString('hex') + '.' + salt;
}

// Protect all admin routes with auth and superadmin check
router.use(requireAuth);
router.use(requireSuperAdmin);

// GET /api/admin/metrics - Global SaaS Metrics
router.get('/metrics', async (req, res) => {
  try {
    const [allOrgs] = await db.select({ count: sql<number>`count(*)::int` }).from(organizations);
    const [activeOrgs] = await db.select({ count: sql<number>`count(*)::int` })
      .from(organizations).where(eq(organizations.status, 'active'));
    const [suspendedOrgs] = await db.select({ count: sql<number>`count(*)::int` })
      .from(organizations).where(eq(organizations.status, 'suspended'));
    
    const [allUsers] = await db.select({ count: sql<number>`count(*)::int` }).from(users);
    const [allConversations] = await db.select({ count: sql<number>`count(*)::int` }).from(conversations);
    const [allMessages] = await db.select({ count: sql<number>`count(*)::int` }).from(messages);
    const [allChannels] = await db.select({ count: sql<number>`count(*)::int` }).from(channels);

    // Plan distribution
    const planCounts = await db.select({
      plan: organizations.plan,
      count: sql<number>`count(*)::int`,
    }).from(organizations).groupBy(organizations.plan);

    res.json({
      totalOrganizations: allOrgs?.count ?? 0,
      activeOrganizations: activeOrgs?.count ?? 0,
      suspendedOrganizations: suspendedOrgs?.count ?? 0,
      totalUsers: allUsers?.count ?? 0,
      totalConversations: allConversations?.count ?? 0,
      totalMessages: allMessages?.count ?? 0,
      totalChannels: allChannels?.count ?? 0,
      planDistribution: planCounts,
    });
  } catch (err) {
    console.error('Admin metrics error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/admin/organizations - List all tenant companies
router.get('/organizations', async (req, res) => {
  try {
    const { search, status, plan, page = '1', limit = '50' } = req.query as Record<string, string>;
    
    const conditions = [];
    if (search) {
      conditions.push(ilike(organizations.name, `%${search}%`));
    }
    if (status && status !== 'all') {
      conditions.push(eq(organizations.status, status));
    }
    if (plan && plan !== 'all') {
      conditions.push(eq(organizations.plan, plan));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const orgRows = await db.select()
      .from(organizations)
      .where(whereClause)
      .orderBy(desc(organizations.createdAt))
      .limit(Number(limit))
      .offset((Number(page) - 1) * Number(limit));

    // Enrich with statistics for each organization
    const enriched = await Promise.all(
      orgRows.map(async (org) => {
        const [userCount] = await db.select({ count: sql<number>`count(*)::int` })
          .from(users).where(eq(users.organizationId, org.id));
        const [convCount] = await db.select({ count: sql<number>`count(*)::int` })
          .from(conversations).where(eq(conversations.organizationId, org.id));
        const [chanCount] = await db.select({ count: sql<number>`count(*)::int` })
          .from(channels).where(eq(channels.organizationId, org.id));
        const [owner] = await db.select({
          id: users.id,
          firstName: users.firstName,
          lastName: users.lastName,
          email: users.email,
        }).from(users)
          .where(and(eq(users.organizationId, org.id), eq(users.role, 'owner')))
          .limit(1);

        return {
          ...org,
          userCount: userCount?.count ?? 0,
          conversationCount: convCount?.count ?? 0,
          channelCount: chanCount?.count ?? 0,
          owner: owner ?? null,
        };
      })
    );

    res.json(enriched);
  } catch (err) {
    console.error('Admin list organizations error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/admin/organizations - Create tenant company & owner
router.post('/organizations', async (req, res) => {
  try {
    const { 
      name, 
      plan = 'starter', 
      status = 'active', 
      maxUsers = 5, 
      maxChannels = 2, 
      aiEnabled = true, 
      notes,
      ownerFirstName,
      ownerLastName,
      ownerEmail,
      ownerPassword,
    } = req.body ?? {};

    if (!name || !ownerEmail || !ownerPassword || !ownerFirstName || !ownerLastName) {
      res.status(400).json({ error: 'Organization name and owner credentials are required' });
      return;
    }

    // Check if email already exists
    const [existingUser] = await db.select({ id: users.id })
      .from(users).where(eq(users.email, String(ownerEmail).toLowerCase())).limit(1);
    if (existingUser) {
      res.status(409).json({ error: 'Owner email is already registered' });
      return;
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      + '-' + Math.random().toString(36).slice(2, 7);

    const [org] = await db.insert(organizations).values({
      name: String(name),
      slug,
      plan: String(plan),
      status: String(status),
      maxUsers: Number(maxUsers) || 5,
      maxChannels: Number(maxChannels) || 2,
      aiEnabled: Boolean(aiEnabled),
      notes: notes ? String(notes) : undefined,
    }).returning();

    const [owner] = await db.insert(users).values({
      organizationId: org.id,
      email: String(ownerEmail).toLowerCase(),
      passwordHash: hashPassword(String(ownerPassword)),
      firstName: String(ownerFirstName),
      lastName: String(ownerLastName),
      role: 'owner',
    }).returning();

    const { passwordHash: _, ...safeOwner } = owner;
    res.status(201).json({ organization: org, owner: safeOwner });
  } catch (err: any) {
    console.error('Admin create organization error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/admin/organizations/:id - Detail view
router.get('/organizations/:id', async (req, res) => {
  try {
    const orgId = Number(req.params.id);
    const [org] = await db.select().from(organizations).where(eq(organizations.id, orgId)).limit(1);
    if (!org) {
      res.status(404).json({ error: 'Organization not found' });
      return;
    }

    const orgUsers = await db.select({
      id: users.id,
      email: users.email,
      firstName: users.firstName,
      lastName: users.lastName,
      role: users.role,
      isActive: users.isActive,
      createdAt: users.createdAt,
    }).from(users).where(eq(users.organizationId, orgId)).orderBy(desc(users.createdAt));

    const orgChannels = await db.select().from(channels).where(eq(channels.organizationId, orgId));

    res.json({
      ...org,
      users: orgUsers,
      channels: orgChannels,
    });
  } catch (err) {
    console.error('Admin get organization error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/admin/organizations/:id - Update plan, limits, status
router.patch('/organizations/:id', async (req, res) => {
  try {
    const orgId = Number(req.params.id);
    const [existing] = await db.select({ id: organizations.id }).from(organizations)
      .where(eq(organizations.id, orgId)).limit(1);
    if (!existing) {
      res.status(404).json({ error: 'Organization not found' });
      return;
    }

    const { name, plan, status, maxUsers, maxChannels, aiEnabled, notes, website, logoUrl } = req.body ?? {};

    const [updated] = await db.update(organizations).set({
      ...(name && { name: String(name) }),
      ...(plan && { plan: String(plan) }),
      ...(status && { status: String(status) }),
      ...(maxUsers !== undefined && { maxUsers: Number(maxUsers) }),
      ...(maxChannels !== undefined && { maxChannels: Number(maxChannels) }),
      ...(aiEnabled !== undefined && { aiEnabled: Boolean(aiEnabled) }),
      ...(notes !== undefined && { notes: notes ? String(notes) : null }),
      ...(website !== undefined && { website: website ? String(website) : null }),
      ...(logoUrl !== undefined && { logoUrl: logoUrl ? String(logoUrl) : null }),
      updatedAt: new Date(),
    }).where(eq(organizations.id, orgId)).returning();

    res.json(updated);
  } catch (err) {
    console.error('Admin update organization error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/admin/organizations/:id - Delete tenant organization
router.delete('/organizations/:id', async (req, res) => {
  try {
    const orgId = Number(req.params.id);
    const [existing] = await db.select({ id: organizations.id }).from(organizations)
      .where(eq(organizations.id, orgId)).limit(1);
    if (!existing) {
      res.status(404).json({ error: 'Organization not found' });
      return;
    }

    await db.delete(organizations).where(eq(organizations.id, orgId));
    res.status(204).send();
  } catch (err) {
    console.error('Admin delete organization error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
