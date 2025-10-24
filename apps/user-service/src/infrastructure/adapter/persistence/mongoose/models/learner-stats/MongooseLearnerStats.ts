import { Document, model, Model, Schema } from 'mongoose';

export interface MongooseLearnerStats extends Document {
  _id: string;
  completedCourses: number;
  completedSessions: number;
  enrolledCourses: number;
  createdAt: Date;
  updatedAt: Date;
}

const LearnerStatsSchema = new Schema<MongooseLearnerStats>(
  {
    _id: {
      type: String,
      required: true,
    },
    completedCourses: {
      type: Number,
      required: true,
      default: 0,
    },
    completedSessions: {
      type: Number,
      required: true,
      default: 0,
    },
    enrolledCourses: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
    collection: 'learner_stats',
  },
);

export const LearnerStatsModel: Model<MongooseLearnerStats> =
  model<MongooseLearnerStats>('LearnerStats', LearnerStatsSchema);
