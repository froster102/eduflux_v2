import ChatPanel from "@/features/chat/components/ChatPanel";
import { useGetChatMessages } from "@/features/chat/hooks/useGetChatMessages";
import { useChatStore } from "@/store/useChatStore";

export default function ChatPanelLoader() {
  const { selectedChat } = useChatStore();
  const {
    data: messagesQueryResult,
    isFetchingNextPage,
    isFetching,
    hasNextPage,
    fetchNextPage,
  } = useGetChatMessages(selectedChat!.id);

  const messages = messagesQueryResult.pages.flatMap((page) => page.messages);

  return (
    <ChatPanel
      isFetchingNextPage={isFetchingNextPage}
      messages={messages}
      onScrollEnd={() => {
        if (!isFetching && hasNextPage) {
          fetchNextPage();
        }
      }}
    />
  );
}
