import type { IUserRepository } from '@/domain/repositories/user.repository';
import { inject } from 'inversify';
import { IUseCase } from './interface/use-case.interface';
import { TYPES } from '@/shared/di/types';
import { NotFoundException } from '../exceptions/not-found.exception';

export interface GetUserSessionPriceInput {
  userId: string;
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
    const { userId } = getUserSessionPriceInput;

    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException(`User with ID${userId} not found.`);
    }

    if (user.sessionPricing) {
      return {
        id: userId,
        price: user.sessionPricing.price,
        currency: user.sessionPricing.currency,
        duration: user.sessionPricing.durationMinutes,
      };
    }

    return null;
  }
}
