import { Schema, model, Document } from 'mongoose';

export interface MongooseTaughtCourseView extends Document {
  _id: string;
  instructorId: string;
  courseId: string;
  title: string;
  thumbnail: string | null;
  level: string | null;
  enrollmentCount: number;
  averageRating: number;
  createdAt: Date;
  updatedAt: Date;
}

const TaughtCourseViewSchema = new Schema<MongooseTaughtCourseView>(
  {
    _id: String,
    instructorId: { type: String, index: true, required: true },
    courseId: { type: String, required: true },
    title: { type: String, default: null },
    thumbnail: { type: String, default: null },
    level: { type: String, default: null },
    enrollmentCount: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
  },
  { timestamps: true, collection: 'taught_course_views' },
);

TaughtCourseViewSchema.index(
  { instructorId: 1, courseId: 1 },
  { unique: true },
);

export const TaughtCourseViewModel = model<MongooseTaughtCourseView>(
  'TaughtCourseView',
  TaughtCourseViewSchema,
);
