# Exception Handling Guide

Brewy provides a comprehensive exception handling system following DDD principles with automatic HTTP status code mapping.

## Exception Hierarchy

### Domain Exceptions

Domain exceptions represent violations of business rules and constraints.

```typescript
import {
  DomainException,
  ValidationException,
  EntityNotFoundException,
  BusinessRuleViolationException,
} from 'brewy';
```

#### ValidationException

For validation errors within domain entities.

```typescript
import { ValidationException } from 'brewy';

class Email {
  constructor(private value: string) {
    if (!this.isValid(value)) {
      throw new ValidationException(
        'Invalid email format',
        'email'
      );
    }
  }
  
  private isValid(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}
```

**HTTP Status**: 400 Bad Request  
**Error Code**: `VALIDATION_ERROR`

#### EntityNotFoundException

When an entity cannot be found by its identifier.

```typescript
import { EntityNotFoundException } from 'brewy';

async execute(userId: string): Promise<User> {
  const user = await this.repository.findById(userId);
  
  if (!user) {
    throw new EntityNotFoundException('User', userId);
  }
  
  return user;
}
```

**HTTP Status**: 404 Not Found  
**Error Code**: `ENTITY_NOT_FOUND`

#### BusinessRuleViolationException

For business rule violations.

```typescript
import { BusinessRuleViolationException } from 'brewy';

class Order {
  addItem(item: OrderItem): void {
    if (this.isFinalized) {
      throw new BusinessRuleViolationException(
        'Cannot add items to finalized order',
        'ORDER_FINALIZED'
      );
    }
    this.items.push(item);
  }
}
```

**HTTP Status**: 400 Bad Request  
**Error Code**: `DOMAIN_ERROR`

### Application Exceptions

Application exceptions handle use case and application logic errors.

```typescript
import {
  ApplicationException,
  UseCaseException,
  UnauthorizedException,
  ForbiddenException,
} from 'brewy';
```

#### UseCaseException

For use case execution errors.

```typescript
import { UseCaseException } from 'brewy';

export class CreateUserUseCase {
  async execute(input: CreateUserDto): Promise<User> {
    try {
      // Use case logic
    } catch (error) {
      throw new UseCaseException(
        'Failed to create user',
        'CreateUserUseCase'
      );
    }
  }
}
```

**HTTP Status**: 400 Bad Request  
**Error Code**: `APPLICATION_ERROR`

#### UnauthorizedException

For authentication failures.

```typescript
import { UnauthorizedException } from 'brewy';

export function requireAuth(): MiddlewareHandler {
  return async (c, next) => {
    const token = c.req.header('Authorization');
    
    if (!token) {
      throw new UnauthorizedException('Missing authentication token');
    }
    
    await next();
  };
}
```

**HTTP Status**: 401 Unauthorized  
**Error Code**: `UNAUTHORIZED`

#### ForbiddenException

For authorization failures.

```typescript
import { ForbiddenException } from 'brewy';

export class DeleteUserUseCase {
  async execute(userId: string, currentUserId: string): Promise<void> {
    if (userId !== currentUserId && !this.isAdmin(currentUserId)) {
      throw new ForbiddenException('You do not have permission to delete this user');
    }
    
    await this.repository.delete(userId);
  }
}
```

**HTTP Status**: 403 Forbidden  
**Error Code**: `FORBIDDEN`

### Infrastructure Exceptions

Infrastructure exceptions handle external system errors.

```typescript
import {
  InfrastructureException,
  DatabaseException,
  ExternalServiceException,
} from 'brewy';
```

#### DatabaseException

For database operation errors.

```typescript
import { DatabaseException } from 'brewy';

export class UserRepository {
  async save(user: User): Promise<void> {
    try {
      await this.db.insert(users).values(user);
    } catch (error) {
      throw new DatabaseException(
        'Failed to save user',
        'insert',
        error as Error
      );
    }
  }
}
```

**HTTP Status**: 503 Service Unavailable  
**Error Code**: `INFRASTRUCTURE_ERROR`

#### ExternalServiceException

For external API/service errors.

```typescript
import { ExternalServiceException } from 'brewy';

export class PaymentService {
  async processPayment(amount: number): Promise<void> {
    try {
      const response = await fetch('https://api.payment.com/charge', {
        method: 'POST',
        body: JSON.stringify({ amount }),
      });
      
      if (!response.ok) {
        throw new ExternalServiceException(
          'Payment processing failed',
          'PaymentAPI',
          response.status
        );
      }
    } catch (error) {
      throw new ExternalServiceException(
        'Payment service unavailable',
        'PaymentAPI'
      );
    }
  }
}
```

**HTTP Status**: 503 Service Unavailable  
**Error Code**: `INFRASTRUCTURE_ERROR`

## ExceptionFilter

The `ExceptionFilter` automatically handles all exceptions and maps them to appropriate HTTP responses.

### Automatic Error Handling

The ExceptionFilter is enabled by default in `AppFactory`:

```typescript
import { AppFactory } from 'brewy';

const app = AppFactory.create(); // ExceptionFilter enabled by default
```

### Error Response Format

All exceptions return a consistent JSON response:

