import ChatHistory from "@/features/chat/components/ChatHistory";
import { useGetChatHistory } from "@/features/chat/hooks/useGetChatHistory";
import { Role } from "@/shared/enums/Role";

interface ChatHistoryLoaderProps {
  role: Role;
}

export default function ChatHistoryLoader({ role }: ChatHistoryLoaderProps) {
  const { data: chatHistory } = useGetChatHistory({ role });

  return <ChatHistory chatHistory={chatHistory} />;
}
