import type { SessionSettingsUpdateEvent } from '@core/application/views/instructor-view/events/SessionSettingsEvent';
import type { EventHandler } from '@core/common/events/EventHandler';

export interface SessionSettingsUpdatedEventHandler
  extends EventHandler<SessionSettingsUpdateEvent, void> {}
