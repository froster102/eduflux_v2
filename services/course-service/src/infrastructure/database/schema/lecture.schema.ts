import { Schema, Document } from 'mongoose';

export interface ILecture extends Document {
  _class: ClassType;
  _id: Schema.Types.ObjectId | string;
  courseId: string;
  title: string;
  description: string;
  assetId: string | null;
  preview: boolean;
  sortOrder: number;
  objectIndex: number;
}

export const LectureSchema = new Schema<ILecture>({
  _class: {
    type: String,
    default: 'lecture',
  },
  _id: {
    type: String,
    required: true,
  },
  courseId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  assetId: {
    type: String,
  },
  preview: {
    type: Boolean,
  },
  sortOrder: {
    type: Number,
  },
  objectIndex: {
    type: Number,
  },
});
