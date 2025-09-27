import type { UserChat } from "@core/domain/user-chat/entity/UserChat";

export type UserChatQueryResult = {
  chats: UserChat[];
  totalCount: number;
};
