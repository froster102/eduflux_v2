import { Schema, model } from 'mongoose';

export interface MongooseChapter {
  _id: string;
  courseId: string;
  title: string;
  description: string;
  sortOrder: number;
  objectIndex: number;
}

const ChapterSchema = new Schema<MongooseChapter>(
  {
    _id: {
      type: String,
    },
    courseId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    sortOrder: { type: Number, default: 0 },
    objectIndex: { type: Number, required: true },
  },
  {
    timestamps: true,
  },
);

export const ChapterModel = model<MongooseChapter>('Chapter', ChapterSchema);
