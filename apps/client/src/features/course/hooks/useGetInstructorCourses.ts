import { useSuspenseQuery } from "@tanstack/react-query";

import { getInstructorCourses } from "../services/course";

export function useGetInstructorCourses(
  paginationQueryParams: PaginationQueryParameters,
) {
  return useSuspenseQuery({
    queryKey: ["instructor-courses", paginationQueryParams],
    queryFn: () => getInstructorCourses(paginationQueryParams),
  });
}
