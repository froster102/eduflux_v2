import type { EventSubscriberPort } from '@eduflux-v2/shared/src/ports/message/EventSubscriberPort';
import type { UserUpdatedEvent } from '@core/application/views/user-chat/events/UserUpdatedEvent';

export interface UserUpdatedEventSubscriber
  extends EventSubscriberPort<UserUpdatedEvent> {}
