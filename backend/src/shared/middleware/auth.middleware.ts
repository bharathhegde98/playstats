import { Context, Next } from 'hono';
import { eq } from 'drizzle-orm';
import { supabaseAdmin } from '../utils/supabase.client';
import { UnauthorizedError } from '../utils/errors';
import { logger } from '../utils/logger';
import { db } from '../../db/client';
import { users } from '../../db/schema';

export interface AuthContext {
  userId: string;
  email?: string;
  role?: string;
}

export const authMiddleware = async (c: Context, next: Next) => {
  try {
    // Get token from Authorization header
    const authHeader = c.req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Missing or invalid authorization header');
    }

    const token = authHeader.substring(7);

    // Verify token with Supabase
    const {
      data: { user },
      error,
    } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      logger.warn('Authentication failed', { error: error?.message });
      throw new UnauthorizedError('Invalid or expired token');
    }

    // Resolve local user id from authUserId (Supabase UUID != local users.id)
    const localUser = await db.query.users.findFirst({
      where: eq(users.authUserId, user.id),
      columns: { id: true, role: true },
    });

    if (!localUser) {
      logger.warn('Local user not found for authUserId', { authUserId: user.id });
      throw new UnauthorizedError('User account not found');
    }

    // Attach local user info to context
    c.set('auth', {
      userId: localUser.id,
      email: user.email,
      role: localUser.role,
    } as AuthContext);

    await next();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw error;
    }
    logger.error('Authentication middleware error', error);
    throw new UnauthorizedError('Authentication failed');
  }
};

// Optional auth - doesn't throw if no token
export const optionalAuthMiddleware = async (c: Context, next: Next) => {
  try {
    const authHeader = c.req.header('Authorization');

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);

      const {
        data: { user },
      } = await supabaseAdmin.auth.getUser(token);

      if (user) {
        const localUser = await db.query.users.findFirst({
          where: eq(users.authUserId, user.id),
          columns: { id: true, role: true },
        });

        if (localUser) {
          c.set('auth', {
            userId: localUser.id,
            email: user.email,
            role: localUser.role,
          } as AuthContext);
        }
      }
    }
  } catch (error) {
    logger.debug('Optional auth failed, continuing without auth', error);
  }

  await next();
};
