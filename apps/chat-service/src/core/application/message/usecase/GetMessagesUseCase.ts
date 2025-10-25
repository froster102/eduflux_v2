import type { GetMessagesUseCasePort } from '@core/application/message/port/usecase/GetMessagesPort';
import type { GetMessagesUseCaseResult } from '@core/application/message/usecase/type/GetMessagesUseCaseResult';
import type { UseCase } from '@core/common/usecase/UseCase';

export interface GetMessagesUseCase
  extends UseCase<GetMessagesUseCasePort, GetMessagesUseCaseResult> {}
