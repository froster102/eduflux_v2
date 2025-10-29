import type { Event } from '@shared/events/Event';
import type { UserEvents } from '@shared/events/user/enum/UserEvents';

export interface UserUpdatedEvent extends Event {
  readonly type: UserEvents.USER_UPDATED;
  readonly id: string;
  readonly image?: string;
  readonly name: string;
  readonly bio?: string;
  readonly occuredAt: string;
}
