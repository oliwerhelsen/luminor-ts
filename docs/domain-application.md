---
layout: default
title: Domain & Application
---

# Domain & Application Layers

Domain-Driven Design (DDD) organiserar kod i lager där Domain innehåller affärslogik och Application koordinerar användningsfall.

## Domain Layer

Domain-lagret innehåller entities, value objects och domain services - kärnan i din affärslogik.

### BaseEntity

Alla entities börver från `BaseEntity` som ger grundläggande funktionalitet:

```typescript
import { BaseEntity } from 'luminor';

export class User extends BaseEntity {
  private _email: string;
  private _name: string;

  constructor(email: string, name: string, id?: string) {
    super(id);
    this._email = email;
    this._name = name;
  }

  get email(): string {
    return this._email;
  }

  get name(): string {
    return this._name;
  }

  updateName(name: string): void {
    this._name = name;
    this.updateTimestamp(); // Uppdaterar updatedAt automatiskt
  }
}
```

### Entity Exempel

```typescript
import { BaseEntity } from 'luminor';

export class Product extends BaseEntity {
  private _name: string;
  private _price: number;
  private _stock: number;

  constructor(name: string, price: number, stock: number, id?: string) {
    super(id);
    this._name = name;
    this._price = price;
    this._stock = stock;
  }

  get name(): string {
    return this._name;
  }

  get price(): number {
    return this._price;
  }

  get stock(): number {
    return this._stock;
  }

  // Domain logic
  reduceStock(amount: number): void {
    if (this._stock < amount) {
      throw new Error('Insufficient stock');
    }
    this._stock -= amount;
    this.updateTimestamp();
  }

  updatePrice(newPrice: number): void {
    if (newPrice <= 0) {
      throw new Error('Price must be positive');
    }
    this._price = newPrice;
    this.updateTimestamp();
  }
}
```

## Application Layer

Application-lagret innehåller use cases och DTOs som koordinerar domain-logik.

### Use Case Interface

```typescript
import { UseCase } from 'luminor';

export interface CreateProductDto {
  name: string;
  price: number;
  stock: number;
}

export class CreateProductUseCase implements UseCase<CreateProductDto, Product> {
  constructor(private productRepository: ProductRepository) {}

  async execute(input: CreateProductDto): Promise<Product> {
    // Validera input
    if (input.price <= 0) {
      throw new Error('Price must be positive');
    }

    // Skapa entity
    const product = new Product(input.name, input.price, input.stock);

    // Spara
    return await this.productRepository.save(product);
  }
}
```

### Use Case med Dependency Injection

```typescript
import { injectable } from 'tsyringe';
import { UseCase } from 'luminor';
import { User } from '../domain/user.entity.js';
import { UserRepository } from '../infrastructure/repositories/user.repository.js';

@injectable()
export class GetUserUseCase implements UseCase<string, User> {
  constructor(private userRepository: UserRepository) {}

  async execute(userId: string): Promise<User> {
    const user = await this.userRepository.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return user;
  }
}
```

## Repository Pattern

Repositories abstraherar databashantering från domain-lagret.

### Repository Interface

```typescript
import { Repository } from 'luminor';
import { User } from './domain/user.entity.js';

export interface UserRepository extends Repository<User> {
  findByEmail(email: string): Promise<User | null>;
}
```

### Repository Implementation

```typescript
import { injectable } from 'tsyringe';
import { eq } from 'drizzle-orm';
import { Repository } from 'luminor';
import { User } from '../domain/user.entity.js';
import { getDatabase } from '../infrastructure/database/database.js';
import { users } from '../infrastructure/database/schema.js';

@injectable()
export class UserRepository implements Repository<User> {
  async findById(id: string): Promise<User | null> {
    const db = await getDatabase();
    const result = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    const row = result[0];
    return new User(row.email, row.name, String(row.id));
  }

  async findByEmail(email: string): Promise<User | null> {
    const db = await getDatabase();
    const result = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    const row = result[0];
    return new User(row.email, row.name, String(row.id));
  }

  async findAll(): Promise<User[]> {
    const db = await getDatabase();
    const results = await db.select().from(users);
    return results.map(row => 
      new User(row.email, row.name, String(row.id))
    );
  }

  async save(entity: User): Promise<User> {
    const db = await getDatabase();
    // Implementation...
    return entity;
  }

  async delete(id: string): Promise<void> {
    const db = await getDatabase();
    await db.delete(users).where(eq(users.id, id));
  }

  async exists(id: string): Promise<boolean> {
    const user = await this.findById(id);
    return user !== null;
  }
}
```

## Komplett Exempel

```typescript
// Domain: src/domain/user.entity.ts
import { BaseEntity } from 'luminor';

export class User extends BaseEntity {
  private _email: string;
  private _name: string;

  constructor(email: string, name: string, id?: string) {
    super(id);
    this._email = email;
    this._name = name;
  }

  get email(): string {
    return this._email;
  }

  get name(): string {
    return this._name;
  }
}

// Application: src/application/use-cases/create-user.use-case.ts
import { injectable } from 'tsyringe';
import { UseCase } from 'luminor';
import { User } from '../../domain/user.entity.js';
import { UserRepository } from '../../infrastructure/repositories/user.repository.js';

export interface CreateUserDto {
  email: string;
  name: string;
}

@injectable()
export class CreateUserUseCase implements UseCase<CreateUserDto, User> {
  constructor(private userRepository: UserRepository) {}

  async execute(input: CreateUserDto): Promise<User> {
    const existing = await this.userRepository.findByEmail(input.email);
    if (existing) {
      throw new Error('User already exists');
    }

    const user = new User(input.email, input.name);
    return await this.userRepository.save(user);
  }
}

// Presentation: src/presentation/api/user.routes.ts
import { Hono } from 'hono';
import { Container } from 'luminor';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case.js';

const userRoutes = new Hono();

userRoutes.post('/', async (c) => {
  const body = await c.req.json();
  const useCase = Container.get<CreateUserUseCase>('CreateUserUseCase');
  const user = await useCase.execute(body);
  
  return c.json({
    id: user.id,
    email: user.email,
    name: user.name,
  }, 201);
});
```

## Nästa steg

- [Tutorials](/tutorials) - Steg-för-steg tutorials
- [Exempel](/examples) - Fler exempel

