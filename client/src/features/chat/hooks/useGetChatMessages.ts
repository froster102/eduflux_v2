import {
  InfiniteData,
  useQueryClient,
  useSuspenseInfiniteQuery,
} from "@tanstack/react-query";
import React from "react";

import { getMessages } from "@/features/chat/service/chat";
import { useChatContext } from "@/context/ChatContext";
import { MessageStatus } from "@/features/chat/contants/MessageStatus";
import { WebSocketEvents } from "@/shared/enums/WebSocketEvents";

export function useGetChatMessages(chatId: string) {
  const { socket } = useChatContext();
  const queryClient = useQueryClient();
  const queryKey = [`${chatId}-messages`];

  const queryResult = useSuspenseInfiniteQuery({
    queryFn: async ({ pageParam }) => {
      console.log(pageParam);

      return await getMessages(chatId, {
        page: { cursor: pageParam, size: 20 },
      });
    },
    initialPageParam: undefined as unknown as string,
    getNextPageParam: (lastPage) => {
      if (lastPage.data.length === 0) {
        return undefined;
      }
      const oldMessage = lastPage.data[lastPage.data.length - 1];

      return oldMessage.createdAt;
    },
    queryKey: queryKey,
  });

  React.useEffect(() => {
    if (!socket || !chatId) {
      return;
    }

    const handleNewMessage = (data: { message: Message }) => {
      queryClient.setQueryData<InfiniteData<GetMessagesResponse>>(
        queryKey,
        (oldData): InfiniteData<GetMessagesResponse> | undefined => {
          if (!oldData) return undefined;
          const newPages = [...oldData.pages];

          newPages[0] = {
            ...newPages[0],
            data: [data.message, ...newPages[0].data],
          };

          return {
            ...oldData,
            pages: newPages,
          };
        },
      );
    };

    const handleMessageStatusUpdate = (data: {
      messageId: string;
      status: MessageStatus;
    }) => {
      queryClient.setQueryData<InfiniteData<GetMessagesResponse>>(
        queryKey,
        (oldData): InfiniteData<GetMessagesResponse> | undefined => {
          if (!oldData) return undefined;
          const newPages = oldData.pages.map((page) => ({
            ...page,
            messages: page.data.map((msg) =>
              msg.id === data.messageId ? { ...msg, status: data.status } : msg,
            ),
          }));

          return {
            ...oldData,
            pages: newPages,
          };
        },
      );
    };

    socket.on(WebSocketEvents.MESSAGE_NEW, handleNewMessage);
    socket.on(WebSocketEvents.MESSAGE_STATUS_UPDATE, handleMessageStatusUpdate);

    return () => {
      socket.off(WebSocketEvents.MESSAGE_NEW, handleNewMessage);
      socket.off(
        WebSocketEvents.MESSAGE_STATUS_UPDATE,
        handleMessageStatusUpdate,
      );
    };
  }, [socket, queryClient, queryKey, chatId]);

  return queryResult;
}
