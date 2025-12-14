import type { Database } from "brewy";
import { DatabaseFactory } from "brewy";

let dbInstance: Database | null = null;

export async function getDatabase(): Promise<Database> {
  if (dbInstance) {
    return dbInstance;
  }

  const dbType = "{{DATABASE_TYPE}}" as "sqlite" | "postgresql" | "mysql";

  if (dbType === "sqlite") {
    dbInstance = await DatabaseFactory.create("sqlite", {
      sqlite: {
        filename: "./database.sqlite",
      },
    });
  } else if (dbType === "postgresql") {
    dbInstance = await DatabaseFactory.create("postgresql", {
      postgresql: {
        connectionString:
          process.env.DATABASE_URL ||
          `postgresql://${process.env.DB_USER || "postgres"}:${
            process.env.DB_PASSWORD || ""
          }@${process.env.DB_HOST || "localhost"}:${
            process.env.DB_PORT || "5432"
          }/${process.env.DB_NAME || "{{PROJECT_NAME}}"}`,
      },
    });
  } else if (dbType === "mysql") {
    dbInstance = await DatabaseFactory.create("mysql", {
      mysql: {
        host: process.env.DB_HOST || "localhost",
        port: parseInt(process.env.DB_PORT || "3306"),
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "",
        database: process.env.DB_NAME || "{{PROJECT_NAME}}",
      },
    });
  } else {
    throw new Error(`Unsupported database type: ${dbType}`);
  }

  return dbInstance;
}
