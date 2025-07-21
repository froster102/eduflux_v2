import { useQuery } from "@tanstack/react-query";

import { getCourses } from "../services/course";

export function useGetCourses(paginationQueryParams: PaginationQueryParams) {
  return useQuery({
    queryKey: ["published-courses", paginationQueryParams],
    queryFn: () => getCourses(paginationQueryParams),
  });
}
