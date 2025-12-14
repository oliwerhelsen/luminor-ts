import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { pgTable, varchar, serial, timestamp } from 'drizzle-orm/pg-core';
import { mysqlTable, int, varchar as mysqlVarchar, timestamp as mysqlTimestamp } from 'drizzle-orm/mysql-core';

if ('{{DATABASE_TYPE}}' === 'sqlite') {
  export const users = sqliteTable('users', {
    id: text('id').primaryKey(),
    email: text('email').notNull().unique(),
    name: text('name').notNull(),
    passwordHash: text('password_hash').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
  });
} else if ('{{DATABASE_TYPE}}' === 'postgresql') {
  export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    name: varchar('name', { length: 255 }).notNull(),
    passwordHash: varchar('password_hash', { length: 255 }).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  });
} else if ('{{DATABASE_TYPE}}' === 'mysql') {
  export const users = mysqlTable('users', {
    id: int('id').primaryKey().autoincrement(),
    email: mysqlVarchar('email', { length: 255 }).notNull().unique(),
    name: mysqlVarchar('name', { length: 255 }).notNull(),
    passwordHash: mysqlVarchar('password_hash', { length: 255 }).notNull(),
    createdAt: mysqlTimestamp('created_at').defaultNow().notNull(),
    updatedAt: mysqlTimestamp('updated_at').defaultNow().notNull(),
  });
}

