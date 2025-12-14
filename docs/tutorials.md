---
layout: default
title: Tutorials
---

# Tutorials

Steg-för-steg guider för att bygga applikationer med Luminor.

## Tutorial 1: Skapa en enkel Todo API

I denna tutorial bygger vi en enkel Todo API med CRUD-operationer.

### Steg 1: Skapa projekt

```bash
luminor create-app todo-api
cd todo-api
npm install
```

### Steg 2: Definiera Domain Entity

Skapa `src/domain/todo.entity.ts`:

```typescript
import { BaseEntity } from 'luminor';

export class Todo extends BaseEntity {
  private _title: string;
  private _completed: boolean;

  constructor(title: string, completed: boolean = false, id?: string) {
    super(id);
    this._title = title;
    this._completed = completed;
  }

  get title(): string {
    return this._title;
  }

  get completed(): boolean {
    return this._completed;
  }

  markComplete(): void {
    this._completed = true;
    this.updateTimestamp();
  }

  markIncomplete(): void {
    this._completed = false;
    this.updateTimestamp();
  }

  updateTitle(title: string): void {
    this._title = title;
    this.updateTimestamp();
  }
}
```

### Steg 3: Skapa Database Schema

Uppdatera `src/infrastructure/database/schema.ts`:

```typescript
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const todos = sqliteTable('todos', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  completed: integer('completed', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});
```

### Steg 4: Skapa Repository

Skapa `src/infrastructure/repositories/todo.repository.ts`:

```typescript
import { injectable } from 'tsyringe';
import { eq } from 'drizzle-orm';
import { Repository } from 'luminor';
import { Todo } from '../../domain/todo.entity.js';
import { getDatabase } from '../database/database.js';
import { todos } from '../database/schema.js';

@injectable()
export class TodoRepository implements Repository<Todo> {
  async findById(id: string): Promise<Todo | null> {
    const db = await getDatabase();
    const result = await db
      .select()
      .from(todos)
      .where(eq(todos.id, id))
      .limit(1);

    if (result.length === 0) return null;

    const row = result[0];
    return new Todo(row.title, Boolean(row.completed), row.id);
  }

  async findAll(): Promise<Todo[]> {
    const db = await getDatabase();
    const results = await db.select().from(todos);
    return results.map(row => 
      new Todo(row.title, Boolean(row.completed), row.id)
    );
  }

  async save(entity: Todo): Promise<Todo> {
    const db = await getDatabase();
    await db.insert(todos).values({
      id: entity.id,
      title: entity.title,
      completed: entity.completed,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    }).onConflictDoUpdate({
      target: todos.id,
      set: {
        title: entity.title,
        completed: entity.completed,
        updatedAt: entity.updatedAt,
      },
    });
    return entity;
  }

  async delete(id: string): Promise<void> {
    const db = await getDatabase();
    await db.delete(todos).where(eq(todos.id, id));
  }

  async exists(id: string): Promise<boolean> {
    return (await this.findById(id)) !== null;
  }
}
```

### Steg 5: Skapa Use Cases

Skapa `src/application/use-cases/create-todo.use-case.ts`:

```typescript
import { injectable } from 'tsyringe';
import { UseCase } from 'luminor';
import { Todo } from '../../domain/todo.entity.js';
import { TodoRepository } from '../../infrastructure/repositories/todo.repository.js';

export interface CreateTodoDto {
  title: string;
}

@injectable()
export class CreateTodoUseCase implements UseCase<CreateTodoDto, Todo> {
  constructor(private todoRepository: TodoRepository) {}

  async execute(input: CreateTodoDto): Promise<Todo> {
    const todo = new Todo(input.title);
    return await this.todoRepository.save(todo);
  }
}
```

Skapa `src/application/use-cases/list-todos.use-case.ts`:

```typescript
import { injectable } from 'tsyringe';
import { UseCase } from 'luminor';
import { Todo } from '../../domain/todo.entity.js';
import { TodoRepository } from '../../infrastructure/repositories/todo.repository.js';

@injectable()
export class ListTodosUseCase implements UseCase<void, Todo[]> {
  constructor(private todoRepository: TodoRepository) {}

  async execute(): Promise<Todo[]> {
    return await this.todoRepository.findAll();
  }
}
```

### Steg 6: Skapa API Routes

Skapa `src/presentation/api/todo.routes.ts`:

