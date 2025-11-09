import type { UserChat } from '@core/application/views/user-chat/entity/UserChat';

export type UserChatQueryResult = {
  chats: UserChat[];
  totalCount: number;
};
