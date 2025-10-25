import { PaymentStatus } from '@/shared/enums/PaymentStatus';
import { PaymentType } from '@/shared/enums/PaymentType';

declare global {
  export type CheckoutItem = {
    referenceId: string;
    item: {
      title: string;
      image?: string;
      amount: number;
    };
    itemType: 'course';
  };

  export type Payment = {
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
    gatewayTransactionId: string;
    status: PaymentStatus;
    createdAt: Date;
    updatedAt: Date;
  };

  export type GetPaymentQueryParameters = {
    filter?: {
      status?: PaymentStatus;
      instructorId?: string;
      type?: PaymentType;
      referenceId?: string;
    };
  } & PaginationQueryParameters;

  export type GetPaymentQueryResult = JsonApiResponse<{
    payments: Payment[];
  }> & {
    meta: Pagination;
  };

  export type GetPaymentSummaryQueryParameter = {
    filter?: GetPaymentQueryParameters['filter'] & {
      groupBy?: PaymentSummaryGroup;
      startDate?: Date;
      endDate?: Date;
    };
  };

  export interface PaymentSummaryAggregation {
    period: string;
    instructorRevenue: number;
    platformFee: number;
    totalAmount: number;
    completedPayments: number;
  }

  export type GetPaymentSummaryResponse = JsonApiResponse<{
    totalInstructorRevenue: number;
    totalPlatformRevenue: number;
    summary: PaymentSummaryAggregation[];
  }>;
}

export {};
