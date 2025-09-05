import type { EnrollmentStatus } from '@core/common/enums/EnrollmentStatus';
import mongoose, { Model, Schema, type Document } from 'mongoose';

export interface MongooseEnrollment extends Document {
  _id: string;
  userId: string;
  courseId: string;
  instructorId: string;
  status: EnrollmentStatus;
  paymentId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export const EnrollmentSchema = new Schema<MongooseEnrollment>(
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

    instructorId: {
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

export const EnrollmentModel: Model<MongooseEnrollment> =
  mongoose.model<MongooseEnrollment>('Enrollment', EnrollmentSchema);
