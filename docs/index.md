---
layout: default
title: Luminor - Enterprise Hono Framework
---

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

## Quick Start

```bash
# Install globally
npm install -g luminor

# Create new project
luminor create-app my-project
```

Or use npx:

```bash
npx luminor create-app my-project
```

## Project Structure

Luminor follows DDD principles and organizes code in layers:

```
src/
├── domain/          # Domain layer (entities, value objects)
├── application/     # Application layer (use cases, DTOs)
├── infrastructure/  # Infrastructure layer (repositories, external services)
└── presentation/    # Presentation layer (Hono routes, controllers)
```

## Next Steps

- [Getting Started](/getting-started) - Install and create your first project
- [Core](/core) - Learn about DI container and Hono integration
- [Infrastructure](/infrastructure) - Database, Auth and Logging
- [Tutorials](/tutorials) - Step-by-step guides

## GitHub

[View on GitHub](https://github.com/your-username/luminor-ts)
