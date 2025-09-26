import type { UserChat } from "@core/application/user-chat/entity/UserChat";

export interface GetChatsUseCaseResult {
  chats: UserChat[];
  totalCount: number;
}