```json
{
  "error": {
    "code": "ENTITY_NOT_FOUND",
    "message": "User with id 123 not found",
    "details": {
      "entityName": "User",
      "entityId": "123"
    }
  }
}
```

In development mode, stack traces are included:

```json
{
  "error": {
    "code": "ENTITY_NOT_FOUND",
    "message": "User with id 123 not found",
    "details": {
      "entityName": "User",
      "entityId": "123"
    },
    "stack": "Error: User with id 123 not found\n    at ..."
  }
}
```

## Usage Patterns

### In Domain Entities

```typescript
import { ValidationException } from 'brewy';

export class User extends BaseEntity {
  changeEmail(newEmail: string): void {
    if (!this.isValidEmail(newEmail)) {
      throw new ValidationException(
        'Invalid email format',
        'email'
      );
    }
    
    this.email = newEmail;
    this.updateTimestamp();
  }
  
  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}
```

### In Use Cases

```typescript
import { EntityNotFoundException, UseCaseException } from 'brewy';

export class UpdateUserUseCase {
  async execute(input: UpdateUserInput): Promise<User> {
    // Find entity
    const user = await this.repository.findById(input.userId);
    if (!user) {
      throw new EntityNotFoundException('User', input.userId);
    }
    
    // Update entity
    try {
      user.changeName(input.name);
      user.changeEmail(input.email);
      
      await this.repository.save(user);
      
      return user;
    } catch (error) {
      if (error instanceof ValidationException) {
        throw error; // Re-throw domain exceptions
      }
      throw new UseCaseException(
        'Failed to update user',
        'UpdateUserUseCase'
      );
    }
  }
}
```

### In Repositories

```typescript
import { DatabaseException } from 'brewy';

export class UserRepositoryImpl {
  async findById(id: string): Promise<User | null> {
    try {
      const result = await this.db
        .select()
        .from(users)
        .where(eq(users.id, id))
        .limit(1);
      
      return result[0] ? this.toDomain(result[0]) : null;
    } catch (error) {
      throw new DatabaseException(
        'Failed to find user',
        'findById',
        error as Error
      );
    }
  }
}
```

### In Routes

Routes don't need explicit error handling - ExceptionFilter handles it:

```typescript
import { Hono } from 'hono';
import { Container } from 'brewy';

const app = new Hono();

app.get('/users/:id', async (c) => {
  const useCase = Container.get<GetUserUseCase>('GetUserUseCase');
  const user = await useCase.execute(c.req.param('id'));
  
  // No try-catch needed - exceptions are handled automatically
  return c.json(user);
});
```

## Custom Exception Filter

To customize error handling, provide your own error handler:

```typescript
import { AppFactory, ExceptionFilter } from 'brewy';

const app = AppFactory.create({
  errorHandler: (error, c) => {
    // Custom logging
    console.error('Custom error handler:', error);
    
    // Use default ExceptionFilter
    return ExceptionFilter.handle(error, c);
  },
});
```

Or disable ExceptionFilter completely:

```typescript
const app = AppFactory.create({
  useExceptionFilter: false,
  errorHandler: (error, c) => {
    // Fully custom error handling
    return c.json({ error: error.message }, 500);
  },
});
```

## Best Practices

1. **Throw domain exceptions in entities**: Keep business rules in the domain layer
2. **Catch and wrap in use cases**: Catch domain exceptions and add context
3. **Let infrastructure fail**: Don't catch infrastructure exceptions, let them bubble up
4. **Don't catch in routes**: Let ExceptionFilter handle all exceptions
5. **Use specific exceptions**: Don't use generic `Error`, use typed exceptions
6. **Provide context**: Include relevant details (field names, entity IDs, etc.)
7. **Log errors**: Use Logger for error logging at appropriate levels

## Examples

### Complete Example

```typescript
// Domain Entity
class User extends BaseEntity {
  changeName(newName: string): void {
    if (!newName || newName.trim().length < 2) {
      throw new ValidationException(
        'Name must be at least 2 characters',
        'name'
      );
    }
    this.name = newName;
  }
}

// Repository
class UserRepository {
  async save(user: User): Promise<void> {
    try {
      await this.db.update(users).set(user).where(eq(users.id, user.id));
    } catch (error) {
      throw new DatabaseException('Failed to save user', 'save', error as Error);
    }
  }
}

// Use Case
class UpdateUserNameUseCase {
  async execute(userId: string, newName: string): Promise<User> {
    const user = await this.repository.findById(userId);
    if (!user) {
      throw new EntityNotFoundException('User', userId);
    }
    
    user.changeName(newName); // May throw ValidationException
    await this.repository.save(user); // May throw DatabaseException
    
    return user;
  }
}

// Route handler
app.put('/users/:id/name', validateJson(UpdateNameDto), async (c) => {
  const useCase = Container.get<UpdateUserNameUseCase>('UpdateUserNameUseCase');
  const { name } = c.req.valid('json');
  const user = await useCase.execute(c.req.param('id'), name);
  
  return c.json(user);
});
// All exceptions handled automatically by ExceptionFilter
```

## Next Steps

- [Validation Guide](./VALIDATION.md)
- [Middleware Guide](./MIDDLEWARE.md)
- [CLI Commands](./CLI_COMMANDS.md)
