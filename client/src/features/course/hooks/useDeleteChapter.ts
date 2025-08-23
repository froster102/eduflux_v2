import { useMutation } from "@tanstack/react-query";

import { deleteChapter } from "../services/course";

export function useDeleteChapter() {
  return useMutation({
    mutationFn: deleteChapter,
  });
}
