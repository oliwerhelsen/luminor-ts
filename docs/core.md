---
layout: default
title: Core
---

# Core - DI Container and Hono Integration

The Core module contains basic functionality for Dependency Injection and Hono app setup.

## Container - Dependency Injection

brewy uses tsyringe for Dependency Injection. The Container class provides a simple API for registering and retrieving dependencies.

### Basic Usage

```typescript
import { Container } from "brewy";
import { Logger } from "brewy";

// Register a service
Container.register("Logger", () => new Logger(LogLevel.INFO));

// Retrieve a service
const logger = Container.get<Logger>("Logger");
```

### Singleton Services

To register a service as singleton:

```typescript
Container.register("Database", () => getDatabase(), { singleton: true });
```

### Register Instances

You can also register direct instances:

```typescript
const logger = new Logger(LogLevel.DEBUG);
Container.registerInstance("Logger", logger);
```

### Example: Register a Repository

```typescript
import { Container } from "brewy";
import { UserRepository } from "./infrastructure/repositories/user.repository.js";

Container.register("UserRepository", () => {
  return new UserRepository();
});
```

## AppFactory - Hono App Setup

AppFactory creates a Hono app with DI integration and error handling.

### Basic Usage

```typescript
import { AppFactory } from "brewy";

const app = AppFactory.create();
```

### Custom Error Handling

```typescript
import { AppFactory } from "brewy";
import { Logger } from "brewy";

const app = AppFactory.create({
  errorHandler: (error, c) => {
    const logger = Container.get<Logger>("Logger");
    logger.error("Unhandled error", error);

    return c.json({ error: { message: error.message } }, 500);
  },
  notFoundHandler: (c) => {
    return c.json({ error: { message: "Not Found" } }, 404);
  },
});
```

### DI Context Injection

Hono context is automatically injected into the DI container for each request:

```typescript
import { Container } from "brewy";
import type { Context } from "hono";

app.use("*", async (c, next) => {
  // Context is available in DI container
  const context = Container.get<Context>("HonoContext");
  await next();
});
```

## Complete Example

```typescript
import "reflect-metadata";
import { Container } from "brewy";
import { AppFactory } from "brewy";
import { Logger, LogLevel } from "brewy";

// Setup DI
Container.register("Logger", () => new Logger(LogLevel.INFO));

// Create app
const app = AppFactory.create();

// Routes
app.get("/", (c) => {
  const logger = Container.get<Logger>("Logger");
  logger.info("Home page accessed");
  return c.json({ message: "Hello from brewy!" });
});

// Start server
serve({ fetch: app.fetch, port: 3000 });
```

## Next Steps

- [Infrastructure](/infrastructure) - Database, Auth and Logging
- [Domain & Application](/domain-application) - Entities and Use Cases
