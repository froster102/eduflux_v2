import { NotificationDITokens } from '@core/application/notification/di/NotificationDITokens';
import { NotificationNotFoundException } from '@core/application/notification/exceptions/NotificationNotFoundException';
import type { NotificationRepositoryPort } from '@core/application/notification/port/persistence/NotificationRepositoryPort';
import type { MarkNotificationAsSeenPort } from '@core/application/notification/port/usecase/MarkNotificationAsSeenPort';
import type { MarkNotificationAsSeenUseCase } from '@core/application/notification/usecase/MarkNotificationAsSeenUseCase';
import { UnauthorizedException } from '@eduflux-v2/shared/exceptions/UnauthorizedException';
import { CoreAssert } from '@eduflux-v2/shared/utils/CoreAssert';
import { NotificationStatus } from '@core/domain/notification/enum/NotificationStatus';
import { inject } from 'inversify';

export class MarkNotificationAsSeenService
  implements MarkNotificationAsSeenUseCase
{
  constructor(
    @inject(NotificationDITokens.NotificationRepository)
    private readonly notificationRepository: NotificationRepositoryPort,
  ) {}

  async execute(payload: MarkNotificationAsSeenPort): Promise<void> {
    const { notificationId, executorId } = payload;

    const notification = CoreAssert.notEmpty(
      await this.notificationRepository.findById(notificationId),
      new NotificationNotFoundException(notificationId),
    );

    if (notification.userId !== executorId) {
      throw new UnauthorizedException(executorId);
    }

    notification.markAsSeen();

    await this.notificationRepository.update(notification.id, {
      status: NotificationStatus.SEEN,
    });
  }
}
