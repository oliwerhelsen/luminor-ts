import type { Context, Next } from 'hono';
import type { Auth } from './better-auth.config.js';

/**
 * Session context that will be available in Hono context variables
 */
export interface SessionContext {
  user: {
    id: string;
    email: string;
    name: string;
    emailVerified: boolean;
    image?: string | null;
    createdAt: Date;
    updatedAt: Date;
  } | null;
  session: {
    id: string;
    userId: string;
    expiresAt: Date;
    ipAddress?: string | null;
    userAgent?: string | null;
  } | null;
}

/**
 * Middleware to extract Better Auth session and inject into Hono context
 *
 * @example
 * ```typescript
 * // Global middleware
 * app.use('*', betterAuthMiddleware(auth));
 *
 * // In routes
 * app.get('/profile', (c) => {
 *   const user = c.get('user');
 *   if (!user) {
 *     return c.json({ error: 'Unauthorized' }, 401);
 *   }
 *   return c.json({ user });
 * });
 * ```
 */
export function betterAuthMiddleware(auth: Auth) {
  return async (c: Context, next: Next) => {
    const session = await auth.api.getSession({
      headers: c.req.raw.headers,
    });

    if (!session) {
      c.set('user', null);
      c.set('session', null);
    } else {
      c.set('user', session.user);
      c.set('session', session.session);
    }

    await next();
  };
}

/**
 * Middleware to protect routes - requires authentication
 *
 * @example
 * ```typescript
 * // Protect specific routes
 * app.use('/api/protected/*', requireAuth(auth));
 *
 * app.get('/api/protected/data', (c) => {
 *   const user = c.get('user'); // Guaranteed to be present
 *   return c.json({ data: 'secret', userId: user.id });
 * });
 * ```
 */
export function requireAuth(auth: Auth) {
  return async (c: Context, next: Next) => {
    const session = await auth.api.getSession({
      headers: c.req.raw.headers,
    });

    if (!session) {
      return c.json({ error: { message: 'Unauthorized' } }, 401);
    }

    c.set('user', session.user);
    c.set('session', session.session);

    await next();
  };
}
