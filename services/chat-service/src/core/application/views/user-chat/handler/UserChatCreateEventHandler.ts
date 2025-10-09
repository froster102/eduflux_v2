import type { UserChatCreatedEvent } from "@core/application/views/user-chat/events/UserChatCreatedEvent";
import type { EventHandler } from "@core/common/events/EventHandler";

export interface UserChatCreatedEventHandler
  extends EventHandler<UserChatCreatedEvent, void> {}
