import { Chat } from "@core/domain/chat/entity/Chat";

export type ChatQueryResult = {
  chats: Chat[];
  totalCount: number;
};
