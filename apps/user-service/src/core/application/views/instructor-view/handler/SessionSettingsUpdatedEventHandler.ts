import type { SessionSettingsUpdateEvent } from '@application/views/instructor-view/events/SessionSettingsEvent';
import type { EventHandler } from '@eduflux-v2/shared/events/handler/EventHandler';

export interface SessionSettingsUpdatedEventHandler
  extends EventHandler<SessionSettingsUpdateEvent, void> {}
