import type { UserUpdatedEvent } from "@core/application/user-view/events/UserUpdatedEvent";
import type { EventHandler } from "@core/common/event/EventHandler";

export interface UserUpdatedEventHandler
  extends EventHandler<UserUpdatedEvent, void> {}
