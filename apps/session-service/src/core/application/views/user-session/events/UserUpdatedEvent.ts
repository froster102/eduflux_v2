import type { UserEvents } from '@core/application/views/user-session/events/enum/UserEvents';
import type { Event } from '@eduflux-v2/shared/events/Event';

export interface UserUpdatedEvent extends Event {
  readonly type: UserEvents.USER_UPDATED;
  readonly id: string;
  readonly image?: string;
  readonly name: string;
  readonly bio?: string;
  readonly occuredAt: string;
}
