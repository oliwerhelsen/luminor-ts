import { serve } from "@hono/node-server";
import {
  AppFactory,
  AuthService,
  Container,
  Logger,
  loggingMiddleware,
  LogLevel,
} from "brewy";
import "reflect-metadata";
import { getDatabase } from "./infrastructure/database/database.js";
import { userRoutes } from "./presentation/api/user.routes.js";

// Setup DI
Container.register("Logger", () => new Logger(LogLevel.INFO));
Container.register("AuthService", () => {
  return new AuthService({
    secret: process.env.JWT_SECRET || "your-secret-key-change-in-production",
    expiresIn: "7d",
  });
});

// Initialize database
await getDatabase();

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

// Routes
app.route("/api/users", userRoutes);

app.get("/", (c) => {
  return c.json({
    message: "Welcome to brewy!",
    version: "1.0.0",
  });
});

const port = parseInt(process.env.PORT || "3000");
console.log(`🚀 Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
