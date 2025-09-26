import type { Role } from "@core/common/enums/Role";
import { Schema, model, Document } from "mongoose";

export interface MongooseUserChat extends Document {
  _id: string;
  lastMessageAt: string;
  lastMessagePreview: string | null;
  createdAt: string;
  participants: {
    id: string;
    name: string;
    image?: string;
    role: Role;
  }[];
}

const chatParticipantSchema = new Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, required: true },
    image: { type: String, required: false },
  },
  { _id: false },
);

const userChatSchema = new Schema<MongooseUserChat>(
  {
    _id: { type: String, required: true },
    lastMessageAt: { type: String, required: true },
    lastMessagePreview: { type: String, required: false },
    createdAt: { type: String, required: true },
    participants: {
      type: [chatParticipantSchema],
      required: true,
    },
  },
  { timestamps: false, collection: "user_chats" },
);

export const UserChatModel = model<MongooseUserChat>(
  "UserChat",
  userChatSchema,
);
