import { useQuery } from '@tanstack/react-query';

import { getApplicationStats } from '@/features/analytics/service/analytics';

export function useGetApplicationStats() {
  return useQuery({
    queryKey: ['application-stats'],
    queryFn: getApplicationStats,
  });
}
