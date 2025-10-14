import { Document, Schema, model } from 'mongoose';

export interface MongooseSubscribedCourseView extends Document {
  _id: string;
  userId: string;
  title: string;
  thumbnail: string;
  description: string;
  enrollmentCount: number;
  instructor: {
    id: string;
    name: string;
  };
  level: string;
  enrolledAt: Date;
  averageRating: number;
  createdAt: Date;
  updatedAt: Date;
}

const SubscribedCourseViewSchema = new Schema<MongooseSubscribedCourseView>(
  {
    _id: String,
    userId: { type: String, index: true, required: true },
    title: String,
    thumbnail: String,
    description: String,
    enrollmentCount: Number,
    instructor: Schema.Types.Mixed,
    averageRating: Number,
    level: String,
    enrolledAt: Date,
  },
  { timestamps: true, collection: 'subscribed_course_views' },
);

SubscribedCourseViewSchema.index({ userId: 1, courseId: 1 }, { unique: true });

export const SubscribedCourseViewModel = model(
  'SubscribedCourseView',
  SubscribedCourseViewSchema,
);
