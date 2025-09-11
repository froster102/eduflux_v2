declare global {
  export type Chat = {
    id: string;
    participants: {
      id: string;
      firstName: string;
      lastName: string;
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
    status: string;
    isRead: boolean;
    createdAt: string;
    updatedAt: string;
  };

  export type GetChatsQueryParmeters = {
    role: ChatRole;
  } & QueryParmeters;

  export type GetMessagesQueryParameters = {
    before: string;
  } & QueryParmeters;

  export type GetMessagesResponse = {
    messages: Message[];
  };
}

export {};
