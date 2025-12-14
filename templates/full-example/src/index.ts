import { serve } from "@hono/node-server";
import {
  AppFactory,
  Container,
  Logger,
  loggingMiddleware,
  LogLevel,
  betterAuthMiddleware,
  requestIdMiddleware,
  corsMiddleware,
} from "brewy";
import "reflect-metadata";
import { getDatabase } from "./infrastructure/database/database.js";
import { getAuth } from "./infrastructure/auth/auth.config.js";
import { userRoutes } from "./presentation/api/user.routes.js";

// Setup DI
Container.register("Logger", () => new Logger(LogLevel.INFO));

// Initialize database
await getDatabase();

// Initialize auth (if enabled)
const authEnabled = "{{AUTH_ENABLED}}" === "true";
const auth = authEnabled ? await getAuth() : null;

// Create app with ExceptionFilter enabled by default
const app = AppFactory.create();

// Middleware
app.use("*", requestIdMiddleware()); // Add request ID tracking
app.use("*", loggingMiddleware()); // Logging
app.use("*", corsMiddleware({ // CORS configuration
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));

if (auth) {
  // Mount Better Auth endpoints
  app.on(["POST", "GET"], "/api/auth/*", (c) => {
    return auth.handler(c.req.raw);
  });

  // Add session middleware to all routes
  app.use("*", betterAuthMiddleware(auth));
}

// Routes
app.route("/api/users", userRoutes);

app.get("/", (c) => {
  return c.json({
    message: "Welcome to brewy!",
    version: "1.0.0",
    auth: authEnabled ? "enabled" : "disabled",
    features: {
      exceptionHandling: true,
      zodValidation: true,
      openApiDocs: false, // Set to true if using OpenAPI
      middleware: ['requestId', 'logging', 'cors'],
    },
  });
});

const port = parseInt(process.env.PORT || "3000");
console.log(`🚀 Server is running on http://localhost:${port}`);
if (authEnabled) {
  console.log(`🔐 Authentication enabled at http://localhost:${port}/api/auth`);
}
console.log(`📝 Exception handling: enabled`);
console.log(`✅ Zod validation: enabled`);

serve({
  fetch: app.fetch,
  port,
});
