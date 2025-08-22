import { inject } from 'inversify';
import { TYPES } from '@/shared/di/types';
import type { IUserRepository } from '@/domain/repositories/user.repository';
import type { IGetUsersUseCase } from './interface/get-users.interface';
import type { UserDto } from '../dto/user.dto';

export class GetUsersUseCase implements IGetUsersUseCase {
  constructor(
    @inject(TYPES.UserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(userIds: string[]): Promise<UserDto[]> {
    const users = await this.userRepository.findByIds(userIds);
    return users;
  }
}
