import type { GetChatsPort } from "@core/application/chat/port/usecase/GetChatsPort";
import type { GetChatsUseCaseResult } from "@core/application/chat/usecase/type/GetChatsUseCaseResult";
import type { UseCase } from "@core/common/usecase/UseCase";

export interface GetChatsUseCase
  extends UseCase<GetChatsPort, GetChatsUseCaseResult> {}
