import type { GetUserSessionsPort } from '@core/application/views/user-session/port/usecase/GetUserSessionsPort';
import type { GetUserSessionsUseCaseResult } from '@core/application/views/user-session/port/usecase/types/GetUserSessionsUseCaseResult';
import type { UseCase } from '@eduflux-v2/shared/usecase/UseCase';

export interface GetUserSessionsUseCase
  extends UseCase<GetUserSessionsPort, GetUserSessionsUseCaseResult> {}
