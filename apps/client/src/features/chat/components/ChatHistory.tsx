import { Card, CardBody, CardHeader } from '@heroui/card';

import ChatItem from '@/features/chat/components/ChatItem';

interface ChatHistoryProps {
  chatHistory: Chat[];
}

export default function ChatHistory({ chatHistory }: ChatHistoryProps) {
  return (
    <Card
      className="w-full h-full bg-background border border-default-200"
      shadow="none"
    >
      <CardHeader className="text-xl font-semibold">My Chats</CardHeader>
      <CardBody className="pt-0">
        {chatHistory.map((chat, i) => (
          <div key={i} className="pt-2">
            <ChatItem chat={chat} />
          </div>
        ))}
      </CardBody>
    </Card>
  );
}
