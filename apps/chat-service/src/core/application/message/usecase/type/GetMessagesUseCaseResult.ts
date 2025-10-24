import type { MessageUseCaseDto } from "@core/application/message/usecase/dto/MessageUseCaseDto";

export type GetMessagesUseCaseResult = {
  messages: MessageUseCaseDto[];
  totalCount: number;
};
