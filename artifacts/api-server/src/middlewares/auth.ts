import type { Request, Response, NextFunction } from 'express';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET || 'default-secret-change-me-in-production'
);

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      userId: number;
      organizationId: number;
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
    req.userId = Number(payload.sub);
    req.organizationId = Number((payload as Record<string, unknown>).organizationId);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}
