---
layout: default
title: Luminor - Enterprise Hono Framework
---

# Luminor

**Enterprise Hono framework med DDD, Dependency Injection och Drizzle ORM**

Luminor är ett kraftfullt och flexibelt ramverk för att bygga enterprise-applikationer med Hono. Det kombinerar bästa praxis från Domain-Driven Design (DDD), Dependency Injection med tsyringe, och Drizzle ORM för databashantering.

## Funktioner

- 🚀 **Hono** som web framework
- 💉 **Dependency Injection** med tsyringe
- 🗄️ **Drizzle ORM** med stöd för MySQL, PostgreSQL och SQLite
- 🏗️ **Domain-Driven Design (DDD)** arkitektur
- 🔐 **Authentication** med JWT
- 📝 **Structured logging**
- 🧪 **Test utilities**

## Snabbstart

```bash
# Installera globalt
npm install -g luminor

# Skapa nytt projekt
luminor create-app my-project
```

Eller använd npx:

```bash
npx luminor create-app my-project
```

## Projektstruktur

Luminor följer DDD-principer och organiserar kod i lager:

```
src/
├── domain/          # Domain layer (entities, value objects)
├── application/     # Application layer (use cases, DTOs)
├── infrastructure/  # Infrastructure layer (repositories, external services)
└── presentation/    # Presentation layer (Hono routes, controllers)
```

## Nästa steg

- [Kom igång](/getting-started) - Installera och skapa ditt första projekt
- [Core](/core) - Lär dig om DI container och Hono integration
- [Infrastructure](/infrastructure) - Database, Auth och Logging
- [Tutorials](/tutorials) - Steg-för-steg guider

## GitHub

[View on GitHub](https://github.com/your-username/luminor-ts)

