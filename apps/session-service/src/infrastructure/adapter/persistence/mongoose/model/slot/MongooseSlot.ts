import { SlotStatus } from '@core/domain/slot/enum/SlotStatus';
import { Document, model, Schema } from 'mongoose';

export interface MongooseSlot extends Document {
  _id: string;
  instructorId: string;
  startTime: Date;
  endTime: Date;
  status: SlotStatus;
  bookedById: string | null;
  sessionId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export const SlotSchema = new Schema<MongooseSlot>(
  {
    _id: {
      type: String,
      required: true,
    },

    instructorId: {
      type: String,
      required: true,
    },

    startTime: {
      type: Date,
      required: true,
    },

    endTime: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: Object.values(SlotStatus),
      required: true,
      default: SlotStatus.AVAILABLE,
    },

    bookedById: {
      type: String,
      default: null,
    },

    sessionId: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

export const SlotModel = model<MongooseSlot>('Slot', SlotSchema);