```typescript
import { Hono } from 'hono';
import { Container } from 'luminor';
import { CreateTodoUseCase } from '../../application/use-cases/create-todo.use-case.js';
import { ListTodosUseCase } from '../../application/use-cases/list-todos.use-case.js';
import { TodoRepository } from '../../infrastructure/repositories/todo.repository.js';

// Register dependencies
Container.register('TodoRepository', () => new TodoRepository());
Container.register('CreateTodoUseCase', () => {
  const repo = Container.get<TodoRepository>('TodoRepository');
  return new CreateTodoUseCase(repo);
});
Container.register('ListTodosUseCase', () => {
  const repo = Container.get<TodoRepository>('TodoRepository');
  return new ListTodosUseCase(repo);
});

const todoRoutes = new Hono();

todoRoutes.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const useCase = Container.get<CreateTodoUseCase>('CreateTodoUseCase');
    const todo = await useCase.execute(body);
    
    return c.json({
      id: todo.id,
      title: todo.title,
      completed: todo.completed,
      createdAt: todo.createdAt,
    }, 201);
  } catch (error: any) {
    return c.json({ error: { message: error.message } }, 400);
  }
});

todoRoutes.get('/', async (c) => {
  try {
    const useCase = Container.get<ListTodosUseCase>('ListTodosUseCase');
    const todos = await useCase.execute();
    
    return c.json(todos.map(todo => ({
      id: todo.id,
      title: todo.title,
      completed: todo.completed,
      createdAt: todo.createdAt,
      updatedAt: todo.updatedAt,
    })));
  } catch (error: any) {
    return c.json({ error: { message: error.message } }, 500);
  }
});

export { todoRoutes };
```

### Steg 7: Integrera i App

Uppdatera `src/index.ts`:

```typescript
import 'reflect-metadata';
import { AppFactory } from 'luminor';
import { serve } from '@hono/node-server';
import { getDatabase } from './infrastructure/database/database.js';
import { todoRoutes } from './presentation/api/todo.routes.js';

await getDatabase();

const app = AppFactory.create();
app.route('/api/todos', todoRoutes);

const port = parseInt(process.env.PORT || '3000');
serve({ fetch: app.fetch, port });
```

### Steg 8: Kör Migrations

```bash
npm run db:generate
npm run db:migrate
```

### Steg 9: Testa API

```bash
npm run dev
```

Testa med curl:

```bash
# Skapa todo
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "Learn Luminor"}'

# Lista todos
curl http://localhost:3000/api/todos
```

## Tutorial 2: Lägga till Authentication

I denna tutorial lägger vi till JWT-autentisering till vår Todo API.

### Steg 1: Setup Auth Service

Uppdatera `src/index.ts`:

```typescript
import { Container } from 'luminor';
import { AuthService } from 'luminor';

Container.register('AuthService', () => {
  return new AuthService({
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: '7d',
  });
});
```

### Steg 2: Skapa Login Route

Lägg till i `src/presentation/api/auth.routes.ts`:

```typescript
import { Hono } from 'hono';
import { Container } from 'luminor';
import { AuthService } from 'luminor';
import { UserRepository } from '../../infrastructure/repositories/user.repository.js';

const authRoutes = new Hono();

authRoutes.post('/login', async (c) => {
  const { email, password } = await c.req.json();
  
  // Hämta användare (implementera din egen verifiering)
  const userRepo = Container.get<UserRepository>('UserRepository');
  const user = await userRepo.findByEmail(email);
  
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return c.json({ error: 'Invalid credentials' }, 401);
  }
  
  const authService = Container.get<AuthService>('AuthService');
  const token = authService.generateToken({
    userId: user.id,
    email: user.email,
  });
  
  return c.json({ token });
});

export { authRoutes };
```

### Steg 3: Skydda Todo Routes

Uppdatera `src/presentation/api/todo.routes.ts`:

```typescript
import { authMiddleware } from 'luminor';

// Skydda alla routes
todoRoutes.use('*', authMiddleware());

// Nu kräver alla routes authentication
todoRoutes.post('/', async (c) => {
  // c.user är tillgänglig här
  const userId = c.user?.userId;
  // ...
});
```

## Ytterligare Tutorials

- **Tutorial 3**: Lägga till validering med Zod
- **Tutorial 4**: Implementera pagination
- **Tutorial 5**: Lägga till caching

[Se fler exempel](/examples)

