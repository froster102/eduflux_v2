import type { IUseCase } from './interface/use-case.interface';
import type { IUserRepository } from '@/domain/repositories/user.repository';
import { User } from '@/domain/entities/user.entity';
import { TYPES } from '@/shared/di/types';
import { inject } from 'inversify';
import { PaginationQueryParams } from '../dto/pagination.dto';

export interface GetInstructorsInput {
  currentUserId: string;
  paginationQueryParams: PaginationQueryParams;
}

export interface GetInstructorsOutput {
  instructors: User[];
  total: number;
}

export class GetInstructorsUseCase
  implements IUseCase<GetInstructorsInput, GetInstructorsOutput>
{
  constructor(
    @inject(TYPES.UserRepository) private userRepository: IUserRepository,
  ) {}

  async execute(
    getInstructorsInput: GetInstructorsInput,
  ): Promise<{ instructors: User[]; total: number }> {
    const { paginationQueryParams, currentUserId } = getInstructorsInput;
    const result = await this.userRepository.findInstructors(
      currentUserId,
      paginationQueryParams,
    );
    return result;
  }
}
