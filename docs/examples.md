---
layout: default
title: Exempel
---

# Exempel

Praktiska exempel på hur man använder Luminor i olika scenarion.

## Exempel 1: Enkel CRUD API

```typescript
import 'reflect-metadata';
import { Container } from 'luminor';
import { AppFactory } from 'luminor';
import { serve } from '@hono/node-server';

const app = AppFactory.create();

app.get('/api/users', async (c) => {
  // Hämta användare
  return c.json({ users: [] });
});

app.post('/api/users', async (c) => {
  const body = await c.req.json();
  // Skapa användare
  return c.json({ id: '123', ...body }, 201);
});

serve({ fetch: app.fetch, port: 3000 });
```

## Exempel 2: Middleware Chain

```typescript
import { loggingMiddleware } from 'luminor';
import { authMiddleware } from 'luminor';

// Global logging
app.use('*', loggingMiddleware());

// Public routes
app.get('/public', (c) => c.json({ message: 'Public' }));

// Protected routes
app.use('/api/*', authMiddleware());
app.get('/api/protected', (c) => c.json({ message: 'Protected' }));
```

## Exempel 3: Error Handling

```typescript
import { AppFactory } from 'luminor';
import { Logger } from 'luminor';

const app = AppFactory.create({
  errorHandler: (error, c) => {
    const logger = Container.get<Logger>('Logger');
    logger.error('Error occurred', error);
    
    return c.json({
      error: {
        message: error.message,
        code: 'INTERNAL_ERROR',
      },
    }, 500);
  },
});
```

## Exempel 4: Custom Middleware

```typescript
app.use('*', async (c, next) => {
  const start = Date.now();
  await next();
  const duration = Date.now() - start;
  
  c.header('X-Response-Time', `${duration}ms`);
});
```

## Exempel 5: Query Parameters

```typescript
app.get('/api/users', async (c) => {
  const page = c.req.query('page') || '1';
  const limit = c.req.query('limit') || '10';
  
  return c.json({
    page: parseInt(page),
    limit: parseInt(limit),
  });
});
```

## Exempel 6: Request Body Validation

```typescript
app.post('/api/users', async (c) => {
  const body = await c.req.json();
  
  if (!body.email || !body.name) {
    return c.json({ error: 'Email and name required' }, 400);
  }
  
  // Process...
});
```

## Exempel 7: CORS

```typescript
app.use('*', async (c, next) => {
  await next();
  c.header('Access-Control-Allow-Origin', '*');
  c.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  c.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
});
```

## Exempel 8: File Upload

```typescript
app.post('/api/upload', async (c) => {
  const body = await c.req.parseBody();
  const file = body.file as File;
  
  // Process file...
  return c.json({ message: 'File uploaded' });
});
```

## Exempel 9: Rate Limiting

```typescript
const rateLimit = new Map<string, number>();

app.use('*', async (c, next) => {
  const ip = c.req.header('x-forwarded-for') || 'unknown';
  const count = rateLimit.get(ip) || 0;
  
  if (count > 100) {
    return c.json({ error: 'Rate limit exceeded' }, 429);
  }
  
  rateLimit.set(ip, count + 1);
  await next();
});
```

## Exempel 10: Health Check

```typescript
app.get('/health', async (c) => {
  const db = await getDatabase();
  
  try {
    // Test database connection
    await db.select().from(users).limit(1);
    
    return c.json({
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return c.json({
      status: 'unhealthy',
      database: 'disconnected',
    }, 503);
  }
});
```

