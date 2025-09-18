import type { SessionQueryParameters } from '@core/application/session/port/persistence/type/SessionQueryParameters';

export interface GetSessionsPort {
  exectorId: string;
  queryParmeters?: SessionQueryParameters;
}
