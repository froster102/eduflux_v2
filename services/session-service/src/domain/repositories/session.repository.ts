import { Session, SessionStatus } from '../entities/session.entity';
import type { IBaseRepository } from './base.repository';
import type { QueryParameters } from './repository';

export interface SessionQueryParameters extends QueryParameters {
  filters?: {
    status?: SessionStatus;
  };
  type?: 'learner' | 'instructor';
  sort?: {};
}

export interface SessionQueryResults {
  sessions: Session[];
  totalCount: number;
}

export interface ISessionRepository extends IBaseRepository<Session> {
  findPendingExpired(now: Date, expiryMinutes: number): Promise<Session[]>;
  listSessions(
    participantId: string,
    query?: SessionQueryParameters,
  ): Promise<SessionQueryResults>;
}
