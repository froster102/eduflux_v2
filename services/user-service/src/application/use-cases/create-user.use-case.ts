import type { IUserRepository } from '@/domain/repositories/user.repository';
import { inject, injectable } from 'inversify';
import { CreateUserDto } from '../dtos/create-user.dto';
import { TYPES } from '@/shared/di/types';
import { User } from '@/domain/entities/user.entity';
import { ConflictException } from '@/application/exceptions/conflict-exception';

@injectable()
export class CreateUserUseCase {
  constructor(
    @inject(TYPES.UserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.userRepository.findById(createUserDto.id);

    if (user) {
      throw new ConflictException(`User already exists.`);
    }

    const newUser = User.create(
      createUserDto.id,
      createUserDto.firstName,
      createUserDto.lastName,
      createUserDto.roles,
      createUserDto.bio,
      createUserDto.socialLinks,
    );

    const createdUser = await this.userRepository.save(newUser);

    return createdUser;
  }
}
