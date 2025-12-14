import type { Context, MiddlewareHandler } from 'hono';

/**
 * Request ID middleware
 * Adds a unique request ID to each request for tracking and logging
 */
export function requestIdMiddleware(headerName: string = 'X-Request-ID'): MiddlewareHandler {
  return async (c: Context, next) => {
    // Check if request already has an ID
    let requestId = c.req.header(headerName);
    
    // Generate new ID if not present
    if (!requestId) {
      requestId = generateRequestId();
    }
    
    // Store in context for use in handlers
    c.set('requestId', requestId);
    
    // Set response header
    c.header(headerName, requestId);
    
    await next();
  };
}

function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}
