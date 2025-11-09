import { useQuery } from '@tanstack/react-query';

import { getUserGrowth } from '../service/analytics';

export function useGetUserGrowth() {
  return useQuery({
    queryKey: ['user-growth'],
    queryFn: () => getUserGrowth(),
  });
}
