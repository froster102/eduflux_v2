import mongoose, { Model } from 'mongoose';

import { Schema } from 'mongoose';

export interface IMongooseProgress extends Document {
  _id: string;
  userId: string;
  courseId: string;
  completedLectures: string[];
  createdAt: Date;
  updatedAt: Date;
}

export const ProgressSchema = new Schema<IMongooseProgress>(
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

export const MongooseProgress: Model<IMongooseProgress> =
  mongoose.model<IMongooseProgress>('Progress', ProgressSchema);
