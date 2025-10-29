import type { SessionQueryResults } from '@core/application/session/port/persistence/type/SessionQueryResult';
import type { GetSessionsPort } from '@core/application/session/port/usecase/GetSessionsPort';
import type { UseCase } from '@eduflux-v2/shared/usecase/UseCase';

export interface GetSessionsUseCase
  extends UseCase<GetSessionsPort, SessionQueryResults> {}
