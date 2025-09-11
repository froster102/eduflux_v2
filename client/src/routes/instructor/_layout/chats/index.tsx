import { createFileRoute } from "@tanstack/react-router";

import { ChatProvider } from "@/context/ChatContext";
import ChatLayout from "@/features/chat/layout/ChatLayout";
import { Role } from "@/shared/enums/Role";

export const Route = createFileRoute("/instructor/_layout/chats/")({
  component: () => (
    <ChatProvider>
      <ChatLayout role={Role.INSTRUCTOR} />
    </ChatProvider>
  ),
});
