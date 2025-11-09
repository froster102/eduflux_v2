import type { MarkNotificationAsSeenPort } from '@core/application/notification/port/usecase/MarkNotificationAsSeenPort';
import type { UseCase } from '@eduflux-v2/shared/usecase/UseCase';

export interface MarkNotificationAsSeenUseCase
  extends UseCase<MarkNotificationAsSeenPort, void> {}
