import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToast } from "@heroui/toast";

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
    onError: () => {
      addToast({
        title: "Content upload",
        description: "Failed to content to lecture",
        color: "danger",
      });
    },
  });
}
