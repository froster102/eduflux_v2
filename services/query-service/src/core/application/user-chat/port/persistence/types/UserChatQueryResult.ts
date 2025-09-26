import type { UserChat } from "@core/application/user-chat/entity/UserChat";

export type UserChatQueryResult = {
  chats: UserChat[];
  totalCount: number;
};
