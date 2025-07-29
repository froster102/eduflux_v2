import { useMutation, useQueryClient } from "@tanstack/react-query";

import { addAssetToLecture } from "../services/course";

export function useAddContentToLecture() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addAssetToLecture,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [`${variables.courseId}-instructor-curriculum`],
      });
    },
  });
}
