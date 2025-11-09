import type { GetChatPort } from '@core/application/chat/port/usecase/GetChatPort';
import type { GetChatUseCaseResult } from '@core/application/chat/usecase/type/GetChatUseCaseResult';
import type { UseCase } from '@eduflux-v2/shared/usecase/UseCase';

export interface GetChatWithInstructorUseCase
  extends UseCase<GetChatPort, GetChatUseCaseResult> {}
