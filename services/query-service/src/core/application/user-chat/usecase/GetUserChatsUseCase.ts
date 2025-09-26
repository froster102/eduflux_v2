import type { GetUserChatsPort } from "@core/application/user-chat/port/usecase/GetChatsPort";
import type { GetChatsUseCaseResult } from "@core/application/user-chat/usecase/types/GetChatsUseCaseResult";
import type { UseCase } from "@core/common/usecase/UseCase";

export interface GetUserChatsUseCase
  extends UseCase<GetUserChatsPort, GetChatsUseCaseResult> {}
