import { db } from '@/database/db';
import { user } from '@/database/schema';
import { User } from 'better-auth/types';
import { eq } from 'drizzle-orm';

export async function updateUser(data: Partial<User> & { id: string }) {
  await db.update(user).set(data).where(eq(user.id, data.id));
}
