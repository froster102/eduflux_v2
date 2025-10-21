import { MessageStatus } from "@/features/chat/contants/MessageStatus";

declare global {
  export type Chat = {
    id: string;
    participants: {
      id: string;
      name: string;
      image: string;
    }[];
    lastMessagePreview: String | null;
    lastMessageAt: String;
  };

  export type Message = {
    id: string;
    chatId: string;
    senderId: string;
    content: string;
    status: MessageStatus;
    isRead: boolean;
    createdAt: string;
    updatedAt: string;
  };

  export type GetChatsQueryParmeters = {
    filter: {
      role: ChatRole;
    };
  } & PaginationQueryParameters;

  export type GetMessagesQueryParameters = CursorPaginationQueryParameters;

  export type GetChatWithInstructorResponse = JsonApiResponse<Chat | null>;

  export type GetMessagesResponse = JsonApiResponse<Message[]>;

  export type GetUserChatsQueryResult = JsonApiResponse<Chat[]> & {
    meta: Pagination;
  };
}

export {};
