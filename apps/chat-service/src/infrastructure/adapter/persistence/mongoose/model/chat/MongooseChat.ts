import { Schema, model, Document } from 'mongoose';
import { Role } from '@core/common/enum/Role';
import type { ChatParticipant } from '@core/domain/chat/entity/Chat';

export interface MongooseChat extends Document {
  _id: string;
  participants: ChatParticipant[];
  lastMessageAt: Date;
  lastMessagePreview: string;
  createdAt: Date;
  updatedAt: Date;
}

const chatParticipantSchema = new Schema<ChatParticipant>(
  {
    userId: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(Role),
      required: true,
    },
  },
  { _id: false },
);

const chatSchema = new Schema<MongooseChat>(
  {
    _id: {
      type: String,
      required: true,
    },
    participants: [chatParticipantSchema],
    lastMessageAt: {
      type: Date,
      required: true,
    },
    lastMessagePreview: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  },
);

export const ChatModel = model<MongooseChat>('Chat', chatSchema);
