import type { EventSubscriberPort } from '@eduflux-v2/shared/src/ports/message/EventSubscriberPort';
import type { UserUpdatedEvent } from '@eduflux-v2/shared/events/user/UserUpdatedEvents';

export interface UserUpdatedEventSubscriber
  extends EventSubscriberPort<UserUpdatedEvent> {}
