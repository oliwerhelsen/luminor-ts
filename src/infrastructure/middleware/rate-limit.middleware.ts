import type { Context, MiddlewareHandler } from 'hono';

export interface RateLimitOptions {
  windowMs?: number;
  maxRequests?: number;
  keyGenerator?: (c: Context) => string;
  handler?: (c: Context) => Response | Promise<Response>;
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const store = new Map<string, RateLimitEntry>();

/**
 * Rate limiting middleware
 * Limits the number of requests from a client within a time window
 */
export function rateLimitMiddleware(options?: RateLimitOptions): MiddlewareHandler {
  const windowMs = options?.windowMs || 15 * 60 * 1000; // 15 minutes default
  const maxRequests = options?.maxRequests || 100; // 100 requests default
  const keyGenerator = options?.keyGenerator || defaultKeyGenerator;
  const handler = options?.handler || defaultHandler;

  // Clean up expired entries periodically
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store.entries()) {
      if (entry.resetTime < now) {
        store.delete(key);
      }
    }
  }, windowMs);

  return async (c: Context, next) => {
    const key = keyGenerator(c);
    const now = Date.now();
    
    let entry = store.get(key);
    
    // Create or reset entry if expired
    if (!entry || entry.resetTime < now) {
      entry = {
        count: 0,
        resetTime: now + windowMs,
      };
      store.set(key, entry);
    }
    
    entry.count++;
    
    // Set rate limit headers
    c.header('X-RateLimit-Limit', maxRequests.toString());
    c.header('X-RateLimit-Remaining', Math.max(0, maxRequests - entry.count).toString());
    c.header('X-RateLimit-Reset', new Date(entry.resetTime).toISOString());
    
    // Check if rate limit exceeded
    if (entry.count > maxRequests) {
      return handler(c);
    }
    
    await next();
  };
}

function defaultKeyGenerator(c: Context): string {
  // Use IP address as key (in production, consider using authenticated user ID)
  return c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || 'unknown';
}

function defaultHandler(c: Context): Response {
  return c.json(
    {
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests, please try again later',
      },
    },
    429
  );
}
