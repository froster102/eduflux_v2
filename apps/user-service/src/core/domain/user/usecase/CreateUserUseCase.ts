import type { UseCase } from '@core/common/usecase/UseCase';
import type { CreateUserPort } from '@core/domain/user/port/usecase/CreateUserPort';
import { UserDto } from '@core/domain/user/usecase/dto/UserDto';

export interface CreateUserUseCase extends UseCase<CreateUserPort, UserDto> {}
