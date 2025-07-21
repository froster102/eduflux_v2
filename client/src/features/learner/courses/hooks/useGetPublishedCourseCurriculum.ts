import { useQuery } from "@tanstack/react-query";

import { getCourseCurriculum } from "../services/course";

export function useGetPublishedCourseCurriculum(courseId: string) {
  return useQuery({
    queryKey: [`published-course-curriculum-${courseId}`],
    queryFn: () => getCourseCurriculum(courseId),
  });
}
