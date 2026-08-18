import { Router } from 'express';
import { db } from '@workspace/db';
import { users, organizations, organizationMembers, aiSettings } from '@workspace/db';
import { eq, and, sql } from 'drizzle-orm';
import { SignJWT, jwtVerify } from 'jose';
import { scryptSync, randomBytes, timingSafeEqual } from 'crypto';

const router = Router();

const JWT_SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET || process.env.JWT_SECRET || 'default-secret-change-me-in-production'
);

function hashPassword(pw: string): string {
  const salt = randomBytes(16).toString('hex');
  return scryptSync(pw, salt, 64).toString('hex') + '.' + salt;
}

function verifyPassword(pw: string, hash: string): boolean {
  const [storedHash, salt] = hash.split('.');
  if (!storedHash || !salt) return false;
  const computed = scryptSync(pw, salt, 64);
  const stored = Buffer.from(storedHash, 'hex');
  return stored.length === computed.length && timingSafeEqual(stored, computed);
}

export async function signToken(userId: number, orgId: number, role: string) {
  return new SignJWT({ sub: String(userId), organizationId: orgId, role })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

async function getUserOrganizations(userId: number, isSuperAdmin: boolean) {
  if (isSuperAdmin) {
    const allOrgs = await db.select().from(organizations);
    return allOrgs.map(o => ({
      id: o.id,
      name: o.name,
      slug: o.slug,
      logoUrl: o.logoUrl,
      plan: o.plan,
      status: o.status,
      role: 'superadmin',
    }));
  }

  let list = await db.select({
    id: organizations.id,
    name: organizations.name,
    slug: organizations.slug,
    logoUrl: organizations.logoUrl,
    plan: organizations.plan,
    status: organizations.status,
    role: organizationMembers.role,
  })
  .from(organizationMembers)
  .innerJoin(organizations, eq(organizations.id, organizationMembers.organizationId))
  .where(eq(organizationMembers.userId, userId));

  if (list.length === 0) {
    const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (user && user.organizationId) {
      const [o] = await db.select().from(organizations).where(eq(organizations.id, user.organizationId)).limit(1);
      if (o) {
        list = [{
          id: o.id,
          name: o.name,
          slug: o.slug,
          logoUrl: o.logoUrl,
          plan: o.plan,
          status: o.status,
          role: user.role,
        }];
      }
    }
  }

  return list;
}

const userPublicFields = {
  id: users.id,
  email: users.email,
  firstName: users.firstName,
  lastName: users.lastName,
  role: users.role,
  avatarUrl: users.avatarUrl,
  organizationId: users.organizationId,
  createdAt: users.createdAt,
};

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password, organizationId } = req.body ?? {};
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }
    const [user] = await db.select().from(users)
      .where(eq(users.email, String(email).toLowerCase())).limit(1);
    if (!user || !verifyPassword(String(password), user.passwordHash)) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const isSuperAdmin = user.role === 'superadmin';
    const userOrgs = await getUserOrganizations(user.id, isSuperAdmin);

    // Determine active organization
    let activeOrg = organizationId 
      ? userOrgs.find(o => o.id === Number(organizationId))
      : userOrgs.find(o => o.id === user.organizationId) || userOrgs[0];

    if (!activeOrg && userOrgs.length > 0) {
      activeOrg = userOrgs[0];
    }

    const activeOrgId = activeOrg ? activeOrg.id : (user.organizationId || 1);
    const activeRole = isSuperAdmin ? 'superadmin' : (activeOrg?.role || user.role || 'agent');

    if (!isSuperAdmin && activeOrg && activeOrg.status === 'suspended') {
      res.status(403).json({ error: 'This organization account is currently suspended. Please contact platform support.' });
      return;
    }

    const accessToken = await signToken(user.id, activeOrgId, activeRole);

    res.json({
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: activeRole,
        avatarUrl: user.avatarUrl,
        organizationId: activeOrgId,
        organization: activeOrg || null,
      },
      organizations: userOrgs,
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/auth/switch-org - Switch active company/organization
router.post('/switch-org', async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const { payload } = await jwtVerify(auth.slice(7), JWT_SECRET);
    const userId = Number(payload.sub);
    const targetOrgId = Number(req.body.organizationId);

    if (!targetOrgId || Number.isNaN(targetOrgId)) {
      res.status(400).json({ error: 'organizationId is required' });
      return;
    }

    const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const isSuperAdmin = user.role === 'superadmin';
    const userOrgs = await getUserOrganizations(userId, isSuperAdmin);

    const targetOrg = userOrgs.find(o => o.id === targetOrgId);
    if (!targetOrg) {
      res.status(403).json({ error: 'You are not a member of this company' });
      return;
    }

    if (!isSuperAdmin && targetOrg.status === 'suspended') {
      res.status(403).json({ error: 'This company account is currently suspended.' });
      return;
    }

    const targetRole = isSuperAdmin ? 'superadmin' : (targetOrg.role || 'agent');
    const accessToken = await signToken(user.id, targetOrg.id, targetRole);

    res.json({
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: targetRole,
        avatarUrl: user.avatarUrl,
        organizationId: targetOrg.id,
        organization: targetOrg,
      },
      organizations: userOrgs,
    });
  } catch (err) {
    console.error('Switch org error:', err);
    res.status(401).json({ error: 'Invalid or expired session' });
  }
});

// POST /api/auth/register - Closed self-registration
router.post('/register', async (_req, res) => {
  res.status(403).json({
    error: 'Self-registration is closed. Please contact the platform administrator to provision your company account.',
  });
});

// GET /api/auth/me
router.get('/me', async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer ')) { res.status(401).json({ error: 'Unauthorized' }); return; }
    const { payload } = await jwtVerify(auth.slice(7), JWT_SECRET);
    const userId = Number(payload.sub);
    const currentOrgId = Number(payload.organizationId) || 1;
    const currentRole = String(payload.role || 'agent');

    const [user] = await db.select(userPublicFields).from(users)
      .where(eq(users.id, userId)).limit(1);
    if (!user) { res.status(404).json({ error: 'User not found' }); return; }
    
    const isSuperAdmin = user.role === 'superadmin';
    const userOrgs = await getUserOrganizations(userId, isSuperAdmin);

    let activeOrg = userOrgs.find(o => o.id === currentOrgId) || userOrgs[0] || null;

    res.json({
      ...user,
      role: isSuperAdmin ? 'superadmin' : currentRole,
      organizationId: activeOrg ? activeOrg.id : currentOrgId,
      organization: activeOrg,
      organizations: userOrgs,
    });
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// POST /api/auth/refresh
router.post('/refresh', async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer ')) { res.status(401).json({ error: 'Unauthorized' }); return; }
    const { payload } = await jwtVerify(auth.slice(7), JWT_SECRET);
    const userId = Number(payload.sub);
    const orgId = Number(payload.organizationId) || 1;
    const role = String(payload.role || 'agent');

    res.json({ accessToken: await signToken(userId, orgId, role) });
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
});

export default router;
