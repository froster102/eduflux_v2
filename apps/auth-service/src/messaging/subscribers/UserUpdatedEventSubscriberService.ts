import { updateUser } from '@/database/db';
import type { EventClass } from '@eduflux-v2/shared/events/Event';
import { UserUpdatedEvent } from '@eduflux-v2/shared/events/user/UserUpdatedEvents';
import type { EventSubscriberPort } from '@eduflux-v2/shared/ports/message/EventSubscriberPort';
import { db } from '@/database/db';
import { eq } from 'drizzle-orm';
import * as schema from '@/database/schema';

export class UserUpdatedEventSubscriberService
  implements EventSubscriberPort<UserUpdatedEvent>
{
  subscribedTo(): Array<EventClass> {
    return [UserUpdatedEvent];
  }
  async on(event: UserUpdatedEvent): Promise<void> {
    // Update basic user info
    await updateUser({
      id: event.payload.id,
      name: event.payload.name,
      image: event.payload.image,
    });

    // Update roles if provided
    if (event.payload.roles) {
      await db
        .update(schema.user)
        .set({ roles: event.payload.roles })
        .where(eq(schema.user.id, event.payload.id));
    }
  }
}
