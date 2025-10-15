import { useQuery } from "@tanstack/react-query";

import { getInstructors } from "../services/instructor";

export function useGetInstructors(paginationQueryParams: QueryParmeters) {
  return useQuery({
    queryKey: ["instructors", paginationQueryParams],
    queryFn: () => getInstructors(paginationQueryParams),
  });
}
