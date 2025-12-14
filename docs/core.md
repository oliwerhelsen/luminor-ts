---
layout: default
title: Core
---

# Core - DI Container och Hono Integration

Core-modulen innehåller grundläggande funktionalitet för Dependency Injection och Hono app setup.

## Container - Dependency Injection

Luminor använder tsyringe för Dependency Injection. Container-klassen ger en enkel API för att registrera och hämta dependencies.

### Grundläggande användning

```typescript
import { Container } from 'luminor';
import { Logger } from 'luminor';

// Registrera en service
Container.register('Logger', () => new Logger(LogLevel.INFO));

// Hämta en service
const logger = Container.get<Logger>('Logger');
```

### Singleton Services

För att registrera en service som singleton:

```typescript
Container.register('Database', () => getDatabase(), { singleton: true });
```

### Registrera Instanser

Du kan också registrera direkta instanser:

```typescript
const logger = new Logger(LogLevel.DEBUG);
Container.registerInstance('Logger', logger);
```

### Exempel: Registrera en Repository

```typescript
import { Container } from 'luminor';
import { UserRepository } from './infrastructure/repositories/user.repository.js';

Container.register('UserRepository', () => {
  return new UserRepository();
});
```

## AppFactory - Hono App Setup

AppFactory skapar en Hono-app med DI-integration och error handling.

### Grundläggande användning

```typescript
import { AppFactory } from 'luminor';

const app = AppFactory.create();
```

### Anpassad Error Handling

```typescript
import { AppFactory } from 'luminor';
import { Logger } from 'luminor';

const app = AppFactory.create({
  errorHandler: (error, c) => {
    const logger = Container.get<Logger>('Logger');
    logger.error('Unhandled error', error);
    
    return c.json(
      { error: { message: error.message } },
      500
    );
  },
  notFoundHandler: (c) => {
    return c.json({ error: { message: 'Not Found' } }, 404);
  },
});
```

### DI Context Injection

Hono context injiceras automatiskt i DI container för varje request:

```typescript
import { Container } from 'luminor';
import type { Context } from 'hono';

app.use('*', async (c, next) => {
  // Context är tillgänglig i DI container
  const context = Container.get<Context>('HonoContext');
  await next();
});
```

## Komplett Exempel

```typescript
import 'reflect-metadata';
import { Container } from 'luminor';
import { AppFactory } from 'luminor';
import { Logger, LogLevel } from 'luminor';

// Setup DI
Container.register('Logger', () => new Logger(LogLevel.INFO));

// Create app
const app = AppFactory.create();

// Routes
app.get('/', (c) => {
  const logger = Container.get<Logger>('Logger');
  logger.info('Home page accessed');
  return c.json({ message: 'Hello from Luminor!' });
});

// Start server
serve({ fetch: app.fetch, port: 3000 });
```

## Nästa steg

- [Infrastructure](/infrastructure) - Database, Auth och Logging
- [Domain & Application](/domain-application) - Entities och Use Cases

