import { NotificationDITokens } from '@core/application/notification/di/NotificationDITokens';
import type { EnrollmentCompletedEventHandler } from '@core/application/notification/handler/EnrollmentCompletedEventHandler';
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

export class EnrollmentCompletedEventHandlerService
  implements EnrollmentCompletedEventHandler
{
  constructor(
    @inject(NotificationDITokens.NotificationRepository)
    private readonly notificationRepository: NotificationRepositoryPort,
  ) {}

  async handle(event: EnrollmentCompletedEvent): Promise<void> {
    const { courseMetadata, path, userId } = event;

    const notification = Notification.create({
      id: uuidV4(),
      userId,
      title: 'Course Enrollment',
      description: `You have successfully enrolled for the course ${courseMetadata.title}`,
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
}
