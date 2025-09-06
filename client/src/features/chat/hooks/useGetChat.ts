import { useQuery } from "@tanstack/react-query";

import { useAuthStore } from "@/store/auth-store";
import { getChat } from "@/features/chat/service/chat";

export function useGetChat(instructorId: string) {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: [`chat-user-${user?.id}-instructor-${instructorId}`],
    queryFn: () => getChat(instructorId),
  });
}
