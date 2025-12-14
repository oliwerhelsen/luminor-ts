# {{PROJECT_NAME}}

Full example brewy application with {{DATABASE_TYPE}} database.

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
  - `user.entity.ts` - User domain entity
- `src/application/` - Application layer (use cases, DTOs)
  - `use-cases/` - Business logic use cases
  - `dto/` - Data transfer objects
- `src/infrastructure/` - Infrastructure layer (repositories, database)
  - `database/` - Drizzle setup and schema
  - `repositories/` - Repository implementations
- `src/presentation/` - Presentation layer (routes, controllers)
  - `api/` - API routes

## Example Features

This full example includes:

- **User Entity** - Domain entity with business logic
- **User Repository** - Database repository implementation
- **Use Cases** - Create, Get, and List users
- **API Routes** - RESTful endpoints for user management
- **Authentication** - JWT-based authentication middleware
- **Logging** - Request/response logging

## API Endpoints

- `POST /api/users` - Create a new user (public)
- `GET /api/users` - List all users (protected)
- `GET /api/users/:id` - Get user by ID (protected)

## Testing

Run tests with:

```bash
npm test
```

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run db:generate` - Generate database migrations
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Drizzle Studio
- `npm test` - Run tests
