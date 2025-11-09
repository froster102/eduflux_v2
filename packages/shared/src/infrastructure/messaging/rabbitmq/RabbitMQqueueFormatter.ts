import type { Event } from '@shared/events/Event';
import type { EventSubscriberPort } from '@shared/ports/message/EventSubscriberPort';

export class RabbitMQqueueFormatter {
  constructor(private moduleName: string) {}

  format(subscriber: EventSubscriberPort<Event>) {
    const value = subscriber.constructor.name;
    const name = value
      .split(/(?=[A-Z])/)
      .join('_')
      .toLowerCase();
    return `${this.moduleName}.${name}`;
  }

  formatRetry(subscriber: EventSubscriberPort<Event>) {
    const name = this.format(subscriber);
    return `retry.${name}`;
  }

  formatDeadLetter(subscriber: EventSubscriberPort<Event>) {
    const name = this.format(subscriber);
    return `dead_letter.${name}`;
  }
}
