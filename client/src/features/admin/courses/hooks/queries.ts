import { useQuery } from "@tanstack/react-query";

import {
  getAllCourses,
  getCourseById,
  getCoursesByIds,
} from "../services/course-services";

export function useGetAllCoursesQuery(queryParams: QueryParams) {
  return useQuery({
    queryKey: ["courses", queryParams],
    queryFn: async () => {
      const response = await getAllCourses(queryParams);

      return response.data;
    },
  });
}

export function useGetCourseByIdQuery(courseId: string) {
  return useQuery({
    queryKey: [`course:${courseId}`],
    queryFn: async () => {
      const response = await getCourseById(courseId);

      return response.data;
    },
    retry: 1,
  });
}

export function useGetCoursesByIds(
  courseIds: string[],
  queryParams: QueryParams,
  enable: boolean,
) {
  return useQuery({
    queryKey: ["courses", queryParams, courseIds],
    queryFn: async () => {
      const response = await getCoursesByIds(courseIds, queryParams);

      return response.data;
    },
    enabled: enable,
  });
}
