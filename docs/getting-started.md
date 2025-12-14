---
layout: default
title: Kom igång
---

# Kom igång med Luminor

Denna guide visar hur du installerar Luminor och skapar ditt första projekt.

## Installation

### Global installation

```bash
npm install -g luminor
```

### Använda med npx (rekommenderat)

Du kan också använda Luminor direkt med npx utan att installera globalt:

```bash
npx luminor create-app my-project
```

## Skapa ett nytt projekt

När du kör `create-app` kommer du att få frågor om:

1. **Projektnamn** - Namnet på ditt projekt
2. **Databas** - Välj mellan SQLite (default), PostgreSQL eller MySQL
3. **Projekttyp** - Välj mellan "Empty project" eller "Full example"

### Exempel

```bash
luminor create-app my-api
```

Du kommer att se:

```
🚀 Luminor - Enterprise Hono Framework

? Project name: my-api
? Select database: SQLite (default)
? Select project type: Empty project
```

## Projekttyper

### Empty Project

En minimal projektstruktur med:
- Grundläggande DDD-struktur
- DI container setup
- Drizzle konfiguration
- Enkel Hono app

Perfekt för att börja från scratch.

### Full Example

En komplett exempel-applikation med:
- User entity och repository
- Use cases (Create, Get, List)
- API routes med CRUD
- Authentication setup
- Logging konfiguration
- Test exempel

Perfekt för att lära dig hur allt fungerar tillsammans.

## Efter installation

När projektet är skapat:

```bash
cd my-api
npm install
```

### Konfigurera miljövariabler

Kopiera `.env.example` till `.env` och uppdatera med dina inställningar:

```bash
cp .env.example .env
```

### Databasmigreringer

För SQLite behöver du inte göra något extra. För PostgreSQL eller MySQL, se till att databasen finns och kör:

```bash
npm run db:generate
npm run db:migrate
```

### Starta utvecklingsservern

```bash
npm run dev
```

Servern kommer att köra på `http://localhost:3000`.

## Nästa steg

- [Core Concepts](/core) - Lär dig om DI container och Hono integration
- [Infrastructure](/infrastructure) - Konfigurera database, auth och logging
- [Tutorials](/tutorials) - Steg-för-steg tutorials

