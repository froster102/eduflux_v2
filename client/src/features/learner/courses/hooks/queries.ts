import { useQuery } from "@tanstack/react-query";

import {
  getCourseCurriculum,
  getCourseInfo,
  getCourses,
} from "../services/course";

export function useGetCourses(paginationQueryParams: PaginationQueryParams) {
  return useQuery({
    queryKey: ["published-courses", paginationQueryParams],
    queryFn: () => getCourses(paginationQueryParams),
  });
}

export function useGetCourseInfo(courseId: string) {
  return useQuery({
    queryKey: [`published-course-${courseId}`],
    queryFn: () => getCourseInfo(courseId),
  });
}

export function useGetPublishedCourseCurriculum(courseId: string) {
  return useQuery({
    queryKey: [`published-course-curriculum-${courseId}`],
    queryFn: () => getCourseCurriculum(courseId),
  });
}
