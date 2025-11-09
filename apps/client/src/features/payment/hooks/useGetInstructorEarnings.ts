import { useQuery } from '@tanstack/react-query';

import { useAuthStore } from '@/store/auth-store';
import { getInstructorTotalEarnings } from '@/features/payment/service/payment';

export function useGetInstructorEarnings() {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: [`instructor-${user!.id}-earnings`],
    queryFn: getInstructorTotalEarnings,
  });
}
