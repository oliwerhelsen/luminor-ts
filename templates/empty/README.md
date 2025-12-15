# {{PROJECT_NAME}}

brewy application with {{DATABASE_TYPE}} database.

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables:

```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Run database migrations:

```bash
npm run db:generate
npm run db:migrate
```

4. Start development server:

```bash
npm run dev
```

## Project Structure

- `src/domain/` - Domain layer (entities, value objects)
- `src/application/` - Application layer (use cases, DTOs)
- `src/infrastructure/` - Infrastructure layer (repositories, database)
- `src/presentation/` - Presentation layer (API routes with inline handlers)

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run db:generate` - Generate database migrations
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Drizzle Studio
