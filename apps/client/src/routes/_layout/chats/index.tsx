import { createFileRoute } from "@tanstack/react-router";

import { ChatProvider } from "@/context/ChatContext";
import { Role } from "@/shared/enums/Role";
import ChatLayout from "@/features/chat/layout/ChatLayout";

export const Route = createFileRoute("/_layout/chats/")({
  component: () => (
    <ChatProvider>
      <ChatLayout role={Role.LEARNER} />
    </ChatProvider>
  ),
});
