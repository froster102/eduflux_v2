import { useQuery } from "@tanstack/react-query";

import {
  getPublishedCourseCurriculum,
  getPublishedCourseInfo,
  getPublishedCourses,
} from "../services/course";

export function useGetPublishedCourses(
  paginationQueryParams: PaginationQueryParams,
) {
  return useQuery({
    queryKey: ["published-courses", paginationQueryParams],
    queryFn: () => getPublishedCourses(paginationQueryParams),
  });
}

export function useGetPublishedCourseInfo(courseId: string) {
  return useQuery({
    queryKey: [`published-course-${courseId}`],
    queryFn: () => getPublishedCourseInfo(courseId),
  });
}

export function useGetPublishedCourseCurriculum(courseId: string) {
  return useQuery({
    queryKey: [`published-course-curriculum-${courseId}`],
    queryFn: () => getPublishedCourseCurriculum(courseId),
  });
}
