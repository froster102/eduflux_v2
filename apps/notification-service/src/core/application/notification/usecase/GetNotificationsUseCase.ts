import type { GetNotificationsPort } from '@core/application/notification/port/usecase/GetNotificationsPort';
import type { NotificationUseCaseDto } from '@core/application/notification/usecase/dto/NotificationUseCaseDto';
import type { UseCase } from '@eduflux-v2/shared/usecase/UseCase';

export interface GetNotificationsUseCase
  extends UseCase<GetNotificationsPort, NotificationUseCaseDto[]> {}
