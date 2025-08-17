import type { QueryOptions } from '@/application/dto/query-options.dto';
import { Session } from '../entities/session.entity';
import type { IBaseRepository } from './base.repository';
import type { GetUserBookingsQueryOptions } from '@/application/use-cases/interface/get-user-bookings.interface';

export interface ISessionRepository extends IBaseRepository<Session> {
  findPendingExpired(now: Date, expiryMinutes: number): Promise<Session[]>;
  findLearnerSessions(
    learnerId: string,
    queryOptions: GetUserBookingsQueryOptions,
  ): Promise<{ sessions: Session[]; total: number }>;
  findInstructorSessions(
    instructorId: string,
    queryOptions: QueryOptions,
  ): Promise<{ sessions: Session[]; total: number }>;
}
