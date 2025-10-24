import mongoose, { Schema, type Document, type Model } from 'mongoose';
import type { PaymentStatus } from '@payment/entity/enum/PaymentStatus';
import type { PaymentType } from '@payment/entity/enum/PaymentType';

export interface MongoosePayment extends Document {
  _id: string;
  userId: string;
  instructorId: string;
  idempotencyKey: string;
  type: PaymentType;
  referenceId: string;
  totalAmount: number;
  platformFee: number;
  instructorRevenue: number;
  currency: string;
  gatewayTransactionId?: string;
  status: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<MongoosePayment>(
  {
    _id: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    instructorId: {
      type: String,
      required: true,
    },
    idempotencyKey: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    referenceId: {
      type: String,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    platformFee: {
      type: Number,
      required: true,
    },
    instructorRevenue: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
      default: 'USD',
    },
    gatewayTransactionId: {
      type: String,
    },
    status: {
      type: String,
      required: true,
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

export const PaymentModel: Model<MongoosePayment> =
  mongoose.model<MongoosePayment>('Payment', PaymentSchema);
