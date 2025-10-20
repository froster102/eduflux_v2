import { PaymentStatus } from '@payment/entity/enum/PaymentStatus';
import type { PaymentType } from '@payment/entity/enum/PaymentType';
import type { CreatePaymentPayload } from '@payment/entity/types/CreatePaymentPayload';

export class Payment {
  id: string;
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

  constructor(payload: CreatePaymentPayload) {
    this.id = payload.id;
    this.userId = payload.userId;
    this.instructorId = payload.instructorId;
    this.type = payload.type;
    this.referenceId = payload.referenceId;
    this.totalAmount = payload.totalAmount;
    this.idempotencyKey = payload.idempotencyKey;
    this.platformFee = payload.platformFee;
    this.instructorRevenue = payload.instructorRevenue;
    this.currency = payload.currency;
    this.gatewayTransactionId = payload.gatewayTransactionId;
    this.status = payload.status;
    this.createdAt = payload.createdAt;
    this.updatedAt = payload.updatedAt;
  }

  updateIdempotencyKey(key: string) {
    this.idempotencyKey = key;
  }

  setTransactionId(id: string) {
    this.gatewayTransactionId = id;
  }

  isCompleted(): boolean {
    return this.status === PaymentStatus.COMPLETED;
  }

  isPending(): boolean {
    return this.status === PaymentStatus.PENDING;
  }

  markAsCompleted() {
    this.status = PaymentStatus.COMPLETED;
  }

  markAsFailed() {
    this.status = PaymentStatus.FAILED;
  }

  markAsRefunded() {
    this.status = PaymentStatus.REFUNDED;
  }

  static new(payload: CreatePaymentPayload): Payment {
    return new Payment(payload);
  }
}
