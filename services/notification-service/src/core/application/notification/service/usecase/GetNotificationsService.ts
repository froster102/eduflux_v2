import { NotificationDITokens } from "@core/application/notification/di/NotificationDITokens";
import type { NotificationRepositoryPort } from "@core/application/notification/port/persistence/NotificationRepositoryPort";
import type { GetNotificationsPort } from "@core/application/notification/port/usecase/GetNotificationsPort";
import { NotificationUseCaseDto } from "@core/application/notification/usecase/dto/NotificationUseCaseDto";
import type { GetNotificationsUseCase } from "@core/application/notification/usecase/GetNotificationsUseCase";
import { inject } from "inversify";

export class GetNotificationsService implements GetNotificationsUseCase {
  constructor(
    @inject(NotificationDITokens.NotificationRepository)
    private readonly notificationRepository: NotificationRepositoryPort,
  ) {}

  async execute(
    payload: GetNotificationsPort,
  ): Promise<NotificationUseCaseDto[]> {
    const { userId } = payload;
    const notifications =
      await this.notificationRepository.findByUserId(userId);

    return NotificationUseCaseDto.fromEntities(notifications);
  }
}
