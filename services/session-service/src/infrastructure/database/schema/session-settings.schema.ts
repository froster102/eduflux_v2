import { Schema, Document } from 'mongoose';

const DailyAvailabilityConfigSchema = new Schema(
  {
    dayOfWeek: { type: Number },
    enabled: { type: Boolean },
    startTime: { type: String },
    endTime: { type: String },
  },
  { _id: false },
);

export interface IMongoScheduleSetting extends Document {
  _id: string;
  instructorId: string;
  price: number;
  currency: string;
  duration: number;
  isSessionEnabled: boolean;
  weeklySchedules: {
    dayOfWeek: number;
    enabled: boolean;
    startTime?: string;
    endTime?: string;
  }[];
  applyForWeeks: number;
  timeZone: string;
  createdAt: Date;
  updatedAt: Date;
}

export const ScheduleSettingSchema = new Schema<IMongoScheduleSetting>(
  {
    _id: { type: String, required: true },

    instructorId: { type: String, required: true },

    price: { type: Number },

    currency: { type: String },

    duration: { type: Number },

    isSessionEnabled: {
      type: Boolean,
    },

    weeklySchedules: {
      type: [DailyAvailabilityConfigSchema],
      required: true,
    },

    applyForWeeks: {
      type: Number,
      required: true,
    },
    timeZone: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);
