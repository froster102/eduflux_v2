import type { UserChatCreatedEvent } from "@core/application/chat/events/UserChatCreatedEvent";
import type { UserUpdatedEvent } from "@core/application/views/user-chat/events/UserUpdatedEvent";

export type KafkaEvent = UserChatCreatedEvent | UserUpdatedEvent;
