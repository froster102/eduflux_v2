import type { IUserRepository } from '@/domain/repositories/user.repository';
import type { IGetUserUseCase } from './interface/get-user.interface';
import { User } from '@/domain/entities/user.entity';
import { TYPES } from '@/shared/di/types';
import { inject } from 'inversify';
import { NotFoundException } from '../exceptions/not-found.exception';

export class GetUserUseCase implements IGetUserUseCase {
  constructor(
    @inject(TYPES.UserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException(`User with ID:${id} not found.`);
    }

    return user;
  }
}
