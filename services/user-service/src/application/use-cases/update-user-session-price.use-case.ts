import type { IUserRepository } from '@/domain/repositories/user.repository';
import type {
  IUpdateUserSessionPriceUseCase,
  UpdateUserSessionPriceInput,
} from './interface/update-user-session-price.interface';
import { inject } from 'inversify';
import { TYPES } from '@/shared/di/types';
import { NotFoundException } from '../exceptions/not-found.exception';
import { ForbiddenException } from '../exceptions/forbidden.exception';
import { Role } from '@/shared/types/role';

export class UpdateUserSessionPriceUseCase
  implements IUpdateUserSessionPriceUseCase
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
