import type { EventHandler } from "@core/common/events/EventHandler";
import type { UserSessionUpdatedEvent } from "@core/domain/user-session/events/SessionUpdatedEvent";

export interface UserSessionUpdatedEventHandler
  extends EventHandler<UserSessionUpdatedEvent, void> {}
