import type { Event } from '@shared/events/Event';

export class EventJsonSerializer {
  static serialize(event: Event): string {
    return JSON.stringify(event);
  }
}
