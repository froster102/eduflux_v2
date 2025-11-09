import { InstructorViewDITokens } from '@application/views/instructor-view/di/InstructorViewDITokens';
import type { UserUpdatedEventSubscriber } from '@application/views/coordinator/subscriber/UserUpdatedEventSubscriber';
import type { InstructorViewRepositoryPort } from '@application/views/instructor-view/port/persistence/InstructorViewRepositoryPort';
import { SubscribedCourseViewDITokens } from '@application/views/subscribed-course/di/SubscribedCourseViewDITokens';
import type { SubscribedCourseViewRepositoryPort } from '@application/views/subscribed-course/port/SubscribedCourseViewRepositoryPort';
import { inject } from 'inversify';
import { UserUpdatedEvent } from '@eduflux-v2/shared/events/user/UserUpdatedEvents';

export class UserUpdatedEventSubscriberService
  implements UserUpdatedEventSubscriber
{
  constructor(
    @inject(InstructorViewDITokens.InstructorViewRepository)
    private readonly instructorViewRepository: InstructorViewRepositoryPort,
    @inject(SubscribedCourseViewDITokens.SubscribedCourseViewRepository)
    private readonly subscribedCourseViewRepository: SubscribedCourseViewRepositoryPort,
  ) {}

  async on(event: UserUpdatedEvent): Promise<void> {
    const { id: userId, name, image, bio } = event.payload;

    const payload = {
      name,
      image,
      bio,
    };

    //perform transaction
    await this.instructorViewRepository.updateUser(userId, payload);
    await this.subscribedCourseViewRepository.updateUser({ id: userId, name });
  }

  subscribedTo() {
    return [UserUpdatedEvent];
  }
}
