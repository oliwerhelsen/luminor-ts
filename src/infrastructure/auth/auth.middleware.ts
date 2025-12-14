import type { Context, Next } from 'hono';
import { Container } from '../../core/container.js';
import { AuthService, type JwtPayload } from './auth.service.js';

export interface AuthContext extends Context {
  user?: JwtPayload;
}

export function authMiddleware() {
  return async (c: Context, next: Next) => {
    try {
      const authService = Container.get<AuthService>('AuthService');
      const authHeader = c.req.header('Authorization');
      const token = authService.extractTokenFromHeader(authHeader);

      if (!token) {
        return c.json({ error: { message: 'Unauthorized' } }, 401);
      }

      const payload = authService.verifyToken(token);
      (c as AuthContext).user = payload;

      await next();
    } catch (error) {
      return c.json({ error: { message: 'Unauthorized' } }, 401);
    }
  };
}

