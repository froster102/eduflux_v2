import type { UserUpdatedEvent } from "@core/application/user-view/events/UserUpdatedEvent";
import type { EventHandler } from "@core/common/events/EventHandler";

export interface UserUpdatedEventHandler
  extends EventHandler<UserUpdatedEvent, void> {}
