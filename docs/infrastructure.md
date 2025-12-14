---
layout: default
title: Infrastructure
---

# Infrastructure - Database, Auth och Logging

Infrastructure-lagret hanterar externa tjänster som databaser, autentisering och loggning.

## Database Factory

DatabaseFactory skapar Drizzle-databaskopplingar för olika databastyper.

### SQLite

```typescript
import { DatabaseFactory } from 'luminor';

const db = await DatabaseFactory.create('sqlite', {
  sqlite: {
    filename: './database.sqlite',
  },
});
```

### PostgreSQL

```typescript
const db = await DatabaseFactory.create('postgresql', {
  postgresql: {
    connectionString: process.env.DATABASE_URL,
  },
});
```

### MySQL

```typescript
const db = await DatabaseFactory.create('mysql', {
  mysql: {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'password',
    database: 'myapp',
  },
});
```

### Använda med Drizzle Schema

```typescript
import { getDatabase } from './infrastructure/database/database.js';
import { users } from './infrastructure/database/schema.js';
import { eq } from 'drizzle-orm';

const db = await getDatabase();
const allUsers = await db.select().from(users);
const user = await db.select().from(users).where(eq(users.id, '123')).limit(1);
```

## Authentication

Luminor inkluderar JWT-baserad autentisering.

### Setup Auth Service

```typescript
import { Container } from 'luminor';
import { AuthService } from 'luminor';

Container.register('AuthService', () => {
  return new AuthService({
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: '7d',
  });
});
```

### Generera Token

```typescript
import { Container } from 'luminor';
import { AuthService } from 'luminor';

const authService = Container.get<AuthService>('AuthService');

const token = authService.generateToken({
  userId: '123',
  email: 'user@example.com',
});
```

### Skydda Routes med Middleware

```typescript
import { authMiddleware } from 'luminor';

// Skydda alla routes under /api
app.use('/api/*', authMiddleware());

// Eller skydda specifika routes
app.get('/api/users', authMiddleware(), async (c) => {
  // c.user är tillgänglig här
  const userId = c.user?.userId;
  return c.json({ userId });
});
```

### Login Route Exempel

```typescript
app.post('/api/login', async (c) => {
  const { email, password } = await c.req.json();
  
  // Verifiera användare (implementera din egen logik)
  const user = await userRepository.findByEmail(email);
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return c.json({ error: 'Invalid credentials' }, 401);
  }
  
  // Generera token
  const authService = Container.get<AuthService>('AuthService');
  const token = authService.generateToken({
    userId: user.id,
    email: user.email,
  });
  
  return c.json({ token });
});
```

## Logging

Structured logging med olika log levels.

### Setup Logger

```typescript
import { Container } from 'luminor';
import { Logger, LogLevel } from 'luminor';

Container.register('Logger', () => new Logger(LogLevel.INFO));
```

### Använda Logger

```typescript
import { Container } from 'luminor';
import { Logger } from 'luminor';

const logger = Container.get<Logger>('Logger');

logger.debug('Debug message', { userId: '123' });
logger.info('Info message', { action: 'user_created' });
logger.warn('Warning message', { issue: 'rate_limit' });
logger.error('Error message', error, { context: 'api' });
```

### Request Logging Middleware

```typescript
import { loggingMiddleware } from 'luminor';

// Logga alla requests
app.use('*', loggingMiddleware());
```

Detta loggar automatiskt:
- Request method och path
- Response status
- Request duration

### Anpassad Logging

```typescript
app.use('*', async (c, next) => {
  const logger = Container.get<Logger>('Logger');
  const start = Date.now();
  
  logger.info('Request started', {
    method: c.req.method,
    path: c.req.path,
  });
  
  await next();
  
  const duration = Date.now() - start;
  logger.info('Request completed', {
    status: c.res.status,
    duration: `${duration}ms`,
  });
});
```

## Komplett Exempel

```typescript
import 'reflect-metadata';
import { Container } from 'luminor';
import { AppFactory } from 'luminor';
import { Logger, LogLevel, loggingMiddleware } from 'luminor';
import { AuthService } from 'luminor';
import { getDatabase } from './infrastructure/database/database.js';

// Setup DI
Container.register('Logger', () => new Logger(LogLevel.INFO));
Container.register('AuthService', () => {
  return new AuthService({
    secret: process.env.JWT_SECRET || 'secret',
    expiresIn: '7d',
  });
});

// Initialize database
await getDatabase();

// Create app
const app = AppFactory.create();

// Middleware
app.use('*', loggingMiddleware());

// Routes
app.get('/', (c) => {
  return c.json({ message: 'Hello' });
});

app.post('/api/login', async (c) => {
  // Login logic
});

app.use('/api/*', authMiddleware());

app.get('/api/protected', async (c) => {
  return c.json({ message: 'Protected route' });
});
```

## Nästa steg

- [Domain & Application](/domain-application) - Entities och Use Cases
- [Tutorials](/tutorials) - Steg-för-steg tutorials

