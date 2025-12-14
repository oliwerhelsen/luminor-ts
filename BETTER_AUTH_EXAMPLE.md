# Better Auth Usage Examples

This guide shows how to use Better Auth with Brewy for authentication.

## Table of Contents
- [Setup](#setup)
- [Creating Auth Routes](#creating-auth-routes)
- [Protecting Routes](#protecting-routes)
- [Client Usage](#client-usage)
- [Complete Example](#complete-example)

## Setup

### 1. Create a New Brewy Project

```bash
brewy create-app my-auth-app
# Select:
# - Database: SQLite (or your preference)
# - Project type: full-example
# - Authentication: Better Auth (recommended)

cd my-auth-app
npm install
```

### 2. Configure Environment Variables

Create a `.env` file:

```env
AUTH_SECRET=your-super-secret-key-change-in-production
BASE_URL=http://localhost:3000
TRUSTED_ORIGINS=http://localhost:5173,http://localhost:3001
```

### 3. Generate Database Schema

Better Auth will automatically create the necessary database tables:

```bash
npm run db:generate
npm run db:migrate
```

## Creating Auth Routes

Better Auth provides built-in endpoints at `/api/auth/*`:

### Available Endpoints

```typescript
// Sign up with email/password
POST /api/auth/sign-up/email
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe"
}

// Sign in with email/password
POST /api/auth/sign-in/email
{
  "email": "user@example.com",
  "password": "securepassword"
}

// Sign out
POST /api/auth/sign-out

// Get current session
GET /api/auth/get-session

// Update user
POST /api/auth/update-user
{
  "name": "Jane Doe"
}

// Change password
POST /api/auth/change-password
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword"
}
```

## Protecting Routes

### Using `requireAuth` Middleware

```typescript
import { Hono } from "hono";
import { requireAuth, type AuthContext } from "brewy";
import { getAuth } from "../infrastructure/auth/auth.config.js";

const protectedRoutes = new Hono();

// Initialize auth
const auth = await getAuth();

// Apply authentication to all routes
protectedRoutes.use("*", requireAuth(auth));

// Now all routes require authentication
protectedRoutes.get("/profile", async (c: AuthContext) => {
  const user = c.get("user"); // User is guaranteed to exist

  return c.json({
    profile: {
      id: user.id,
      email: user.email,
      name: user.name,
      emailVerified: user.emailVerified,
    },
  });
});

protectedRoutes.get("/dashboard", async (c: AuthContext) => {
  const user = c.get("user");
  const session = c.get("session");

  return c.json({
    message: `Welcome to your dashboard, ${user.name}!`,
    sessionId: session.id,
  });
});

export { protectedRoutes };
```

### Using `betterAuthMiddleware` for Optional Auth

```typescript
import { Hono } from "hono";
import { betterAuthMiddleware, type AuthContext } from "brewy";
import { getAuth } from "../infrastructure/auth/auth.config.js";

const publicRoutes = new Hono();
const auth = await getAuth();

// Add session to context, but don't require it
publicRoutes.use("*", betterAuthMiddleware(auth));

publicRoutes.get("/posts", async (c: AuthContext) => {
  const user = c.get("user"); // May be null

  // Show different content based on auth status
  if (user) {
    return c.json({
      message: `Hello ${user.name}!`,
      posts: await getPersonalizedPosts(user.id),
    });
  }

  return c.json({
    message: "Public posts",
    posts: await getPublicPosts(),
  });
});
```

## Client Usage

### Using Fetch API

```typescript
// Sign Up
async function signUp(email: string, password: string, name: string) {
  const response = await fetch("http://localhost:3000/api/auth/sign-up/email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // Important for cookies
    body: JSON.stringify({ email, password, name }),
  });

  const data = await response.json();
  return data;
}

// Sign In
async function signIn(email: string, password: string) {
  const response = await fetch("http://localhost:3000/api/auth/sign-in/email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  return data;
}

// Get Current User
async function getCurrentUser() {
  const response = await fetch("http://localhost:3000/api/auth/get-session", {
    credentials: "include",
  });

  const data = await response.json();
  return data.user;
}

// Sign Out
async function signOut() {
  const response = await fetch("http://localhost:3000/api/auth/sign-out", {
    method: "POST",
    credentials: "include",
  });

  return response.ok;
}

// Access Protected Route
async function getProfile() {
  const response = await fetch("http://localhost:3000/api/profile", {
    credentials: "include",
  });

  if (response.status === 401) {
    throw new Error("Unauthorized");
  }

  return response.json();
}
```

### Using Better Auth Client (React Example)

Better Auth provides official client libraries:

```bash
npm install better-auth
```

```tsx
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: "http://localhost:3000",
});

// In your React component
function LoginForm() {
  const { signIn, signUp, useSession } = authClient;
  const { data: session } = useSession();

  const handleSignIn = async (email: string, password: string) => {
    await signIn.email({
      email,
      password,
    });
  };

  if (session) {
    return <div>Welcome, {session.user.name}!</div>;
  }

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleSignIn(email, password);
    }}>
      {/* Form fields */}
    </form>
  );
}
```

## Complete Example

Here's a complete example of a blog API with authentication:

### `src/presentation/api/blog.routes.ts`

```typescript
import { Hono } from "hono";
import {
  requireAuth,
  betterAuthMiddleware,
  type AuthContext
} from "brewy";
import { getAuth } from "../../infrastructure/auth/auth.config.js";

const blogRoutes = new Hono();
const auth = await getAuth();

// Add session to all routes
blogRoutes.use("*", betterAuthMiddleware(auth));

// Public: List all posts
blogRoutes.get("/", async (c: AuthContext) => {
  const posts = await db.select().from(postsTable);

  return c.json({ posts });
});

// Public: Get single post
blogRoutes.get("/:id", async (c: AuthContext) => {
  const id = c.req.param("id");
  const post = await db.select()
    .from(postsTable)
    .where(eq(postsTable.id, id))
    .limit(1);

  if (!post[0]) {
    return c.json({ error: "Post not found" }, 404);
  }

  return c.json({ post: post[0] });
});

// Protected: Create post (requires auth)
blogRoutes.post("/", requireAuth(auth), async (c: AuthContext) => {
  const user = c.get("user"); // Guaranteed to exist
  const body = await c.req.json();

  const newPost = await db.insert(postsTable).values({
    title: body.title,
    content: body.content,
    authorId: user.id,
    createdAt: new Date(),
  }).returning();

  return c.json({ post: newPost[0] }, 201);
});

// Protected: Update post (requires auth + ownership)
blogRoutes.put("/:id", requireAuth(auth), async (c: AuthContext) => {
  const user = c.get("user");
  const id = c.req.param("id");
  const body = await c.req.json();

  // Check ownership
  const post = await db.select()
    .from(postsTable)
    .where(eq(postsTable.id, id))
    .limit(1);

  if (!post[0]) {
    return c.json({ error: "Post not found" }, 404);
  }

  if (post[0].authorId !== user.id) {
    return c.json({ error: "Forbidden" }, 403);
  }

  // Update
  const updated = await db.update(postsTable)
    .set({
      title: body.title,
      content: body.content,
      updatedAt: new Date(),
    })
    .where(eq(postsTable.id, id))
    .returning();

  return c.json({ post: updated[0] });
});

// Protected: Delete post (requires auth + ownership)
blogRoutes.delete("/:id", requireAuth(auth), async (c: AuthContext) => {
  const user = c.get("user");
  const id = c.req.param("id");

  // Check ownership
  const post = await db.select()
    .from(postsTable)
    .where(eq(postsTable.id, id))
    .limit(1);

  if (!post[0]) {
    return c.json({ error: "Post not found" }, 404);
  }

  if (post[0].authorId !== user.id) {
    return c.json({ error: "Forbidden" }, 403);
  }

  await db.delete(postsTable).where(eq(postsTable.id, id));

  return c.json({ message: "Post deleted" });
});

export { blogRoutes };
```

### `src/index.ts`

```typescript
import { serve } from "@hono/node-server";
import { AppFactory, betterAuthMiddleware } from "brewy";
import { getAuth } from "./infrastructure/auth/auth.config.js";
import { blogRoutes } from "./presentation/api/blog.routes.js";

const auth = await getAuth();
const app = AppFactory.create();

// Mount Better Auth endpoints
app.on(["POST", "GET"], "/api/auth/*", (c) => {
  return auth.handler(c.req.raw);
});

// Add session middleware globally
app.use("*", betterAuthMiddleware(auth));

// Mount routes
app.route("/api/posts", blogRoutes);

serve({ fetch: app.fetch, port: 3000 });
```

## Testing with cURL

```bash
# Sign up
curl -X POST http://localhost:3000/api/auth/sign-up/email \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}' \
  -c cookies.txt

# Sign in
curl -X POST http://localhost:3000/api/auth/sign-in/email \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  -c cookies.txt

# Access protected route
curl http://localhost:3000/api/posts \
  -b cookies.txt

# Create a post (protected)
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"My First Post","content":"Hello, world!"}' \
  -b cookies.txt
```

## Advanced Features

Better Auth supports many advanced features out of the box:

### OAuth Providers (Google, GitHub, etc.)

```typescript
import { createBetterAuth } from 'brewy';

const auth = createBetterAuth({
  database: db,
  databaseType: 'sqlite',
  secret: process.env.AUTH_SECRET,
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    },
  },
});
```

### Two-Factor Authentication

```typescript
// Enable 2FA in config
const auth = createBetterAuth({
  database: db,
  databaseType: 'sqlite',
  secret: process.env.AUTH_SECRET,
  plugins: [
    twoFactor({
      issuer: "MyApp",
    }),
  ],
});
```

### Magic Link Authentication

```typescript
// Configure magic link
const auth = createBetterAuth({
  database: db,
  databaseType: 'sqlite',
  secret: process.env.AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
  },
  magicLink: {
    enabled: true,
    sendMagicLink: async ({ email, url }) => {
      // Send email with magic link
      await sendEmail(email, url);
    },
  },
});
```

## Best Practices

1. **Always use HTTPS in production**
2. **Set strong AUTH_SECRET** (use `openssl rand -hex 32`)
3. **Configure CORS properly** for your frontend domain
4. **Use environment variables** for sensitive configuration
5. **Validate user input** even in protected routes
6. **Implement rate limiting** for auth endpoints
7. **Log authentication events** for security monitoring

## Resources

- [Better Auth Documentation](https://www.better-auth.com/docs)
- [Brewy Documentation](https://github.com/oliwerhelsen/luminor-ts)
- [Hono Documentation](https://hono.dev)
