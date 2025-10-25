import type { UpdateMessageStatusPort } from '@core/application/message/port/usecase/UpdateMessageStatusPort';
import type { UseCase } from '@core/common/usecase/UseCase';

export interface UpdateMessageStatusUseCase
  extends UseCase<UpdateMessageStatusPort, void> {}
