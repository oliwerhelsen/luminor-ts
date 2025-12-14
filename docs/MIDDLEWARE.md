# Middleware Guide

Brewy provides built-in middleware and tools for creating custom middleware.

## Built-in Middleware

### Request ID Middleware

Adds a unique request ID to each request for tracking and logging.

```typescript
import { AppFactory, requestIdMiddleware } from 'brewy';

const app = AppFactory.create();

app.use('*', requestIdMiddleware());
// Or with custom header name
app.use('*', requestIdMiddleware('X-Trace-ID'));
```

The request ID is:
- Added to response headers as `X-Request-ID` (or custom name)
- Available in context: `c.get('requestId')`
- Useful for log correlation

### CORS Middleware

Configures Cross-Origin Resource Sharing headers.

```typescript
import { corsMiddleware } from 'brewy';

app.use('*', corsMiddleware({
  origin: '*', // Allow all origins
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400,
}));

// Restrict to specific origins
app.use('*', corsMiddleware({
  origin: ['https://example.com', 'https://app.example.com'],
}));

// Dynamic origin validation
app.use('*', corsMiddleware({
  origin: (origin) => {
    if (origin.endsWith('.example.com')) {
      return origin;
    }
    return undefined; // Reject
  },
}));
```

### Rate Limiting Middleware

Limits the number of requests from a client within a time window.

```typescript
import { rateLimitMiddleware } from 'brewy';

// Default: 100 requests per 15 minutes
app.use('*', rateLimitMiddleware());

// Custom configuration
app.use('/api/*', rateLimitMiddleware({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 10, // 10 requests per minute
}));

// Custom key generator (e.g., by user ID)
app.use('/api/*', rateLimitMiddleware({
  keyGenerator: (c) => {
    const userId = c.get('userId');
    return userId || c.req.header('x-forwarded-for') || 'unknown';
  },
}));

// Custom error handler
app.use('/api/*', rateLimitMiddleware({
  handler: (c) => {
    return c.json({
      error: {
        code: 'TOO_MANY_REQUESTS',
        message: 'Slow down! Try again in a minute.',
      },
    }, 429);
  },
}));
```

Response headers include:
- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Remaining requests in window
- `X-RateLimit-Reset`: When the window resets

### Validation Middleware

Validates request data using Zod schemas.

```typescript
import { validateJson, validateQuery, validateParam } from 'brewy';
import { z } from 'zod';

// Validate JSON body
const CreateUserDto = z.object({
  name: z.string(),
  email: z.string().email(),
});

app.post('/users', validateJson(CreateUserDto), async (c) => {
  const body = c.req.valid('json'); // Type-safe and validated
  return c.json(body);
});

// Validate query parameters
const SearchDto = z.object({
  q: z.string(),
  page: z.string().transform(Number),
});

app.get('/search', validateQuery(SearchDto), async (c) => {
  const query = c.req.valid('query');
  return c.json({ query: query.q, page: query.page });
});

// Validate route parameters
const UserIdDto = z.object({
  id: z.string().uuid(),
});

app.get('/users/:id', validateParam(UserIdDto), async (c) => {
  const { id } = c.req.valid('param');
  return c.json({ id });
});
```

### Logging Middleware

Logs HTTP requests and responses.

```typescript
import { loggingMiddleware, Logger, LogLevel } from 'brewy';

// Basic usage
app.use('*', loggingMiddleware());

// Custom logger
const logger = new Logger(LogLevel.DEBUG);
app.use('*', loggingMiddleware(logger));
```

Logs include:
- Request method, path, query
- Response status, duration
- Request ID (if using requestIdMiddleware)

## Creating Custom Middleware

### Basic Middleware

```typescript
import type { MiddlewareHandler } from 'hono';

export function myMiddleware(): MiddlewareHandler {
  return async (c, next) => {
    // Before request
    console.log('Before:', c.req.path);
    
    await next(); // Process request
    
    // After request
    console.log('After:', c.res.status);
  };
}

// Usage
app.use('*', myMiddleware());
```

### Middleware with Options

```typescript
export interface MyMiddlewareOptions {
  enabled?: boolean;
  prefix?: string;
}

export function myMiddleware(options?: MyMiddlewareOptions): MiddlewareHandler {
  const enabled = options?.enabled ?? true;
  const prefix = options?.prefix ?? '[LOG]';
  
  return async (c, next) => {
    if (!enabled) {
      return next();
    }
    
    console.log(`${prefix} ${c.req.method} ${c.req.path}`);
    await next();
  };
}

// Usage
app.use('*', myMiddleware({ prefix: '[API]' }));
```

