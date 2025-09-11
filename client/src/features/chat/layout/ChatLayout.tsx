import { Card } from "@heroui/card";
import { Chip } from "@heroui/chip";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import ChatHistoryLoader from "@/features/chat/components/ChatHistoryLoader";
import ChatHistorySkeleton from "@/features/chat/components/ChatHistorySkeleton";
import ChatPanelLoader from "@/features/chat/components/ChatPanelLoader";
import ChatPanelSkeleton from "@/features/chat/components/ChatPanelSkeleton";
import { useChatStore } from "@/store/useChatStore";
import { Role } from "@/shared/enums/Role";
import { useChatContext } from "@/context/ChatContext";

interface ChatLayoutProps {
  role: Role;
}

export default function ChatLayout({ role }: ChatLayoutProps) {
  const { selectedChat } = useChatStore();
  const { joinChat, isConnected } = useChatContext();

  React.useEffect(() => {
    if (selectedChat && isConnected) {
      joinChat(selectedChat.id);
    }
  }, [selectedChat, isConnected]);

  return (
    <div className="flex h-full gap-4 w-full">
      <div className="w-full hidden xl:max-w-md xl:block h-full">
        <ErrorBoundary fallback={<p>Error loading chat history.</p>}>
          <Suspense fallback={<ChatHistorySkeleton />}>
            <ChatHistoryLoader role={role} />
          </Suspense>
        </ErrorBoundary>
      </div>
      {selectedChat ? (
        <ErrorBoundary fallback={<p>Error loading chat messages.</p>}>
          <Suspense fallback={<ChatPanelSkeleton />}>
            <ChatPanelLoader />
          </Suspense>
        </ErrorBoundary>
      ) : (
        <Card className="hidden xl:flex justify-center items-center w-full h-full bg-background border border-default-200">
          <Chip> Select a chat to start messaging</Chip>
        </Card>
      )}
    </div>
  );
}
