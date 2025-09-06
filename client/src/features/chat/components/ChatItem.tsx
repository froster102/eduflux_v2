import { Avatar } from "@heroui/avatar";
import { Card } from "@heroui/card";

import { useAuthStore } from "@/store/auth-store";
import { IMAGE_BASE_URL } from "@/config/image";
import { useChatStore } from "@/store/useChatStore";

interface ChatItemProps {
  chat: Chat;
}

export default function ChatItem({ chat }: ChatItemProps) {
  const { user } = useAuthStore();
  const otherParticipant = chat.participants.find((p) => p.id !== user!.id);
  const { selectedChat, setSelectedChat } = useChatStore();

  return (
    <Card
      isPressable
      className={`flex w-full flex-row items-center gap-2 p-2 hover:bg-default-100 hover:text-white cursor-pointer rounded-full ${selectedChat?.id === chat.id ? "bg-primary text-background" : " bg-background"}`}
      shadow="none"
      onPress={() => {
        setSelectedChat(chat);
      }}
    >
      <Avatar size="md" src={`${IMAGE_BASE_URL}${otherParticipant?.image}`} />
      <div className="flex-1 w-full">
        <p className="text-left font-medium">{otherParticipant?.firstName}</p>
        <div className="flex items-end gap-2 w-full">
          <p className="text-sm text-default-500">Last message preview...</p>
          <p className="text-xs text-default-400">{chat.lastMessageAt}</p>
        </div>
      </div>
    </Card>
  );
}
