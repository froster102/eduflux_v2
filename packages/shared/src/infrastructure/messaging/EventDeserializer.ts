import type { Event, EventClass } from '@shared/events/Event';
import type { EventSubscribers } from '@shared/infrastructure/messaging/EventSubscribers';

export class EventDeserializer extends Map<string, EventClass> {
  static configure(subscribers: EventSubscribers) {
    const mapping = new EventDeserializer();
    subscribers.items.forEach((subscriber) => {
      subscriber.subscribedTo().forEach(mapping.registerEvent.bind(mapping));
    });

    return mapping;
  }

  private registerEvent(event: EventClass) {
    const eventName = event.EVENT_NAME;
    this.set(eventName, event);
  }

  deserialize(event: string) {
    const data = JSON.parse(event) as { id: string; name: string; payload: any; timestamp: string };
    const eventClass = super.get(data.name);

    if (!eventClass) {
      throw Error(`Event mapping not found for event ${data.name}`);
    }

    // Instantiate the event class with id and payload
    return new eventClass(data.id, data.payload);
  }
}
