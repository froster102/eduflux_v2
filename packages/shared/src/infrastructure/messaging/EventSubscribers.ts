import type { Event } from '@shared/events/Event';
import type { EventSubscriberPort } from '@shared/ports/message/EventSubscriberPort';
import type { Container } from 'inversify';

export abstract class EventSubscribers {
  constructor(public items: Array<EventSubscriberPort<Event>>) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static from(_container: Container): EventSubscribers {
    throw new Error('Static from() must be implemented by subclass!');
  }
}
