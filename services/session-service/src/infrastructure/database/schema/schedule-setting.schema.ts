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
  weeklyAvailabilityTemplate: {
    dayOfWeek: number;
    enabled: boolean;
    startTime?: string;
    endTime?: string;
  }[];
  slotDurationMinutes: number;
  applyForWeeks: number;
  createdAt: Date;
  updatedAt: Date;
}

export const ScheduleSettingSchema = new Schema<IMongoScheduleSetting>(
  {
    _id: { type: String, required: true },

    instructorId: { type: String, required: true },

    weeklyAvailabilityTemplate: {
      type: [DailyAvailabilityConfigSchema],
      required: true,
    },

    slotDurationMinutes: {
      type: Number,
      required: true,
    },

    applyForWeeks: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);
