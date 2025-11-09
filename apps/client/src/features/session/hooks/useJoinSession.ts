import { useQuery } from '@tanstack/react-query';

import { joinSession } from '@/features/session/services/session';
import { useAuthStore } from '@/store/auth-store';

export function useJoinSession(sessionId: string) {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: [`user:${user?.id}:sessions:${sessionId}:token`],
    queryFn: () => joinSession(sessionId),
    enabled: !!sessionId,
    retry: 0,
  });
}
