import type { MiddlewareHandler } from 'hono';
import { cors as honoCors } from 'hono/cors';

export interface CorsOptions {
  origin?: string | string[] | ((origin: string) => string | undefined | null);
  allowMethods?: string[];
  allowHeaders?: string[];
  maxAge?: number;
  credentials?: boolean;
  exposeHeaders?: string[];
}

/**
 * CORS middleware
 * Configures Cross-Origin Resource Sharing headers
 */
export function corsMiddleware(options?: CorsOptions): MiddlewareHandler {
  return honoCors(options as never);
}
