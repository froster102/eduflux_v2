import { PaginationQueryParams } from '@/application/dto/pagination.dto';
import { Session } from '../entities/session.entity';
import { IBaseRepository } from './base.repository';

export interface ISessionRepository extends IBaseRepository<Session> {
  findPendingExpired(now: Date, expiryMinutes: number): Promise<Session[]>;
  findLearnerSessions(
    learnerId: string,
    paginationQueryParams: PaginationQueryParams,
  ): Promise<{ sessions: Session[]; total: number }>;
  findInstructorSessions(
    instructorId: string,
    paginationQueryParams: PaginationQueryParams,
  ): Promise<{ sessions: Session[]; total: number }>;
}
