import { useMutation } from "@tanstack/react-query";
import { addToast } from "@heroui/toast";

import { updateChapter } from "../services/course";

export function useUpdateChapter() {
  return useMutation({
    mutationFn: updateChapter,
    onError: () => {
      addToast({
        title: "Chapter updation",
        description: "Failed to update chapter",
        color: "danger",
      });
    },
  });
}
