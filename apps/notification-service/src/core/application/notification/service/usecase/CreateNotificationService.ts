import { NotificationDITokens } from "@core/application/notification/di/NotificationDITokens";
import type { NotificationRepositoryPort } from "@core/application/notification/port/persistence/NotificationRepositoryPort";
import type { CreateNotificationPort } from "@core/application/notification/port/usecase/CreateNotificationPort";
import type { CreateNotificationUseCase } from "@core/application/notification/usecase/CreateNotificationUseCase";
import { NotificationUseCaseDto } from "@core/application/notification/usecase/dto/NotificationUseCaseDto";
import { Notification } from "@core/domain/notification/entiy/Notification";
import { NotificationStatus } from "@core/domain/notification/enum/NotificationStatus";
import { inject } from "inversify";
import { v4 as uuidV4 } from "uuid";

export class CreateNotificationService implements CreateNotificationUseCase {
  constructor(
    @inject(NotificationDITokens.NotificationRepository)
    private readonly notificationRepository: NotificationRepositoryPort,
  ) {}

  async execute(
    payload: CreateNotificationPort,
  ): Promise<NotificationUseCaseDto> {
    const { title, description, path, userId } = payload;
    const notification = Notification.create({
      id: uuidV4(),
      userId,
      title,
      description,
      path,
      timestamp: new Date().toISOString(),
      status: NotificationStatus.UNSEEN,
    });

    await this.notificationRepository.save(notification);

    return NotificationUseCaseDto.fromEntity(notification);
  }
}
