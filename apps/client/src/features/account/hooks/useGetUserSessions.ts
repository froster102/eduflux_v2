import { useQuery } from '@tanstack/react-query';

import { useAuthStore } from '@/store/auth-store';

import { getUserSessions } from '../service/account';

export function useGetUserSessions() {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: [`user-${user!.id}-sessions`],
    queryFn: getUserSessions,
  });
}
