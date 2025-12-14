import type { Context } from 'hono';
import type { SessionContext } from './better-auth.middleware.js';

/**
 * Hono context with Better Auth session
 * Use this type for your route handlers when you need session data
 *
 * @example
 * ```typescript
 * import type { AuthContext } from 'brewy';
 *
 * app.get('/profile', (c: AuthContext) => {
 *   const user = c.get('user');
 *   if (!user) {
 *     return c.json({ error: 'Not authenticated' }, 401);
 *   }
 *   return c.json({ user });
 * });
 * ```
 */
export type AuthContext = Context<{
  Variables: SessionContext;
}>;

/**
 * Re-export session types for convenience
 */
export type { SessionContext } from './better-auth.middleware.js';
