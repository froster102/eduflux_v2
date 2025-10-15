import { useQuery } from "@tanstack/react-query";

import { getInstructorCourses } from "../services/course";

export function useGetInstructorCourses(paginationQueryParams: QueryParmeters) {
  return useQuery({
    queryKey: ["instructor-courses", paginationQueryParams],
    queryFn: () => getInstructorCourses(paginationQueryParams),
  });
}
