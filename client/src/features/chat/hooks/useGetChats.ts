import { useQuery } from "@tanstack/react-query";

import { useAuthStore } from "@/store/auth-store";
import { getChats } from "@/features/chat/service/chat";

export function useGetChats(queryParameters: GetChatsQueryParmeters) {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: [`${user!.id}-chats`, queryParameters],
    queryFn: () => getChats(queryParameters),
  });
}
