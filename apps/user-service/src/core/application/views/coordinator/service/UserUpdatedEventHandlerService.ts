import { InstructorViewDITokens } from '@core/application/views/instructor-view/di/InstructorViewDITokens';
import type { UserUpdatedEventHandler } from '@core/application/views/coordinator/handler/UserUpdatedEventHandler';
import type { InstructorViewRepositoryPort } from '@core/application/views/instructor-view/port/persistence/InstructorViewRepositoryPort';
import { SubscribedCourseViewDITokens } from '@core/application/views/subscribed-course/di/SubscribedCourseViewDITokens';
import type { SubscribedCourseViewRepositoryPort } from '@core/application/views/subscribed-course/port/SubscribedCourseViewRepositoryPort';
import type { UserUpdatedEvent } from '@core/domain/user/events/UserUpdatedEvent';
import { inject } from 'inversify';

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
