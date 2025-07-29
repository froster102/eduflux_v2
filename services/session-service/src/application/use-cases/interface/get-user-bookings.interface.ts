import { AuthenticatedUserDto } from '@/application/dto/authenticated-user.dto';
import { IUseCase } from './use-case.interface';
import { PaginationQueryParams } from '@/application/dto/pagination.dto';
import { Role } from '@/shared/constants/role';
import { Session } from '@/domain/entities/session.entity';

export interface GetUserBookingsInput {
  actor: AuthenticatedUserDto;
  paginationQueryParams: PaginationQueryParams & { role: Role };
}

export interface GetUserBookingsOutput {
  sessions: Session[];
  total: number;
}

export interface IGetUserBookingsUseCase
  extends IUseCase<GetUserBookingsInput, GetUserBookingsOutput> {}
