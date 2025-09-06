declare global {
  export type Chat = {
    id: string;
    participants: RefUser[];
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
    role: "INSTRUCTOR" | "LEARNER";
  } & QueryParmeters;
}

export {};
