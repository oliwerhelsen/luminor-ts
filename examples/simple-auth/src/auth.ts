import { betterAuth } from "better-auth";

// Simple in-memory auth setup for demonstration
// In production, use a real database with Drizzle adapter
export const auth = betterAuth({
  database: {
    // Using in-memory storage for this example
    // Replace with drizzleAdapter(db, { provider: 'sqlite' }) in production
    provider: "memory" as any,
  },
  secret: process.env.AUTH_SECRET || "demo-secret-change-in-production",
  baseURL: process.env.BASE_URL || "http://localhost:3000",
  emailAndPassword: {
    enabled: true,
  },
});

export type Auth = typeof auth;
