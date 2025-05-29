import { useQuery } from "@tanstack/react-query";

import {
  getEnrolledStudents,
  getTutorDetails,
} from "../services/tutor-services";

export function useGetTutorQuery(tutorId: string) {
  return useQuery({
    queryFn: async () => {
      const response = await getTutorDetails(tutorId);

      return response.data;
    },
    queryKey: ["tutor"],
  });
}

export function useGetEnrolledStudentsQuery(queryParams: QueryParams) {
  return useQuery({
    queryKey: ["enrolledStudents", queryParams],
    queryFn: async () => {
      const response = await getEnrolledStudents(queryParams);

      return response.data;
    },
  });
}
