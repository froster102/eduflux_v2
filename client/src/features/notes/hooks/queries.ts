import { useQuery } from "@tanstack/react-query";

import { getNotes } from "../services/note-services";

export function useGetNotesQuery(queryParams: QueryParams) {
  return useQuery({
    queryKey: ["notes", queryParams],
    queryFn: async () => {
      const response = await getNotes(queryParams);

      return response.data;
    },
  });
}
