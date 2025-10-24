import { useSuspenseQuery } from "@tanstack/react-query";

import { getInstructors } from "../services/instructor";

export function useGetInstructors(
  paginationQueryParams: PaginationQueryParameters,
) {
  return useSuspenseQuery({
    queryKey: ["instructors", paginationQueryParams],
    queryFn: () => getInstructors(paginationQueryParams),
  });
}
