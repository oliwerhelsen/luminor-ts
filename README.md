# brewy

**Enterprise Hono framework with DDD, Dependency Injection, and Drizzle ORM**

brewy is a powerful and flexible framework for building enterprise applications with Hono. It combines best practices from Domain-Driven Design (DDD), Dependency Injection with tsyringe, and Drizzle ORM for database management.

## Features

- 🚀 **Hono** as web framework
- 💉 **Dependency Injection** with tsyringe
- 🗄️ **Drizzle ORM** with support for MySQL, PostgreSQL and SQLite
- 🏗️ **Domain-Driven Design (DDD)** architecture
- 🔐 **Authentication** with Better Auth (optional)
- 📝 **Structured logging**
- 🧪 **Test utilities**
- ✨ **CLI Generators** for scaffolding DDD components
- ✅ **Zod Validation** with type-safe DTOs
- 🛡️ **Exception Handling** with automatic HTTP status mapping
- 🔧 **Built-in Middleware** (CORS, Rate Limiting, Request ID)
- 📚 **OpenAPI Integration** with Scalar documentation UI

## Installation

```bash
npm install -g brewy
```

Or use npx:

```bash
npx brewy create-app my-project
```

## Quick Start

```bash
# Create new project
brewy create-app my-project

# Follow the prompts to select:
# - Database type (SQLite, PostgreSQL, MySQL)
# - Project type (empty or full-example)
# - Authentication (Better Auth or none)

cd my-project
npm install
npm run dev
```

## CLI Generators

brewy includes powerful CLI generators for scaffolding DDD components:

```bash
# Generate a complete module structure
brewy generate module user

# Generate components
brewy g entity user              # Domain entity
brewy g value-object email       # Value object
brewy g repository user          # Repository interface + implementation
brewy g use-case create-user     # Application use case
brewy g controller user          # REST controller
brewy g dto create-user          # Zod DTO schema
brewy g middleware auth-check    # Custom middleware
```

See the [CLI Commands Guide](./docs/CLI_COMMANDS.md) for details.

## Documentation

### Guides

- [CLI Commands](./docs/CLI_COMMANDS.md) - Code generation and scaffolding
- [Validation with Zod](./docs/VALIDATION.md) - Type-safe request validation
- [Exception Handling](./docs/EXCEPTIONS.md) - Comprehensive error handling
- [Middleware](./docs/MIDDLEWARE.md) - Built-in and custom middleware
- [OpenAPI Documentation](./docs/OPENAPI.md) - API documentation with Scalar

## Project Structure

brewy follows DDD principles and organizes code in layers:

```
src/
├── domain/          # Domain layer (entities, value objects, repositories)
├── application/     # Application layer (use cases, DTOs)
├── infrastructure/  # Infrastructure layer (repositories, external services)
└── presentation/    # Presentation layer (Hono routes, controllers)
```

### Module-based Structure (Optional)

For larger projects, organize by modules:

```
src/modules/
├── user/
│   ├── domain/
│   ├── application/
│   ├── infrastructure/
│   └── presentation/
└── product/
    ├── domain/
    ├── application/
    ├── infrastructure/
    └── presentation/
```

## Core Features

### Exception Handling

Automatic HTTP status mapping for domain exceptions:

```typescript
import { EntityNotFoundException, ValidationException } from 'brewy';

// Automatically returns 404
throw new EntityNotFoundException('User', userId);

// Automatically returns 400
throw new ValidationException('Invalid email format', 'email');
```

### Zod Validation

Type-safe request validation with automatic error responses:

```typescript
import { validateJson, z } from 'brewy';

const CreateUserDto = z.object({
  email: z.string().email(),
  name: z.string().min(2),
});

app.post('/users', validateJson(CreateUserDto), async (c) => {
  const body = c.req.valid('json'); // Type-safe and validated
  return c.json(body);
});
```

### Built-in Middleware

```typescript
import {
  requestIdMiddleware,
  corsMiddleware,
  rateLimitMiddleware,
} from 'brewy';

app.use('*', requestIdMiddleware());
app.use('*', corsMiddleware({ origin: '*' }));
app.use('/api/*', rateLimitMiddleware({ maxRequests: 100 }));
```

### OpenAPI Documentation

```typescript
import { createOpenAPIApp } from 'brewy';

const app = createOpenAPIApp({
  title: 'My API',
  version: '1.0.0',
});

// OpenAPI spec at /openapi.json
// Interactive docs at /api-docs
```

## License

MIT

## Contributing

Contributions are welcome! Open an issue or submit a pull request.
