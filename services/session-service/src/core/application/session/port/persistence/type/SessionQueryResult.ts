import type { Session } from '@core/domain/session/entity/Session';

export interface SessionQueryResults {
  sessions: Session[];
  totalCount: number;
}
