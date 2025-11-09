import { Schema, model } from 'mongoose';

export interface MongooseLecture {
  _id: string;
  courseId: string;
  title: string;
  description: string;
  assetId: string | null;
  preview: boolean;
  sortOrder: number;
  objectIndex: number;
}

const LectureSchema = new Schema<MongooseLecture>(
  {
    _id: {
      type: String,
    },
    courseId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    assetId: { type: String, default: null },
    preview: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
    objectIndex: { type: Number, required: true },
  },
  {
    timestamps: true,
  },
);

export const LectureModel = model<MongooseLecture>('Lecture', LectureSchema);
