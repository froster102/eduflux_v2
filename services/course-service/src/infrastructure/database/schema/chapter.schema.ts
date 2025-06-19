import { Schema } from 'mongoose';

export interface IChapter extends Document {
  _class: ClassType;
  _id: Schema.Types.ObjectId | string;
  courseId: string;
  title: string;
  description: string;
  sortOrder: number;
  objectIndex: number;
}

export const ChapterSchema = new Schema<IChapter>({
  _class: {
    type: String,
    default: 'chapter',
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
  },
  description: {
    type: String,
    required: true,
  },
  sortOrder: {
    type: Number,
  },
  objectIndex: {
    type: Number,
  },
});
