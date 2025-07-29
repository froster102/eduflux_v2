import type { IUserRepository } from '@/domain/repositories/user.repository';
import type {
  GetInstructorsInput,
  IGetInstructorsUseCase,
} from './interface/get-instructors.interface';
import { User } from '@/domain/entities/user.entity';
import { TYPES } from '@/shared/di/types';
import { inject } from 'inversify';

export class GetInstructorsUseCase implements IGetInstructorsUseCase {
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
