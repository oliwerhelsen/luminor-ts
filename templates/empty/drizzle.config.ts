import type { Config } from 'drizzle-kit';

const config: Config = {
  schema: './src/infrastructure/database/schema.ts',
  out: './drizzle',
};

if ('{{DATABASE_TYPE}}' === 'sqlite') {
  config.driver = 'better-sqlite3';
  config.dbCredentials = {
    url: './database.sqlite',
  };
} else if ('{{DATABASE_TYPE}}' === 'postgresql') {
  config.driver = 'pg';
  config.dbCredentials = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || '{{PROJECT_NAME}}',
  };
} else if ('{{DATABASE_TYPE}}' === 'mysql') {
  config.driver = 'mysql2';
  config.dbCredentials = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || '{{PROJECT_NAME}}',
  };
}

export default config;
