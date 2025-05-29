import { useQuery } from "@tanstack/react-query";

import { getAllEnrollments } from "../services/enrollment-services";

export function useGetAllEnrollmentsQuery(queryParams: QueryParams) {
  return useQuery({
    queryKey: ["enrollments", queryParams],
    queryFn: async () => {
      const response = await getAllEnrollments(queryParams);

      return response.data;
    },
  });
}
