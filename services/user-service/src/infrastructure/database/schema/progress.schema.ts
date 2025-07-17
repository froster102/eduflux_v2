import { Schema } from 'mongoose';

export interface IMongoProgress extends Document {
  _id: Schema.Types.ObjectId | string;
  userId: string;
  courseId: string;
  completedLectures: string[];
  createdAt: Date;
  updatedAt: Date;
}

export const ProgressSchema = new Schema<IMongoProgress>(
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
