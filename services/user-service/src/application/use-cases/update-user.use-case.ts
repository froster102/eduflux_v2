import type { IUserRepository } from '@/domain/repositories/user.repository';
import { TYPES } from '@/shared/di/types';
import { inject } from 'inversify';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UserNotFoundException } from '@/domain/exceptions/user.exception';
import { User } from '@/domain/entities/user.entity';

export class UpdateUserUseCase {
  constructor(
    @inject(TYPES.UserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findById(updateUserDto.id);

    if (!user) {
      throw new UserNotFoundException(updateUserDto.id);
    }

    const updatedUser = Object.assign(user, updateUserDto);

    await this.userRepository.update(updateUserDto.id, updatedUser);

    return updatedUser;
  }
}
