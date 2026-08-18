import type { Request, Response, NextFunction } from 'express';
import { jwtVerify } from 'jose';
import { db, organizations } from '@workspace/db';
import { eq } from 'drizzle-orm';

const JWT_SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET || process.env.JWT_SECRET || 'default-secret-change-me-in-production'
);

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      userId: number;
      organizationId: number;
      role: string;
    }
  }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  try {
    const { payload } = await jwtVerify(auth.slice(7), JWT_SECRET);
    req.userId = Number(payload.sub) || 1;
    const rawOrgId = (payload as Record<string, unknown>).organizationId;
    req.organizationId = (rawOrgId && !Number.isNaN(Number(rawOrgId)) && Number(rawOrgId) > 0) ? Number(rawOrgId) : 1;
    req.role = String((payload as Record<string, unknown>).role || 'agent');

    // If not superadmin, check if organization is suspended
    if (req.role !== 'superadmin' && req.organizationId) {
      const [org] = await db.select({ status: organizations.status })
        .from(organizations)
        .where(eq(organizations.id, req.organizationId))
        .limit(1);

      if (org && org.status === 'suspended') {
        res.status(403).json({ error: 'Your organization account is suspended. Please contact platform support.' });
        return;
      }
    }

    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

export function requireSuperAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.role !== 'superadmin') {
    res.status(403).json({ error: 'Forbidden: Super Admin access required' });
    return;
  }
  next();
}

export function requireOrgAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.role !== 'superadmin' && req.role !== 'owner' && req.role !== 'admin') {
    res.status(403).json({ error: 'Forbidden: Administrator privileges required' });
    return;
  }
  next();
}

