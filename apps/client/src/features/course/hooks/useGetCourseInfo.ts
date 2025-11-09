import { useQuery } from '@tanstack/react-query';

import { getCourseInfo } from '../services/course';

export function useGetCourseInfo(courseId: string) {
  return useQuery({
    queryKey: [`published-course-${courseId}`],
    queryFn: () => getCourseInfo(courseId),
  });
}
