import { drizzle } from 'drizzle-orm/node-postgres';
import { databaseConfig } from '@/shared/config/databaseConfig';
import { Pool } from 'pg';
import * as schema from './schema';
import type { User } from 'better-auth/types';
import { eq } from 'drizzle-orm';

const pool = new Pool({
  connectionString: databaseConfig.DATABASE_URL,
});

export const db = drizzle({ client: pool, schema });

export const updateUser = async (data: Partial<User> & { id: string }) => {
  await db.update(schema.user).set(data).where(eq(schema.user.id, data.id));
};
