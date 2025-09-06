import { ChatUseCaseDto } from "@core/application/chat/usecase/dto/ChatUseCaseDto";

export interface GetChatsUseCaseResult {
  chats: ChatUseCaseDto[];
  totalCount: number;
}
