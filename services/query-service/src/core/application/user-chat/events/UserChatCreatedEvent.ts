import type { Role } from "@shared/constants/roles";

export type UserChatCreatedEvent = {
  type: "user.chat.created";
  data: {
    readonly id: string;
    readonly participants: { userId: string; role: Role }[];
    readonly lastMessageAt: string;
    readonly createdAt: string;
    readonly updatedAt: string;
  };
};
