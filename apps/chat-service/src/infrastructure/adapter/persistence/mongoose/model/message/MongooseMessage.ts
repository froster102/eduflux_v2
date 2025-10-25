import { MessageStatus } from '@core/common/enum/MessageStatus';
import { Schema, model, Document } from 'mongoose';

export interface MongooseMessage extends Document {
  _id: string;
  chatId: string;
  senderId: string;
  content: string;
  status: MessageStatus;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<MongooseMessage>(
  {
    _id: {
      type: String,
      required: true,
    },
    chatId: {
      type: String,
      required: true,
    },
    senderId: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(MessageStatus),
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const MessageModel = model<MongooseMessage>('Message', messageSchema);
