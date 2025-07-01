import { useQuery } from "@tanstack/react-query";

import {
  getAllAvailableCourse,
  getAllStudentEnrollments,
  getEnrolledCourse,
} from "../services/course-services";

export function useGetAllAvailableCoursesQuery(queryParams?: QueryParams) {
  return useQuery({
    queryKey: ["availableCourses", queryParams],
    queryFn: async () => {
      const response = await getAllAvailableCourse(queryParams);

      return response.data;
    },
  });
}

export function useGetAllStudentEnrollmentsQuery(studentId: string) {
  return useQuery({
    queryKey: ["studentEnrollments"],
    queryFn: async () => {
      const response = await getAllStudentEnrollments(studentId);

      return response.data;
    },
  });
}

export function useGetEnrolledCourseQuery(studentId: string, courseId: string) {
  return useQuery({
    queryKey: [`course:${courseId}:student:${studentId}`],
    queryFn: async () => {
      const response = await getEnrolledCourse(studentId, courseId);

      return response.data;
    },
  });
}
