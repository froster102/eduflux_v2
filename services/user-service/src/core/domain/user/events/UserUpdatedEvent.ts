import { Event } from '@core/common/events/Event';
import type { UserUpdatedEventPayload } from '@core/domain/user/events/types/UserUpdatedEventPayload';

export class UserUpdatedEvent extends Event {
  public readonly id: string;
  public readonly image?: string;
  public readonly name: string;
  public readonly bio?: string;
  public readonly occuredAt: string;

  private constructor(payload: UserUpdatedEventPayload) {
    super({ type: payload.type, occuredAt: payload.occuredAt });
    this.id = payload.id;
    this.image = payload.image;
    this.name = payload.name;
    this.bio = payload.bio;
    this.occuredAt = payload.occuredAt;
  }

  public static new(payload: UserUpdatedEventPayload): UserUpdatedEvent {
    return new UserUpdatedEvent(payload);
  }
}
