import { createBetterAuth } from "brewy";
import { getDatabase } from "../database/database.js";

/**
 * Better Auth configuration
 * Only used if authentication is enabled during project setup
 */
export async function getAuth() {
  const db = await getDatabase();

  return createBetterAuth({
    database: db,
    databaseType: "{{DATABASE_TYPE}}",
    secret: process.env.AUTH_SECRET || "change-this-secret-in-production",
    baseURL: process.env.BASE_URL || "http://localhost:3000",
    trustedOrigins: process.env.TRUSTED_ORIGINS?.split(",") || [
      "http://localhost:5173",
    ],
  });
}

export type Auth = Awaited<ReturnType<typeof getAuth>>;
