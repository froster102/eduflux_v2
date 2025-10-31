import { updateUser } from '@/database/db';
import type { EventClass } from '@eduflux-v2/shared/events/Event';
import { UserUpdatedEvent } from '@eduflux-v2/shared/events/user/UserUpdatedEvents';
import type { EventSubscriberPort } from '@eduflux-v2/shared/ports/message/EventSubscriberPort';

export class UserUpdatedEventSubscriberService
  implements EventSubscriberPort<UserUpdatedEvent>
{
  subscribedTo(): Array<EventClass> {
    return [UserUpdatedEvent];
  }
  async on(event: UserUpdatedEvent): Promise<void> {
    await updateUser({
      id: event.payload.id,
      name: event.payload.name,
      image: event.payload.image,
    });
  }
}
