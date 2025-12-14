import { Repository } from "brewy";
import { eq } from "drizzle-orm";
import { injectable } from "tsyringe";
import { User } from "../../domain/user.entity.js";
import { getDatabase } from "../database/database.js";
import { users } from "../database/schema.js";

@injectable()
export class UserRepository implements Repository<User> {
  async findById(id: string): Promise<User | null> {
    const db = await getDatabase();
    // Handle both string and number IDs
    const idValue = "{{DATABASE_TYPE}}" === "sqlite" ? id : Number(id);
    const result = await db
      .select()
      .from(users)
      .where(eq(users.id, idValue as any))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    const row = result[0];
    return new User(row.email, row.name, row.passwordHash, String(row.id));
  }

  async findByEmail(email: string): Promise<User | null> {
    const db = await getDatabase();
    const result = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    const row = result[0];
    return new User(row.email, row.name, row.passwordHash, String(row.id));
  }

  async findAll(): Promise<User[]> {
    const db = await getDatabase();
    const results = await db.select().from(users);

    return results.map(
      (row) => new User(row.email, row.name, row.passwordHash, String(row.id))
    );
  }

  async save(entity: User): Promise<User> {
    const db = await getDatabase();
    const userData: any = {
      email: entity.email,
      name: entity.name,
      passwordHash: entity.passwordHash,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };

    // Only include id for SQLite (string), PostgreSQL/MySQL use auto-increment
    if ("{{DATABASE_TYPE}}" === "sqlite") {
      userData.id = entity.id;
    }

    if ("{{DATABASE_TYPE}}" === "sqlite") {
      await db
        .insert(users)
        .values(userData)
        .onConflictDoUpdate({
          target: users.id,
          set: {
            email: userData.email,
            name: userData.name,
            passwordHash: userData.passwordHash,
            updatedAt: userData.updatedAt,
          },
        });
    } else {
      // For PostgreSQL/MySQL, check if user exists
      const existing = await this.findById(entity.id);
      if (existing) {
        await db
          .update(users)
          .set({
            email: userData.email,
            name: userData.name,
            passwordHash: userData.passwordHash,
            updatedAt: userData.updatedAt,
          })
          .where(eq(users.id, Number(entity.id) as any));
      } else {
        const result = await db.insert(users).values(userData);
        // Update entity with generated ID for PostgreSQL/MySQL
        if (Array.isArray(result) && result[0]?.insertId) {
          (entity as any)._id = String(result[0].insertId);
        }
      }
    }

    return entity;
  }

  async delete(id: string): Promise<void> {
    const db = await getDatabase();
    const idValue = "{{DATABASE_TYPE}}" === "sqlite" ? id : Number(id);
    await db.delete(users).where(eq(users.id, idValue as any));
  }

  async exists(id: string): Promise<boolean> {
    const user = await this.findById(id);
    return user !== null;
  }
}
