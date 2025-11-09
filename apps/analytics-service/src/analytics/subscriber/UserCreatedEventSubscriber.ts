import type { EventSubscriberPort } from '@eduflux-v2/shared/ports/message/EventSubscriberPort';
import type { UserCreatedEvent } from '@eduflux-v2/shared/events/user/UserCreatedEvent';

export interface UserCreatedEventSubscriber
  extends EventSubscriberPort<UserCreatedEvent> {}
