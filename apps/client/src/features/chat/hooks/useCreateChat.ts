import { useMutation } from "@tanstack/react-query";

import { createChat } from "@/features/chat/service/chat";

export function useCreateChat() {
  return useMutation({
    mutationFn: createChat,
  });
}
