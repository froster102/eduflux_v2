import type { UpdateMessageStatusPort } from '@core/application/message/port/usecase/UpdateMessageStatusPort';
import type { UseCase } from '@eduflux-v2/shared/usecase/UseCase';

export interface UpdateMessageStatusUseCase
  extends UseCase<UpdateMessageStatusPort, void> {}
