import { useQuery } from "@tanstack/react-query";

import { getSubscribedCourses } from "../services/course";

import { useAuthStore } from "@/store/auth-store";

export function useGetSubsribedCourses({
  paginationQueryParams,
  enabled,
}: {
  paginationQueryParams: PaginationQueryParams;
  enabled: boolean;
}) {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: [`user-${user?.id}-subscribed-courses`, paginationQueryParams],
    queryFn: () => getSubscribedCourses(paginationQueryParams),
    enabled,
  });
}
