import type { GetMessagesUseCasePort } from '@core/application/message/port/usecase/GetMessagesPort';
import type { GetMessagesUseCaseResult } from '@core/application/message/usecase/type/GetMessagesUseCaseResult';
import type { UseCase } from '@eduflux-v2/shared/usecase/UseCase';

export interface GetMessagesUseCase
  extends UseCase<GetMessagesUseCasePort, GetMessagesUseCaseResult> {}
