import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import type { MySql2Database } from 'drizzle-orm/mysql2';
import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import type { AnyMySqlDatabase, AnyPgDatabase, AnySQLiteDatabase } from 'drizzle-orm';

export type Database =
  | AnySQLiteDatabase
  | AnyPgDatabase
  | AnyMySqlDatabase;

export interface DatabaseConfig {
  sqlite?: {
    filename: string;
  };
  postgresql?: {
    connectionString: string;
  };
  mysql?: {
    host: string;
    port?: number;
    user: string;
    password: string;
    database: string;
  };
}

export class DatabaseFactory {
  static async create(
    type: 'sqlite' | 'postgresql' | 'mysql',
    config: DatabaseConfig
  ): Promise<Database> {
    switch (type) {
      case 'sqlite': {
        if (!config.sqlite) {
          throw new Error('SQLite config is required');
        }
        const { drizzle } = await import('drizzle-orm/better-sqlite3');
        const Database = (await import('better-sqlite3')).default;
        const sqlite = new Database(config.sqlite.filename);
        return drizzle(sqlite);
      }

      case 'postgresql': {
        if (!config.postgresql) {
          throw new Error('PostgreSQL config is required');
        }
        const { drizzle } = await import('drizzle-orm/node-postgres');
        const { Pool } = await import('pg');
        const pool = new Pool({
          connectionString: config.postgresql.connectionString,
        });
        return drizzle(pool);
      }

      case 'mysql': {
        if (!config.mysql) {
          throw new Error('MySQL config is required');
        }
        const { drizzle } = await import('drizzle-orm/mysql2');
        const mysql = await import('mysql2/promise');
        const connection = await mysql.createConnection({
          host: config.mysql.host,
          port: config.mysql.port || 3306,
          user: config.mysql.user,
          password: config.mysql.password,
          database: config.mysql.database,
        });
        return drizzle(connection);
      }

      default:
        throw new Error(`Unsupported database type: ${type}`);
    }
  }
}

