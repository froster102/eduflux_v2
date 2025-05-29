import { useQuery } from "@tanstack/react-query";

import { getAllUsers } from "../services/user-services";

export function useGetAllUsers(queryParams: QueryParams) {
  return useQuery({
    queryKey: ["users", queryParams],
    queryFn: async () => {
      const response = await getAllUsers(queryParams);

      return response.data;
    },
  });
}
