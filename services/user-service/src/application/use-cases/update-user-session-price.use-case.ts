import type { IUserRepository } from '@/domain/repositories/user.repository';
import { inject } from 'inversify';
import { IUseCase } from './interface/use-case.interface';
import { TYPES } from '@/shared/di/types';
import { NotFoundException } from '../exceptions/not-found.exception';
import { AuthenticatedUserDto } from '../dto/authenticated-user.dto';
import { ForbiddenException } from '../exceptions/forbidden.exception';
import { Role } from '@/shared/types/role';

export interface UpdateUserSessionPriceInput {
  price: number;
  actor: AuthenticatedUserDto;
}

export class UpdateUserSessionPriceUseCase
  implements IUseCase<UpdateUserSessionPriceInput, void>
{
  constructor(
    @inject(TYPES.UserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(
    updateUserSessionPriceInput: UpdateUserSessionPriceInput,
  ): Promise<void> {
    const { price, actor } = updateUserSessionPriceInput;

    if (!actor.hasRole(Role.INSTRUCTOR)) {
      throw new ForbiddenException(
        `User with ID${actor.id} not authorized`,
        'You are not authorized to perform this action,Please activate your instructor account to proceed.',
      );
    }

    const user = await this.userRepository.findById(actor.id);

    if (!user) {
      throw new NotFoundException(`User with ID${actor.id} not found.`);
    }

    user.setSessionPrice(price);

    await this.userRepository.update(actor.id, user);
  }
}
