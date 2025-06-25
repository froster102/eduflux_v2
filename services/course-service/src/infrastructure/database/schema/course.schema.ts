import { CourseLevel } from '@/domain/entity/course.entity';
import { Schema } from 'mongoose';

type Status =
  | 'draft'
  | 'published'
  | 'unpublished'
  | 'archived'
  | 'in_review'
  | 'approved'
  | 'rejected';

export interface ICourse extends Document {
  _id: Schema.Types.ObjectId | string;
  title: string;
  description: string;
  thumbnail: string;
  level: CourseLevel | null;
  price: string | null;
  isFree: boolean;
  status: Status;
  feedback: string | null;
  instructor: { id: string; name: string };
  averageRating: number;
  ratingCount: number;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export const CourseSchema = new Schema<ICourse>(
  {
    _id: {
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

    thumbnail: {
      type: String,
      default: null,
    },

    level: {
      type: String,
      required: true,
    },

    price: {
      type: String,
    },

    isFree: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      required: true,
      default: 'draft',
    },

    feedback: {
      type: String,
    },

    instructor: {
      id: {
        type: String,
        required: true,
      },

      name: {
        type: String,
        required: true,
      },
    },

    averageRating: {
      type: Number,
      required: true,
      alias: 'average_rating',
    },

    ratingCount: {
      type: Number,
      required: true,
      alias: 'rating_course',
    },

    publishedAt: {
      type: Date,
      alias: 'published_at',
    },

    createdAt: {
      type: Date,
      required: true,
      alias: 'created_at',
    },

    updatedAt: {
      type: Date,
      required: true,
      alias: 'updated_at',
    },
  },
  {
    timestamps: true,
  },
);
