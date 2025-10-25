import type { CreateNotificationPort } from '@core/application/notification/port/usecase/CreateNotificationPort';
import type { NotificationUseCaseDto } from '@core/application/notification/usecase/dto/NotificationUseCaseDto';
import type { UseCase } from '@core/common/usecase/UseCase';

export interface CreateNotificationUseCase
  extends UseCase<CreateNotificationPort, NotificationUseCaseDto> {}
