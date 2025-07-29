import { PaginationQueryParams } from '@/application/dto/pagination.dto';
import { User } from '@/domain/entities/user.entity';
import { IUseCase } from './use-case.interface';

export interface GetInstructorsInput {
  currentUserId: string;
  paginationQueryParams: PaginationQueryParams;
}

export interface GetInstructorsOutput {
  instructors: User[];
  total: number;
}
export interface IGetInstructorsUseCase
  extends IUseCase<GetInstructorsInput, GetInstructorsOutput> {}
