import type { EventSubscriberPort } from '@eduflux-v2/shared/src/ports/message/EventSubscriberPort';
import { SessionSettingsUpdateEvent } from '@eduflux-v2/shared/events/session/SessionSettingsUpdateEvent';

export interface SessionSettingsUpdatedEventSubscriber
  extends EventSubscriberPort<SessionSettingsUpdateEvent> {}

