---
layout: default
title: Infrastructure
---

# Infrastructure - Database, Auth and Logging

The Infrastructure layer handles external services such as databases, authentication, and logging.

## Database Factory

DatabaseFactory creates Drizzle database connections for different database types.

### SQLite

```typescript
import { DatabaseFactory } from "brewy";

const db = await DatabaseFactory.create("sqlite", {
  sqlite: {
    filename: "./database.sqlite",
  },
});
```

### PostgreSQL

```typescript
const db = await DatabaseFactory.create("postgresql", {
  postgresql: {
    connectionString: process.env.DATABASE_URL,
  },
});
```

### MySQL

```typescript
const db = await DatabaseFactory.create("mysql", {
  mysql: {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "myapp",
  },
});
```

### Using with Drizzle Schema

```typescript
import { getDatabase } from "./infrastructure/database/database.js";
import { users } from "./infrastructure/database/schema.js";
import { eq } from "drizzle-orm";

const db = await getDatabase();
const allUsers = await db.select().from(users);
const user = await db.select().from(users).where(eq(users.id, "123")).limit(1);
```

## Authentication

brewy includes JWT-based authentication.

### Setup Auth Service

```typescript
import { Container } from "brewy";
import { AuthService } from "brewy";

Container.register("AuthService", () => {
  return new AuthService({
    secret: process.env.JWT_SECRET || "your-secret-key",
    expiresIn: "7d",
  });
});
```

### Generate Token

```typescript
import { Container } from "brewy";
import { AuthService } from "brewy";

const authService = Container.get<AuthService>("AuthService");

const token = authService.generateToken({
  userId: "123",
  email: "user@example.com",
});
```

### Protect Routes with Middleware

```typescript
import { authMiddleware } from "brewy";

// Protect all routes under /api
app.use("/api/*", authMiddleware());

// Or protect specific routes
app.get("/api/users", authMiddleware(), async (c) => {
  // c.user is available here
  const userId = c.user?.userId;
  return c.json({ userId });
});
```

### Login Route Example

```typescript
app.post("/api/login", async (c) => {
  const { email, password } = await c.req.json();

  // Verify user (implement your own logic)
  const user = await userRepository.findByEmail(email);
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return c.json({ error: "Invalid credentials" }, 401);
  }

  // Generate token
  const authService = Container.get<AuthService>("AuthService");
  const token = authService.generateToken({
    userId: user.id,
    email: user.email,
  });

  return c.json({ token });
});
```

## Logging

Structured logging with different log levels.

### Setup Logger

```typescript
import { Container } from "brewy";
import { Logger, LogLevel } from "brewy";

Container.register("Logger", () => new Logger(LogLevel.INFO));
```

### Using Logger

```typescript
import { Container } from "brewy";
import { Logger } from "brewy";

const logger = Container.get<Logger>("Logger");

logger.debug("Debug message", { userId: "123" });
logger.info("Info message", { action: "user_created" });
logger.warn("Warning message", { issue: "rate_limit" });
logger.error("Error message", error, { context: "api" });
```

### Request Logging Middleware

```typescript
import { loggingMiddleware } from "brewy";

// Log all requests
app.use("*", loggingMiddleware());
```

This automatically logs:

- Request method and path
- Response status
- Request duration

### Custom Logging

```typescript
app.use("*", async (c, next) => {
  const logger = Container.get<Logger>("Logger");
  const start = Date.now();

  logger.info("Request started", {
    method: c.req.method,
    path: c.req.path,
  });

  await next();

  const duration = Date.now() - start;
  logger.info("Request completed", {
    status: c.res.status,
    duration: `${duration}ms`,
  });
});
```

## Complete Example

```typescript
import "reflect-metadata";
import { Container } from "brewy";
import { AppFactory } from "brewy";
import { Logger, LogLevel, loggingMiddleware } from "brewy";
import { AuthService } from "brewy";
import { getDatabase } from "./infrastructure/database/database.js";

// Setup DI
Container.register("Logger", () => new Logger(LogLevel.INFO));
Container.register("AuthService", () => {
  return new AuthService({
    secret: process.env.JWT_SECRET || "secret",
    expiresIn: "7d",
  });
});

// Initialize database
await getDatabase();

// Create app
const app = AppFactory.create();

// Middleware
app.use("*", loggingMiddleware());

// Routes
app.get("/", (c) => {
  return c.json({ message: "Hello" });
});

app.post("/api/login", async (c) => {
  // Login logic
});

app.use("/api/*", authMiddleware());

app.get("/api/protected", async (c) => {
  return c.json({ message: "Protected route" });
});
```

## Next Steps

- [Domain & Application](/domain-application) - Entities and Use Cases
- [Tutorials](/tutorials) - Step-by-step tutorials
