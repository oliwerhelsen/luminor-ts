# Validation Guide with Zod

Brewy integrates Zod for type-safe runtime validation with automatic TypeScript type inference.

## Installation

Zod and validation utilities are included with brewy:

```typescript
import { z, validateJson, validateQuery, validateParam } from 'brewy';
```

## Creating DTOs

### Basic DTO

```typescript
import { z } from 'zod';

export const CreateUserDto = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type CreateUserDto = z.infer<typeof CreateUserDto>;
```

### DTO with Optional Fields

```typescript
export const UpdateUserDto = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  age: z.number().int().positive().optional(),
});

export type UpdateUserDto = z.infer<typeof UpdateUserDto>;
```

### Nested Objects

```typescript
export const CreateOrderDto = z.object({
  customer: z.object({
    name: z.string(),
    email: z.string().email(),
  }),
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().int().positive(),
  })),
  total: z.number().positive(),
});

export type CreateOrderDto = z.infer<typeof CreateOrderDto>;
```

### Enums

```typescript
export const UserRole = z.enum(['admin', 'user', 'guest']);

export const CreateUserDto = z.object({
  name: z.string(),
  email: z.string().email(),
  role: UserRole,
});
```

## Using Validation in Routes

### JSON Body Validation

```typescript
import { Hono } from 'hono';
import { validateJson } from 'brewy';
import { CreateUserDto } from './dtos/create-user.dto.js';

const app = new Hono();

app.post('/users', validateJson(CreateUserDto), async (c) => {
  const body = c.req.valid('json'); // Type-safe and validated
  
  // body is typed as CreateUserDto
  console.log(body.email, body.name);
  
  return c.json({ success: true });
});
```

### Query Parameter Validation

```typescript
import { validateQuery } from 'brewy';
import { z } from 'zod';

const SearchQueryDto = z.object({
  q: z.string(),
  page: z.string().transform(Number).pipe(z.number().int().positive()).optional(),
  limit: z.string().transform(Number).pipe(z.number().int().positive()).optional(),
});

app.get('/search', validateQuery(SearchQueryDto), async (c) => {
  const query = c.req.valid('query');
  
  console.log(query.q, query.page, query.limit);
  
  return c.json({ results: [] });
});
```

### Route Parameter Validation

```typescript
import { validateParam } from 'brewy';
import { z } from 'zod';

const UserParamDto = z.object({
  id: z.string().uuid('Invalid user ID format'),
});

app.get('/users/:id', validateParam(UserParamDto), async (c) => {
  const { id } = c.req.valid('param');
  
  return c.json({ id });
});
```

### Form Data Validation

```typescript
import { validateForm } from 'brewy';
import { z } from 'zod';

const LoginFormDto = z.object({
  username: z.string(),
  password: z.string(),
});

app.post('/login', validateForm(LoginFormDto), async (c) => {
  const form = c.req.valid('form');
  
  return c.json({ username: form.username });
});
```

## Validation Errors

When validation fails, Zod automatically returns a 400 error with details:

```json
{
  "error": {
    "issues": [
      {
        "code": "too_small",
        "minimum": 8,
        "type": "string",
        "inclusive": true,
        "message": "Password must be at least 8 characters",
        "path": ["password"]
      }
    ]
  }
}
```

## Custom Validation

### Custom Error Messages

```typescript
export const CreateUserDto = z.object({
  email: z.string()
    .email({ message: "Please provide a valid email address" }),
  password: z.string()
    .min(8, { message: "Password is too short - minimum 8 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
});
```

### Custom Validators

```typescript
const isValidUsername = (username: string) => {
  return /^[a-z0-9_]+$/.test(username);
};

export const CreateUserDto = z.object({
  username: z.string()
    .refine(isValidUsername, {
      message: "Username can only contain lowercase letters, numbers, and underscores",
    }),
});
```

### Async Validation

```typescript
const isEmailUnique = async (email: string) => {
  const exists = await checkEmailExists(email);
  return !exists;
};

export const CreateUserDto = z.object({
  email: z.string()
    .email()
    .refine(isEmailUnique, {
      message: "Email is already taken",
    }),
});
```

## Advanced Patterns

### Discriminated Unions

```typescript
export const PaymentDto = z.discriminatedUnion('method', [
  z.object({
    method: z.literal('card'),
    cardNumber: z.string(),
    cvv: z.string(),
  }),
  z.object({
    method: z.literal('paypal'),
    email: z.string().email(),
  }),
  z.object({
    method: z.literal('bank'),
    accountNumber: z.string(),
  }),
]);
```

### Transformations

```typescript
export const CreateUserDto = z.object({
  email: z.string().email().transform(v => v.toLowerCase()),
  name: z.string().transform(v => v.trim()),
  birthdate: z.string().transform(v => new Date(v)),
});
```

### Partial and Pick

```typescript
// Make all fields optional
export const UpdateUserDto = CreateUserDto.partial();

// Pick specific fields
export const UserEmailDto = CreateUserDto.pick({ email: true });

// Omit specific fields
export const UserWithoutPasswordDto = CreateUserDto.omit({ password: true });
```

## Generating DTOs with CLI

```bash
# Generate a new DTO
brewy g dto create-user

# The generated file includes a template:
```

```typescript
import { z } from 'zod';

export const CreateUserDto = z.object({
  // Add your fields here
  // Example:
  // name: z.string().min(1),
  // email: z.string().email(),
  // age: z.number().int().positive().optional(),
});

export type CreateUserDto = z.infer<typeof CreateUserDto>;
```

## Best Practices

1. **Co-locate DTOs**: Keep DTOs in `application/dtos/` near use cases
2. **One DTO per operation**: Create separate DTOs for create, update, etc.
3. **Reuse schemas**: Use `.pick()`, `.omit()`, `.partial()` to derive DTOs
4. **Meaningful names**: Use descriptive names like `CreateUserDto`, `UpdateUserDto`
5. **Type inference**: Always export both the schema and the inferred type
6. **Custom messages**: Provide user-friendly error messages
7. **Validate early**: Use validation middleware before use case execution

## Integration with Use Cases

```typescript
import { UseCase, ValidationException } from 'brewy';
import { CreateUserDto } from '../dtos/create-user.dto.js';

export class CreateUserUseCase implements UseCase<CreateUserDto, User> {
  async execute(input: CreateUserDto): Promise<User> {
    // Input is already validated by middleware
    // Additional business validation if needed
    if (await this.userExists(input.email)) {
      throw new ValidationException(
        'User with this email already exists',
        'email'
      );
    }
    
    // Create user...
  }
}
```

## Next Steps

- [Exception Handling](./EXCEPTIONS.md)
- [Middleware Guide](./MIDDLEWARE.md)
- [OpenAPI Documentation](./OPENAPI.md)
