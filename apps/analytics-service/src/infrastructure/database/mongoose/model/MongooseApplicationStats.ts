import mongoose, { Schema, type Document, type Model } from 'mongoose';

export interface MongooseApplicationStats extends Document {
  _id: string;
  totalLearners: number;
  totalInstructors: number;
  totalCourses: number;
  platformEarnings: number;
  createdAt: Date;
  updatedAt: Date;
}

const ApplicationStatsSchema = new Schema<MongooseApplicationStats>(
  {
    _id: {
      type: String,
      required: true,
    },
    totalLearners: {
      type: Number,
      required: true,
      default: 0,
    },
    totalInstructors: {
      type: Number,
      required: true,
      default: 0,
    },
    totalCourses: {
      type: Number,
      required: true,
      default: 0,
    },
    platformEarnings: {
      type: Number,
      required: true,
      default: 0,
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

export const ApplicationStatsModel: Model<MongooseApplicationStats> =
  mongoose.model<MongooseApplicationStats>(
    'ApplicationStats',
    ApplicationStatsSchema,
  );
