import type { UserChatCreatedEvent } from "@core/application/user-chat/events/UserChatCreatedEvent";
import type { ConfirmSessionEvent } from "@shared/events/ConfirmSessionEvent";

export type KafkaEvent = (ConfirmSessionEvent | UserChatCreatedEvent) & {
  type: string;
};
