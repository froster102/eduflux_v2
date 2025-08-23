import { useQuery } from "@tanstack/react-query";

import { getInstructorCourseCurriculum } from "../services/course";

export function useGetInstructorCourseCurriculum(courseId: string) {
  return useQuery({
    queryKey: [`${courseId}-instructor-curriculum`],
    queryFn: () => getInstructorCourseCurriculum(courseId),
  });
}
