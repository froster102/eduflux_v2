import type { IUserRepository } from '@/domain/repositories/user.repository';
import type {
  GetUserSessionPriceInput,
  GetUserSessionPriceOutput,
  IGetUserSessionPriceUseCase,
} from './interface/get-user-session-price.interface';
import { inject } from 'inversify';
import { TYPES } from '@/shared/di/types';
import { NotFoundException } from '../exceptions/not-found.exception';

export class GetUserSessionPriceUseCase implements IGetUserSessionPriceUseCase {
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
