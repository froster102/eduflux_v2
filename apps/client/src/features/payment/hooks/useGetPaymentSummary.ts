import { useQuery } from '@tanstack/react-query';

import { getPaymentSummary } from '@/features/payment/service/payment';

export function useGetPaymentSummary(query?: GetPaymentSummaryQueryParameter) {
  return useQuery({
    queryKey: ['payment-summary', query],
    queryFn: () => getPaymentSummary(query),
  });
}
