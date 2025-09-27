import type { UserChat } from "@core/domain/user-chat/entity/UserChat";

export interface GetChatsUseCaseResult {
  chats: UserChat[];
  totalCount: number;
}
