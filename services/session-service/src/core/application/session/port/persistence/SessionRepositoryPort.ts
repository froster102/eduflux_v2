import type { SessionQueryParameters } from '@core/application/session/port/persistence/type/SessionQueryParameters';
import type { SessionQueryResults } from '@core/application/session/port/persistence/type/SessionQueryResult';
import type { BaseRepositoryPort } from '@core/common/port/persistence/BaseRepositoryPort';
import type { Session } from '@core/domain/session/entity/Session';
import type { SessionStatus } from '@core/domain/session/enum/SessionStatus';

export interface SessionRepositoryPort extends BaseRepositoryPort<Session> {
  findPendingExpired(now: Date, expiryMinutes: number): Promise<Session[]>;
  listSessions(
    participantId: string,
    query?: SessionQueryParameters,
  ): Promise<SessionQueryResults>;
  findAndUpdateOverdueSessions(
    statusesToFind: SessionStatus[],
    scheduledEndTimeBefore: Date,
    statusToUpdate: SessionStatus,
  ): Promise<Session[]>;
}
