import {
  PaymentProvider,
  PaymentPurpose,
  PaymentStatus,
} from '@/domain/entities/transaction.entity';
import mongoose, { Document, Model } from 'mongoose';
import { TransactionSchema } from '../schema/transaction.schema';

export interface ITransaction extends Document {
  _id: string;
  providerPaymentId: string | null;
  paymentProvider: PaymentProvider;
  status: PaymentStatus;
  paymentPurpose: PaymentPurpose;
  amount: number;
  currency: string;
  payerId: string;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  failureReason: string | null;
}

export const PaymentModel: Model<ITransaction> = mongoose.model<ITransaction>(
  'Transaction',
  TransactionSchema,
);
