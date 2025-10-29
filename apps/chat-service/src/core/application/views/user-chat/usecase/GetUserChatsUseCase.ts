import type { GetUserChatsPort } from '@core/application/views/user-chat/port/usecase/GetChatsPort';
import type { GetChatsUseCaseResult } from '@core/application/views/user-chat/usecase/types/GetChatsUseCaseResult';
import type { UseCase } from '@eduflux-v2/shared/usecase/UseCase';

export interface GetUserChatsUseCase
  extends UseCase<GetUserChatsPort, GetChatsUseCaseResult> {}
