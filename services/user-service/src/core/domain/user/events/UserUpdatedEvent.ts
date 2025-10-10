import type { Event } from '@core/common/events/Event';
import type { UserEvents } from '@core/domain/user/events/UserEvents';

export interface UserUpdatedEvent extends Event {
  readonly type: UserEvents.USER_UPDATED;
  readonly id: string;
  readonly image?: string;
  readonly name: string;
  readonly bio?: string;
  readonly occuredAt: string;
}
