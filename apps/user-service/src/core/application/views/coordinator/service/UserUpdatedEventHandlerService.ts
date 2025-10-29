import { InstructorViewDITokens } from '@application/views/instructor-view/di/InstructorViewDITokens';
import type { UserUpdatedEventHandler } from '@application/views/coordinator/handler/UserUpdatedEventHandler';
import type { InstructorViewRepositoryPort } from '@application/views/instructor-view/port/persistence/InstructorViewRepositoryPort';
import { SubscribedCourseViewDITokens } from '@application/views/subscribed-course/di/SubscribedCourseViewDITokens';
import type { SubscribedCourseViewRepositoryPort } from '@application/views/subscribed-course/port/SubscribedCourseViewRepositoryPort';
import { inject } from 'inversify';
import type { UserUpdatedEvent } from '@eduflux-v2/shared/events/user/UserUpdatedEvents';

export class UserUpdatedEventHandlerService implements UserUpdatedEventHandler {
  constructor(
    @inject(InstructorViewDITokens.InstructorViewRepository)
    private readonly instructorViewRepository: InstructorViewRepositoryPort,
    @inject(SubscribedCourseViewDITokens.SubscribedCourseViewRepository)
    private readonly subscribedCourseViewRepository: SubscribedCourseViewRepositoryPort,
  ) {}

  async handle(event: UserUpdatedEvent): Promise<void> {
    const { id: userId, name, image, bio } = event;

    const payload = {
      name,
      image,
      bio,
    };

    //perform transaction
    await this.instructorViewRepository.updateUser(userId, payload);
    await this.subscribedCourseViewRepository.updateUser({ id: userId, name });
  }
}
