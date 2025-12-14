# Luminor

Enterprise Hono framework med DDD, Dependency Injection och Drizzle ORM.

## Installation

```bash
npm install -g luminor
# eller
npx luminor create-app my-project
```

## Användning

```bash
luminor create-app my-project
```

Kommandot kommer att ställa frågor om:
- Databasval (MySQL, PostgreSQL, SQLite)
- Projekttyp (Empty project eller Full example)

## Funktioner

- 🚀 Hono som web framework
- 💉 Dependency Injection med tsyringe
- 🗄️ Drizzle ORM med stöd för MySQL, PostgreSQL och SQLite
- 🏗️ Domain-Driven Design (DDD) arkitektur
- 🔐 Authentication med JWT
- 📝 Structured logging
- 🧪 Test utilities

## Projektstruktur

Genererade projekt följer DDD-principer:

```
src/
├── domain/          # Domain layer (entities, value objects)
├── application/     # Application layer (use cases, DTOs)
├── infrastructure/ # Infrastructure layer (repositories, external services)
└── presentation/   # Presentation layer (Hono routes, controllers)
```

## License

MIT

