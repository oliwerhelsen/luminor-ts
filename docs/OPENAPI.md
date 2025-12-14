# OpenAPI Documentation Guide

Brewy integrates with OpenAPI 3.0 and Scalar for beautiful, auto-generated API documentation.

## Quick Start

### Basic Setup

```typescript
import { createOpenAPIApp } from 'brewy';

const app = createOpenAPIApp({
  title: 'My API',
  version: '1.0.0',
  description: 'API documentation for my application',
});

// Your routes here
app.get('/hello', (c) => c.json({ message: 'Hello!' }));

// OpenAPI spec available at: /openapi.json
// Documentation UI available at: /api-docs
```

### Custom Documentation Path

```typescript
const app = createOpenAPIApp({
  title: 'My API',
  version: '1.0.0',
  docsPath: '/docs', // Custom path instead of /api-docs
});
```

## Creating Documented Routes

### Simple Route Documentation

```typescript
import { createOpenAPIApp, z } from 'brewy';

const app = createOpenAPIApp({
  title: 'User API',
  version: '1.0.0',
});

const UserDto = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
});

// OpenAPI routes
app.openapi(
  {
    method: 'get',
    path: '/users/{id}',
    request: {
      params: z.object({
        id: z.string(),
      }),
    },
    responses: {
      200: {
        description: 'User found',
        content: {
          'application/json': {
            schema: UserDto,
          },
        },
      },
      404: {
        description: 'User not found',
      },
    },
  },
  async (c) => {
    const { id } = c.req.param();
    // Implementation
    return c.json({ id, name: 'John', email: 'john@example.com' });
  }
);
```

### POST Route with Request Body

```typescript
const CreateUserDto = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

app.openapi(
  {
    method: 'post',
    path: '/users',
    request: {
      body: {
        content: {
          'application/json': {
            schema: CreateUserDto,
          },
        },
      },
    },
    responses: {
      201: {
        description: 'User created successfully',
        content: {
          'application/json': {
            schema: UserDto,
          },
        },
      },
      400: {
        description: 'Invalid request data',
      },
    },
  },
  async (c) => {
    const body = c.req.valid('json');
    // Create user logic
    return c.json({ id: '1', ...body }, 201);
  }
);
```

### Query Parameters

```typescript
const SearchDto = z.object({
  q: z.string().describe('Search query'),
  page: z.string().transform(Number).describe('Page number'),
  limit: z.string().transform(Number).optional().describe('Results per page'),
});

app.openapi(
  {
    method: 'get',
    path: '/search',
    request: {
      query: SearchDto,
    },
    responses: {
      200: {
        description: 'Search results',
        content: {
          'application/json': {
            schema: z.object({
              results: z.array(z.any()),
              total: z.number(),
              page: z.number(),
            }),
          },
        },
      },
    },
  },
  async (c) => {
    const query = c.req.valid('query');
    return c.json({
      results: [],
      total: 0,
      page: query.page,
    });
  }
);
```

## Advanced Documentation

### Tags and Grouping

```typescript
app.openapi(
  {
    method: 'get',
    path: '/users',
    tags: ['Users'], // Groups routes in documentation
    summary: 'List all users',
    description: 'Returns a paginated list of all users',
    responses: {
      200: {
        description: 'Users retrieved successfully',
        content: {
          'application/json': {
            schema: z.array(UserDto),
          },
        },
      },
    },
  },
  async (c) => {
    return c.json([]);
  }
);
```

### Multiple Response Types

```typescript
app.openapi(
  {
    method: 'get',
    path: '/users/{id}',
    request: {
      params: z.object({
        id: z.string(),
      }),
    },
    responses: {
      200: {
        description: 'User found',
        content: {
          'application/json': {
            schema: UserDto,
          },
        },
      },
      404: {
        description: 'User not found',
        content: {
          'application/json': {
            schema: z.object({
              error: z.object({
                code: z.string(),
                message: z.string(),
              }),
            }),
          },
        },
      },
      500: {
        description: 'Internal server error',
      },
    },
  },
  async (c) => {
    const { id } = c.req.param();
    // Implementation
  }
);
```

### Security Definitions

```typescript
const app = createOpenAPIApp({
  title: 'Secure API',
  version: '1.0.0',
});

// Define security scheme in OpenAPI spec
app.doc('/openapi.json', {
  openapi: '3.0.0',
  info: {
    title: 'Secure API',
    version: '1.0.0',
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
});

// Use security in routes
app.openapi(
  {
    method: 'get',
    path: '/protected',
    security: [{ bearerAuth: [] }],
    responses: {
      200: {
        description: 'Protected resource',
      },
      401: {
        description: 'Unauthorized',
      },
    },
  },
  async (c) => {
    return c.json({ data: 'secret' });
  }
);
```

## Reusable Components

### Shared Schemas

```typescript
// Define reusable schemas
const schemas = {
  User: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
  }),
  Error: z.object({
    error: z.object({
      code: z.string(),
      message: z.string(),
    }),
  }),
};

// Use in multiple routes
app.openapi(
  {
    method: 'get',
    path: '/users/{id}',
    responses: {
      200: {
        description: 'User found',
        content: {
          'application/json': {
            schema: schemas.User,
          },
        },
      },
      404: {
        description: 'Not found',
        content: {
          'application/json': {
            schema: schemas.Error,
          },
        },
      },
    },
  },
  async (c) => {
    // Implementation
  }
);
```

### Route Helpers

