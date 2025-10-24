import { useMutation } from "@tanstack/react-query";

import { createChapter } from "../services/course";

export function useCreateChapter() {
  return useMutation({
    mutationFn: createChapter,
  });
}
