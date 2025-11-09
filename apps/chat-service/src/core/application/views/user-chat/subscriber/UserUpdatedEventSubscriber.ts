import type { UserUpdatedEvent } from '@eduflux-v2/shared/events/user/UserUpdatedEvents';
import type { EventSubscriberPort } from '@eduflux-v2/shared/src/ports/message/EventSubscriberPort';

export interface UserUpdatedEventSubscriber
  extends EventSubscriberPort<UserUpdatedEvent> {}
