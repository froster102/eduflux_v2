import { User } from '@/domain/entities/user.entity';
import type { IUserRepository } from '@/domain/repositories/user.repository';
import { TYPES } from '@/shared/di/types';
import { inject } from 'inversify';
import { NotFoundException } from '../exceptions/not-found.exception';
import { IUseCase } from './interface/use-case.interface';

export class GetUserUseCase implements IUseCase<string, User> {
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
