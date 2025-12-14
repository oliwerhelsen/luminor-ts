import { serve } from "@hono/node-server";
import { AppFactory } from "brewy";
import { auth } from "./auth.js";
import { postsRouter } from "./routes/posts.js";
import { profileRouter } from "./routes/profile.js";

const app = AppFactory.create();

// Mount Better Auth endpoints
app.on(["POST", "GET"], "/api/auth/*", (c) => {
  return auth.handler(c.req.raw);
});

// Mount application routes
app.route("/api/posts", postsRouter);
app.route("/api/me", profileRouter);

// Welcome route
app.get("/", (c) => {
  return c.json({
    message: "Better Auth + Brewy Example API",
    version: "1.0.0",
    endpoints: {
      auth: {
        signUp: "POST /api/auth/sign-up/email",
        signIn: "POST /api/auth/sign-in/email",
        signOut: "POST /api/auth/sign-out",
        getSession: "GET /api/auth/get-session",
      },
      posts: {
        list: "GET /api/posts",
        get: "GET /api/posts/:id",
        create: "POST /api/posts (protected)",
        delete: "DELETE /api/posts/:id (protected)",
      },
      profile: {
        get: "GET /api/me (protected)",
      },
    },
  });
});

const port = parseInt(process.env.PORT || "3000");
console.log(`
🚀 Server running at http://localhost:${port}

📚 Try these commands:

1️⃣  Sign up:
   curl -X POST http://localhost:${port}/api/auth/sign-up/email \\
     -H "Content-Type: application/json" \\
     -d '{"email":"test@example.com","password":"password123","name":"Test User"}' \\
     -c cookies.txt

2️⃣  Sign in:
   curl -X POST http://localhost:${port}/api/auth/sign-in/email \\
     -H "Content-Type: application/json" \\
     -d '{"email":"test@example.com","password":"password123"}' \\
     -c cookies.txt

3️⃣  Create a post:
   curl -X POST http://localhost:${port}/api/posts \\
     -H "Content-Type: application/json" \\
     -d '{"title":"Hello","content":"My first post!"}' \\
     -b cookies.txt

4️⃣  View posts:
   curl http://localhost:${port}/api/posts

5️⃣  Get profile:
   curl http://localhost:${port}/api/me -b cookies.txt
`);

serve({ fetch: app.fetch, port });
