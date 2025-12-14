import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import type { Database } from '../database/factory.js';

export interface BetterAuthConfig {
  database: Database;
  databaseType: 'sqlite' | 'pg' | 'mysql';
  secret: string;
  baseURL?: string;
  trustedOrigins?: string[];
}

/**
 * Create a Better Auth instance with Drizzle adapter
 *
 * @example
 * ```typescript
 * const auth = createBetterAuth({
 *   database: db,
 *   databaseType: 'sqlite',
 *   secret: process.env.AUTH_SECRET || 'your-secret-key',
 *   baseURL: 'http://localhost:3000',
 *   trustedOrigins: ['http://localhost:5173']
 * });
 * ```
 */
export function createBetterAuth(config: BetterAuthConfig) {
  return betterAuth({
    database: drizzleAdapter(config.database, {
      provider: config.databaseType,
    }),
    secret: config.secret,
    baseURL: config.baseURL,
    trustedOrigins: config.trustedOrigins,
    emailAndPassword: {
      enabled: true,
    },
  });
}

export type Auth = ReturnType<typeof createBetterAuth>;
