import type { IUserRepository } from '@/domain/repositories/user.repository';
import { inject } from 'inversify';
import { IUseCase } from './interface/use-case.interface';
import { TYPES } from '@/shared/di/types';
import { NotFoundException } from '../exceptions/not-found.exception';
import { AuthenticatedUserDto } from '../dto/authenticated-user.dto';
import { Role } from '@/shared/types/role';
import { ForbiddenException } from '../exceptions/forbidden.exception';

export interface GetUserSessionPriceInput {
  actor: AuthenticatedUserDto;
}

export interface GetUserSessionPriceOutput {
  id: string;
  price: number;
  currency: string;
  duration: number;
}

export class GetUserSessionPriceUseCase
  implements
    IUseCase<GetUserSessionPriceInput, GetUserSessionPriceOutput | null>
{
  constructor(
    @inject(TYPES.UserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(
    getUserSessionPriceInput: GetUserSessionPriceInput,
  ): Promise<GetUserSessionPriceOutput | null> {
    const { actor } = getUserSessionPriceInput;

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

    if (user.sessionPrice) {
      return {
        id: actor.id,
        price: user.sessionPrice.price,
        currency: user.sessionPrice.currency,
        duration: user.sessionPrice.durationMinutes,
      };
    }

    return null;
  }
}
