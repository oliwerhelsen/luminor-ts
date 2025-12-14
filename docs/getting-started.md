---
layout: default
title: Getting Started
---

# Getting Started with brewy

This guide shows you how to install brewy and create your first project.

## Installation

### Global Installation

```bash
npm install -g brewy
```

### Using with npx (Recommended)

You can also use brewy directly with npx without installing globally:

```bash
npx brewy create-app my-project
```

## Creating a New Project

When you run `create-app`, you will be asked about:

1. **Project name** - The name of your project
2. **Database** - Choose between SQLite (default), PostgreSQL, or MySQL
3. **Project type** - Choose between "Empty project" or "Full example"

### Example

```bash
brewy create-app my-api
```

You will see:

```
🚀 brewy - Enterprise Hono Framework

? Project name: my-api
? Select database: SQLite (default)
? Select project type: Empty project
```

## Project Types

### Empty Project

A minimal project structure with:

- Basic DDD structure
- DI container setup
- Drizzle configuration
- Simple Hono app

Perfect for starting from scratch.

### Full Example

A complete example application with:

- User entity and repository
- Use cases (Create, Get, List)
- API routes with CRUD
- Authentication setup
- Logging configuration
- Test examples

Perfect for learning how everything works together.

## After Installation

Once the project is created:

```bash
cd my-api
npm install
```

### Configure Environment Variables

Copy `.env.example` to `.env` and update with your settings:

```bash
cp .env.example .env
```

### Database Migrations

For SQLite, you don't need to do anything extra. For PostgreSQL or MySQL, make sure the database exists and run:

```bash
npm run db:generate
npm run db:migrate
```

### Start Development Server

```bash
npm run dev
```

The server will run on `http://localhost:3000`.

## Next Steps

- [Core Concepts](/core) - Learn about DI container and Hono integration
- [Infrastructure](/infrastructure) - Configure database, auth and logging
- [Tutorials](/tutorials) - Step-by-step tutorials
