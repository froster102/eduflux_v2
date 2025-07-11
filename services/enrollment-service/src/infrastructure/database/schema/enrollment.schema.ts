import { EnrollmentStatus } from '@/domain/enitites/enrollment.entity';
import { Schema } from 'mongoose';

export interface IEnrollment extends Document {
  _id: Schema.Types.ObjectId | string;
  userId: string;
  courseId: string;
  status: EnrollmentStatus;
  paymentId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export const EnrollmentSchema = new Schema<IEnrollment>(
  {
    _id: {
      type: String,
    },

    userId: {
      type: String,
    },

    courseId: {
      type: String,
    },

    status: {
      type: String,
    },

    paymentId: {
      type: String,
    },

    createdAt: {
      type: Date,
    },

    updatedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);
