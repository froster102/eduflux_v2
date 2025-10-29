import mongoose, { Model } from 'mongoose';

import { Schema } from 'mongoose';

export interface MongooseProgress extends Document {
  _id: string;
  userId: string;
  courseId: string;
  completedLectures: string[];
  createdAt: Date;
  updatedAt: Date;
}

export const ProgressSchema = new Schema<MongooseProgress>(
  {
    _id: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    courseId: {
      type: String,
    },
    completedLectures: [],
  },
  { timestamps: true },
);

export const MongooseProgress: Model<MongooseProgress> =
  mongoose.model<MongooseProgress>('Progress', ProgressSchema);
