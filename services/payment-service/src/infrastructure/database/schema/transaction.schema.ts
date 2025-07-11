import { Schema } from 'mongoose';
import { ITransaction } from '../model/transaction.model';

export const TransactionSchema = new Schema<ITransaction>(
  {
    _id: { type: String, required: true },
    providerPaymentId: { type: String, index: true },
    paymentProvider: { type: String },
    status: { type: String },
    paymentPurpose: { type: String },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    payerId: { type: String, required: true, index: true },
    metadata: {},
    failureReason: { type: String },
  },
  {
    timestamps: true,
  },
);
