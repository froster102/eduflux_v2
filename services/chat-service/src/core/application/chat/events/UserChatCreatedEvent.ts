import type { ChatUseCaseDto } from "@core/application/chat/usecase/dto/ChatUseCaseDto";

export type UserChatCreatedEvent = {
  type: "user.chat.created";
  data: ChatUseCaseDto;
};
