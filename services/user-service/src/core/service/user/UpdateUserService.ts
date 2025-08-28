import { CoreDITokens } from '@core/common/di/CoreDITokens';
import { Events } from '@core/common/enums/Events';
import { Code } from '@core/common/errors/Code';
import { Exception } from '@core/common/errors/Exception';
import type { EventBusPort } from '@core/common/message/EventBustPort';
import { UserDITokens } from '@core/domain/user/di/UserDITokens';
import { UserCreateEvent } from '@core/domain/user/events/UserCreateEvent';
import type { UserRepositoryPort } from '@core/domain/user/port/persistence/UserRepositoryPort';
import type { UpdateUserPort } from '@core/domain/user/port/usecase/UpdateUserPort';
import { UserDto } from '@core/domain/user/usecase/dto/UserDto';
import type { UpdateUserUseCase } from '@core/domain/user/usecase/UpdateUserUseCase';
import { CoreAssert } from '@core/util/assert/CoreAssert';
import { inject } from 'inversify';

export class UpdateUserService implements UpdateUserUseCase {
  constructor(
    @inject(UserDITokens.UserRepository)
    private readonly userRepository: UserRepositoryPort,
    @inject(CoreDITokens.EventBus)
    private readonly eventBusPort: EventBusPort,
  ) {}

  async execute(payload: UpdateUserPort): Promise<UserDto> {
    const user = CoreAssert.notEmpty(
      await this.userRepository.findById(payload.id),
      Exception.new({ code: Code.ENTITY_NOT_FOUND_ERROR }),
    );

    user.update(payload);

    const updatedUser = await this.userRepository.update(payload.id, user);

    if (updatedUser) {
      await this.eventBusPort.sendEvent({
        correlationId: '',
        type: 'user.update',
        data: UserCreateEvent.new(
          Events.USER_UPDATE,
          user.getId(),
          user.getImage()!,
          user.getFullName(),
          new Date().toISOString(),
        ),
      });
    }

    return UserDto.fromEntity(user);
  }
}
