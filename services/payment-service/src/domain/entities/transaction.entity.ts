import { v4 as uuidv4 } from 'uuid';

import { Currency } from '../../shared/constants/currency';
import { DomainException } from '../exception/domain.exception';

export type PaymentStatus =
  | 'PENDING'
  | 'SUCCESS'
  | 'FAILED'
  | 'REFUNDED'
  | 'CANCELED';

export type PaymentPurpose = 'COURSE_ENROLLMENT' | 'INSTRUCTOR_SESSION';

export type PaymentProvider = 'STRIPE';

export class Transaction {
  private _id: string;
  private _providerPaymentId: string | null;
  private _paymentProvider: PaymentProvider;
  private _status: PaymentStatus;
  private _paymentPurpose: PaymentPurpose;
  private _amount: number;
  private _currency: Currency;
  private _payerId: string;
  private _metadata: Record<string, any>;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _failureReason: string | null;

  private constructor(
    id: string,
    providerPaymentId: string | null,
    paymentProvider: PaymentProvider,
    status: PaymentStatus,
    paymentPurpose: PaymentPurpose,
    amount: number,
    currency: Currency,
    payerId: string,
    metadata: Record<string, any>,
    createdAt: Date,
    updatedAt: Date,
    failureReason: string | null,
  ) {
    this._id = id;
    this._providerPaymentId = providerPaymentId;
    this._paymentProvider = paymentProvider;
    this._status = status;
    this._paymentPurpose = paymentPurpose;
    this._amount = amount;
    this._currency = currency;
    this._payerId = payerId;
    this._metadata = metadata;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
    this._failureReason = failureReason;
  }

  static create(
    amount: number,
    currency: Currency,
    payerId: string,
    purpose: PaymentPurpose,
    paymentProvider: PaymentProvider,
    metadata: Record<string, any> = {},
  ): Transaction {
    const now = new Date();
    return new Transaction(
      uuidv4(),
      null,
      paymentProvider,
      'PENDING',
      purpose,
      amount,
      currency,
      payerId,
      metadata,
      now,
      now,
      null,
    );
  }

  static fromPersistence(
    id: string,
    providerPaymentId: string | null,
    paymentProvider: PaymentProvider,
    status: PaymentStatus,
    paymentPurpose: PaymentPurpose,
    amount: number,
    currency: Currency,
    payerId: string,
    metadata: Record<string, any>,
    createdAt: Date,
    updatedAt: Date,
    failureReason: string | null,
  ): Transaction {
    return new Transaction(
      id,
      providerPaymentId,
      paymentProvider,
      status,
      paymentPurpose,
      amount,
      currency,
      payerId,
      metadata,
      createdAt,
      updatedAt,
      failureReason,
    );
  }

  get id(): string {
    return this._id;
  }

  get providerPaymentId(): string | null {
    return this._providerPaymentId;
  }

  get paymentProvider(): PaymentProvider {
    return this._paymentProvider;
  }

  get status(): PaymentStatus {
    return this._status;
  }

  get paymentPurpose(): PaymentPurpose {
    return this._paymentPurpose;
  }

  get amount(): number {
    return this._amount;
  }

  get currency(): Currency {
    return this._currency;
  }

  get payerId(): string {
    return this._payerId;
  }

  get metadata(): Record<string, any> {
    return { ...this._metadata };
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get failureReason(): string | null {
    return this._failureReason;
  }

  markAsSuccess(providerId: string): void {
    if (this._status === 'PENDING') {
      this._status = 'SUCCESS';
      this._providerPaymentId = providerId;
      this._updatedAt = new Date();
      this._failureReason = null;
    } else {
      throw new DomainException(
        `Cannot mark Transaction as success from status: ${this._status}`,
      );
    }
  }

  markAsFailed(reason: string | null = null): void {
    if (this._status === 'PENDING') {
      this._status = 'FAILED';
      this._failureReason = reason;
      this._updatedAt = new Date();
    } else {
      throw new DomainException(
        `Cannot mark Transaction as failed from status: ${this._status}`,
      );
    }
  }

  markAsRefunded(): void {
    if (this._status === 'SUCCESS' || this._status === 'PENDING') {
      this._status = 'REFUNDED';
      this._updatedAt = new Date();
      this._failureReason = null;
    } else {
      throw new DomainException(
        `Cannot mark Transaction as refunded from status: ${this._status}`,
      );
    }
  }

  markAsCanceled(): void {
    if (this._status === 'PENDING') {
      this._status = 'CANCELED';
      this._updatedAt = new Date();
      this._failureReason = null;
    } else {
      throw new DomainException(
        `Cannot mark Transaction as canceled from status: ${this._status}`,
      );
    }
  }

  toJSON(): object {
    return {
      id: this._id,
      providerPaymentId: this._providerPaymentId,
      paymentProvider: this._paymentProvider,
      status: this._status,
      paymentPurpose: this._paymentPurpose,
      amount: this._amount,
      currency: this._currency,
      payerId: this._payerId,
      metadata: this._metadata,
      createdAt: this._createdAt.toISOString(), // ISO string for better serialization
      updatedAt: this._updatedAt.toISOString(),
      failureReason: this._failureReason,
    };
  }
}
