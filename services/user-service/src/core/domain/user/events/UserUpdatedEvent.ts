import type { Event } from '@core/common/events/Event';

export interface UserUpdatedEvent extends Event {
  readonly id: string;
  readonly image?: string;
  readonly name: string;
  readonly bio?: string;
  readonly occuredAt: string;
}
