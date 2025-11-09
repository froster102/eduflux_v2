export interface PaymentSummaryResult {
  totalInstructorRevenue: number;
  totalPlatformRevenue: number;
  totalPayments: number;
  monthlyData: {
    month: string;
    instructorRevenue: number;
    platformFee: number;
    totalAmount: number;
    completedPayments: number;
  }[];
}
