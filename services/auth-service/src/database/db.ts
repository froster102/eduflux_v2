import { drizzle } from 'drizzle-orm/node-postgres';
import { databaseConfig } from '@/shared/config/database.config';
import { Pool } from 'pg';
import * as schema from './schema';

const pool = new Pool({
  connectionString: databaseConfig.DATABASE_URL,
});

export const db = drizzle({ client: pool, schema });