```typescript
import { createDocumentedRoute } from 'brewy';

const getUserRoute = createDocumentedRoute({
  method: 'get',
  path: '/users/{id}',
  summary: 'Get user by ID',
  tags: ['Users'],
  request: {
    params: z.object({
      id: z.string().uuid(),
    }),
  },
  responses: {
    200: {
      description: 'User found',
      content: {
        'application/json': {
          schema: UserDto,
        },
      },
    },
  },
});

app.openapi(getUserRoute, async (c) => {
  // Implementation
});
```

## Scalar UI Customization

The Scalar UI is automatically configured with a beautiful theme. To customize:

```typescript
import { OpenAPIHono } from '@hono/zod-openapi';
import { apiReference } from '@scalar/hono-api-reference';

const app = new OpenAPIHono();

app.doc('/openapi.json', {
  openapi: '3.0.0',
  info: {
    title: 'My API',
    version: '1.0.0',
  },
});

app.get('/docs', apiReference({
  spec: {
    url: '/openapi.json',
  },
  theme: 'purple', // purple, default, moon, etc.
  layout: 'modern', // modern or classic
  darkMode: true,
}));
```

## Integration with Existing App

You can integrate OpenAPI into an existing Hono app:

```typescript
import { AppFactory } from 'brewy';
import { OpenAPIHono } from '@hono/zod-openapi';
import { apiReference } from '@scalar/hono-api-reference';

// Regular app
const app = AppFactory.create();

// OpenAPI sub-app
const apiApp = new OpenAPIHono();

apiApp.doc('/openapi.json', {
  openapi: '3.0.0',
  info: {
    title: 'API Documentation',
    version: '1.0.0',
  },
});

apiApp.get('/docs', apiReference({
  spec: { url: '/api/openapi.json' },
}));

// Add documented routes
apiApp.openapi(/* ... */);

// Mount API app
app.route('/api', apiApp);

// Regular routes (not documented)
app.get('/', (c) => c.json({ message: 'Hello' }));
```

## Best Practices

1. **Document all public APIs**: Use OpenAPI for external/public APIs
2. **Use descriptions**: Add helpful descriptions to schemas and routes
3. **Group with tags**: Organize routes into logical groups
4. **Response types**: Document all possible responses (200, 400, 404, etc.)
5. **Security**: Define security schemes for protected routes
6. **Examples**: Add examples to schemas for better documentation
7. **Versioning**: Include API version in OpenAPI config

## Example: Complete User API

```typescript
import { createOpenAPIApp, z } from 'brewy';

const app = createOpenAPIApp({
  title: 'User Management API',
  version: '1.0.0',
  description: 'API for managing users',
});

// Schemas
const UserDto = z.object({
  id: z.string().uuid(),
  name: z.string().min(2).describe('User full name'),
  email: z.string().email().describe('User email address'),
  createdAt: z.string().datetime().describe('Creation timestamp'),
});

const CreateUserDto = UserDto.omit({ id: true, createdAt: true });
const UpdateUserDto = CreateUserDto.partial();

// List users
app.openapi(
  {
    method: 'get',
    path: '/users',
    tags: ['Users'],
    summary: 'List all users',
    responses: {
      200: {
        description: 'List of users',
        content: {
          'application/json': {
            schema: z.array(UserDto),
          },
        },
      },
    },
  },
  async (c) => c.json([])
);

// Get user
app.openapi(
  {
    method: 'get',
    path: '/users/{id}',
    tags: ['Users'],
    summary: 'Get user by ID',
    request: {
      params: z.object({
        id: z.string().uuid(),
      }),
    },
    responses: {
      200: {
        description: 'User found',
        content: {
          'application/json': {
            schema: UserDto,
          },
        },
      },
      404: {
        description: 'User not found',
      },
    },
  },
  async (c) => {
    const { id } = c.req.param();
    // Implementation
  }
);

// Create user
app.openapi(
  {
    method: 'post',
    path: '/users',
    tags: ['Users'],
    summary: 'Create a new user',
    request: {
      body: {
        content: {
          'application/json': {
            schema: CreateUserDto,
          },
        },
      },
    },
    responses: {
      201: {
        description: 'User created',
        content: {
          'application/json': {
            schema: UserDto,
          },
        },
      },
      400: {
        description: 'Invalid request',
      },
    },
  },
  async (c) => {
    const body = c.req.valid('json');
    // Implementation
  }
);

// Update user
app.openapi(
  {
    method: 'put',
    path: '/users/{id}',
    tags: ['Users'],
    summary: 'Update user',
    request: {
      params: z.object({
        id: z.string().uuid(),
      }),
      body: {
        content: {
          'application/json': {
            schema: UpdateUserDto,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'User updated',
        content: {
          'application/json': {
            schema: UserDto,
          },
        },
      },
      404: {
        description: 'User not found',
      },
    },
  },
  async (c) => {
    // Implementation
  }
);

// Delete user
app.openapi(
  {
    method: 'delete',
    path: '/users/{id}',
    tags: ['Users'],
    summary: 'Delete user',
    request: {
      params: z.object({
        id: z.string().uuid(),
      }),
    },
    responses: {
      204: {
        description: 'User deleted',
      },
      404: {
        description: 'User not found',
      },
    },
  },
  async (c) => {
    // Implementation
  }
);

export default app;
```

## Next Steps

- [Validation Guide](./VALIDATION.md)
- [Exception Handling](./EXCEPTIONS.md)
- [Middleware Guide](./MIDDLEWARE.md)
