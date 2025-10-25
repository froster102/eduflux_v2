import { ChatDITokens } from '@core/application/chat/di/ChatDITokens';
import type { ChatRepositoryPort } from '@core/application/chat/port/persistence/ChatRepositoryPort';
import type { GetChatsPort } from '@core/application/chat/port/usecase/GetChatsPort';
import { ChatUseCaseDto } from '@core/application/chat/usecase/dto/ChatUseCaseDto';
import type { GetChatsUseCase } from '@core/application/chat/usecase/GetChatsUseCase';
import type { GetChatsUseCaseResult } from '@core/application/chat/usecase/type/GetChatsUseCaseResult';
import { inject } from 'inversify';

export class GetChatsService implements GetChatsUseCase {
  constructor(
    @inject(ChatDITokens.ChatRepository)
    private readonly chatRepository: ChatRepositoryPort,
  ) {}

  async execute(payload: GetChatsPort): Promise<GetChatsUseCaseResult> {
    const result = await this.chatRepository.findByUserIdAndRole(
      payload.userId,
      payload.role,
      payload.queryParameters,
    );

    return {
      chats: ChatUseCaseDto.fromEntities(result.chats),
      totalCount: result.totalCount,
    };
  }
}
