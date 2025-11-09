import { useQuery } from '@tanstack/react-query';

import { getPayments } from '@/features/payment/service/payment';

export function useGetPayments(query?: GetPaymentQueryParameters) {
  return useQuery({
    queryFn: () => getPayments(query),
    queryKey: ['payments', query],
  });
}
