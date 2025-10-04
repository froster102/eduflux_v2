import type { SessionUpdatedEvent } from "@core/application/instructor-view/events/SessionUpdatedEvent";
import type { EventHandler } from "@core/common/events/EventHandler";

export interface SessionUpdatedEventHandler
  extends EventHandler<SessionUpdatedEvent, void> {}
