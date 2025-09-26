import type { UserChatCreatedEvent } from "@core/application/user-chat/events/UserChatCreatedEvent";
import type { EventHandler } from "@core/common/event/EventHandler";

export interface UserChatCreatedEventHandler
  extends EventHandler<UserChatCreatedEvent, void> {}
