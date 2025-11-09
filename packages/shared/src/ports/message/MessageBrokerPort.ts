import type { Event } from '@shared/events/Event';
import type { EventSubscribers } from '@shared/infrastructure/messaging/EventSubscribers';

export interface MessageBrokerPort {
  publish(event: Event): Promise<void>;
  addSubscribers(subscribers: EventSubscribers): Promise<void>;
}
