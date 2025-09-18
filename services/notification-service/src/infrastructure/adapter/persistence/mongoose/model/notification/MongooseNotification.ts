import type { NotificationStatus } from "@core/domain/notification/enum/NotificationStatus";
import mongoose, { Model, Schema, type Document } from "mongoose";

export interface MongooseNotification extends Document {
  _id: string;
  userId: string;
  title: string;
  description: string;
  path: string;
  status: NotificationStatus;
  timestamp: string;
  createdAt: Date;
  updatedAt: Date;
}

export const NotificationSchema = new Schema<MongooseNotification>(
  {
    _id: {
      type: String,
    },

    userId: {
      type: String,
    },

    title: {
      type: String,
    },

    description: {
      type: String,
    },

    path: {
      type: String,
    },

    status: {
      type: String,
    },

    timestamp: {
      type: String,
    },

    createdAt: {
      type: Date,
    },

    updatedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

export const NotificationModel: Model<MongooseNotification> =
  mongoose.model<MongooseNotification>("Notification", NotificationSchema);
