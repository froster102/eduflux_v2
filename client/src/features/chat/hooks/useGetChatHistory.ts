import { useSuspenseQuery } from "@tanstack/react-query";

import { useAuthStore } from "@/store/auth-store";
import { getChatChatHistory } from "@/features/chat/service/chat";

export function useGetChatHistory(queryParameters: GetChatsQueryParmeters) {
  const { user } = useAuthStore();

  return useSuspenseQuery({
    queryKey: [`${user!.id}-chats`, queryParameters],
    queryFn: async () => {
      return getChatChatHistory(queryParameters);
    },
  });
}
