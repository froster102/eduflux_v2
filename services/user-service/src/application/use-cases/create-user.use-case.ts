import type { IUserRepository } from '@/domain/repositories/user.repository';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/shared/di/types';
import { User } from '@/domain/entities/user.entity';
import { ConflictException } from '../exceptions/conflict.exception';
import { IUseCase } from './interface/use-case.interface';
import { Role } from '@/shared/types/role';

export interface CreateUserInput {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: Role[];
  bio?: string;
  socialLinks?: {
    platform: string;
    url: string;
  }[];
}

@injectable()
export class CreateUserUseCase implements IUseCase<CreateUserInput, User> {
  constructor(
    @inject(TYPES.UserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(createUserInput: CreateUserInput): Promise<User> {
    const { email, firstName, id, lastName, roles, bio, socialLinks } =
      createUserInput;
    const user = await this.userRepository.findById(id);

    if (user) {
      throw new ConflictException(`User with ID:${id} already exists.`);
    }

    const newUser = User.create(
      id,
      firstName,
      lastName,
      email,
      roles,
      bio,
      socialLinks,
    );

    const createdUser = await this.userRepository.save(newUser);

    return createdUser;
  }
}
