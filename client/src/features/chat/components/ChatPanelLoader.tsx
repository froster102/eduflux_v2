import React from "react";

import { useChatContext } from "@/context/ChatContext";
import ChatPanel from "@/features/chat/components/ChatPanel";
import { useGetChatMessages } from "@/features/chat/hooks/useGetChatMessages";
import { useChatStore } from "@/store/useChatStore";
import { WebSocketEvents } from "@/shared/enums/WebSocketEvents";
import { MessageStatus } from "@/features/chat/contants/MessageStatus";
import { useAuthStore } from "@/store/auth-store";

export default function ChatPanelLoader() {
  const { selectedChat } = useChatStore();
  const { socket } = useChatContext();
  const { user: currentUser } = useAuthStore();
  const {
    data: messagesQueryResult,
    isFetchingNextPage,
    isFetching,
    hasNextPage,
    fetchNextPage,
  } = useGetChatMessages(selectedChat!.id);

  const messages = messagesQueryResult.pages.flatMap((page) => page.messages);

  const handleMessageRead = React.useCallback(
    (messageId: string) => {
      if (socket && selectedChat) {
        socket.emit(WebSocketEvents.MESSAGE_READ, {
          messageId,
          chatId: selectedChat.id,
        });
      }
    },
    [socket, selectedChat],
  );

  React.useEffect(() => {
    if (!socket || !currentUser || !selectedChat) {
      return;
    }

    const messagesToDeliver = messages.filter(
      (msg) =>
        msg.senderId !== currentUser.id && msg.status === MessageStatus.SENT,
    );

    if (messagesToDeliver.length > 0) {
      messagesToDeliver.forEach((msg) => {
        socket.emit(WebSocketEvents.MESSAGE_DELIVERED, {
          messageId: msg.id,
          chatId: selectedChat.id,
        });
      });
    }
  }, [messages, socket, currentUser, selectedChat]);

  return (
    <ChatPanel
      isFetchingNextPage={isFetchingNextPage}
      messages={messages}
      onMessageRead={handleMessageRead}
      onScrollEnd={() => {
        if (!isFetching && hasNextPage) {
          fetchNextPage();
        }
      }}
    />
  );
}
