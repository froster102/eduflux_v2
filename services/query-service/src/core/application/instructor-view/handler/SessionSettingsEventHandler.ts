import type { SessionSettingsEvent } from "@core/application/instructor-view/events/SessionSettingsEvent";
import type { EventHandler } from "@core/common/event/EventHandler";

export interface SessionSettingsEventHandler
  extends EventHandler<SessionSettingsEvent, void> {}
