import { auth } from '@/lib/better-auth/auth';

export async function updateUserPassword(data: {
  newPassword: string;
  currentPassword: string;
}) {
  const { data: response, error } = await auth.changePassword({
    currentPassword: data.currentPassword,
    newPassword: data.newPassword,
  });

  if (error) {
    throw error;
  }

  return response;
}

export async function getUserSessions() {
  const { data, error } = await auth.listSessions();

  if (error) {
    throw error;
  }

  return data;
}
