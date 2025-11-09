import { useQuery } from '@tanstack/react-query';

import { useAuthStore } from '@/store/auth-store';
import { getChatWithInstructor } from '@/features/chat/service/chat';

export function useGetChatWithInstructor(instructorId: string) {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: [`chat-user-${user?.id}-instructor-${instructorId}`],
    queryFn: () => getChatWithInstructor(instructorId),
  });
}
