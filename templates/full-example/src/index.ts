import { serve } from "@hono/node-server";
import {
  AppFactory,
  Container,
  Logger,
  loggingMiddleware,
  LogLevel,
  betterAuthMiddleware,
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

// Create app
const app = AppFactory.create({
  errorHandler: (error, c) => {
    const logger = Container.get<Logger>("Logger");
    logger.error("Unhandled error", error);
    return c.json({ error: { message: error.message } }, 500);
  },
});

// Middleware
app.use("*", loggingMiddleware());

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
  });
});

const port = parseInt(process.env.PORT || "3000");
console.log(`🚀 Server is running on http://localhost:${port}`);
if (authEnabled) {
  console.log(`🔐 Authentication enabled at http://localhost:${port}/api/auth`);
}

serve({
  fetch: app.fetch,
  port,
});
