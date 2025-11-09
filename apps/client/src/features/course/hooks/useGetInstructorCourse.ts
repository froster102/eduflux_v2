import { useQuery } from '@tanstack/react-query';

import { getCourseInfo } from '../services/course';

export function useGetInstructorCourse(courseId: string) {
  return useQuery({
    queryKey: [`course-${courseId}`],
    queryFn: () => getCourseInfo(courseId),
  });
}
