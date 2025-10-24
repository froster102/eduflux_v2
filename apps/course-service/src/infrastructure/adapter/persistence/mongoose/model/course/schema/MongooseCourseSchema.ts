import { Schema, model } from 'mongoose';

export interface MongooseCourse {
  _id: string;
  title: string;
  description: string;
  thumbnail: string | null;
  level: string | null;
  categoryId: string;
  slug: string;
  price: number | null;
  isFree: boolean;
  status: string;
  feedback: string | null;
  instructor: {
    id: string;
    name: string;
  };
  averageRating: number;
  ratingCount: number;
  enrollmentCount: number;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
}

const CourseSchema = new Schema<MongooseCourse>(
  {
    _id: {
      type: String,
    },
    title: { type: String, required: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    description: { type: String, default: '' },
    thumbnail: { type: String, default: null },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: null,
    },
    categoryId: { type: String, required: true },
    price: { type: Number, default: null },
    isFree: { type: Boolean, default: false },
    status: {
      type: String,
      enum: [
        'draft',
        'published',
        'unpublished',
        'archived',
        'in_review',
        'approved',
        'rejected',
      ],
      default: 'draft',
    },
    feedback: { type: String, default: null },
    instructor: {
      id: { type: String, required: true },
      name: { type: String, required: true },
    },
    averageRating: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    enrollmentCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    publishedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  },
);

export const CourseModel = model<MongooseCourse>('Course', CourseSchema);
