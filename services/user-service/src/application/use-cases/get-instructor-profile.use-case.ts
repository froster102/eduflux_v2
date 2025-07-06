import type { IUserRepository } from '@/domain/repositories/user.repository';
import { TYPES } from '@/shared/di/types';
import { inject } from 'inversify';
import { NotFoundException } from '../exceptions/not-found.exception';
import { Role } from '@/shared/types/role';
import { ForbiddenException } from '../exceptions/forbidden.exception';

export class GetInstructorProfileUseCase {
  constructor(
    @inject(TYPES.UserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(userId: string) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.roles.includes(Role.INSTRUCTOR)) {
      throw new ForbiddenException(
        'You are not authorized to view this profile.',
      );
    }

    return user;
  }
}
