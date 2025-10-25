import type { UserEvents } from '@core/application/views/user-chat/events/enum/UserEvents';
import type { Event } from '@core/common/events/Event';

export interface UserUpdatedEvent extends Event {
  readonly type: UserEvents.USER_UPDATED;
  readonly id: string;
  readonly image?: string;
  readonly name: string;
  readonly bio?: string;
  readonly occuredAt: string;
}
