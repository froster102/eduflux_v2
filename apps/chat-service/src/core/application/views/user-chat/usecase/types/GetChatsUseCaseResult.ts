import type { UserChat } from "@core/application/views/user-chat/entity/UserChat";

export interface GetChatsUseCaseResult {
  chats: UserChat[];
  totalCount: number;
}
