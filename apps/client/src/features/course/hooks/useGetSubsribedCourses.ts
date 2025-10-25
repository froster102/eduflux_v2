import { useQuery } from '@tanstack/react-query';

import { useAuthStore } from '@/store/auth-store';

import { getSubscribedCourses } from '../services/course';

export function useGetSubsribedCourses({
  paginationQueryParams,
  enabled,
}: {
  paginationQueryParams: PaginationQueryParameters;
  enabled: boolean;
}) {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: [`user-${user?.id}-subscribed-courses`, paginationQueryParams],
    queryFn: () => getSubscribedCourses(paginationQueryParams),
    enabled,
  });
}
