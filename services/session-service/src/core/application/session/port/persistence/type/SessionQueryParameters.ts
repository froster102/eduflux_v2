import type { QueryParameters } from '@core/common/port/persistence/type/QueryParameters';
import type { SessionStatus } from '@core/domain/session/enum/SessionStatus';

export interface SessionQueryParameters extends QueryParameters {
  filters?: {
    status?: SessionStatus;
  };
  type?: 'learner' | 'instructor';
  sort?: {};
}
