import mongoose, { Document, Model, Schema } from 'mongoose';

export interface MongooseInstructor extends Document {
  _id: string;
  sessionsConducted: number;
  totalCourses: number;
  isSessionEnabled: boolean;
  totalLearners: number;
  createdAt: Date;
  updatedAt: Date;
}

export const InstructorSchema = new Schema<MongooseInstructor>(
  {
    _id: {
      type: String,
    },
    sessionsConducted: {
      type: Number,
      required: true,
      default: 0,
    },
    totalCourses: {
      type: Number,
      required: true,
      default: 0,
    },
    isSessionEnabled: {
      type: Boolean,
      required: true,
      default: false,
    },
    totalLearners: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

export const InstructorModel: Model<MongooseInstructor> =
  mongoose.model<MongooseInstructor>('Instructor', InstructorSchema);
