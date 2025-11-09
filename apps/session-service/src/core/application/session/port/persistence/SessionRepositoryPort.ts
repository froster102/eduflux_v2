import type { SessionQueryParameters } from '@core/application/session/port/persistence/type/SessionQueryParameters';
import type { SessionQueryResults } from '@core/application/session/port/persistence/type/SessionQueryResult';
import type { BaseRepositoryPort } from '@eduflux-v2/shared/ports/persistence/BaseRepositoryPort';
import type { Session } from '@core/domain/session/entity/Session';
import type { SessionStatus } from '@eduflux-v2/shared/constants/SessionStatus';

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
