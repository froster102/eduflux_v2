import type { MessageQueryParameters } from "@core/application/message/port/persistence/type/MessageQueryParameters";

export interface GetMessagesUseCasePort {
  chatId: string;
  userId: string;
  queryParameters?: MessageQueryParameters;
}
