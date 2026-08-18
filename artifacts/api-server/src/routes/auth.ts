import { Router } from 'express';
import { db } from '@workspace/db';
import { users, organizations } from '@workspace/db';
import { eq } from 'drizzle-orm';
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

function verifyPassword(pw: string, stored: string): boolean {
  const [h, s] = stored.split('.');
  if (!h || !s) return false;
  try {
    return timingSafeEqual(Buffer.from(h, 'hex'), scryptSync(pw, s, 64) as Buffer);
  } catch {
    return false;
  }
}

async function signToken(userId: number, orgId: number, role: string): Promise<string> {
  return new SignJWT({ sub: String(userId), organizationId: orgId, role })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
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
    const { email, password } = req.body ?? {};
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

    // Check organization status if not superadmin
    let org = null;
    if (user.organizationId) {
      const [o] = await db.select().from(organizations).where(eq(organizations.id, user.organizationId)).limit(1);
      org = o;
      if (user.role !== 'superadmin' && org && org.status === 'suspended') {
        res.status(403).json({ error: 'Your organization account is suspended. Please contact platform support.' });
        return;
      }
    }

    const accessToken = await signToken(user.id, user.organizationId, user.role);
    res.json({
      accessToken,
      user: {
        id: user.id, email: user.email,
        firstName: user.firstName, lastName: user.lastName,
        role: user.role, avatarUrl: user.avatarUrl,
        organizationId: user.organizationId,
        organization: org,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, organizationName } = req.body ?? {};
    if (!email || !password || !firstName || !lastName) {
      res.status(400).json({ error: 'All fields are required' });
      return;
    }
    const [existing] = await db.select({ id: users.id }).from(users)
      .where(eq(users.email, String(email).toLowerCase())).limit(1);
    if (existing) {
      res.status(409).json({ error: 'Email already in use' });
      return;
    }
    const orgName = organizationName || `${firstName}'s Workspace`;
    const slug = orgName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      + '-' + Math.random().toString(36).slice(2, 7);
    const [org] = await db.insert(organizations).values({ 
      name: orgName, 
      slug,
      plan: 'free',
      status: 'active',
      maxUsers: 5,
      maxChannels: 2,
      aiEnabled: true,
    }).returning();
    const [user] = await db.insert(users).values({
      organizationId: org.id,
      email: String(email).toLowerCase(),
      passwordHash: hashPassword(String(password)),
      firstName: String(firstName),
      lastName: String(lastName),
      role: 'owner',
    }).returning();
    const accessToken = await signToken(user.id, org.id, user.role);
    res.status(201).json({
      accessToken,
      user: {
        id: user.id, email: user.email,
        firstName: user.firstName, lastName: user.lastName,
        role: user.role, avatarUrl: user.avatarUrl,
        organizationId: user.organizationId,
        organization: org,
      },
    });
  } catch (err: any) {
    console.error(err);
    if (err?.code === '23505') {
      res.status(409).json({ error: 'Email already in use' });
      return;
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/auth/me
router.get('/me', async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer ')) { res.status(401).json({ error: 'Unauthorized' }); return; }
    const { payload } = await jwtVerify(auth.slice(7), JWT_SECRET);
    const userId = Number(payload.sub);
    const [user] = await db.select(userPublicFields).from(users)
      .where(eq(users.id, userId)).limit(1);
    if (!user) { res.status(404).json({ error: 'User not found' }); return; }
    
    let org = null;
    if (user.organizationId) {
      const [o] = await db.select().from(organizations).where(eq(organizations.id, user.organizationId)).limit(1);
      org = o;
    }

    res.json({ ...user, organization: org });
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
    const [user] = await db.select({ role: users.role, organizationId: users.organizationId })
      .from(users).where(eq(users.id, userId)).limit(1);
    if (!user) { res.status(404).json({ error: 'User not found' }); return; }
    res.json({ accessToken: await signToken(userId, user.organizationId, user.role) });
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
});

export default router;
