import type { CreateChatPort } from '@core/application/chat/port/usecase/CreateChatPort';
import { ChatUseCaseDto } from '@core/application/chat/usecase/dto/ChatUseCaseDto';
import type { UseCase } from '@eduflux-v2/shared/usecase/UseCase';

export interface CreateChatUseCase
  extends UseCase<CreateChatPort, ChatUseCaseDto> {}
