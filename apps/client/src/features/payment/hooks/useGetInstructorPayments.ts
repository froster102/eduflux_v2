import { useQuery } from '@tanstack/react-query';

import { getInstructorPayments } from '@/features/payment/service/payment';
import { useAuthStore } from '@/store/auth-store';

export function useGetInstructorPayments(query?: GetPaymentQueryParameters) {
  const { user } = useAuthStore();

  return useQuery({
    queryFn: () => getInstructorPayments(query),
    queryKey: [`instructor-${user!.id}-payments`, query],
  });
}
