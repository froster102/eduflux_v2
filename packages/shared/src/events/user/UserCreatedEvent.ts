import { Event } from '@shared/events/Event';
import { UserEvents } from '@shared/events/user/enum/UserEvents';

export interface UserCreatedEventPayload {
  readonly id: string;
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly roles?: string[];
}

export class UserCreatedEvent extends Event<UserCreatedEventPayload> {
  static readonly EVENT_NAME: string = UserEvents.USER_CREATED;

  constructor(id: string, payload: UserCreatedEventPayload) {
    super({ id, name: 'user.created' }, payload);
  }
}
