import { PaginationQueryParams } from '@/application/dto/pagination.dto';
import { User } from '../entities/user.entity';
import { IBaseRepository } from './base.repository';

export interface IUserRepository extends IBaseRepository<User> {
  findInstructors(
    currentUserId: string,
    paginationQueryParams: PaginationQueryParams,
  ): Promise<{ instructors: User[]; total: number }>;
}
