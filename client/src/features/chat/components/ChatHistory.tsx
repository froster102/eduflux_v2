import { Card, CardBody, CardHeader } from "@heroui/card";

import ChatItem from "@/features/chat/components/ChatItem";

interface ChatIHistoryProps {
  chats: Chat[];
}

export default function ChatHistory({ chats }: ChatIHistoryProps) {
  return (
    <Card className="w-full h-full bg-background border border-default-200">
      <CardHeader className="text-xl font-semibold">My Chats</CardHeader>
      <CardBody className="pt-0">
        {chats.map((chat, i) => (
          <div key={i} className="pt-2">
            <ChatItem chat={chat} />
          </div>
        ))}
      </CardBody>
    </Card>
  );
}
