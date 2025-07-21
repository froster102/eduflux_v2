import { useMutation } from "@tanstack/react-query";
import { addToast } from "@heroui/toast";

import { createChapter } from "../services/course";

export function useCreateChapter() {
  return useMutation({
    mutationFn: createChapter,

    onError: () => {
      addToast({
        title: "Chapter creation",
        description: "Failed to create chapter",
        color: "danger",
      });
    },
  });
}
