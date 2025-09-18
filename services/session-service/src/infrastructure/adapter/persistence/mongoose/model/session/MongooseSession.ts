import mongoose, { Document, Model, Schema } from 'mongoose';
import type { SessionStatus } from '@core/domain/session/enum/SessionStatus';

export interface MongooseSession extends Document {
  _id: string;
  instructorId: string;
  learnerId: string;
  availabilitySlotId: string;
  startTime: Date;
  endTime: Date;
  status: SessionStatus;
  paymentId: string | null;
  pendingPaymentExpiryTime: Date | null;
  price: number;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}

export const SessionSchema = new Schema<MongooseSession>(
  {
    _id: {
      type: String,
    },
    instructorId: {
      type: String,
      required: true,
    },
    learnerId: {
      type: String,
      required: true,
    },
    availabilitySlotId: {
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
    },
    paymentId: {
      type: String,
      default: null,
    },
    pendingPaymentExpiryTime: {
      type: Date,
      default: null,
    },
    price: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const SessionModel: Model<MongooseSession> =
  mongoose.model<MongooseSession>('Session', SessionSchema);
