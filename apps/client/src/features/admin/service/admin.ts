import { auth } from '@/lib/better-auth/auth';

export async function banUser(userId: string) {
  const { data, error } = await auth.admin.banUser({ userId: userId });

  if (error) {
    throw error;
  }

  return data;
}

export async function unbanUser(userId: string) {
  const { data, error } = await auth.admin.unbanUser({ userId });

  if (error) {
    throw error;
  }

  return data;
}

export async function listUsers(query: ListUsersQuery) {
  const { data, error } = await auth.admin.listUsers({ query });

  if (error) {
    throw error;
  }

  return data;
}
