import { Router } from 'express';
import { db } from '@workspace/db';
import { conversations, contacts, deals, messages } from '@workspace/db';
import { eq, and, count, sql, desc } from 'drizzle-orm';
import { requireAuth } from '../middlewares/auth.js';

const router = Router();

// GET /api/analytics/dashboard-stats
router.get('/dashboard-stats', requireAuth, async (req, res) => {
  try {
    const orgId = req.organizationId;

    const [{ total: totalConversations }] = await db
      .select({ total: count() })
      .from(conversations)
      .where(eq(conversations.organizationId, orgId));

    const [{ total: openConversations }] = await db
      .select({ total: count() })
      .from(conversations)
      .where(and(eq(conversations.organizationId, orgId), eq(conversations.status, 'open')));

    const [{ total: resolvedToday }] = await db
      .select({ total: count() })
      .from(conversations)
      .where(and(
        eq(conversations.organizationId, orgId),
        eq(conversations.status, 'resolved'),
        sql`DATE(${conversations.updatedAt}) = CURRENT_DATE`
      ));

    const [{ total: totalContacts }] = await db
      .select({ total: count() })
      .from(contacts)
      .where(eq(contacts.organizationId, orgId));

    const [{ totalValue }] = await db
      .select({ totalValue: sql<string>`COALESCE(SUM(${deals.value}), 0)` })
      .from(deals)
      .where(eq(deals.organizationId, orgId));

    const [{ aiCount }] = await db
      .select({ aiCount: count() })
      .from(conversations)
      .where(and(eq(conversations.organizationId, orgId), eq(conversations.aiHandled, true)));

    const aiHandledPercent = Number(totalConversations) > 0
      ? Math.round((Number(aiCount) / Number(totalConversations)) * 100)
      : 0;

    // Recent activity
    const recentConvs = await db
      .select({
        id: conversations.id,
        status: conversations.status,
        createdAt: conversations.createdAt,
        contactFirstName: contacts.firstName,
        contactLastName: contacts.lastName,
      })
      .from(conversations)
      .leftJoin(contacts, eq(conversations.contactId, contacts.id))
      .where(eq(conversations.organizationId, orgId))
      .orderBy(desc(conversations.createdAt))
      .limit(10);

    const recentActivity = recentConvs.map((c) => ({
      id: c.id,
      description: `${c.status === 'open' ? 'New conversation' : `Conversation ${c.status}`}${c.contactFirstName ? ` with ${c.contactFirstName} ${c.contactLastName}` : ''}`,
      actorName: c.contactFirstName ? `${c.contactFirstName} ${c.contactLastName}` : null,
      createdAt: c.createdAt,
    }));

    res.json({
      totalConversations: Number(totalConversations),
      openConversations: Number(openConversations),
      resolvedToday: Number(resolvedToday),
      avgResponseTime: 5,
      aiHandledPercent,
      totalContacts: Number(totalContacts),
      totalDealsValue: Number(totalValue),
      recentActivity,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/analytics/conversations
router.get('/conversations', requireAuth, async (req, res) => {
  try {
    res.json({ data: [] });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Internal server error' }); }
});

// GET /api/analytics/agent-performance
router.get('/agent-performance', requireAuth, async (req, res) => {
  try {
    res.json({ data: [] });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Internal server error' }); }
});

export default router;
