# Luminor

**Enterprise Hono framework with DDD, Dependency Injection, and Drizzle ORM**

Luminor is a powerful and flexible framework for building enterprise applications with Hono. It combines best practices from Domain-Driven Design (DDD), Dependency Injection with tsyringe, and Drizzle ORM for database management.

## Features

- 🚀 **Hono** as web framework
- 💉 **Dependency Injection** with tsyringe
- 🗄️ **Drizzle ORM** with support for MySQL, PostgreSQL and SQLite
- 🏗️ **Domain-Driven Design (DDD)** architecture
- 🔐 **Authentication** with JWT
- 📝 **Structured logging**
- 🧪 **Test utilities**

## Installation

```bash
npm install -g luminor
```

Or use npx:

```bash
npx luminor create-app my-project
```

## Quick Start

```bash
# Create new project
luminor create-app my-project

cd my-project
npm install
npm run dev
```

## Documentation

Full documentation available at: [https://your-username.github.io/luminor-ts](https://your-username.github.io/luminor-ts)

- [Getting Started](https://your-username.github.io/luminor-ts/getting-started)
- [Core](https://your-username.github.io/luminor-ts/core)
- [Infrastructure](https://your-username.github.io/luminor-ts/infrastructure)
- [Tutorials](https://your-username.github.io/luminor-ts/tutorials)

## Project Structure

Luminor follows DDD principles and organizes code in layers:

```
src/
├── domain/          # Domain layer (entities, value objects)
├── application/     # Application layer (use cases, DTOs)
├── infrastructure/  # Infrastructure layer (repositories, external services)
└── presentation/    # Presentation layer (Hono routes, controllers)
```

## License

MIT

## Contributing

Contributions are welcome! Open an issue or submit a pull request.
