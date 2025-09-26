import { UserChatDITokens } from "@core/application/user-chat/di/UserChatDITokens";
import type { UserChatRepositoryPort } from "@core/application/user-chat/port/persistence/UserChatRepositoryPort";
import type { GetUserChatsPort } from "@core/application/user-chat/port/usecase/GetChatsPort";
import type { GetUserChatsUseCase } from "@core/application/user-chat/usecase/GetUserChatsUseCase";
import type { GetChatsUseCaseResult } from "@core/application/user-chat/usecase/types/GetChatsUseCaseResult";
import { inject } from "inversify";

export class GetUserChatsService implements GetUserChatsUseCase {
  constructor(
    @inject(UserChatDITokens.UserChatRepository)
    private readonly userChatRepository: UserChatRepositoryPort,
  ) {}

  async execute(payload: GetUserChatsPort): Promise<GetChatsUseCaseResult> {
    const result = await this.userChatRepository.findByUserIdAndRole(
      payload.userId,
      payload.role,
      payload.queryParameters,
    );

    return {
      chats: result.chats,
      totalCount: result.totalCount,
    };
  }
}
