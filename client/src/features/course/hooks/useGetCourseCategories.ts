import { useQuery } from "@tanstack/react-query";

import { getCourseCategories } from "../services/course";

export function useGetCourseCategories() {
  return useQuery({
    queryKey: ["course-categories"],
    queryFn: getCourseCategories,
  });
}
