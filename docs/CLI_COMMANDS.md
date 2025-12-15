# CLI Commands Guide

Brewy provides a powerful CLI for scaffolding DDD components.

## Installation

```bash
npm install -g brewy
```

Or use with npx:

```bash
npx brewy <command>
```

## Commands

### create-app

Create a new brewy application with interactive prompts.

```bash
brewy create-app my-app
```

You'll be prompted to select:
- Database type (SQLite, PostgreSQL, MySQL)
- Project type (empty or full-example)
- Authentication (Better Auth or none)

### generate (g)

Generate code from templates following DDD principles.

```bash
brewy generate <type> <name>
brewy g <type> <name>  # shorthand
```

## Available Generators

### Module

Generate a complete DDD module structure.

```bash
brewy g module user
```

Creates:
```
src/modules/user/
├── domain/
│   ├── entities/
│   ├── value-objects/
│   └── repositories/
├── application/
│   ├── use-cases/
│   └── dtos/
├── infrastructure/
│   └── repositories/
└── presentation/
    └── routes/
```

### Entity

Generate a domain entity.

```bash
brewy g entity user
```

Creates a DDD entity class extending `BaseEntity` with:
- Props interface
- Factory method
- Getters
- Business logic methods placeholder

### Value Object

Generate a domain value object.

```bash
brewy g value-object email
brewy g vo email  # shorthand
```

Creates an immutable value object with:
- Validation logic
- Equality comparison
- Encapsulation

### Repository

Generate repository interface and implementation.

```bash
brewy g repository user
brewy g repo user  # shorthand
```

Creates:
- `domain/repositories/user.repository.ts` - Interface
- `infrastructure/repositories/user.repository.impl.ts` - Implementation

### Use Case

Generate an application use case.

```bash
brewy g use-case create-user
brewy g uc create-user  # shorthand
```

Creates a use case class with:
- Input/Output type definitions
- Dependency injection
- Execute method
- Exception handling

### Routes

Generate presentation routes with inline handlers.

```bash
brewy g routes user
```

Creates a Hono router with:
- CRUD routes (GET, POST, PUT, DELETE)
- Inline handlers for proper type inference
- Use case integration
- DTO validation placeholders

**Note:** The old `controller` command is deprecated. Use `routes` instead to follow Hono best practices.

### DTO

Generate a Zod DTO schema.

```bash
brewy g dto create-user
```

Creates a Zod schema with:
- Type-safe validation
- Inferred TypeScript type
- Ready to use with `validateJson()`

### Middleware

Generate custom middleware.

```bash
brewy g middleware auth-check
brewy g mw auth-check  # shorthand
```

Creates middleware with:
- Options interface
- Before/after request hooks
- Type-safe context

## Module-Based Organization

When you have a `src/modules/` directory, generators will prompt you to:
1. Select an existing module
2. Create a new module

This helps maintain a clean, modular architecture.

## Examples

### Complete User Module

```bash
# Create module structure
brewy g module user

# Generate entity
brewy g entity user

# Generate repository
brewy g repo user

# Generate DTOs
brewy g dto create-user
brewy g dto update-user

# Generate use cases
brewy g uc create-user
brewy g uc get-user
brewy g uc list-users

# Generate routes
brewy g routes user
```

### Standalone Components (No Modules)

```bash
# Generate in flat structure
brewy g entity product
# Creates: src/domain/entities/product.entity.ts

brewy g uc create-product
# Creates: src/application/use-cases/create-product.use-case.ts
```

## Tips

1. **Naming Convention**: Use kebab-case for names (e.g., `create-user`, `user-profile`)
2. **Module First**: Create a module before generating components within it
3. **DTO Validation**: Always create DTOs before routes for proper validation
4. **Repository Pattern**: Generate repository before use cases that need it

## Next Steps

After generating components:
1. Implement the business logic
2. Register dependencies in DI container
3. Mount routes in main app
4. Write tests
