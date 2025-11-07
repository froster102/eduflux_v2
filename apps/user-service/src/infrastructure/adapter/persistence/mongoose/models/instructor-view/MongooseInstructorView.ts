import { Schema, model, Document } from 'mongoose';

const userProfileSchema = new Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: false },
    bio: { type: String, required: false },
  },
  { _id: false },
);

const sessionPricingSchema = new Schema(
  {
    price: { type: Number, required: true, default: 0 },
    currency: { type: String, required: true, default: 'USD' },
    duration: { type: Number, required: true, default: 0 },
    timeZone: { type: String, required: true, default: 'UTC' },
    isSchedulingEnabled: { type: Boolean, required: true, default: false },
  },
  { _id: false },
);

export interface MongooseInstructorView extends Document {
  _id: string;

  profile: {
    name: string;
    image?: string;
    bio: string;
  };

  sessionsConducted: number;
  totalCourses: number;
  totalLearners: number;

  pricing: {
    price: number;
    currency: string;
    duration: number;
    timeZone: string;
    isSchedulingEnabled: boolean;
  };
}

const instructorViewSchema = new Schema(
  {
    _id: { type: String, required: true },

    profile: { type: userProfileSchema, required: true },

    sessionsConducted: { type: Number, required: true, default: 0 },
    totalCourses: { type: Number, required: true, default: 0 },
    totalLearners: { type: Number, required: true, default: 0 },

    pricing: { type: sessionPricingSchema, required: true },
  },
  { timestamps: false, collection: 'instructor_views' },
);

instructorViewSchema.index({ 'profile.name': 'text' });

export const InstructorViewModel = model<MongooseInstructorView>(
  'InstructorView',
  instructorViewSchema,
);
