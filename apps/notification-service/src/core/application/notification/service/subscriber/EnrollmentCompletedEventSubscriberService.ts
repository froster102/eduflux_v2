import { NotificationDITokens } from '@core/application/notification/di/NotificationDITokens';
import type { EnrollmentCompletedEventSubscriber } from '@core/application/notification/subscriber/EnrollmentCompletedEventSubscriber';
import type { NotificationRepositoryPort } from '@core/application/notification/port/persistence/NotificationRepositoryPort';
import { NotificationUseCaseDto } from '@core/application/notification/usecase/dto/NotificationUseCaseDto';
import { eventEmitter } from '@core/common/util/event/eventEmitter';
import { Notification } from '@core/domain/notification/entiy/Notification';
import { NotificationStatus } from '@core/domain/notification/enum/NotificationStatus';
import { ServerEvents } from '@shared/enum/ServerEvents';
import type { EnrollmentCompletedEvent } from '@eduflux-v2/shared/events/course/EnrollmentCompletedEvent';
import type { ServerEvent } from '@shared/types/ServerEvent';
import { inject } from 'inversify';
import { v4 as uuidV4 } from 'uuid';
import { EnrollmentCompletedEvent as EnrollmentCompletedEventClass } from '@eduflux-v2/shared/events/course/EnrollmentCompletedEvent';

export class EnrollmentCompletedEventSubscriberService
  implements EnrollmentCompletedEventSubscriber
{
  constructor(
    @inject(NotificationDITokens.NotificationRepository)
    private readonly notificationRepository: NotificationRepositoryPort,
  ) {}

  async on(event: EnrollmentCompletedEvent): Promise<void> {
    const { title, path, userId } = event.payload;

    const notification = Notification.create({
      id: uuidV4(),
      userId,
      title: 'Course Enrollment',
      description: `You have successfully enrolled for the course ${title}`,
      path,
      status: NotificationStatus.UNSEEN,
      timestamp: new Date().toISOString(),
    });

    await this.notificationRepository.save(notification);

    const notificationUseCaseDto =
      NotificationUseCaseDto.fromEntity(notification);

    const serverEventPayload: ServerEvent<NotificationUseCaseDto> = {
      payload: notificationUseCaseDto,
      type: ServerEvents.USER_NOTIFICATON,
    };

    eventEmitter.emit(ServerEvents.USER_NOTIFICATON, serverEventPayload);

    return;
  }

  subscribedTo() {
    return [EnrollmentCompletedEventClass];
  }
}
