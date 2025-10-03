import type { SessionSettingsEvent } from "@core/application/instructor-view/events/SessionSettingsEvent";
import type { EventHandler } from "@core/common/events/EventHandler";

export interface SessionSettingsEventHandler
  extends EventHandler<SessionSettingsEvent, void> {}
