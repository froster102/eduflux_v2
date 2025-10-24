export interface PaymentSummaryAggregation {
  period: string;
  instructorRevenue: number;
  platformFee: number;
  totalAmount: number;
  completedPayments: number;
}
