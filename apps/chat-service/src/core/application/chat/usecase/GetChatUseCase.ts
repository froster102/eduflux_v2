import type { ChatUseCaseDto } from "@core/application/chat/usecase/dto/ChatUseCaseDto";
import type { UseCase } from "@core/common/usecase/UseCase";

export interface GetChatPort {
  chatId: string;
}

export interface GetChatUseCase extends UseCase<GetChatPort, ChatUseCaseDto> {}
