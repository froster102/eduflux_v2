import type { InstructorCreatedEvent } from "@core/application/instructor-view/events/InstructorCreatedEvent";
import type { InstructorStatsEvent } from "@core/application/instructor-view/events/InstructorStatsEvent";
import type { SessionSettingsEvent } from "@core/application/instructor-view/events/SessionSettingsEvent";
import type { UserChatCreatedEvent } from "@core/application/user-chat/events/UserChatCreatedEvent";
import type { UserUpdatedEvent } from "@core/application/user-view/events/UserUpdatedEvent";
import type { SessionConfimedEvent } from "@core/domain/user-session/events/ConfirmSessionEvent";

export type KafkaEvent =
  | SessionConfimedEvent
  | UserChatCreatedEvent
  | SessionSettingsEvent
  | InstructorStatsEvent
  | InstructorCreatedEvent
  | UserUpdatedEvent;
