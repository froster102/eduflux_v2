import type { IUseCase } from './use-case.interface';
import type { QueryOptions } from '@/application/dto/query-options.dto';
import { Session, SessionStatus } from '@/domain/entities/session.entity';

export interface GetUserBookingsQueryOptions extends QueryOptions {
  filters?: {
    status?: SessionStatus;
    startTime_gte?: string;
    endTime_lte?: string;
  };
}

export interface GetUserBookingsInput {
  userId: string;
  queryOptions: GetUserBookingsQueryOptions;
}

export interface GetUserBookingsOutput {
  sessions: Session[];
  total: number;
}

export interface IGetUserBookingsUseCase
  extends IUseCase<GetUserBookingsInput, GetUserBookingsOutput> {}
