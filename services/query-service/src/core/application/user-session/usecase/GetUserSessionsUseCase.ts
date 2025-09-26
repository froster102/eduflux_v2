import type { GetUserSessionsPort } from "@core/application/user-session/port/usecase/GetUserSessionsPort";
import type { GetUserSessionsUseCaseResult } from "@core/application/user-session/port/usecase/type/GetUserSessionsUseCaseResult";
import type { UseCase } from "@core/common/usecase/UseCase";

export interface GetUserSessionsUseCase
  extends UseCase<GetUserSessionsPort, GetUserSessionsUseCaseResult> {}
