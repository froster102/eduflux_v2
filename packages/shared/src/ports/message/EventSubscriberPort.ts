import type { Event, EventClass } from '@shared/events/Event';

export interface EventSubscriberPort<T extends Event> {
  subscribedTo(): Array<EventClass>;
  on(event: T): Promise<void>;
}