### Middleware with Context Modification

```typescript
export function authMiddleware(): MiddlewareHandler {
  return async (c, next) => {
    const token = c.req.header('Authorization');
    
    if (!token) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    // Decode and verify token
    const user = await verifyToken(token);
    
    // Add to context
    c.set('user', user);
    c.set('userId', user.id);
    
    await next();
  };
}

// Usage
app.use('/api/*', authMiddleware());

app.get('/api/profile', (c) => {
  const user = c.get('user');
  return c.json(user);
});
```

### Error Handling in Middleware

```typescript
export function errorCatchingMiddleware(): MiddlewareHandler {
  return async (c, next) => {
    try {
      await next();
    } catch (error) {
      console.error('Caught error:', error);
      
      // Re-throw to let ExceptionFilter handle it
      throw error;
      
      // Or handle it yourself
      // return c.json({ error: 'Something went wrong' }, 500);
    }
  };
}
```

### Conditional Middleware

```typescript
export function conditionalMiddleware(
  condition: (c: Context) => boolean,
  middleware: MiddlewareHandler
): MiddlewareHandler {
  return async (c, next) => {
    if (condition(c)) {
      return middleware(c, next);
    }
    await next();
  };
}

// Usage
app.use('*', conditionalMiddleware(
  (c) => c.req.path.startsWith('/api'),
  rateLimitMiddleware()
));
```

## Generating Middleware with CLI

```bash
brewy g middleware auth-check
```

Generates:

```typescript
import type { Context, MiddlewareHandler } from 'hono';

export interface authCheckOptions {
  // Add configuration options here
  // Example:
  // enabled?: boolean;
}

/**
 * auth-check middleware
 * TODO: Add description
 */
export function authCheckMiddleware(options?: authCheckOptions): MiddlewareHandler {
  return async (c: Context, next) => {
    // Implement middleware logic
    // Example:
    // console.log('Before request');
    
    await next();
    
    // Example:
    // console.log('After request');
  };
}
```

## Middleware Patterns

### Timing Middleware

```typescript
export function timingMiddleware(): MiddlewareHandler {
  return async (c, next) => {
    const start = Date.now();
    
    await next();
    
    const duration = Date.now() - start;
    c.header('X-Response-Time', `${duration}ms`);
  };
}
```

### Cache Middleware

```typescript
const cache = new Map<string, { data: any; expires: number }>();

export function cacheMiddleware(ttl: number = 60000): MiddlewareHandler {
  return async (c, next) => {
    if (c.req.method !== 'GET') {
      return next();
    }
    
    const key = c.req.url;
    const cached = cache.get(key);
    
    if (cached && cached.expires > Date.now()) {
      return c.json(cached.data);
    }
    
    await next();
    
    if (c.res.status === 200) {
      const data = await c.res.json();
      cache.set(key, { data, expires: Date.now() + ttl });
    }
  };
}
```

### Compression Middleware

```typescript
import { compress } from 'hono/compress';

app.use('*', compress());
```

### Security Headers Middleware

```typescript
export function securityHeadersMiddleware(): MiddlewareHandler {
  return async (c, next) => {
    await next();
    
    c.header('X-Content-Type-Options', 'nosniff');
    c.header('X-Frame-Options', 'DENY');
    c.header('X-XSS-Protection', '1; mode=block');
    c.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  };
}
```

## Middleware Order

Middleware execution order matters:

```typescript
const app = AppFactory.create();

// 1. Request ID (first, for logging)
app.use('*', requestIdMiddleware());

// 2. Logging (early, to log everything)
app.use('*', loggingMiddleware());

// 3. CORS (before auth)
app.use('*', corsMiddleware());

// 4. Rate limiting (before expensive operations)
app.use('/api/*', rateLimitMiddleware());

// 5. Authentication (after rate limit)
app.use('/api/*', authMiddleware());

// 6. Routes
app.route('/api/users', userRoutes);
```

## Best Practices

1. **Order matters**: Apply middleware in the right order
2. **Scope appropriately**: Don't apply middleware globally if it's only needed on specific routes
3. **Fail fast**: Validate and authenticate early
4. **Add context**: Use `c.set()` to share data between middleware and handlers
5. **Handle errors**: Let ExceptionFilter handle errors, or catch and rethrow
6. **Performance**: Keep middleware lightweight
7. **Reusability**: Create reusable middleware with options

## Next Steps

- [Validation Guide](./VALIDATION.md)
- [Exception Handling](./EXCEPTIONS.md)
- [OpenAPI Documentation](./OPENAPI.md)
