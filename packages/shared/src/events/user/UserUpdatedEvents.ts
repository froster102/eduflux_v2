import { Event } from '@shared/events/Event';
import { UserEvents } from '@shared/events/user/enum/UserEvents';

export interface UserUpdatedEventPayload {
  readonly id: string;
  readonly image?: string;
  readonly name: string;
  readonly bio?: string;
}

export class UserUpdatedEvent extends Event<UserUpdatedEventPayload> {
  static readonly EVENT_NAME: string = UserEvents.USER_UPDATED;

  constructor(id: string, payload: UserUpdatedEventPayload) {
    super({ id, name: UserEvents.USER_UPDATED }, payload);
  }
}
