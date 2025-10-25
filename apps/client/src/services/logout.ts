import { auth } from '@/lib/better-auth/auth';

export async function logout() {
  const { data, error } = await auth.signOut();

  if (error) {
    throw error;
  }

  return data;
}
