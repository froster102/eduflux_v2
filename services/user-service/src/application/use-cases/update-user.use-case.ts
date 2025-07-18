import type {
  IMessageBrokerGatway,
  IUserEvent,
} from '../ports/message-broker.gateway';
import type { IUserRepository } from '@/domain/repositories/user.repository';
import { TYPES } from '@/shared/di/types';
import { inject } from 'inversify';
import { User } from '@/domain/entities/user.entity';
import { NotFoundException } from '../exceptions/not-found.exception';
import { IUseCase } from './interface/use-case.interface';
import { Role } from '@/shared/types/role';
import { USERS_TOPIC } from '@/shared/constants/topics';

export interface UpdateUserInput {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  roles?: Role[];
  image?: string;
  bio?: string;
  socialLinks?: {
    platform: string;
    url: string;
  }[];
}

export class UpdateUserUseCase implements IUseCase<UpdateUserInput, User> {
  constructor(
    @inject(TYPES.UserRepository)
    private readonly userRepository: IUserRepository,
    @inject(TYPES.MessageBrokerGateway)
    private readonly messageBrokerGateway: IMessageBrokerGatway,
  ) {}

  async execute(updateUserInput: UpdateUserInput): Promise<User> {
    const user = await this.userRepository.findById(updateUserInput.id);

    if (!user) {
      throw new NotFoundException(
        `User with ID:${updateUserInput.id} not found.`,
      );
    }

    user.update(updateUserInput);

    const updatedUser = await this.userRepository.update(
      updateUserInput.id,
      user,
    );

    if (updatedUser) {
      const updateUserUpdateEventPayload: IUserEvent['data'] = {
        id: user.id,
        image: user.image,
        name: user.firstName + ' ' + user.lastName,
        occuredAt: new Date().toISOString(),
      };
      await this.messageBrokerGateway.publish(USERS_TOPIC, {
        correlationId: '',
        type: 'user.update',
        data: updateUserUpdateEventPayload,
      });
    }

    return user;
  }
}
